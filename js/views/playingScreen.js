/********************************************************************
  PLAYING SCREEN
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    CONSTANTS = require('../constants/constants');

var PlayingScreen = React.createClass({
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

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('webkitfullscreenchange', this.handleResize);
    window.addEventListener('mozfullscreenchange', this.handleResize);
    window.addEventListener('fullscreenchange', this.handleResize);
    window.addEventListener('msfullscreenchange', this.handleResize);

    //for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen){
      this.startHideControlBarTimer();
    }
  },

  startHideControlBarTimer: function(){
    if (this.state.timer !== null){
      clearTimeout(this.state.timer);
    }
    var timer = setTimeout(function(){
      if(this.state.controlBarVisible){
        this.hideControlBar();
      }
    }.bind(this), 3000);
    this.setState({timer: timer});
  },

  componentWillUnmount: function () {
    if (this.state.timer !== null){
      clearTimeout(this.state.timer);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('webkitfullscreenchange', this.handleResize);
    window.removeEventListener('mozfullscreenchange', this.handleResize);
    window.removeEventListener('fullscreenchange', this.handleResize);
    window.removeEventListener('msfullscreenchange', this.handleResize);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if(nextProps) {
      if(!this.props.fullscreen && nextProps.fullscreen) {
        this.startHideControlBarTimer();
      }
    }
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
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
    if (this.props.controller.state.volumeState.volumeSliderVisible) {
      this.props.controller.hideVolumeSliderBar();
    }
    if (!this.state.controlBarVisible){
      this.showControlBar(event);
      this.startHideControlBarTimer();
    }
    else {
      this.props.controller.togglePlayPause();
    }
  },

  handlePlayerMouseMove: function() {
    if(!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.startHideControlBarTimer();
    }
  },

  showControlBar: function(event) {
    if (!this.isMobile || event.type == 'touchend') {
      this.setState({controlBarVisible: true});
      this.refs.PlayingScreen.getDOMNode().style.cursor="auto";
    }
  },

  hideControlBar: function(event) {
    if (!this.isMobile || !event) {
      this.setState({controlBarVisible: false});
      this.refs.PlayingScreen.getDOMNode().style.cursor="none";
    }
  },

  render: function() {
    var upNext = null;
    if (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) {
      upNext = <UpNextPanel {...this.props} controlBarVisible={this.state.controlBarVisible} currentPlayhead={this.props.currentPlayhead}/>;
    }
    return (
      <div className="playingScreen" ref="PlayingScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onMouseMove={this.handlePlayerMouseMove} style={InlineStyle.defaultScreenStyle.style}>
        <div onMouseUp={this.handlePlayerMouseUp} onTouchEnd={this.handleTouchEnd} style={InlineStyle.defaultScreenStyle.style}>
          <AdOverlay {...this.props} overlay={this.props.controller.state.adOverlayUrl} showOverlay={this.props.controller.state.showAdOverlay}
            showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton} controlBarVisible={this.state.controlBarVisible} />
          <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
            controlBarWidth={this.state.controlBarWidth} />
          <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
            controlBarWidth={this.state.controlBarWidth}
            playerState={this.props.playerState} />
        </div>
        {upNext}
      </div>
    );
  }
});
module.exports = PlayingScreen;
