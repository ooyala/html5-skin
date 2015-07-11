/********************************************************************
  CLOSED CAPTION SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionScreen
* @constructor
*/
var ClosedCaptionScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true
    };
  },

  closeClosedCaptionPanel: function() {
    this.props.controller.closeClosedCaptionScreen();
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.state.playerState}/>
        <div onClick={this.closeClosedCaptionPanel} style={{position: "absolute", top:0, right: 0, color: "lightgray"}}><span className="icon icon-close"></span></div>
      </div>
    );
  }
});