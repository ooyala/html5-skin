/********************************************************************
  DISCovery SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var DiscoveryScreen = React.createClass({
  getInitialState: function() {
    var screenToShow = STATE.PLAYING;
    if (this.props.currentPlayhead == this.props.duration) {
       screenToShow = STATE.END; 
    }
    return {
      controlBarVisible: true,
      screenToShow: screenToShow
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <DiscoveryPanel style={discoveryScreenStyle}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.state.playerState} screenToShow={this.state.screenToShow}/>
      </div>
    );
  }
});