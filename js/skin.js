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

  componentWillMount: function() {
    if (this.props.skinConfig.ccOptions){
         this.props.controller.state.ccOptions.language = this.props.skinConfig.ccOptions.defaultLanguage;
         this.props.controller.state.ccOptions.text.font = this.props.skinConfig.ccOptions.text.defaultFont;
         this.props.controller.state.ccOptions.text.size = this.props.skinConfig.ccOptions.text.defaultSize;
         this.props.controller.state.ccOptions.text.color = this.props.skinConfig.ccOptions.text.defaultColor;
         this.props.controller.state.ccOptions.text.opacity = this.props.skinConfig.ccOptions.text.defaultOpacity;
         this.props.controller.state.ccOptions.text.shadow = this.props.skinConfig.ccOptions.text.defaultShadow;
         this.props.controller.state.ccOptions.window.backgroundColor = this.props.skinConfig.ccOptions.window.defaultBackgroundColor;
         this.props.controller.state.ccOptions.window.borderColor = this.props.skinConfig.ccOptions.window.defaultBorderColor;
         this.props.controller.state.ccOptions.window.backgroundOpacity = this.props.skinConfig.ccOptions.window.defaultBackgroundOpacity;
         this.props.controller.state.ccOptions.window.borderOpacity = this.props.skinConfig.ccOptions.window.defaultBorderOpacity;
         this.props.controller.state.ccOptions.transition = this.props.skinConfig.ccOptions.defaultTransition;
    }
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
    this.forceUpdate();
  },

  render: function() {
    switch (this.state.screenToShow) {
      case SCREEN.START_SCREEN:
        return (
          // <EndScreen {...this.props} contentTree={this.state.contentTree} style={endScreenStyle}/>
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
      case SCREEN.CLOSEDCAPTION_SCREEN:
        return (
          <ClosedCaptionScreen {...this.props} 
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              ccOptions={this.props.controller.state.ccOptions}
              duration={this.state.duration}
              buffered={this.state.buffered}
              playerState={this.state.playerState}
              ref="closedCaptionScreen" />
        );
      default:
        return false;
    }
  }
});
