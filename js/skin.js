/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var React = require('react'),
    Utils = require('./components/utils'),
    CONSTANTS = require('./constants/constants'),
    Spinner = require('./components/spinner'),
    AdScreen = require('./views/adScreen'),
    ClosedCaptionScreen = require('./views/closedCaptionScreen'),
    DiscoveryScreen = require('./views/discoveryScreen'),
    EndScreen = require('./views/endScreen'),
    MoreOptionsScreen = require('./views/moreOptionsScreen'),
    ShareScreen = require('./views/shareScreen'),
    StartScreen = require('./views/startScreen'),
    PauseScreen = require('./views/pauseScreen'),
    PlayingScreen = require('./views/playingScreen'),
    ErrorScreen = require('./views/errorScreen'),
    VideoQualityScreen = require('./views/videoQualityScreen'),
    ComponentWidthMixin = require('./mixins/componentWidthMixin'),
    ClassNames = require('classnames');

var Skin = React.createClass({
  mixins: [ComponentWidthMixin],

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
      var breakpointData = this.generateBreakpointData();
      var responsiveId = ClassNames(breakpointData.ids);
      var responsiveUIMultiple = this.props.skinConfig.responsive.breakpoints[responsiveId].multiplier;
      var marginHeight = responsiveUIMultiple * (CONSTANTS.UI.defaultControlBarHeight + CONSTANTS.UI.defaultScrubberBarHeight);
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

  generateBreakpointData: function() {
    var breakpoints = this.props.skinConfig.responsive.breakpoints;
    var breakpointData = {
      classes: {},
      ids: {}
    };

    //loop through breakpoints from skinConfig
    //generate Classname object with name and min/max width
    for (var key in breakpoints) {
      if (breakpoints.hasOwnProperty(key)) {
        //min width only, 1st breakpoint
        if(breakpoints[key].minWidth && !breakpoints[key].maxWidth) {
          breakpointData.classes[breakpoints[key].name] = breakpointData.ids[breakpoints[key].id] = this.state.componentWidth >= breakpoints[key].minWidth;
        }
        //min and max, middle breakpoints
        else if(breakpoints[key].minWidth && breakpoints[key].maxWidth) {
          breakpointData.classes[breakpoints[key].name] = breakpointData.ids[breakpoints[key].id] = this.state.componentWidth >= breakpoints[key].minWidth && this.state.componentWidth <= breakpoints[key].maxWidth;
        }
        //max width only, last breakpoint
        else if(breakpoints[key].maxWidth && !breakpoints[key].minWidth) {
          breakpointData.classes[breakpoints[key].name] = breakpointData.ids[breakpoints[key].id] = this.state.componentWidth <= breakpoints[key].maxWidth;
        }
      }
    }

    return breakpointData;
  },

  render: function() {
    var breakpointData = this.generateBreakpointData();
    var responsiveClass = ClassNames(breakpointData.classes);
    var responsiveId = ClassNames(breakpointData.ids);
    var screen;

    //For IE10, use the start screen and that's it.
    if (Utils.isIE10()){
      if (this.state.screenToShow == CONSTANTS.SCREEN.START_SCREEN){
        screen = (
          <StartScreen {...this.props}
            componentWidth={this.state.componentWidth}
            contentTree={this.state.contentTree} />
        );
      }
      else {
        screen = (<div></div>);
      }
    }
    //switch screenToShow
    else {
      switch (this.state.screenToShow) {
        case CONSTANTS.SCREEN.LOADING_SCREEN:
          screen = (
            <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/>
          );
          break;
        case CONSTANTS.SCREEN.START_SCREEN:
          screen = (
            <StartScreen {...this.props}
              componentWidth={this.state.componentWidth}
              contentTree={this.state.contentTree} />
          );
          break;
        case CONSTANTS.SCREEN.PLAYING_SCREEN:
          screen = (
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
              responsiveView={responsiveId}
              componentWidth={this.state.componentWidth}
              videoQualityOptions={this.state.videoQualityOptions}
              closedCaptionOptions = {this.props.closedCaptionOptions}
              ref="playScreen" />
          );
          break;
        case CONSTANTS.SCREEN.SHARE_SCREEN:
          screen = (
            <ShareScreen {...this.props}
              assetId={this.state.assetId}
              playerParam={this.state.playerParam}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              fullscreen={this.state.fullscreen}
              playerState={this.state.playerState}
              seeking={this.state.seeking}
              ref="shareScreen" />
          );
          break;
        case CONSTANTS.SCREEN.PAUSE_SCREEN:
          screen = (
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
              responsiveView={responsiveId}
              componentWidth={this.state.componentWidth}
              videoQualityOptions={this.state.videoQualityOptions}
              ref="pauseScreen" />
          );
          break;
        case CONSTANTS.SCREEN.END_SCREEN:
          screen = (
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
              responsiveView={responsiveId}
              videoQualityOptions={this.state.videoQualityOptions}
              componentWidth={this.state.componentWidth}
              ref="endScreen" />
          );
          break;
        case CONSTANTS.SCREEN.AD_SCREEN:
          screen = (
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
              responsiveView={responsiveId}
              componentWidth={this.state.componentWidth}
              videoQualityOptions={this.state.videoQualityOptions}
              ref="adScreen" />
          );
          break;
        case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
          screen = (
            <DiscoveryScreen {...this.props}
              discoveryData={this.state.discoveryData}
              playerState={this.state.playerState}
              responsiveView={responsiveId}
              componentWidth={this.state.componentWidth}
              ref="DiscoveryScreen" />
          );
          break;
        case CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN:
          screen = (
            <MoreOptionsScreen {...this.props}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              playerState={this.state.playerState}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              responsiveView={responsiveId}
              ref="moreOptionsScreen" />
          );
          break;
        case CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN:
          screen = (
            <ClosedCaptionScreen {...this.props}
              contentTree={this.state.contentTree}
              closedCaptionOptions = {this.props.closedCaptionOptions}
              currentPlayhead={this.state.currentPlayhead}
              duration={this.state.duration}
              buffered={this.state.buffered}
              playerState={this.state.playerState}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              responsiveView={responsiveId}
              componentWidth={this.state.componentWidth}
              ref="closedCaptionScreen" />
          );
          break;
        case CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN:
          screen = (
            <VideoQualityScreen {...this.props}
              playerState={this.state.playerState}
              fullscreen={this.state.fullscreen}
              videoQualityOptions={this.state.videoQualityOptions}
              responsiveView={responsiveId}
              ref="videoQualityScreen" />
          );
          break;
        case CONSTANTS.SCREEN.ERROR_SCREEN:
          screen = (
            <ErrorScreen {...this.props}
              errorCode={this.props.controller.state.errorCode} />
          );
          break;
        default:
          screen = (<div></div>);
      }
    }

    return (
      <div id="ooyala-responsive" className={responsiveClass}>
        {screen}
      </div>
    );
  }
});
module.exports = Skin;