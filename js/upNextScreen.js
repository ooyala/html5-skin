/********************************************************************
  UP NEXT SCREEN
*********************************************************************/

var UpNextScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  handlePlayerMouseUp: function(event) {
    this.props.controller.togglePlayPause();
  },
  
  showControlBar: function() {
    this.setState({controlBarVisible: true});
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar}
        onClick={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <UpNextPanel {...this.props} controlBarHeight={controlBarHeight} controlBarVisible={this.state.controlBarVisible}/>

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.props.playerState} />
      </div>
    );
  }
});