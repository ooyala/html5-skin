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
    this.setState({clientWidth: this.getDOMNode().clientWidth, clientHeight: this.getDOMNode().clientHeight});
  },

  toggleClosedCaptionPanel: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  componentDidMount: function () {
    this.setState({
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
    window.addEventListener('resize', this.handleResize);
  },

  render: function() {
    
    return (
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props} ccOptions = {this.props.ccOptions} clientWidth = {this.state.clientWidth} clientHeight = {this.state.clientHeight}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.clientWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.clientWidth}
          playerState={this.state.playerState}/>
      </div>
    );
  }
});