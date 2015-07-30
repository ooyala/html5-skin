/********************************************************************
  AD SCREEN
*********************************************************************/

var AdScreen = React.createClass({
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

  openUrl: function(url) {
    if (url === null) { 
      return; 
    }
    window.open(url);
  },

  handlePlayerMouseUp: function() {
    console.log("AdScreen clicked!!!!!!!!!");
    if (this.props.playerState ===  STATE.PLAYING) {
      var clickThroughUrl = this.props.currentAdsInfo.currentAdItem.clickUrl;
      this.openUrl(clickThroughUrl);
    }
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
        onMouseUp={this.handlePlayerMouseUp} style={defaultScreenStyle.style}>
        
        <AdPanel {...this.props} controlBarWidth={this.state.controlBarWidth}/>

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});