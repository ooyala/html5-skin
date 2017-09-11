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
      discoveryData: null,
      isMouseDown: false,
      isMouseMove: false,
      XMouseStart: 0,
      YMouseStart: 0,
    };
  },

  componentDidUpdate: function() {
    // Notify AMC the correct overlay rendering info
    if (this.state.screenToShow !== null && !this.overlayRenderingEventSent) {
      var responsiveUIMultiple = this.props.skinConfig.responsive.breakpoints[this.state.responsiveId].multiplier;
      var marginHeight = responsiveUIMultiple * this.props.skinConfig.controlBar.height;
      this.props.controller.publishOverlayRenderingEvent(marginHeight);
      this.overlayRenderingEventSent = true;
    }
  },

  componentDidMount: function () {
    window.addEventListener('mouseup', this.handleClickOutsidePlayer);
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

  updatePlayhead: function(newPlayhead, newDuration, newBuffered, adPlayhead) {
    this.setState({
      currentPlayhead: newPlayhead,
      duration: newDuration,
      buffered: newBuffered,
      currentAdPlayhead: adPlayhead
    });
  },

  //here and below functions for 360 (vr functions)
  handleVRPlayerMouseDown: function(e) {
    if (this.props.controller.state.isVideo360) {
      this.setState({
        isMouseDown: true,
        XMouseStart: e.pageX,
        YMouseStart: e.pageY
      });
      if (this.props.controller.onTouched) {
        this.props.controller.onTouched(true);
      }
    }
  },

  handleVRPlayerMouseMove: function(e) {
    if (this.props.controller.state.isVideo360 && this.state.isMouseDown) {
      this.setState({
        isMouseMove: true
      });
      if (this.props.controller.onTouching) {
        var params = this.getDirectionParams(e.pageX, e.pageY);
        this.props.controller.onTouching(params, true);
      }
    }
  },

  handleVRPlayerMouseUp: function() {
    if (this.props.controller.state.isVideo360) {
      this.setState({
        isMouseDown: false,
        XMouseStart: 0,
        YMouseStart: 0
      });
      if (this.props.controller.onTouched) {
        this.props.controller.onTouched(true);
      }
    }
  },

  handleVRPlayerMouseLeave: function () {
    if (this.props.controller.state.isVideo360) {
      this.setState({
        isMouseDown: false,
      });
    }
  },

  handleVRPlayerClick: function () {
    this.setState({
      isMouseMove: false,
    });
  },

  getDirectionParams: function(pageX, pageY) {
    var dx = pageX - this.state.XMouseStart
      , dy = pageY - this.state.YMouseStart;
    var maxDegreesX = 90
      , maxDegreesY = 120;
    var degreesForPixelYaw = maxDegreesX / this.state.componentWidth
      , degreesForPixelPitch = maxDegreesY / this.state.componentHeight;
    var yaw = (this.props.controller.state.viewingDirection.yaw || 0) + dx * degreesForPixelYaw
      , pitch = (this.props.controller.state.viewingDirection.pitch || 0) + dy * degreesForPixelPitch;
    return [yaw, 0, pitch];
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
        case CONSTANTS.SCREEN.INITIAL_SCREEN:
          screen = (
            <StartScreen {...this.props}
              componentWidth={this.state.componentWidth}
              contentTree={this.state.contentTree}
              isInitializing={true} />
          );
          break;
        case CONSTANTS.SCREEN.LOADING_SCREEN:
          screen = (
            <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/>
          );
          break;
        case CONSTANTS.SCREEN.START_SCREEN:
          screen = (
            <StartScreen {...this.props}
              componentWidth={this.state.componentWidth}
              contentTree={this.state.contentTree}
              isInitializing={false} />
          );
          break;
        case CONSTANTS.SCREEN.PLAYING_SCREEN:
          screen = (
            <PlayingScreen
              {...this.props}
              handleVRPlayerMouseDown={this.handleVRPlayerMouseDown}
              handleVRPlayerMouseMove={this.handleVRPlayerMouseMove}
              handleVRPlayerMouseUp={this.handleVRPlayerMouseUp}
              handleVRPlayerMouseLeave={this.handleVRPlayerMouseLeave}
              handleVRPlayerClick={this.handleVRPlayerClick}
              isMouseMove={this.state.isMouseMove}
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
              componentHeight={this.state.componentHeight}
              videoQualityOptions={this.state.videoQualityOptions}
              closedCaptionOptions={this.props.closedCaptionOptions}
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
            <PauseScreen
              {...this.props}
              handleVRPlayerMouseDown={this.handleVRPlayerMouseDown}
              handleVRPlayerMouseMove={this.handleVRPlayerMouseMove}
              handleVRPlayerMouseUp={this.handleVRPlayerMouseUp}
              handleVRPlayerMouseLeave={this.handleVRPlayerMouseLeave}
              handleVRPlayerClick={this.handleVRPlayerClick}
              isMouseMove={this.state.isMouseMove}
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
              ref="pauseScreen"
            />
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
              currentAdPlayhead={this.state.currentAdPlayhead}
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
                forceCountDownTimer={this.state.forceCountDownTimerOnEndScreen}
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

Skin.defaultProps = {
  skinConfig: {
    general: {
      loadingImage: {
        imageResource: {
          url: null
        }
      }
    },
    responsive: {
      breakpoints: {
        md: {
          multiplier: 1
        }
      }
    },
    controlBar: {
      height: 90
    }
  },
  controller: {
    state: {
      adVideoDuration: 0,
      errorCode: 404
    },
    publishOverlayRenderingEvent: function() {}
  }

};

module.exports = Skin;
