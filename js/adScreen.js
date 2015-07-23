/********************************************************************
  AD SCREEN
*********************************************************************/

var AdScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
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
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onMouseUp={this.handlePlayerMouseUp} style={defaultScreenStyle.style}>
        
        <AdPanel 
        {...this.props} />

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight} />
        
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.props.playerState} />
      </div>
    );
  }
});