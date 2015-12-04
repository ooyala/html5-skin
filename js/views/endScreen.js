/********************************************************************
  END SCREEN
*********************************************************************/
var React = require('react'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    CONSTANTS = require('../constants/constants');

var EndScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      description: this.props.contentTree.description,
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function() {
    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('webkitfullscreenchange', this.handleResize);
    window.addEventListener('mozfullscreenchange', this.handleResize);
    window.addEventListener('fullscreenchange', this.handleResize);
    window.addEventListener('msfullscreenchange', this.handleResize);

    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('webkitfullscreenchange', this.handleResize);
    window.removeEventListener('mozfullscreenchange', this.handleResize);
    window.removeEventListener('fullscreenchange', this.handleResize);
    window.removeEventListener('msfullscreenchange', this.handleResize);
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerMouseUp: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      // pause or play the video if the skin is clicked
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;

      this.props.controller.togglePlayPause();

      if (this.props.controller.state.volumeState.volumeSliderVisible) {
        this.props.controller.hideVolumeSliderBar();
      }
    }
  },

  handleMouseDown: function(event) {
    //to prevent cursor changing to text cursor if click and drag
    event.preventDefault();
  },
  
  render: function() {
    var screenStyle = this.props.style;
    var repeatClass = this.props.skinConfig.icons.replay.fontStyleClass;
    var repeatStyle = screenStyle.repeatButton.style;

    repeatStyle.color = this.props.skinConfig.endScreen.replayIconStyle.color;
    repeatStyle.opacity = this.props.skinConfig.endScreen.replayIconStyle.opacity;

    // ReplayButton position, defaulting to centered
    if (this.props.skinConfig.endScreen.showReplayButton) {
      repeatStyle.top = "50%";
      repeatStyle.left = "50%";
    }
    else {
      repeatStyle.display = "none";
    }

    return (
      <div className="endScreen"
           onMouseUp={this.handlePlayerMouseUp}
           onTouchEnd={this.handlePlayerMouseUp}
           onMouseDown={this.handleMouseDown}
           style={{height: "100%", width: "100%"}}>
        <div style={screenStyle.backgroundStyle}></div>
        <div className="replay">
          <span className={repeatClass} style={repeatStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState}
          authorization={this.props.authorization} />
      </div>
    );
  }
});
module.exports = EndScreen;
