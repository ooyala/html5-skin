/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var React = require('react'),
    Utils = require('./components/utils'),
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

  componentDidMount: function () {
    window.addEventListener('mouseup', this.handleClickOutsidePlayer);
  },

  componentWillMount: function() {
    if (this.props.skinConfig.closedCaptionOptions){
      this.props.controller.state.closedCaptionOptions.language = (this.props.skinConfig.closedCaptionOptions.defaultLanguage ? this.props.skinConfig.closedCaptionOptions.defaultLanguage : "en" );
      this.props.controller.state.closedCaptionOptions.enabled = (this.props.skinConfig.closedCaptionOptions.defaultEnabled ? this.props.skinConfig.closedCaptionOptions.defaultEnabled : false);
    }
    else {
      this.props.controller.state.closedCaptionOptions.language = "en";
      this.props.controller.state.closedCaptionOptions.enabled = false;
    }
  },

  componentWillUnmount: function () {
    window.removeEventListener('mouseup', this.handleClickOutsidePlayer);
  },

  handleClickOutsidePlayer: function() {
    this.props.controller.state.accessibilityControlsEnabled = false;
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
  },

  render: function() {
    //For IE10, use the start screen and that's it.
    if (Utils.isIE10()){
      if (this.state.screenToShow == CONSTANTS.SCREEN.START_SCREEN){
        return (<StartScreen {...this.props} contentTree={this.state.contentTree} />);
      }
      else {
        return React.createElement("div");
      }
    }

    if (this.props.controller.state.disableClickLayer === true) {
      return null;
    }

    switch (this.state.screenToShow) {
      case CONSTANTS.SCREEN.LOADING_SCREEN:
        return (
          <Spinner />
        );
      case CONSTANTS.SCREEN.START_SCREEN:
        return (
          <StartScreen {...this.props} contentTree={this.state.contentTree} />
        );
      case CONSTANTS.SCREEN.PLAYING_SCREEN:
        return (
          <PlayingScreen {...this.props}
            contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            buffered={this.state.buffered}
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            seeking={this.state.seeking}
            upNextInfo={this.state.upNextInfo}
            authorization={this.state.authorization}
            controlBarAutoHide={this.props.skinConfig.controlBar.autoHide}
            ref="playScreen" />
        );
      case CONSTANTS.SCREEN.SHARE_SCREEN:
        return (
          <ShareScreen {...this.props}
            contentTree={this.state.contentTree}
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
            upNextInfo={this.state.upNextInfo}
            authorization={this.state.authorization}
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
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            seeking={this.state.seeking}
            authorization={this.state.authorization}
            ref="endScreen" />
        );
      case CONSTANTS.SCREEN.AD_SCREEN:
        return (
          <AdScreen {...this.props}
            contentTree={this.state.contentTree}
            currentAdsInfo={this.state.currentAdsInfo}
            currentPlayhead={this.state.currentPlayhead}
            fullscreen={this.state.fullscreen}
            playerState={this.state.playerState}
            duration={this.state.duration}
            adVideoDuration={this.props.controller.state.adVideoDuration}
            buffered={this.state.buffered}
            seeking={this.state.seeking}
            controlBarAutoHide={this.props.skinConfig.controlBar.autoHide}
            ref="adScreen" />
        );
      case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
        return (
          <DiscoveryScreen {...this.props}
            contentTree={this.state.contentTree}
            currentPlayhead={this.state.currentPlayhead}
            duration={this.state.duration}
            buffered={this.state.buffered}
            discoveryData={this.state.discoveryData}
            playerState={this.state.playerState}
            fullscreen={this.state.fullscreen}
            seeking={this.state.seeking}
            ref="DiscoveryScreen" />
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
            closedCaptionOptions = {this.props.closedCaptionOptions}
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
            errorCode={this.props.controller.state.errorCode} />
        );
      default:
        return false;
    }
  }
});
module.exports = Skin;
