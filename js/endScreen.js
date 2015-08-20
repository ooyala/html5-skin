/********************************************************************
  END SCREEN
*********************************************************************/

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

    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },  

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerMouseUp: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      // pause or play the video if the skin is clicked
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
    var screenStyle = this.props.style;
    var repeatClass = this.props.skinConfig.icons.replay.fontStyleClass;
    var repeatStyle = screenStyle.repeatButton.style;

    repeatStyle.color = this.props.skinConfig.endScreen.replayIconStyle.color;

    // ReplayButton position, defaulting to centered
    if (this.props.skinConfig.endScreen.showReplayButton) {
      repeatStyle.top = "50%";
      repeatStyle.left = "50%";
    }
    else {
      repeatStyle.display = "none";
    }

    return (
      <div className="endScreen" onMouseOver={this.showControlBar}
           onMouseUp={this.handlePlayerMouseUp}
           onTouchEnd={this.handlePlayerMouseUp}
           style={{height: "100%", width: "100%"}}>
        <div style={screenStyle.backgroundStyle}></div>
        <div className="replay">
          <span className={repeatClass} style={repeatStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});