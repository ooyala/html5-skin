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
      clientWidth: null,
      clientHeight: null
    };
  },

  handleResize: function(e) {
    this.setState({clientWidth: this.getDOMNode().clientWidth});
    this.setState({clientHeight: this.getDOMNode().clientHeight});
  },

  toggleClosedCaptionPanel: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  componentDidMount: function () {
    this.setState({
      controlBarWidth: this.getDOMNode().clientWidth,
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
    window.addEventListener('resize', this.handleResize);
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props} ccOptions = {this.props.ccOptions} clientWidth = {this.state.clientWidth} clientHeight = {this.state.clientHeight}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.state.playerState}/>
      </div>
    );
  }
});