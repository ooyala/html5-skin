/********************************************************************
  PLAYING SCREEN
*********************************************************************/

var PlayingScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);

    //for mobile, hide control bar after 3 seconds
    this.hideControlBarTimerMobile();
  },

  hideControlBarTimerMobile: function(){
    if (Utils.isMobile()){
      setTimeout(function(){
        if(this.state.controlBarVisible){
          this.hideControlBar();
        }
      }.bind(this), 3000);
    }
  },

  componentDidUpdate: function () {

  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerMouseUp: function() {
    // pause or play the video if the skin is clicked on desktop
    if (!Utils.isMobile()){
      this.props.controller.togglePlayPause();
    }
    // for mobile, touch is handled in handleTouchEnd
  },

  handleTouchEnd: function() {
    if (!this.state.controlBarVisible){
      this.showControlBar();
      this.hideControlBarTimerMobile();
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
        onMouseUp={this.handlePlayerMouseUp} onTouchEnd={this.handleTouchEnd} style={{height: "100%", width: "100%"}}>

        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.props.playerState} />
      </div>
    );
  }
});