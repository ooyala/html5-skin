/********************************************************************
  PLAYING SCREEN
*********************************************************************/
var React = require('react'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
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

    //for mobile, hide control bar after 3 seconds
    if (this.isMobile){
      this.startHideControlBarTimer();
    }
  },

  startHideControlBarTimer: function(){
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
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerMouseUp: function() {
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      this.props.controller.togglePlayPause();
    }
    // for mobile, touch is handled in handleTouchEnd
  },

  handleTouchEnd: function() {
    if (this.props.controller.state.volumeState.volumeSliderVisible) {
      this.props.controller.hideVolumeSliderBar();
    }
    if (!this.state.controlBarVisible){
      this.showControlBar();
      this.startHideControlBarTimer();
    }
    else {
      this.props.controller.togglePlayPause();
    }
  },

  showControlBar: function() {
    this.setState({controlBarVisible: true});
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
  },

  render: function() {
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onMouseUp={this.handlePlayerMouseUp} onTouchEnd={this.handleTouchEnd} style={{height: "100%", width: "100%"}}>
        <AdOverlay overlay={this.props.controller.state.adOverlayUrl} showOverlay={this.props.controller.state.showAdOverlay} controlBarVisible={this.state.controlBarVisible} />
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});
module.exports = PlayingScreen;
