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
    ResizeMixin = require('../mixins/resizeMixin');

var PlayingScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.browserSupportsTouch = this.props.controller.state.browserSupportsTouch;
    return {
      controlBarVisible: true,
      timer: null,
      isMouseDown: false,
      XMouseStart: 0,
      YMouseStart: 0,
      mouseMoveStartTime: 0
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

  handleTouchEnd: function(event) {
    event.preventDefault();//to prevent mobile from propagating click to discovery shown on pause
    if (!this.state.controlBarVisible){
      this.showControlBar(event);
      this.props.controller.startHideControlBarTimer();
    }
    else {
      // this.props.controller.togglePlayPause(event);
    }
    console.log('SSS event', event);
  },

  handlePlayerMouseDown: function(e) {
    this.setState({
      isMouseDown: true,
      XMouseStart: e.pageX,
      YMouseStart: e.pageY,
      mouseMoveStartTime: new Date()
    });
  },

  handlePlayerMouseMove: function(e) {
    if(!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
    console.log('this.state.isMouseDown', this.state.isMouseDown);
    if (this.state.isMouseDown) {
      var dx = e.pageX - this.state.XMouseStart;
      var dy = e.pageY - this.state.YMouseStart;
      console.log('SSS XStart', this.state.XMouseStart, 'SSS XEnd', e.pageX,  'YStart', this.state.YMouseStart, 'YEnd', e.pageY);
      var directionRad = Math.atan2(dx, dy);
      var directionDeg= directionRad * (180/Math.PI);
      var vectorLength = Math.sqrt(Math.pow(dx, 2)+ Math.pow(dy, 2));
      var timeSec = ((new Date) - this.state.mouseMoveStartTime) / 1000;
      var speed = vectorLength / timeSec;
      console.log('SSS dx', dx, 'dy', dy);
      console.log('SSS angle directionDeg', directionDeg);
      // console.log('SSS vectorLength', vectorLength);
      // console.log('SSS timeSec', timeSec);
      // console.log('SSS speed', speed);
      var params = [-10, -20, 0 ];
      this.props.controller.onTouched(params, true);
    }
  },

  handlePlayerMouseUp: function(e) {
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE

      this.props.controller.state.accessibilityControlsEnabled = true;
    }
    // for mobile, touch is handled in handleTouchEnd
    this.setState({
      isMouseDown: false,
      // XMouseStart: e.pageX,
      // YMouseStart: e.pageY
    });
    this.props.controller.onVcTouched();
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
    <div className="oo-state-screen oo-playing-screen"
         ref="PlayingScreen"
         onMouseOver={this.showControlBar}
         onMouseOut={this.hideControlBar}
         onMouseMove={this.handlePlayerMouseMove}
    >

      {/*<div className="oo-state-screen-selectable" onMouseUp={this.handlePlayerMouseUp} onTouchEnd={this.handleTouchEnd}></div>*/}
      <div className="oo-state-screen-selectable" onMouseDown={this.handlePlayerMouseDown} onMouseUp={this.handlePlayerMouseUp} onMouseMove={this.handlePlayerMouseMove} onTouchEnd={this.handleTouchEnd}></div>

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
    </div>
    );
  }
});
module.exports = PlayingScreen;
