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
    } else if (this.refs.adScreen) {
      this.refs.adScreen.setState({
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
      case SCREEN.AD_SCREEN: 
        return (
          <AdScreen {...this.props} contentTree={this.state.contentTree}
          currentAdsInfo={this.state.currentAdsInfo}
          currentPlayhead={this.state.currentPlayhead}
          playerState={this.state.playerState}
          duration={this.state.duration}
          buffered={this.state.buffered}
          ref="adScreen" />
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
      default:
        return false;
    }
  }
});
