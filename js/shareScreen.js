/********************************************************************
  SHARING SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var ShareScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  closeSharePanel: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.closeShareScreen();
    }
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth - 2 * UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING});
  },

  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  render: function() {
    return (
      <div className="ShareScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <SharePanel {...this.props}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.state.playerState} />
        <div className="close" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.closeSharePanel} style={shareScreenStyle.closeButton}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </div>
      </div>
    );
  }
});