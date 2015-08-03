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
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: true,
      clientWidth: null,
      clientHeight: null
    };
  },

  handleResize: function(e) {
    this.setState({clientWidth: this.getDOMNode().clientWidth, clientHeight: this.getDOMNode().clientHeight});
  },

  componentDidMount: function () {
    this.setState({
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
    window.addEventListener('resize', this.handleResize);
  },

  closeClosedCaptionPanel: function() {
    this.props.controller.toggleClosedCaptionScreen();
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
        <div className="icon icon-close" style={closedCaptionScreenStyles.closeButtonStyle} onClick={this.isMobile?null:this.closeClosedCaptionPanel} onTouchEnd={this.closeClosedCaptionPanel}></div>
      </div>
    );
  }
});