/********************************************************************
  PLAYING SCREEN
*********************************************************************/

var PlayingScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerMouseUp: function() {
    // pause or play the video if the skin is clicked
    this.props.controller.togglePlayPause();
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
        onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});