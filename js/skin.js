/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return {
      screenToShow: null,
      currentPlayhead: 0,
      discoveryData: null 
    };
  },

  switchComponent: function(args) {
    var newState = args || {};
    this.setState(newState);
    if (this.refs.playScreen) {
      this.refs.playScreen.setState({
        playerState: this.state.playerState
      });
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return true;
  },

  updatePlayhead: function(newPlayhead, newDuration, newBuffered) {
    this.setState({
      currentPlayhead: newPlayhead,
      duration: newDuration,
      buffered: newBuffered
    });
    //for playhead updates we are likely in the same state, so skip the
    // shouldComponentUpdate check
    var remainingTime = this.state.duration - this.state.currentPlayhead;
    console.log("remainingTime = " + remainingTime);
    if (this.props.skinConfig.upNextScreen.mode === "on" && 
        remainingTime <= this.props.skinConfig.upNextScreen.countDownTime &&
        this.state.duration > this.props.skinConfig.upNextScreen.countDownTime)  {
      this.state.screenToShow = SCREEN.UP_NEXT_SCREEN;
    }
    this.forceUpdate();
  },

  render: function() {
    switch (this.state.screenToShow) {
      case SCREEN.START_SCREEN:
        return (
          <StartScreen {...this.props} contentTree={this.state.contentTree} style={startScreenStyle}/>
        );
      case SCREEN.PLAYING_SCREEN:
        return (
          <PlayingScreen {...this.props} contentTree={this.state.contentTree}
          currentPlayhead={this.state.currentPlayhead}
          duration={this.state.duration}
          buffered={this.state.buffered}
          ref="playScreen" />
        );
      case SCREEN.END_SCREEN:
        return (
          <EndScreen {...this.props} 
          contentTree={this.state.contentTree} 
          discoveryData={this.state.discoveryData}
          currentPlayhead={this.state.currentPlayhead}
          duration={this.state.duration}
          buffered={this.state.buffered} 
          style={endScreenStyle}
          ref="endScreen" />
        );
      case SCREEN.DISCOVERY_SCREEN:
        return (
          <DiscoveryScreen {...this.props} 
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              style={discoveryScreenStyle}
              discoveryData={this.state.discoveryData}
              playerState={this.state.playerState}
              ref="DiscoveryScreen" />
        );
      case SCREEN.UP_NEXT_SCREEN:
        return (
          <UpNextScreen {...this.props} 
          contentTree={this.state.contentTree}
          currentPlayhead={this.state.currentPlayhead}
          duration={this.state.duration}
          buffered={this.state.buffered}
          upNextData={this.state.upNextData}
          playerState={this.state.playerState}
          ref="playScreen" />
        );
      default:
        return false;
    }
  }
});
