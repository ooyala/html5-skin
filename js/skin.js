/** ******************************************************************
  RENDERER PLACEHOLDER
******************************************************************** */
import { PlayingScreen, PlayingScreenWithAutoHide } from './views/playingScreen';
import { PauseScreen, PauseScreenWithAutoHide } from './views/pauseScreen';

const React = require('react');
const createReactClass = require('create-react-class');
const ClassNames = require('classnames');
const Utils = require('./components/utils');
const CONSTANTS = require('./constants/constants');
const Spinner = require('./components/spinner');
const OnOffSwitch = require('./components/closed-caption/onOffSwitch');
const ClosedCaptionPanel = require('./components/closed-caption/closedCaptionPanel');
const DiscoveryPanel = require('./components/discoveryPanel');
const VideoQualityPanel = require('./components/videoQualityPanel');
const PlaybackSpeedPanel = require('./components/playbackSpeedPanel');
const ClosedCaptionMultiAudioMenu = require('./components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');
const SharePanel = require('./components/sharePanel');
const VolumePanel = require('./components/volumePanel');
const MoreOptionsPanel = require('./components/moreOptionsPanel');
import AdScreen from './views/adScreen';
const EndScreen = require('./views/endScreen');
const StartScreen = require('./views/startScreen');
const ErrorScreen = require('./views/errorScreen');
const ContentScreen = require('./views/contentScreen');
const ResponsiveManagerMixin = require('./mixins/responsiveManagerMixin');
const AudioOnlyScreen = require('./views/audioOnlyScreen');

const Skin = createReactClass({
  mixins: [ResponsiveManagerMixin],

  /**
   * Ref callback, stores reference to DOM element.
   * @private
   * @param {HTMLElement} domElement A reference to the component's DOM element
   */
  storeRef(domElement) {
    this.domElement = domElement;
  },

  getInitialState() {
    this.overlayRenderingEventSent = false;
    return {
      totalTime: '00:00',
      screenToShow: null,
      currentPlayhead: 0,
      discoveryData: null,
      isVrMouseDown: false,
      isVrMouseMove: false,
      xVrMouseStart: 0,
      yVrMouseStart: 0,
    };
  },

  componentDidUpdate() {
    // Notify AMC the correct overlay rendering info
    if (this.state.screenToShow !== null && !this.overlayRenderingEventSent) {
      const responsiveUIMultiple = this.props.skinConfig.responsive.breakpoints[this.state.responsiveId]
        .multiplier;
      const marginHeight = responsiveUIMultiple * this.props.skinConfig.controlBar.height;
      this.props.controller.publishOverlayRenderingEvent(marginHeight);
      this.overlayRenderingEventSent = true;
    }
  },

  componentDidMount() {
    window.addEventListener('mouseup', this.handleClickOutsidePlayer);
    document.addEventListener('keydown', this.onKeyDown);
  },

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleClickOutsidePlayer);
    document.removeEventListener('keydown', this.onKeyDown);
  },

  handleClickOutsidePlayer() {
    this.props.controller.state.accessibilityControlsEnabled = false;
    this.props.controller.state.isClickedOutside = true;
  },

  switchComponent(args) {
    const newState = args || {};
    this.setState(newState);
  },

  updatePlayhead(newPlayhead, newDuration, newBuffered, adPlayhead) {
    return new Promise((resolve) => {
      this.setState(function(prevState) {
        const duration = Utils.ensureNumber(newDuration, prevState.duration);
        const totalTime = this.getTotalTime(duration);
        const currentPlayhead = Utils.ensureNumber(newPlayhead, prevState.currentPlayhead);
        const buffered = Utils.ensureNumber(newBuffered, prevState.buffered);
        const currentAdPlayhead = Utils.ensureNumber(adPlayhead, prevState.currentAdPlayhead);
        return {
          currentPlayhead,
          duration,
          buffered,
          currentAdPlayhead,
          totalTime,
        };
      }, resolve);
    });
  },
  /**
   * Gets the total time of the video in (HH:)MM:SS format
   * @private
   * @param {number} duration - time to format HH:mm
   * @returns {string} The total time of the video in (HH:)MM:SS format
   */
  getTotalTime(duration) {
    let totalTime = '00:00';
    const ensureNumberDuration = Utils.ensureNumber(duration) ? Utils.ensureNumber(duration) : 0;
    totalTime = Utils.formatSeconds(ensureNumberDuration);
    return totalTime;
  },

  /**
   * Gets the current playhead time of the video in (HH:)MM:SS format. If the stream is live,
   * will return the time shift instead.
   * @private
   * @returns {string} The current playhead time in (HH:)MM:SS format or null if the current playhead is invalid or timeshift is 0
   */
  getPlayheadTime() {
    let playheadTime = isFinite(parseInt(this.state.currentPlayhead))
      ? Utils.formatSeconds(parseInt(this.state.currentPlayhead))
      : null;
    const isLiveStream = this.state.isLiveStream;
    const timeShift = this.state.currentPlayhead - this.state.duration;
    // checking timeShift < 1 seconds (not === 0) as processing of the click after we rewinded and then went live may take some time
    const isLiveNow = Math.abs(timeShift) < 1;
    playheadTime = isLiveStream
      ? (isLiveNow ? null : Utils.formatSeconds(timeShift))
      : playheadTime;
    return playheadTime;
  },

  /**
   * Handles mouseDown or touchStart events
   * Used for vr video
   * Checks and sets the current value of coordinates, which could be changed when the user used tilting
   * Sets coordinate values for further calculation of rotation coordinates
   * @public
   * @param {MouseEvent} event - event
   */
  handleVrPlayerMouseDown(event) {
    // continue only if video is vr and non in stereo mode
    if (!this.props.controller || this.props.controller.isVrStereo || !this.props.controller.videoVr) {
      return;
    }

    // Sets coordinate values for further calculation of rotation coordinates
    const coords = Utils.getCoords(event);
    this.setState({
      isVrMouseDown: true,
      xVrMouseStart: coords.x,
      yVrMouseStart: coords.y,
    });

    // Check current a vr video position (an user could change position using tilting)
    const useVrViewingDirection = true;
    this.updateVrDirection(useVrViewingDirection);
  },

  /**
   * Should be called when an user rotates a vr video
   * Sets the desired coordinate values during vr video rotation
   * Sets the state "isVrMouseMove" to true, indicating that the video is currently rotating.
   * @public
   * @param {MouseEvent} event - event
   */
  handleVrPlayerMouseMove(event) {
    if (this.props.controller && this.props.controller.isVrStereo) {
      return;
    }
    if (this.props.controller && this.props.controller.videoVr && this.state.isVrMouseDown) {
      event.preventDefault();
      this.setState({
        isVrMouseMove: true,
      });
      if (typeof this.props.controller.onTouchMove === 'function') {
        const coords = Utils.getCoords(event);
        const params = this.getDirectionParams(coords.x, coords.y);
        this.props.controller.onTouchMove(params, true);
      }
    }
  },

  /**
   * Should be called when an user stopped rotating vr video
   * Use only for mouseUp event,
   * !!! handlers for touchEnd event are in handleTouchEndOnWindow and handleTouchEndOnPlayer !!!
   * Used for vr video
   * Resets the initial values to calculate the coordinates of rotation
   * Says that the rotation of vr video is ended - set state "isVrMouseDown" to false
   * @public
   * @param {MouseEvent} event - mouse or touch event
   */
  handleVrPlayerMouseUp(event) {
    // continue only if video is vr and non in stereo mode
    if (!this.props.controller || !this.props.controller.videoVr || this.props.controller.isVrStereo) {
      return;
    }

    const isTouchEnd = typeof event === 'object' && event.type === 'touchend';
    // do not continue if the event is 'touchend'
    if (!isTouchEnd && typeof this.props.controller.checkVrDirection === 'function') {
      this.setState({
        isVrMouseDown: false,
        xVrMouseStart: 0,
        yVrMouseStart: 0,
      });
    }
  },

  /**
   * @public
   * @description set isVrMouseMove to false for click event
   */
  handleVrPlayerClick() {
    this.setState({
      isVrMouseMove: false,
    });
  },

  /**
   * @public
   * @description set accessibilityControlsEnabled to true for focus event
   */
  handleVrPlayerFocus() {
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
  getDirectionParams(_pageX, _pageY) {
    let yaw = this.getVrViewingDirectionParamValue('yaw');
    let pitch = this.getVrViewingDirectionParamValue('pitch');
    if (this.state.componentWidth && this.state.componentHeight) {
      const pageX = Utils.ensureNumber(_pageX, 0);
      const pageY = Utils.ensureNumber(_pageY, 0);
      const dx = pageX - this.state.xVrMouseStart;
      const dy = pageY - this.state.yVrMouseStart;
      const maxDegreesX = 90;
      const maxDegreesY = 120;
      const degreesForPixelYaw = maxDegreesX / this.state.componentWidth;
      const degreesForPixelPitch = maxDegreesY / this.state.componentHeight;
      yaw += dx * degreesForPixelYaw;
      pitch += dy * degreesForPixelPitch;
    }
    return [yaw, 0, pitch];
  },

  /**
   * @description check vrViewingDirection existing and return the value
   * @private
   * @param {string} paramName - one of "yaw" or "pitch"
   * @returns {number} value of vrViewingDirection param
   */
  getVrViewingDirectionParamValue(paramName) {
    let vrViewingDirectionValue = 0;
    if (
      this.props.controller
      && this.props.controller.state
      && this.props.controller.state.vrViewingDirection
      && typeof this.props.controller.state.vrViewingDirection[paramName] === 'number'
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
  onKeyDown(evt) {
    if (
      !evt.target
      || !this.domElement
      || !this.props.controller.state.fullscreen
      || evt.key !== CONSTANTS.KEY_VALUES.TAB
    ) {
      return;
    }
    // Focusable elements on the player (this.domElement) are expected to have the
    // data-focus-id attribute, this is a convention used throughout this project.
    const selector = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}]:enabled`;
    console.log('>>>>',selector,'<<<<<<');
    const focusableElements = this.domElement.querySelectorAll(selector);

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
   */
  handleTouchEndOnWindow() {
    if (this.props.controller.videoVr) { // only for vr on mobile
      this.setState({
        isVrMouseDown: false,
        isVrMouseMove: false,
        xVrMouseStart: 0,
        yVrMouseStart: 0,
      });

      // @TODO: now function this.props.controller.onEndMove(); is not worked correctly now. Fix it.
      // Related bug is https://jira.corp.ooyala.com/browse/PLAYER-4797
    }
  },

  /**
   * Handles touchEnd Event within the player screen.
   * Should play/pause the video
   * @public
   * @param {Object} event - event object
   */
  handleTouchEndOnPlayer(event) {
    if (this.props.controller.state.controlBarVisible) {
      let shouldToggle = false;
      if (!this.props.controller.videoVr || !this.state.isVrMouseMove) {
        shouldToggle = true;
      }
      if (shouldToggle) {
        this.props.controller.togglePlayPause(event);
      }
    }
  },

  /**
   * Ask for last direction and set it to vrViewingDirection.
   * @public
   * @param {boolean} useVrViewingDirection - true if function 'getVrViewingDirection' is needed to be used
   * from the plugin, false - if function 'getCurrentDirection' will be used
   */
  updateVrDirection(useVrViewingDirection) {
    if (
      typeof this.props.controller.checkVrDirection === 'function'
      && typeof this.props.controller.setControllerVrViewingDirection === 'function'
    ) {
      this.props.controller.checkVrDirection(useVrViewingDirection);
      this.props.controller.setControllerVrViewingDirection();
    }
  },

  render() {
    let screen;
    const isReceiver = this.props.controller.state.cast.isReceiver;

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
      if (this.props.controller.state.audioOnly) {
        switch (this.state.screenToShow) {
          case CONSTANTS.SCREEN.INITIAL_SCREEN:
          case CONSTANTS.SCREEN.START_SCREEN:
          case CONSTANTS.SCREEN.PLAYING_SCREEN:
          case CONSTANTS.SCREEN.PAUSE_SCREEN:
          case CONSTANTS.SCREEN.END_SCREEN:
            screen = (
              <AudioOnlyScreen
                {...this.props}
                contentTree={this.state.contentTree}
                currentPlayhead={this.state.currentPlayhead}
                duration={this.state.duration}
                totalTime={this.state.totalTime}
                playheadTime={this.getPlayheadTime()}
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
              />
            );
            break;
          default:
            break;
        }
      }
      if (!screen) {
        // switch screenToShow
        switch (this.state.screenToShow) {
          case CONSTANTS.SCREEN.INITIAL_SCREEN:
            screen = (
              <StartScreen
                {...this.props}
                componentWidth={this.state.componentWidth}
                contentTree={this.state.contentTree}
                isInitializing
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
                showSpinner
              />
            );
            break;
          case CONSTANTS.SCREEN.PLAYING_SCREEN:

            const PlayingScreenToRender = isReceiver ? PlayingScreen : PlayingScreenWithAutoHide;

            screen = (
              <PlayingScreenToRender
                {...this.props}
                handleTouchEndOnPlayer={this.handleTouchEndOnPlayer}
                handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
                handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
                handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
                handleVrPlayerClick={this.handleVrPlayerClick}
                handleVrPlayerFocus={this.handleVrPlayerFocus}
                handleTouchEndOnWindow={this.handleTouchEndOnWindow}
                isVrMouseMove={this.state.isVrMouseMove}
                contentTree={this.state.contentTree}
                currentPlayhead={this.state.currentPlayhead}
                duration={this.state.duration}
                totalTime={this.state.totalTime}
                playheadTime={this.getPlayheadTime()}
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
          case CONSTANTS.SCREEN.VOLUME_SCREEN:
            screen = (
              <ContentScreen {...this.props} screen={CONSTANTS.SCREEN.VOLUME_SCREEN} icon="volume">
                <VolumePanel
                  {...this.props}
                  playerState={this.state.playerState}
                  isLiveStream={this.state.isLiveStream}
                  a11yControls={this.props.controller.accessibilityControls}
                  currentPlayhead={this.state.currentPlayhead}
                  duration={this.state.duration}
                  totalTime={this.state.totalTime}
                  playheadTime={this.getPlayheadTime()}
                  buffered={this.state.buffered}
                  responsiveView={this.state.responsiveId}
                  componentWidth={this.state.componentWidth}
                />
              </ContentScreen>
            );
            break;
          case CONSTANTS.SCREEN.PAUSE_SCREEN:

            const PauseScreenToRender = isReceiver ? PauseScreen : PauseScreenWithAutoHide;

            screen = (
              <PauseScreenToRender
                {...this.props}
                handleTouchEndOnPlayer={this.handleTouchEndOnPlayer}
                handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
                handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
                handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
                handleVrPlayerClick={this.handleVrPlayerClick}
                handleTouchEndOnWindow={this.handleTouchEndOnWindow}
                isVrMouseMove={this.state.isVrMouseMove}
                contentTree={this.state.contentTree}
                currentPlayhead={this.state.currentPlayhead}
                playerState={this.state.playerState}
                duration={this.state.duration}
                totalTime={this.state.totalTime}
                playheadTime={this.getPlayheadTime()}
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
                totalTime={this.state.totalTime}
                playheadTime={this.getPlayheadTime()}
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
                  videosPerPage={{
                    xs: 2, sm: 4, md: 6, lg: 8,
                  }}
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
                  fullscreen={this.state.fullscreen}
                />
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
                icon="cc"
              >
                <ClosedCaptionPanel
                  {...this.props}
                  closedCaptionOptions={this.props.closedCaptionOptions}
                  dataItemsPerPage={{
                    xs: 1, sm: 4, md: 8, lg: 8,
                  }}
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
                autoFocus={this.state.videoQualityOptions.autoFocus}
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
          case CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN:
            screen = (
              <ContentScreen
                {...this.props}
                screenClassName="oo-menu-content-screen"
                screen={CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN}
                titleText={CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}
                autoFocus={this.state.playbackSpeedOptions.autoFocus}
              >
                <PlaybackSpeedPanel
                  language={this.props.language}
                  localizableStrings={this.props.localizableStrings}
                  controller={this.props.controller}
                  skinConfig={this.props.skinConfig}
                  fullscreen={this.state.fullscreen}
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
                dataItemsPerPage={{
                  xs: 1, sm: 4, md: 8, lg: 8,
                }}
                screen={CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN}
                screenClassName="oo-cc-ma-container"
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
    }

    const className = ClassNames(this.state.responsiveClass, 'oo-responsive', {
      'oo-audio-only': this.props.controller.state.audioOnly,
    });

    return (
      <div
        ref={this.storeRef}
        className={className}
      >
        {screen}
      </div>
    );
  },
});

Skin.defaultProps = {
  skinConfig: {
    general: {
      loadingImage: {
        imageResource: {
          url: null,
        },
      },
    },
    responsive: {
      breakpoints: {
        md: {
          multiplier: 1,
        },
      },
    },
    controlBar: {
      height: 90,
    },
  },
  controller: {
    state: {
      adVideoDuration: 0,
      errorCode: 404,
    },
    publishOverlayRenderingEvent() {},
  },
};

module.exports = Skin;
