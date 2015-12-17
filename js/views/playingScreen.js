/********************************************************************
  PLAYING SCREEN
*********************************************************************/
var React = require('react'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    Spinner = require('../components/spinner'),
    ResizeMixin = require('../mixins/resizeMixin');

var PlayingScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: true,
      controlBarWidth: 0,
      timer: null
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    //for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen){
      this.props.controller.startHideControlBarTimer();
    }
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
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

  handleResize: function() {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
      this.props.controller.startHideControlBarTimer();
    }
  },

  handlePlayerMouseUp: function(event) {
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE

      this.props.controller.togglePlayPause();
      this.props.controller.state.accessibilityControlsEnabled = true;
    }
    // for mobile, touch is handled in handleTouchEnd
  },

  handleTouchEnd: function(event) {
    event.preventDefault();//to prevent mobile from propagating click to discovery shown on pause
    if (this.props.controller.state.volumeState.volumeSliderVisible) {
      this.props.controller.hideVolumeSliderBar();
    }
    if (!this.state.controlBarVisible){
      this.showControlBar(event);
      this.props.controller.startHideControlBarTimer();
    }
    else {
      this.props.controller.togglePlayPause();
    }
  },

  handlePlayerMouseMove: function() {
    if(!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
  },

  showControlBar: function(event) {
    if (!this.isMobile || event.type == 'touchend') {
      this.setState({controlBarVisible: true});
      this.props.controller.showControlBar();
      this.refs.PlayingScreen.getDOMNode().style.cursor="auto";
    }
  },

  hideControlBar: function(event) {
    if (this.props.controlBarAutoHide == true && !(this.isMobile && event)) {
      this.setState({controlBarVisible: false});
      this.props.controller.hideControlBar();
      this.refs.PlayingScreen.getDOMNode().style.cursor="none";
    }
  },

  render: function() {
    return (
    <div className="state-screen playingScreen"
         ref="PlayingScreen"
         onMouseOver={this.showControlBar}
         onMouseOut={this.hideControlBar}
         onMouseMove={this.handlePlayerMouseMove}>

      {this.props.controller.state.buffering ? <Spinner /> : ''}

      <div className="default-screen"
           onMouseUp={this.handlePlayerMouseUp}
           onTouchEnd={this.handleTouchEnd}>

        <AdOverlay {...this.props}
          overlay={this.props.controller.state.adOverlayUrl}
          showOverlay={this.props.controller.state.showAdOverlay}
          showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}
          controlBarVisible={this.state.controlBarVisible} />

        <ScrubberBar {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />

        <ControlBar {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState}
          authorization={this.props.authorization} />
      </div>

      {(this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) ?
        <UpNextPanel {...this.props} controlBarVisible={this.state.controlBarVisible} currentPlayhead={this.props.currentPlayhead}/> : ''}
    </div>
    );
  }
});
module.exports = PlayingScreen;