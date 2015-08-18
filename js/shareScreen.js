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
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  render: function() {
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <SharePanel {...this.props}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.state.playerState} />
        <div onClick={this.closeSharePanel} onTouchEnd={this.closeSharePanel} style={shareScreenStyle.closeButton} className={this.props.skinConfig.icons.dismiss.fontStyleClass}></div>
      </div>
    );
  }
});