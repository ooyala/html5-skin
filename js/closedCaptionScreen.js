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
      controlBarVisible: true,
      clientWidth: null
    };
  },

  toggleClosedCaptionPanel: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  componentDidMount: function () {
    this.setState({
      controlBarWidth: this.getDOMNode().clientWidth,
      clientWidth: this.getDOMNode().clientWidth
    });
    console.log("xenia", this.getDOMNode().clientWidth);
    console.log("xenia", this.getDOMNode().clientHeight);
  },

  render: function() {
    console.log("xenia0",this.state.clientWidth);
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props} ccOptions = {this.props.ccOptions} clientWidth = {this.state.clientWidth}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.state.playerState}/>
        <div onClick={this.toggleClosedCaptionPanel} style={{position: "absolute", top:0, right: 0, color: "lightgray"}}><span className="icon icon-close"></span></div>
      </div>
    );
  }
});