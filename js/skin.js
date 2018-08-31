/** ******************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
const React = require('react');
const Utils = require('./components/utils');
const CONSTANTS = require('./constants/constants');
const Spinner = require('./components/spinner');
const OnOffSwitch = require('./components/closed-caption/onOffSwitch');
const ClosedCaptionPanel = require('./components/closed-caption/closedCaptionPanel');
const DiscoveryPanel = require('./components/discoveryPanel');
const VideoQualityPanel = require('./components/videoQualityPanel');
const PlaybackSpeedPanel = require('./components/playbackSpeedPanel');
const ClosedCaptionMultiAudioMenu = 
  require('./components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');
const SharePanel = require('./components/sharePanel');
const MoreOptionsPanel = require('./components/moreOptionsPanel');
const AdScreen = require('./views/adScreen');
const EndScreen = require('./views/endScreen');
const StartScreen = require('./views/startScreen');
const ErrorScreen = require('./views/errorScreen');
const ContentScreen = require('./views/contentScreen');
const ResponsiveManagerMixin = require('./mixins/responsiveManagerMixin');
const createReactClass = require('create-react-class');

import {PlayingScreenWithAutoHide} from './views/playingScreen';
import {PauseScreenWithAutoHide} from './views/pauseScreen';

const Skin = createReactClass({
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
      const responsiveUIMultiple = this.props.skinConfig.responsive.breakpoints[this.state.responsiveId]
        .multiplier;
      const marginHeight = responsiveUIMultiple * this.props.skinConfig.controlBar.height;
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
    const newState = args || {};
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
      const coords = Utils.getCoords(event);

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
        const coords = Utils.getCoords(event);
        const params = this.getDirectionParams(coords.x, coords.y);
        this.props.controller.onTouchMove(params, true);
      }
    }
  },

  /**
   * @public
   * @description the function is called when we stop the rotation
   * @param {MouseEvent} event - mouse or touch event
   */
  handleVrPlayerMouseUp: function(event) {
    if (this.props.controller && this.props.controller.isVrStereo) {
      return;
    }

    if (this.props.controller && this.props.controller.videoVr) {
      let isVrMouseMove = this.state.isVrMouseMove;
      let isTouchEnd = typeof event === 'object' && event.type === 'touchend';

      if (isTouchEnd) {
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
      let endMove = this.state.isVrMouseMove || OO.isAndroid || OO.isIos;
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
   * @param {number} _pageX - x coordinate
   * @param {number} _pageY - y coordinate
   * @returns {[number, number, number]} array with yaw, roll, pitch
   */
  getDirectionParams: function(_pageX, _pageY) {
    const pageX = Utils.ensureNumber(_pageX, 0);
    const pageY = Utils.ensureNumber(_pageY, 0);
    const dx = pageX - this.state.xVrMouseStart;
    const dy = pageY - this.state.yVrMouseStart;
    const maxDegreesX = 90;
    const maxDegreesY = 120;
    const degreesForPixelYaw = maxDegreesX / this.state.componentWidth;
    const degreesForPixelPitch = maxDegreesY / this.state.componentHeight;
    const yaw = this.getVrViewingDirectionParamValue('yaw') + dx * degreesForPixelYaw;
    const pitch = this.getVrViewingDirectionParamValue('pitch') + dy * degreesForPixelPitch;
    return [yaw, 0, pitch];
  },

  /**
   * @description check vrViewingDirection existing and return the value
   * @private
   * @param {string} paramName - one of "yaw" or "pitch"
   * @returns {number} value of vrViewingDirection param
   */
  getVrViewingDirectionParamValue: function(paramName) {
    let vrViewingDirectionValue = 0;
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
    const selector = '[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']:enabled';
    let focusableElements = this.domElement.querySelectorAll(selector);

    if (focusableElements.length) {
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
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

  /**
   * This function toggles the current screen (pause/play) and
   * sets current direction for vr video (it is necessary for tilting)
   * when touchend is called on selected screen
   * @public
   * @param {Event} event - event object
   */
  handleTouchEnd: function(event) {
    event.preventDefault();
    if (this.props.controller.state.controlBarVisible) {
      let shouldToggle = false;
      if (this.props.controller.videoVr) {
        if (!this.state.isVrMouseMove) {
          shouldToggle = true;
        }
      } else {
        shouldToggle = true;
      }
      if (shouldToggle) {
        this.props.controller.togglePlayPause(event);
      }
      // set value for this.state.isVrMouseMove in this.handleVrPlayerMouseUp
    }
    if (this.props.controller.videoVr) { // only for vr on mobile
      // Check current a vr video position (an user could change position using tilting)
      if (
        typeof this.props.controller.checkVrDirection === 'function' &&
        typeof this.props.controller.setControllerVrViewingDirection === 'function'
      ) {
        const useVrViewingDirection = true;
        this.props.controller.checkVrDirection(useVrViewingDirection);
        this.props.controller.setControllerVrViewingDirection();
      }
    }
  },

  render: function() {
    let screen;

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
            <PlayingScreenWithAutoHide
              {...this.props}
              handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
              handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
              handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
              handleVrPlayerClick={this.handleVrPlayerClick}
              handleVrPlayerFocus={this.handleVrPlayerFocus}
              handleTouchEnd={this.handleTouchEnd}
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
            <PauseScreenWithAutoHide
              {...this.props}
              handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
              handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
              handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
              handleVrPlayerClick={this.handleVrPlayerClick}
              handleTouchEnd={this.handleTouchEnd}
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
              <MoreOptionsPanel
                {...this.props}
                responsiveView={this.state.responsiveId}
                fullscreen={this.state.fullscreen} />
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN:
          screen = (
            <ContentScreen
              {...this.props}
              screen={CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN}
              screenClassName="oo-content-screen-closed-captions"
              titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
              autoFocus={this.state.closedCaptionOptions.autoFocus}
              closedCaptionOptions={this.props.closedCaptionOptions}
              element={
                <OnOffSwitch {...this.props} ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS} />
              }
              icon="cc">
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
              screenClassName="oo-menu-content-screen"
              screen={CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN}
              titleText={CONSTANTS.SKIN_TEXT.VIDEO_QUALITY}
              autoFocus={this.state.videoQualityOptions.autoFocus}>
              <VideoQualityPanel
                {...this.props}
                fullscreen={this.state.fullscreen}
                videoQualityOptions={this.state.videoQualityOptions}
                responsiveView={this.state.responsiveId} />
            </ContentScreen>
          );
          break;
        case CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN:
          screen = (
            <ContentScreen
              {...this.props}
              screenClassName="oo-menu-content-screen"
              screen={CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN}
              titleText={CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}
              autoFocus={this.state.playbackSpeedOptions.autoFocus} >
              <PlaybackSpeedPanel
                language={this.props.language}
                localizableStrings={this.props.localizableStrings}
                controller={this.props.controller}
                skinConfig={this.props.skinConfig}
                fullscreen={this.state.fullscreen}
                responsiveView={this.state.responsiveId} />
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
              screenClassName="oo-cc-ma-container"
              autoFocus={this.state.multiAudioOptions.autoFocus}
              icon="cc">
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
