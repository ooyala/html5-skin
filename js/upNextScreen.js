/********************************************************************
  UP NEXT SCREEN
*********************************************************************/

var UpNextScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth - 2 * UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING});
  },

  handlePlayerMouseUp: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.togglePlayPause();
    }
  },

  showControlBar: function() {
    this.setState({controlBarVisible: true});
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
  },

  render: function() {
    return (
      <div className="upNextScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onClick={this.handlePlayerMouseUp} onTouchEnd={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <UpNextPanel {...this.props} controlBarVisible={this.state.controlBarVisible}/>

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});