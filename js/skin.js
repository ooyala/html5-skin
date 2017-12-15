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

    // if (window.DeviceOrientationEvent) {
    //   console.log('BBB this.props.controller', this.props.controller);
    //   if (this.props.controller) {
    //     console.log('BBB this.props.controller.videoVr', this.props.controller.videoVr);
    //   }
    //   window.addEventListener('deviceorientation', this.handleVrMobileOrientation.bind(this), false);
    // }
  },

  componentWillUnmount: function () {
    window.removeEventListener('mouseup', this.handleClickOutsidePlayer);
  },

  checkVrGyroscopeEnabled: function() {
    if (this.props.controller &&
      this.props.controller.videoVr &&
      this.props.controller.state.isMobile &&
      typeof this.props.controller.checkVrGyroscopeEnabled === 'function') {
      this.props.controller.checkVrGyroscopeEnabled();
    }
  },

  handleVrDevicemotion: function () {
    window.addEventListener("devicemotion", function(e) {
    console.log('BBB e.rotationRate',  e.rotationRate);
    console.log('BBB e.interval',  e.interval);
// e.acceleration
// e.accelerationIncludingGravity
// e.rotationRate (Returns the rate at which the device is rotating around each of its axes in degrees per second)
// e.interval(Returns the interval, in milliseconds, at which data is obtained from the underlaying hardware)
    }, true);
  },

  handleVrMobileOrientation: function(e) {
    if (this.props.controller) {
      console.log('BBB handleVrMobileOrientation this.props.controller.videoVr', this.props.controller.videoVr);
    }
    if (!(this.props.controller || this.props.controller.videoVr)) {
      console.log('BBB WTF');
      return;
    }
    if (!this.props.controller.vrMobileOrientationChecked) {

      console.log('BBB e', e);

      var beta = e.beta; //x
      var alpha = e.alpha; //z
      var gamma = e.gamma; //y


      var yaw = this.getVrViewingDirectionParamValue("yaw");
      var pitch = this.getVrViewingDirectionParamValue("pitch");
      console.log('BBB beta', beta);
      console.log('BBB Math.round(event.beta)', Math.round(beta));
      console.log('BBB alpha', alpha);
      console.log('BBB Math.round(alpha)', Math.round(alpha));
      console.log('BBB gamma', gamma);
      console.log('BBB Math.round(gamma)', Math.round(gamma));
      console.log('BBB yaw', yaw);
      console.log('BBB pitch', pitch);

      if (alpha !== undefined && alpha !== null) {
        // yaw += beta;
        yaw += alpha;
        pitch += gamma;

        console.log('BBB yaw2', yaw);
        console.log('BBB pitch2', pitch);

        if (typeof this.props.controller.onTouchMove === 'function') {
          var params = [yaw, 0, pitch];
          this.props.controller.onTouchMove(params);
        }
      }

      this.props.controller.vrMobileOrientationChecked = true;
    }
  },

  // handleVrMobileOrientation: function(e) {
  //   if (typeof e.rotationRate === "undefined") { return; }
  //   var mobileVibrationValue = Utils.isIos() ? 0.022 : 1;
  //   // var ratio = 0.00277778;
  //   // var ratio = 0.0159154943;
  //   var ratio = 1;
  //   var x = e.rotationRate.alpha * ratio;
  //   var y = e.rotationRate.beta * ratio;
  //   var portrait = typeof e.portrait !== "undefined" ? e.portrait : window.matchMedia("(orientation: portrait)").matches;
  //   var landscape = typeof e.landscape !== "undefined" ? e.landscape : window.matchMedia("(orientation: landscape)").matches;
  //   var orientation = e.orientation || window.orientation;
  //
  //   var yaw = this.getVrViewingDirectionParamValue("yaw");
  //   var pitch = this.getVrViewingDirectionParamValue("pitch");
  //   if (portrait) {
  //     yaw = yaw - y * mobileVibrationValue;
  //     pitch = pitch + x * mobileVibrationValue;
  //     // yaw = yaw - y;
  //     // pitch = pitch + x;
  //   } else if (landscape) {
  //     var orientationDegree = -90;
  //     if (typeof orientation != "undefined") {
  //       orientationDegree = orientation;
  //     }
  //
  //     yaw = orientationDegree === -90 ? yaw + x * mobileVibrationValue : yaw - x * mobileVibrationValue;
  //     pitch = orientationDegree === -90 ? pitch + y * mobileVibrationValue : pitch - y * mobileVibrationValue;
  //   }
  //
  //   console.log('BBB yaw ', yaw, ' pitch ', pitch);
  //   return [yaw, 0, pitch];
  // },

  // handleMobileOrientation: function(event) {
  //   if (typeof event.rotationRate === "undefined") return;
  //   var mobileVibrationValue = Utils.isIos() ? 0.022 : 1;
  //   var x = event.rotationRate.alpha;
  //   var y = event.rotationRate.beta;
  //   var portrait = typeof event.portrait !== "undefined" ? event.portrait : window.matchMedia("(orientation: portrait)").matches;
  //   var landscape = typeof event.landscape !== "undefined" ? event.landscape : window.matchMedia("(orientation: landscape)").matches;
  //   var orientation = event.orientation || window.orientation;
  //
  //   if (portrait) {
  //     this.lon = this.lon - y * this.mobileVibrationValue;
  //     this.lat = this.lat + x * this.mobileVibrationValue;
  //   } else if (landscape) {
  //     var orientationDegree = -90;
  //     if (typeof orientation != "undefined") {
  //       orientationDegree = orientation;
  //     }
  //
  //     this.lon = orientationDegree == -90 ? this.lon + x * this.mobileVibrationValue : this.lon - x * this.mobileVibrationValue;
  //     this.lat = orientationDegree == -90 ? this.lat + y * this.mobileVibrationValue : this.lat - y * this.mobileVibrationValue;
  //   }
  // },

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
        console.log('BBB params', params);
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
              checkVrGyroscopeEnabled={this.checkVrGyroscopeEnabled}
              handleVrMobileOrientation={this.handleVrMobileOrientation}
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
