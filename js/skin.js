/** ******************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var React = require('react');
var Utils = require('./components/utils');
var CONSTANTS = require('./constants/constants');
var Spinner = require('./components/spinner');
var OnOffSwitch = require('./components/closed-caption/onOffSwitch');
var ClosedCaptionPanel = require('./components/closed-caption/closedCaptionPanel');
var DiscoveryPanel = require('./components/discoveryPanel');
var VideoQualityPanel = require('./components/videoQualityPanel');
var ClosedCaptionMultiAudioMenu = require('./components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');
var SharePanel = require('./components/sharePanel');
var MoreOptionsPanel = require('./components/moreOptionsPanel');
var AdScreen = require('./views/adScreen');
var EndScreen = require('./views/endScreen');
var StartScreen = require('./views/startScreen');
var PauseScreen = require('./views/pauseScreen');
var PlayingScreen = require('./views/playingScreen');
var ErrorScreen = require('./views/errorScreen');
var ContentScreen = require('./views/contentScreen');
var ResponsiveManagerMixin = require('./mixins/responsiveManagerMixin');
var createReactClass = require('create-react-class');

var Skin = createReactClass({
  mixins: [ResponsiveManagerMixin],

  /**
   * Ref callback, stores reference to DOM element.
   * @private
   * @param {HTMLElement} domElement A reference to the component's DOM element
   */
  storeRef: function(domElement) {
    this.domElement = domElement;
  },

  getInitialState: function() {
    this.overlayRenderingEventSent = false;
    return {
      screenToShow: null,
      currentPlayhead: 0,
      discoveryData: null,
      isVrMouseDown: false,
      isVrMouseMove: false,
      xVrMouseStart: 0,
      yVrMouseStart: 0
    };
  },

  componentDidUpdate: function() {
    // Notify AMC the correct overlay rendering info
    if (this.state.screenToShow !== null && !this.overlayRenderingEventSent) {
      var responsiveUIMultiple = this.props.skinConfig.responsive.breakpoints[this.state.responsiveId]
        .multiplier;
      var marginHeight = responsiveUIMultiple * this.props.skinConfig.controlBar.height;
      this.props.controller.publishOverlayRenderingEvent(marginHeight);
      this.overlayRenderingEventSent = true;
    }
  },

  componentDidMount: function() {
    window.addEventListener('mouseup', this.handleClickOutsidePlayer);
    document.addEventListener('keydown', this.onKeyDown);
  },

  componentWillUnmount: function() {
    window.removeEventListener('mouseup', this.handleClickOutsidePlayer);
    document.removeEventListener('keydown', this.onKeyDown);
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
   * @param {MouseEvent} event - event
   */
  handleVrPlayerMouseDown: function(event) {
    if (this.props.controller && this.props.controller.isVrStereo) {
      return;
    }
    if (this.props.controller && this.props.controller.videoVr) {
      var coords = Utils.getCoords(event);

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
   * @param {MouseEvent} event - event
   */
  handleVrPlayerMouseMove: function(event) {
    if (this.props.controller && this.props.controller.isVrStereo) {
      return;
    }
    if (this.props.controller && this.props.controller.videoVr && this.state.isVrMouseDown) {
      event.preventDefault();
      this.setState({
        isVrMouseMove: true
      });
      if (typeof this.props.controller.onTouchMove === 'function') {
        var coords = Utils.getCoords(event);
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
    if (this.props.controller && this.props.controller.isVrStereo) {
      return;
    }
    if (this.props.controller && this.props.controller.videoVr) {
      var isVrMouseMove = this.state.isVrMouseMove;
      if (Utils.isIos()) {
        isVrMouseMove = false; // for the opportunity to stop video on iPhone by touching on the screen
      }
      this.setState({
        isVrMouseDown: false,
        isVrMouseMove: isVrMouseMove,
        xVrMouseStart: 0,
        yVrMouseStart: 0
      });

      if (typeof this.props.controller.checkVrDirection === 'function') {
        this.props.controller.checkVrDirection();
      }

      // The camera decelerate after the "touchmove" on the mobile device
      // or on the desktop after the "mousemove",
      // but not after using the rotation controls
      var endMove = this.state.isVrMouseMove || OO.isAndroid || OO.isIos;
      if (endMove && typeof this.props.controller.onEndMove === 'function') {
        this.props.controller.onEndMove();
      }
    }
  },

  /**
   * @public
   * @description set isVrMouseMove to false for click event
   */
  handleVrPlayerClick: function() {
    this.setState({
      isVrMouseMove: false
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
   * @description get direction params.
   * Direction params are values for new position of a vr video (yaw, roll=0, pitch)
   * @private
   * @param {number} pageX - x coordinate
   * @param {number} pageY - y coordinate
   * @returns {[number, number, number]} array with yaw, roll, pitch
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
    var yaw = this.getVrViewingDirectionParamValue('yaw') + dx * degreesForPixelYaw;
    var pitch = this.getVrViewingDirectionParamValue('pitch') + dy * degreesForPixelPitch;
    return [yaw, 0, pitch];
  },

  /**
   * @description check vrViewingDirection existing and return the value
   * @private
   * @param {string} paramName - one of "yaw" or "pitch"
   * @returns {number} value of vrViewingDirection param
   */
  getVrViewingDirectionParamValue: function(paramName) {
    var vrViewingDirectionValue = 0;
    if (
      this.props.controller &&
      this.props.controller.state &&
      this.props.controller.state.vrViewingDirection &&
      typeof this.props.controller.state.vrViewingDirection[paramName] === 'number'
    ) {
      vrViewingDirectionValue = this.props.controller.state.vrViewingDirection[paramName];
    }
    return vrViewingDirectionValue;
  },

  /**
   * Will handle the keydown event when the player is active and it will restrict
   * tab navigation to elements that are within it when it is in fullscreen mode.
   * Note that this only handles the edge cases that are needed in order to loop the tab
   * focus. Tabbing in between the elements is handled by the browser.
   * @private
   * @param {Event} evt Keydown event object.
   */
  onKeyDown: function(evt) {
    if (
      !evt.target ||
      !this.domElement ||
      !this.props.controller.state.fullscreen ||
      evt.key !== CONSTANTS.KEY_VALUES.TAB
    ) {
      return;
    }
    // Focusable elements on the player (this.domElement) are expected to have the
    // data-focus-id attribute, this is a convention used throughout this project.
    var selector = '[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']:enabled';
    var focusableElements = this.domElement.querySelectorAll(selector);

    if (focusableElements.length) {
      var firstFocusableElement = focusableElements[0];
      var lastFocusableElement = focusableElements[focusableElements.length - 1];
      // This indicates we're tabbing over the focusable player elements
      if (evt.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)) {
        if (evt.shiftKey) {
          // Shift + tabbing on first element, focus on last
          if (evt.target === firstFocusableElement) {
            evt.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          // Tabbing on last element, focus on first
          if (evt.target === lastFocusableElement) {
            evt.preventDefault();
            firstFocusableElement.focus();
          }
        }
        // Keydown happened on a non-player element
      } else {
        evt.preventDefault();

        if (evt.shiftKey) {
          lastFocusableElement.focus();
        } else {
          firstFocusableElement.focus();
        }
      }
    } else {
      OO.log('Skin: No focusable elements found');
    }
  },

  render: function() {
    var screen;

    // For IE10, use the start screen and that's it.
    if (Utils.isIE10()) {
      if (this.state.screenToShow === CONSTANTS.SCREEN.START_SCREEN) {
        screen = (
          <StartScreen
            {...this.props}
            componentWidth={this.state.componentWidth}
            contentTree={this.state.contentTree}
          />
        );
      } else {
        screen = <div />;
      }
    } else {
      // switch screenToShow
      switch (this.state.screenToShow) {
        case CONSTANTS.SCREEN.INITIAL_SCREEN:
          screen = (
            <StartScreen
              {...this.props}
              componentWidth={this.state.componentWidth}
              contentTree={this.state.contentTree}
              isInitializing={true}
            />
          );
          break;
        case CONSTANTS.SCREEN.LOADING_SCREEN:
          screen = <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url} />;
          break;
        case CONSTANTS.SCREEN.START_SCREEN:
          screen = (
            <StartScreen
              {...this.props}
              componentWidth={this.state.componentWidth}
              contentTree={this.state.contentTree}
              isInitializing={false}
            />
          );
          break;
        case CONSTANTS.SCREEN.START_LOADING_SCREEN:
          screen = (
            <StartScreen
              {...this.props}
              componentWidth={this.state.componentWidth}
              contentTree={this.state.contentTree}
              isInitializing={false}
              showSpinner={true}
            />
          );
          break;
        case CONSTANTS.SCREEN.PLAYING_SCREEN:
          screen = (
            <PlayingScreen
              {...this.props}
              handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
              handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
              handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
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
              ref="playScreen"
            />
          );
          break;
        case CONSTANTS.SCREEN.SHARE_SCREEN:
          screen = (
            <ContentScreen {...this.props} screen={CONSTANTS.SCREEN.SHARE_SCREEN} icon="share">
              <SharePanel
                {...this.props}
                assetId={this.state.assetId}
                playerParam={this.state.playerParam}
                contentTree={this.state.contentTree}
              />
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
              handleVrPlayerClick={this.handleVrPlayerClick}
              isVrMouseMove={this.state.isVrMouseMove}
              contentTree={this.state.contentTree}
              currentPlayhead={this.state.currentPlayhead}
              playerState={this.state.playerState}
              duration={this.state.duration}
              buffered={this.state.buffered}
              pauseAnimationDisabled={this.state.pauseAnimationDisabled}
              fullscreen={this.state.fullscreen}
              seeking={this.state.seeking}
              upNextInfo={this.state.upNextInfo}
              isLiveStream={this.state.isLiveStream}
              controlBarAutoHide={this.props.skinConfig.controlBar.autoHide}
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
            <EndScreen
              {...this.props}
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
              ref="endScreen"
            />
          );
          break;
        case CONSTANTS.SCREEN.AD_SCREEN:
          screen = (
            <AdScreen
              {...this.props}
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
              ref="adScreen"
            />
          );
          break;
        case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
          screen = (
            <ContentScreen
              {...this.props}
              screen={CONSTANTS.SCREEN.DISCOVERY_SCREEN}
              titleText={CONSTANTS.SKIN_TEXT.DISCOVER}
              icon="discovery"
            >
              <DiscoveryPanel
                {...this.props}
                videosPerPage={{ xs: 2, sm: 4, md: 6, lg: 8 }}
                forceCountDownTimer={this.state.forceCountDownTimerOnEndScreen}
                discoveryData={this.state.discoveryData}
                playerState={this.state.playerState}
                responsiveView={this.state.responsiveId}
                componentWidth={this.state.componentWidth}
              />
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN:
          screen = (
            <ContentScreen {...this.props} screen={CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN}>
              <MoreOptionsPanel {...this.props} fullscreen={this.state.fullscreen} />
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN:
          screen = (
            <ContentScreen
              {...this.props}
              screen={CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN}
              screenClassName="oo-content-screen oo-content-screen-closed-captions"
              titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
              autoFocus={this.state.closedCaptionOptions.autoFocus}
              closedCaptionOptions={this.props.closedCaptionOptions}
              element={
                <OnOffSwitch {...this.props} ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS} />
              }
              icon="cc"
            >
              <ClosedCaptionPanel
                {...this.props}
                closedCaptionOptions={this.props.closedCaptionOptions}
                dataItemsPerPage={{ xs: 1, sm: 4, md: 8, lg: 8 }}
                responsiveView={this.state.responsiveId}
                componentWidth={this.state.componentWidth}
              />
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
              icon="quality"
            >
              <VideoQualityPanel
                {...this.props}
                fullscreen={this.state.fullscreen}
                videoQualityOptions={this.state.videoQualityOptions}
                responsiveView={this.state.responsiveId}
              />
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN:
          screen = (
            <ContentScreen
              {...this.props}
              cssClass="oo-close-button oo-close-button--ma"
              dataItemsPerPage={{ xs: 1, sm: 4, md: 8, lg: 8 }}
              screen={CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN}
              screenClassName="oo-content-screen oo-cc-ma-container"
              autoFocus={this.state.multiAudioOptions.autoFocus}
              icon="cc"
            >
              <ClosedCaptionMultiAudioMenu {...this.props} />
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.ERROR_SCREEN:
          screen = <ErrorScreen {...this.props} errorCode={this.props.controller.state.errorCode} />;
          break;
        default:
          screen = <div />;
      }
    }

    return (
      <div
        id="oo-responsive"
        ref={this.storeRef}
        className={this.state.responsiveClass}>
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
