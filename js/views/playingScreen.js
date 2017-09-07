/********************************************************************
  PLAYING SCREEN
*********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ControlBar = require('../components/controlBar'),
    AdOverlay = require('../components/adOverlay'),
    ClassNames = require('classnames'),
    UpNextPanel = require('../components/upNextPanel'),
    Spinner = require('../components/spinner'),
    TextTrack = require('../components/textTrackPanel'),
    Watermark = require('../components/watermark'),
    ResizeMixin = require('../mixins/resizeMixin'),
    ViewControls = require('../components/viewControls');

var PlayingScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.browserSupportsTouch = this.props.controller.state.browserSupportsTouch;
    this.isVideo360 = this.props.controller.state.isVideo360;

    return {
      controlBarVisible: true,
      timer: null,
      isMouseDown: false,
      isMouseMove: false,
      XMouseStart: 0,
      YMouseStart: 0,
    };
  },

  componentDidMount: function () {
    //for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen || this.browserSupportsTouch){
      this.props.controller.startHideControlBarTimer();
    }
  },

  componentWillUpdate: function(nextProps) {
    if(nextProps) {
      if (nextProps.controller.state.controlBarVisible == false && this.state.controlBarVisible == true) {
        this.hideControlBar();
      }
      if(!this.props.fullscreen && nextProps.fullscreen) {
        this.props.controller.startHideControlBarTimer();
      }
      if(this.props.fullscreen && !nextProps.fullscreen && this.isMobile) {
        this.setState({controlBarVisible: true});
        this.props.controller.showControlBar();
        this.props.controller.startHideControlBarTimer();
      }
    }
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
  },

  handleResize: function() {
    if (this.isMounted()) {
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleKeyPress: function(event) {
    // show control bar on tab key navigation
    event.preventDefault();
    var charCode = event.which || event.keyCode;
    if (charCode === 9 || charCode === 32 || charCode === 13) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleTouchEnd: function(event) {
    event.preventDefault();//to prevent mobile from propagating click to discovery shown on pause
    if (!this.state.controlBarVisible){
      this.showControlBar(event);
      this.props.controller.startHideControlBarTimer();
    }
    else if (!this.isVideo360) {
      this.props.controller.togglePlayPause(event);
    }
  },

  handlePlayerMouseDown: function(e) {
    if (!this.isVideo360) { return; }
    this.setState({
      isMouseDown: true,
      XMouseStart: e.pageX,
      YMouseStart: e.pageY
    });
    if (this.props.controller.onTouched) {
      this.props.controller.onTouched(true);
    }
  },

  handlePlayerMouseMove: function(e) {
    if(!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
    if (this.isVideo360 && this.state.isMouseDown) {
  
      this.setState({
        isMouseMove: true
      });
      
      var params = this.getDirectionParams(e.pageX, e.pageY);
      if (this.props.controller.onTouching) {
        this.props.controller.onTouching(params, true);
      }
    }
  },

  handlePlayerMouseUp: function(e) {
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE

      this.props.controller.state.accessibilityControlsEnabled = true;
      if (!this.isVideo360) {
        this.props.controller.togglePlayPause();
      }
    }
    // for mobile, touch is handled in handleTouchEnd
    if (this.isVideo360) {
      this.setState({
        isMouseDown: false,
      });
      if (this.props.controller.onTouched) {
        this.props.controller.onTouched(true);
      }
    }
  },
  
  handlePlayerMouseLeave: function () {
    if (this.isVideo360) {
      this.setState({
        isMouseDown: false,
      });
    }
  },
  
  handlePlayerClicked: function (event) {
    if(!this.state.isMouseMove){
      this.props.controller.togglePlayPause(event);
    }
    
    this.setState({
      isMouseMove: false,
    });
  },
  
  getDirectionParams: function(pageX, pageY) {
    var dx = pageX - this.state.XMouseStart
      , dy = pageY - this.state.YMouseStart;
    var maxDegreesX = 90,
      maxDegreesY = 120;
    var degreesForPixelYaw = maxDegreesX / this.props.componentWidth,
      degreesForPixelPitch = maxDegreesY / this.props.componentHeight;
    var yaw = (this.props.controller.state.viewingDirection.yaw || 0) + dx * degreesForPixelYaw,
      pitch = (this.props.controller.state.viewingDirection.pitch || 0) + dy * degreesForPixelPitch;
    return [yaw, 0, pitch];
  },

  showControlBar: function(event) {
    if (!this.isMobile || event.type == 'touchend') {
      this.setState({controlBarVisible: true});
      this.props.controller.showControlBar();
      ReactDOM.findDOMNode(this.refs.PlayingScreen).style.cursor="auto";
    }
  },

  hideControlBar: function(event) {
    if (this.props.controlBarAutoHide == true && !(this.isMobile && event)) {
      this.setState({controlBarVisible: false});
      this.props.controller.hideControlBar();
      ReactDOM.findDOMNode(this.refs.PlayingScreen).style.cursor="none";
    }
  },

  render: function() {
    var adOverlay = (this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay) ?
      <AdOverlay {...this.props}
        overlay={this.props.controller.state.adOverlayUrl}
        showOverlay={this.props.controller.state.showAdOverlay}
        showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}/> : null;

    var upNextPanel = (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) ?
      <UpNextPanel {...this.props}
        controlBarVisible={this.state.controlBarVisible}
        currentPlayhead={this.props.currentPlayhead}/> : null;

    return (
    <div
      className="oo-state-screen oo-playing-screen"
      ref="PlayingScreen"
      onMouseOver={this.showControlBar}
      onMouseOut={this.hideControlBar}
      onMouseMove={this.handlePlayerMouseMove}
      onMouseLeave={this.handlePlayerMouseLeave}
      onKeyUp={this.handleKeyPress}
    >
      <div
        className="oo-state-screen-selectable"
        onMouseDown={this.handlePlayerMouseDown}
        onMouseUp={this.handlePlayerMouseUp}
        onTouchEnd={this.handleTouchEnd}
        onClick={this.handlePlayerClicked}
      />

      <Watermark {...this.props} controlBarVisible={this.state.controlBarVisible}/>

      {this.props.controller.state.buffering ? <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/> : null}

      <div className="oo-interactive-container">

        {this.props.closedCaptionOptions.enabled ?
          <TextTrack
            closedCaptionOptions={this.props.closedCaptionOptions}
            cueText={this.props.closedCaptionOptions.cueText}
            responsiveView={this.props.responsiveView}
          /> : null
        }

        {adOverlay}

        {upNextPanel}

        <ControlBar {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          playerState={this.props.playerState}
          isLiveStream={this.props.isLiveStream} />
      </div>
      
      {
        this.isVideo360 &&
        <ViewControls
          {...this.props}
          controlBarVisible={this.state.controlBarVisible}
        />
      }
    </div>
    );
  }
});
module.exports = PlayingScreen;
