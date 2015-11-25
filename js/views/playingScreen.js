/********************************************************************
  PLAYING SCREEN
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    Spinner = require('../components/spinner'),
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
      this.props.controller.startHideControlBarTimer();
    }
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('webkitfullscreenchange', this.handleResize);
    window.removeEventListener('mozfullscreenchange', this.handleResize);
    window.removeEventListener('fullscreenchange', this.handleResize);
    window.removeEventListener('msfullscreenchange', this.handleResize);
  },

  componentWillUpdate: function(nextProps, nextState) {
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

  handleResize: function(e) {
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

  handlePlayerMouseDown: function(event) {
    //to prevent cursor changing to text cursor if click and drag
    event.preventDefault();
  },

  handleTouchEnd: function(event) {
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
    var upNext = null;
    if (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) {
      upNext = <UpNextPanel {...this.props} controlBarVisible={this.state.controlBarVisible} currentPlayhead={this.props.currentPlayhead}/>;
    }

    var spinner = null;
    if (this.props.controller.state.buffering === true) {
      spinner = <Spinner />;
    }
    return (
      <div className="playingScreen" ref="PlayingScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onMouseMove={this.handlePlayerMouseMove} style={InlineStyle.defaultScreenStyle.style}>
        {spinner}
        <div onMouseUp={this.handlePlayerMouseUp} onMouseDown={this.handlePlayerMouseDown} onTouchEnd={this.handleTouchEnd} style={InlineStyle.defaultScreenStyle.style}>
          <AdOverlay {...this.props} overlay={this.props.controller.state.adOverlayUrl} showOverlay={this.props.controller.state.showAdOverlay}
            showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton} controlBarVisible={this.state.controlBarVisible} />
          <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
            controlBarWidth={this.state.controlBarWidth} />
          <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
            controlBarWidth={this.state.controlBarWidth}
            playerState={this.props.playerState}
            authorization={this.props.authorization} />
        </div>
        {upNext}
      </div>
    );
  }
});
module.exports = PlayingScreen;
