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
      isVrMouseDown: false,
      isVrMouseMove: false,
      xVrMouseStart: 0,
      yVrMouseStart: 0,
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
    this.props.controller.state.isClickedOutside = true;
  },

  switchComponent: function(args) {
    var newState = args || {};
    this.setState(newState);
  },

  updatePlayhead: function(newPlayhead, newDuration, newBuffered, adPlayhead) {
    this.setState({
      currentPlayhead: Utils.ensureNumber(newPlayhead, this.state.currentPlayhead),
      duration: Utils.ensureNumber(newDuration, this.state.duration),
      buffered: Utils.ensureNumber(newBuffered, this.state.buffered),
      currentAdPlayhead: Utils.ensureNumber(adPlayhead, this.state.currentAdPlayhead)
    });
  },

  /**
   * @public
   * @description the function is called when we start the rotation
   * @param e - event
   */
  handleVrPlayerMouseDown: function(e) {
    if (this.props.controller.videoVr) {

      var coords = Utils.getCoords(e);

      this.setState({
        isVrMouseDown: true,
        xVrMouseStart: coords.x,
        yVrMouseStart: coords.y
      });
      if (typeof this.props.controller.checkVrDirection === 'function') {
        this.props.controller.checkVrDirection();
      }
    }
  },

  /**
   * @public
   * @description the function is called while rotation is active
   * @param e - event
   */
  handleVrPlayerMouseMove: function(e) {
    if (this.props.controller.videoVr && this.state.isVrMouseDown) {
      this.setState({
        isVrMouseMove: true
      });

      var coords = Utils.getCoords(e);

      if (typeof this.props.controller.onTouchMove === 'function') {
        var params = this.getDirectionParams(coords.x, coords.y);
        this.props.controller.onTouchMove(params, true);
      }
    }
  },

  /**
   * @public
   * @description the function is called when we stop the rotation
   */
  handleVrPlayerMouseUp: function() {
    if (this.props.controller && this.props.controller.videoVr) {
      this.setState({
        isVrMouseDown: false,
        xVrMouseStart: 0,
        yVrMouseStart: 0
      });
      if (typeof this.props.controller.checkVrDirection === 'function') {
        this.props.controller.checkVrDirection();
      }
    }
  },

  /**
   * @public
   * @description set isVrMouseDown to false for mouseleave event
   */
  handleVrPlayerMouseLeave: function () {
    if (this.props.controller.videoVr) {
      this.setState({
        isVrMouseDown: false,
      });
    }
  },

  /**
   * @public
   * @description set isVrMouseMove to false for click event
   */
  handleVrPlayerClick: function () {
    this.setState({
      isVrMouseMove: false,
    });
  },

  /**
   * @public
   * @description set accessibilityControlsEnabled to true for focus event
   */
  handleVrPlayerFocus: function() {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  /**
   * @description get direction params. Direction params are values for new position of a vr video (yaw, roll=0, pitch)
   * @private
   * @param pageX {number} x coordinate
   * @param pageY {number} y coordinate
   * @returns {[number, number, number]}
   */
  getDirectionParams: function(pageX, pageY) {
    pageX = Utils.ensureNumber(pageX, 0);
    pageY = Utils.ensureNumber(pageY, 0);
    var dx = pageX - this.state.xVrMouseStart;
    var dy = pageY - this.state.yVrMouseStart;
    var maxDegreesX = 90;
    var maxDegreesY = 120;
    var degreesForPixelYaw = maxDegreesX / this.state.componentWidth;
    var degreesForPixelPitch = maxDegreesY / this.state.componentHeight;
    var yaw = this.getVrViewingDirectionParamValue("yaw") + dx * degreesForPixelYaw;
    var pitch = this.getVrViewingDirectionParamValue("pitch") + dy * degreesForPixelPitch;
    return [yaw, 0, pitch];
  },

  /**
   * @description check vrViewingDirection existing and return the value
   * @private
   * @param paramName {string} "yaw", "pitch"
   * @returns {number} value of vrViewingDirection param
   */
  getVrViewingDirectionParamValue: function(paramName) {
    var vrViewingDirectionValue = 0;
    if (this.props.controller &&
      this.props.controller.state &&
      this.props.controller.state.vrViewingDirection &&
      typeof this.props.controller.state.vrViewingDirection[paramName] === "number") {
      vrViewingDirectionValue = this.props.controller.state.vrViewingDirection[paramName]
    }
    return vrViewingDirectionValue
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
              handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
              handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
              handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
              handleVrPlayerMouseLeave={this.handleVrPlayerMouseLeave}
              handleVrPlayerClick={this.handleVrPlayerClick}
              handleVrPlayerFocus={this.handleVrPlayerFocus}
              isVrMouseMove={this.state.isVrMouseMove}
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
              captionDirection={this.props.controller.captionDirection}
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
              handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
              handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
              handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
              handleVrPlayerMouseLeave={this.handleVrPlayerMouseLeave}
              handleVrPlayerClick={this.handleVrPlayerClick}
              isVrMouseMove={this.state.isVrMouseMove}
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
              captionDirection={this.props.controller.captionDirection}
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
            autoFocus={this.state.closedCaptionOptions.autoFocus}
            closedCaptionOptions={this.props.closedCaptionOptions}
            element={<OnOffSwitch {...this.props} ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS} />}
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
            autoFocus={this.state.videoQualityOptions.autoFocus}
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
