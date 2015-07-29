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
      controlBarWidth: 0
    };
  },

  toggleClosedCaptionPanel: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  render: function() {
    
    return (
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props} ccOptions = {this.props.ccOptions}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.state.playerState}/>
        <div onClick={this.toggleClosedCaptionPanel} style={{position: "absolute", top:0, right: 0, color: "lightgray"}}><span className="icon icon-close"></span></div>
      </div>
    );
  }
});