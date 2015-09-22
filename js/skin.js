/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var React = require('react'),
    Utils = require('./components/utils'),
    InlineStyle = require('./styles/inlineStyle'),
    CONSTANTS = require('./constants/constants'),
    AdScreen = require('./views/adScreen'),
    ClosedCaptionScreen = require('./views/closedCaptionScreen'),
    DiscoveryScreen = require('./views/discoveryScreen'),
    EndScreen = require('./views/endScreen'),
    MoreOptionsScreen = require('./views/moreOptionsScreen'),
    ShareScreen = require('./views/shareScreen'),
    StartScreen = require('./views/startScreen'),
    PauseScreen = require('./views/pauseScreen'),
    PlayingScreen = require('./views/playingScreen'),
    UpNextScreen = require('./views/upNextScreen'),
    Spinner = require('./components/spinner'),
    ErrorScreen = require('./views/errorScreen');

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
      var marginHeight = Utils.getScaledControlBarHeight(this.getDOMNode().clientWidth) + CONSTANTS.UI.defaultScrubberBarHeight;
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
      if (this.state.screenToShow == CONSTANTS.SCREEN.START_SCREEN){
        return (<StartScreen {...this.props} contentTree={this.state.contentTree} style={InlineStyle.startScreenStyle}/>);
      }
      else {
        return React.createElement("div");
      }
    }

    switch (this.state.screenToShow) {
      case CONSTANTS.SCREEN.LOADING_SCREEN:
        return (
          <Spinner />
        );
      case CONSTANTS.SCREEN.START_SCREEN:
        return (
          <StartScreen {...this.props} contentTree={this.state.contentTree} style={InlineStyle.startScreenStyle}/>
        );
      case CONSTANTS.SCREEN.PLAYING_SCREEN:
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
      case CONSTANTS.SCREEN.SHARE_SCREEN:
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
      case CONSTANTS.SCREEN.PAUSE_SCREEN:
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
      case CONSTANTS.SCREEN.END_SCREEN:
        return (
          <EndScreen {...this.props}
            contentTree={this.state.contentTree}
            discoveryData={this.state.discoveryData}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            buffered={this.state.buffered}
            style={InlineStyle.endScreenStyle}
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            seeking={this.state.seeking}
            ref="endScreen" />
        );
      case CONSTANTS.SCREEN.AD_SCREEN:
        return (
          <AdScreen {...this.props} contentTree={this.state.contentTree}
            currentAdsInfo={this.state.currentAdsInfo}
            currentPlayhead={this.state.currentPlayhead}
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            duration={this.state.duration}
            buffered={this.state.buffered}
            seeking={this.state.seeking}
            ref="adScreen" />
        );
      case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
        return (
          <DiscoveryScreen {...this.props}
            contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            buffered={this.state.buffered}
            style={InlineStyle.discoveryScreenStyle}
            discoveryData={this.state.discoveryData}
            playerState={this.state.playerState}
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="DiscoveryScreen" />
        );
      case CONSTANTS.SCREEN.UP_NEXT_SCREEN:
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
      case CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN:
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
      case CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN:
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
      case CONSTANTS.SCREEN.ERROR_SCREEN:
        return (
          <ErrorScreen {...this.props}
            errorCode={this.props.controller.state.errorCode}
            style={InlineStyle.errorScreenStyle}/>
        );
      default:
        return false;
    }
  }
});
module.exports = Skin;
