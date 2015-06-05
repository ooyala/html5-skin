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
    return {
      controlBarVisible: true
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;

    var tabStyle  = {display: "inline-block", width: "100px", "height": "50px", color: "white",
      "lineHeight": "50px", borderBottom: "1px solid white", borderRight: "1px solid white", textAlign: "center"};

    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <DiscoveryPanel style={discoveryScreenStyle}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.state.playerState} />
      </div>
    );
  }
});