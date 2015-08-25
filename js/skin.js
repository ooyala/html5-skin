/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    this.overlayRenderingEventSent = false;
    return {
      screenToShow: null,
      currentPlayhead: 0,
      discoveryData: null
    };
  },

  componentDidUpdate: function() {
    // Notify AMC the correct overlay rendering info
    if (this.state.screenToShow !== null && !this.overlayRenderingEventSent) {
      var marginHeight = Utils.getScaledControlBarHeight(this.getDOMNode().clientWidth) + UI.defaultScrubberBarHeight;
      this.props.controller.publishOverlayRenderingEvent(marginHeight);
      this.overlayRenderingEventSent = true;
    }
  },

  componentWillMount: function() {
    if (this.props.skinConfig.ccOptions){
         this.props.controller.state.ccOptions.language = (this.props.skinConfig.ccOptions.defaultLanguage ? this.props.skinConfig.ccOptions.defaultLanguage : "en" );
         this.props.controller.state.ccOptions.enabled = (this.props.skinConfig.ccOptions.defaultEnabled ? this.props.skinConfig.ccOptions.defaultEnabled : false);
    }
    else {
      this.props.controller.state.ccOptions.language = "en";
      this.props.controller.state.ccOptions.enabled = false;
    }
  },

  switchComponent: function(args) {
    var newState = args || {};
    this.setState(newState);
  },

  updatePlayhead: function(newPlayhead, newDuration, newBuffered) {
    this.setState({
      currentPlayhead: newPlayhead,
      duration: newDuration,
      buffered: newBuffered
    });
    this.forceUpdate();
  },

  render: function() {
    //For IE10, use the start screen and that's it.
    if (Utils.isIE10()){
      if (this.state.screenToShow == SCREEN.START_SCREEN){
        return (<StartScreen {...this.props} contentTree={this.state.contentTree} style={startScreenStyle}/>);
      }
      else {
        return React.createElement("div");
      }
    }

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
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            seeking={this.state.seeking}
            ref="playScreen" />
        );
      case SCREEN.SHARE_SCREEN:
        return (
          <ShareScreen {...this.props} contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            buffered={this.state.buffered}
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            seeking={this.state.seeking}
            ref="shareScreen" />
        );
      case SCREEN.PAUSE_SCREEN:
        return (
          <PauseScreen {...this.props}
            contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            playerState={this.state.playerState}
            duration={this.state.duration}
            buffered={this.state.buffered}
            pauseAnimationDisabled = {this.state.pauseAnimationDisabled}
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="pauseScreen" />
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
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            seeking={this.state.seeking}
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
            seeking={this.state.seeking}
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
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="DiscoveryScreen" />
        );
      case SCREEN.UP_NEXT_SCREEN:
        return (
          <UpNextScreen {...this.props}
            contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            upNextInfo={this.state.upNextInfo}
            playerState={this.state.playerState}
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="UpNextScreen" />
        );
      case SCREEN.MORE_OPTIONS_SCREEN:
        return (
          <MoreOptionsScreen {...this.props}
            contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            playerState={this.state.playerState}
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="moreOptionsScreen" />
        );
      case SCREEN.CLOSEDCAPTION_SCREEN:
        return (
          <ClosedCaptionScreen {...this.props}
            contentTree={this.state.contentTree}
            ccOptions = {this.props.ccOptions}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            buffered={this.state.buffered}
            playerState={this.state.playerState}
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="closedCaptionScreen" />
        );
      default:
        return false;
    }
  }
});
