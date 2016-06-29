/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var React = require('react'),
    Utils = require('./components/utils'),
    CONSTANTS = require('./constants/constants'),
    Spinner = require('./components/spinner'),
    OnOffSwitch = require('./components/closed-caption/onOffSwitch'),
    ClosedCaptionPanel = require('./components/closed-caption/closedCaptionPanel'),
    DiscoveryPanel = require('./components/discoveryPanel'),
    VideoQualityPanel = require('./components/videoQualityPanel'),
    SharePanel = require('./components/sharePanel'),
    MoreOptionsPanel = require('./components/moreOptionsPanel'),
    AdScreen = require('./views/adScreen'),
    EndScreen = require('./views/endScreen'),
    StartScreen = require('./views/startScreen'),
    PauseScreen = require('./views/pauseScreen'),
    PlayingScreen = require('./views/playingScreen'),
    ErrorScreen = require('./views/errorScreen'),
    ContentScreen = require('./views/contentScreen'),
    ResponsiveManagerMixin = require('./mixins/responsiveManagerMixin');

var Skin = React.createClass({
  mixins: [ResponsiveManagerMixin],

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
      var responsiveUIMultiple = this.props.skinConfig.responsive.breakpoints[this.state.responsiveId].multiplier;
      var marginHeight = responsiveUIMultiple * CONSTANTS.UI.defaultControlBarHeight;
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
      this.props.controller.state.closedCaptionOptions.textColor = (this.props.skinConfig.closedCaptionOptions.defaultTextColor ? this.props.skinConfig.closedCaptionOptions.defaultTextColor : "White");
      this.props.controller.state.closedCaptionOptions.windowColor = (this.props.skinConfig.closedCaptionOptions.defaultWindowColor ? this.props.skinConfig.closedCaptionOptions.defaultWindowColor : "Transparent");
      this.props.controller.state.closedCaptionOptions.backgroundColor = (this.props.skinConfig.closedCaptionOptions.defaultBackgroundColor ? this.props.skinConfig.closedCaptionOptions.defaultBackgroundColor : "Black");
      this.props.controller.state.closedCaptionOptions.textOpacity = (this.props.skinConfig.closedCaptionOptions.defaultTextOpacity ? this.props.skinConfig.closedCaptionOptions.defaultTextOpacity : 1);
      this.props.controller.state.closedCaptionOptions.backgroundOpacity = (this.props.skinConfig.closedCaptionOptions.defaultBackgroundOpacity ? this.props.skinConfig.closedCaptionOptions.defaultBackgroundOpacity : 0.6);
      this.props.controller.state.closedCaptionOptions.windowOpacity = (this.props.skinConfig.closedCaptionOptions.defaultWindowOpacity ? this.props.skinConfig.closedCaptionOptions.defaultWindowOpacity : 0);
      this.props.controller.state.closedCaptionOptions.fontType = (this.props.skinConfig.closedCaptionOptions.defaultFontType ? this.props.skinConfig.closedCaptionOptions.defaultFontType : "Proportional Sans-Serif");
      this.props.controller.state.closedCaptionOptions.fontSize = (this.props.skinConfig.closedCaptionOptions.defaultFontSize ? this.props.skinConfig.closedCaptionOptions.defaultFontSize : "Medium");
      this.props.controller.state.closedCaptionOptions.textEnhancement = (this.props.skinConfig.closedCaptionOptions.defaultTextEnhancement ? this.props.skinConfig.closedCaptionOptions.defaultTextEnhancement : "Uniform");
    }
    else {
      this.props.controller.state.closedCaptionOptions.language = "en";
      this.props.controller.state.closedCaptionOptions.enabled = false;
      this.props.controller.state.closedCaptionOptions.textColor = "White";
      this.props.controller.state.closedCaptionOptions.windowColor = "Transparent";
      this.props.controller.state.closedCaptionOptions.backgroundColor = "Black";
      this.props.controller.state.closedCaptionOptions.textOpacity = 1;
      this.props.controller.state.closedCaptionOptions.backgroundOpacity = 0.6;
      this.props.controller.state.closedCaptionOptions.windowOpacity = 0;
      this.props.controller.state.closedCaptionOptions.fontType = "Proportional Sans-Serif";
      this.props.controller.state.closedCaptionOptions.fontSize = "Medium";
      this.props.controller.state.closedCaptionOptions.textEnhancement = "Uniform";
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
              isLiveStream={this.state.isLiveStream}
              controlBarAutoHide={this.props.skinConfig.controlBar.autoHide}
              responsiveView={this.state.responsiveId}
              componentWidth={this.state.componentWidth}
              videoQualityOptions={this.state.videoQualityOptions}
              closedCaptionOptions = {this.props.closedCaptionOptions}
              ref="playScreen" />
          );
          break;
        case CONSTANTS.SCREEN.SHARE_SCREEN:
          screen = (
          <ContentScreen
            {...this.props}
            screen={CONSTANTS.SCREEN.SHARE_SCREEN}
            icon="share">
            <SharePanel
              {...this.props}
              assetId={this.state.assetId}
              playerParam={this.state.playerParam}
              contentTree={this.state.contentTree} />
          </ContentScreen>
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
              isLiveStream={this.state.isLiveStream}
              responsiveView={this.state.responsiveId}
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
              isLiveStream={this.state.isLiveStream}
              responsiveView={this.state.responsiveId}
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
              responsiveView={this.state.responsiveId}
              componentWidth={this.state.componentWidth}
              videoQualityOptions={this.state.videoQualityOptions}
              adStartTime={this.state.adStartTime}
              ref="adScreen" />
          );
          break;
        case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
          screen = (
            <ContentScreen
              {...this.props}
              screen={CONSTANTS.SCREEN.DISCOVERY_SCREEN}
              titleText={CONSTANTS.SKIN_TEXT.DISCOVER}
              icon="discovery">
              <DiscoveryPanel
                {...this.props}
                videosPerPage={{xs:2, sm:4, md:6, lg:8}}
                discoveryData={this.state.discoveryData}
                playerState={this.state.playerState}
                responsiveView={this.state.responsiveId}
                componentWidth={this.state.componentWidth}/>
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN:
          screen = (
          <ContentScreen
            {...this.props}
            screen={CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN}>
            <MoreOptionsPanel
              {...this.props}
              fullscreen={this.state.fullscreen}/>
          </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN:
          screen = (
          <ContentScreen
            {...this.props}
            screen={CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN}
            screenClassName="oo-content-screen oo-content-screen-closed-captions"
            titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
            closedCaptionOptions={this.props.closedCaptionOptions}
            element={<OnOffSwitch {...this.props} />}
            icon="cc">
            <ClosedCaptionPanel
              {...this.props}
              closedCaptionOptions={this.props.closedCaptionOptions}
              dataItemsPerPage={{xs:1, sm:4, md:8, lg:8}}
              responsiveView={this.state.responsiveId}
              componentWidth={this.state.componentWidth}/>
          </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN:
          screen = (
          <ContentScreen
            {...this.props}
            screen={CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN}
            titleText={CONSTANTS.SKIN_TEXT.VIDEO_QUALITY}
            icon="quality">
            <VideoQualityPanel
              {...this.props}
              fullscreen={this.state.fullscreen}
              videoQualityOptions={this.state.videoQualityOptions}
              responsiveView={this.state.responsiveId}/>
          </ContentScreen>
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
      <div id="oo-responsive" className={this.state.responsiveClass}>
        {screen}
      </div>
    );
  }
});
module.exports = Skin;