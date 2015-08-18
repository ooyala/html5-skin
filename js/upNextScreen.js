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
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  handlePlayerMouseUp: function(event) {
    if (event.type !== 'touchend' && this.isMobile){
      //do nothing to prevent double firing of events
      //from touchend and click on mobile devices
    }
    else {
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
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
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