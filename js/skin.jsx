
import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import debounce from 'lodash.debounce';

import { PlayingScreen, PlayingScreenWithAutoHide } from './views/playingScreen';
import { PauseScreen, PauseScreenWithAutoHide } from './views/pauseScreen';
import AdScreen from './views/adScreen';
import Utils from './components/utils';
import CONSTANTS from './constants/constants';
import Spinner from './components/spinner';
import OnOffSwitch from './components/closed-caption/onOffSwitch';
import ClosedCaptionPanel from './components/closed-caption/closedCaptionPanel';
import DiscoveryPanel from './components/discoveryPanel';
import VideoQualityPanel from './components/videoQualityPanel';
import PlaybackSpeedPanel from './components/playbackSpeedPanel';
import ClosedCaptionMultiAudioMenu from
  './components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu';
import SharePanel from './components/sharePanel';
import VolumePanel from './components/volumePanel';
import MoreOptionsPanel from './components/moreOptionsPanel';
import EndScreen from './views/endScreen';
import StartScreen from './views/startScreen';
import ErrorScreen from './views/errorScreen';
import ContentScreen from './views/contentScreen';
import AudioOnlyScreen from './views/audioOnlyScreen';

/**
 * The core React component
 */
class Skin extends React.Component {
  constructor(props) {
    super(props);
    this.overlayRenderingEventSent = false;
    this.state = {
      componentWidth: null,
      componentHeight: null,
      responsiveClass: null,
      responsiveId: null,
      totalTime: '00:00',
      screenToShow: null,
      currentPlayhead: 0,
      discoveryData: null,
      isVrMouseDown: false,
      isVrMouseMove: false,
      xVrMouseStart: 0,
      yVrMouseStart: 0,
    };
  }

  componentDidMount() {
    const debounceTimeout = 150;
    window.addEventListener('resize', debounce(this.onResize, debounceTimeout));
    window.addEventListener('webkitfullscreenchange', debounce(this.onResize, debounceTimeout));
    this.generateResponsiveData();
    window.addEventListener('mouseup', this.handleClickOutsidePlayer);
    document.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * Notify AMC the correct overlay rendering info
   */
  componentDidUpdate() {
    const { controller, skinConfig } = this.props;
    const { responsiveId, screenToShow } = this.state;
    if (!screenToShow || !this.overlayRenderingEventSent) {
      return;
    }
    const responsiveUIMultiple = skinConfig.responsive.breakpoints[responsiveId]
      .multiplier;
    const marginHeight = responsiveUIMultiple * skinConfig.controlBar.height;
    controller.publishOverlayRenderingEvent(marginHeight);
    this.overlayRenderingEventSent = true;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('webkitfullscreenchange', this.onResize);
    window.removeEventListener('mouseup', this.handleClickOutsidePlayer);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onResize = () => {
    this.generateResponsiveData();
  }

  /**
   * It gives the value of height, based on the width of mainVideoContainer (in a ratio 16:9);
   * @param {number} componentWidth - width of the element
   * @returns {number} - default height of the element
   * If we do not have width of mainVideoContainer it returns 0
   */
  getDefaultElementHeight = (componentWidth) => {
    const ratioCoef = 0.5625; // y - coefficient for default aspect ratio 16:9
    let componentHeight = 0;
    if (componentWidth && Utils.ensureNumber(componentWidth)) {
      componentHeight = componentWidth * ratioCoef;
    }
    return componentHeight;
  }

  generateResponsiveData = () => {
    let componentWidth = 0;
    let componentHeight = 0;
    const dom = ReactDOM.findDOMNode(this); // eslint-disable-line
    const { controller, skinConfig } = this.props;
    if (dom) {
      componentWidth = Math.ceil(dom.getBoundingClientRect().width);
      componentHeight = dom.parentNode ? dom.parentNode.getBoundingClientRect().height : componentHeight;
      if (!componentHeight) {
        let width = componentWidth;
        // If width === 0, we can use width of mainVideoContainer
        if (!width && !!controller.state.mainVideoContainer) {
          width = controller.state.mainVideoContainer.width();
        }
        // Height must exist, if height is 0 or do not exist, we should use default value for height
        componentHeight = this.getDefaultElementHeight(width);
      }
    }
    const { breakpoints } = skinConfig.responsive;
    const breakpointData = {
      classes: {},
      ids: {},
    };

    if (controller.state.audioOnly) {
      breakpointData.classes[breakpoints['audio-only-xs'].name] = true;
      breakpointData.ids[breakpoints['audio-only-xs'].id] = true;
    } else {
      // loop through breakpoints from skinConfig
      // generate Classname object with name and min/max width
      Object.keys(breakpoints).forEach((key) => {
        // min width only, 1st breakpoint
        if (breakpoints[key].minWidth && !breakpoints[key].maxWidth) {
          breakpointData.classes[breakpoints[key].name] = componentWidth >= breakpoints[key].minWidth;
          breakpointData.ids[breakpoints[key].id] = componentWidth >= breakpoints[key].minWidth;
        // min and max, middle breakpoints
        } else if (breakpoints[key].minWidth && breakpoints[key].maxWidth) {
          const result = componentWidth >= breakpoints[key].minWidth
            && componentWidth <= breakpoints[key].maxWidth;
          breakpointData.classes[breakpoints[key].name] = result;
          breakpointData.ids[breakpoints[key].id] = result;
        // max width only, last breakpoint
        } else if (breakpoints[key].maxWidth && !breakpoints[key].minWidth) {
          breakpointData.classes[breakpoints[key].name] = componentWidth <= breakpoints[key].maxWidth;
          breakpointData.ids[breakpoints[key].id] = componentWidth <= breakpoints[key].maxWidth;
        }
      });
    }

    // set responsive data to state
    this.setState({
      componentWidth,
      componentHeight,
      responsiveClass: ClassNames(breakpointData.classes),
      responsiveId: ClassNames(breakpointData.ids),
    });
  }


  handleClickOutsidePlayer = () => {
    const { controller } = this.props;
    controller.state.accessibilityControlsEnabled = false;
    controller.state.isClickedOutside = true;
  }

  /**
   * Proceed the component switch
   * @param {Object} args - the arguments
   */
  switchComponent = (args) => {
    const newState = args || {};
    this.setState(newState);
  }

  /**
   * Update the playhead
   * @param {number} newPlayhead - a new position of the playhead
   * @param {number} newDuration - a new position of the duration
   * @param {number} newBuffered - a new value of buffered size
   * @param {number} adPlayhead - a new value of the playhead of an ad
   * @returns {Promise<Object>} the promise that resolves with new state
   */
  updatePlayhead = (newPlayhead, newDuration, newBuffered, adPlayhead) => new Promise((resolve) => {
    this.setState((prevState) => {
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

  /**
   * Gets the total time of the video in (HH:)MM:SS format
   * @private
   * @param {number} duration - time to format HH:mm
   * @returns {string} The total time of the video in (HH:)MM:SS format
   */
  getTotalTime = (duration) => {
    const ensureNumberDuration = Utils.ensureNumber(duration) ? Utils.ensureNumber(duration) : 0;
    const totalTime = Utils.formatSeconds(ensureNumberDuration);
    return totalTime;
  }

  /**
   * Gets the current playhead time of the video in (HH:)MM:SS format. If the stream is live,
   * will return the time shift instead.
   * @private
   * @returns {string} The current playhead time in (HH:)MM:SS format or null if the current playhead is invalid or timeshift is 0
   */
  getPlayheadTime = () => {
    const { currentPlayhead, duration, isLiveStream } = this.state;
    if (!Number.isFinite(parseInt(currentPlayhead, 0)) || !Number.isFinite(parseInt(duration, 0))) {
      return '--:--';
    }

    let playheadTime = Utils.formatSeconds(parseInt(currentPlayhead, 0));
    if (isLiveStream) {
      // checking timeShift < 1 seconds (not === 0) as processing of the click after we rewinded and then went live may take some time
      const timeShift = currentPlayhead - duration;
      const isLiveNow = Math.abs(timeShift) < 1;
      playheadTime = isLiveNow ? null : Utils.formatSeconds(timeShift);
    }
    return playheadTime;
  }

  /**
   * Handles mouseDown or touchStart events
   * Used for vr video
   * Checks and sets the current value of coordinates, which could be changed when the user used tilting
   * Sets coordinate values for further calculation of rotation coordinates
   * @public
   * @param {MouseEvent} event - event
   */
  handleVrPlayerMouseDown = (event) => {
    // continue only if video is vr and non in stereo mode
    const { controller } = this.props;
    if (!controller || controller.isVrStereo || !controller.videoVr) {
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
  }

  /**
   * Should be called when an user rotates a vr video
   * Sets the desired coordinate values during vr video rotation
   * Sets the state "isVrMouseMove" to true, indicating that the video is currently rotating.
   * @public
   * @param {MouseEvent} event - event
   */
  handleVrPlayerMouseMove = (event) => {
    const { controller } = this.props;
    const { isVrMouseDown } = this.state;
    if (controller && controller.isVrStereo) {
      return;
    }
    if (controller && controller.videoVr && isVrMouseDown) {
      event.preventDefault();
      this.setState({
        isVrMouseMove: true,
      });
      if (typeof controller.onTouchMove === 'function') {
        const coords = Utils.getCoords(event);
        const params = this.getDirectionParams(coords.x, coords.y);
        controller.onTouchMove(params, true);
      }
    }
  }

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
  handleVrPlayerMouseUp = (event) => {
    // continue only if video is vr and non in stereo mode
    const { controller } = this.props;
    if (!controller || !controller.videoVr || controller.isVrStereo) {
      return;
    }

    const isTouchEnd = typeof event === 'object' && event.type === 'touchend';
    // do not continue if the event is 'touchend'
    if (!isTouchEnd && typeof controller.checkVrDirection === 'function') {
      this.setState({
        isVrMouseDown: false,
        xVrMouseStart: 0,
        yVrMouseStart: 0,
      });
    }
  }

  /**
   * @public
   * @description set isVrMouseMove to false for click event
   */
  handleVrPlayerClick = () => {
    this.setState({
      isVrMouseMove: false,
    });
  }

  /**
   * @public
   * @description set accessibilityControlsEnabled to true for focus event
   */
  handleVrPlayerFocus = () => {
    const { controller } = this.props;
    controller.state.accessibilityControlsEnabled = true;
  }

  /**
   * @description get direction params.
   * Direction params are values for new position of a vr video (yaw, roll=0, pitch)
   * @private
   * @param {number} _pageX - x coordinate
   * @param {number} _pageY - y coordinate
   * @returns {[number, number, number]} array with yaw, roll, pitch
   */
  getDirectionParams = (_pageX, _pageY) => {
    let yaw = this.getVrViewingDirectionParamValue('yaw');
    let pitch = this.getVrViewingDirectionParamValue('pitch');
    const {
      componentWidth,
      componentHeight,
      xVrMouseStart,
      yVrMouseStart,
    } = this.state;
    if (componentWidth && componentHeight) {
      const pageX = Utils.ensureNumber(_pageX, 0);
      const pageY = Utils.ensureNumber(_pageY, 0);
      const dx = pageX - xVrMouseStart;
      const dy = pageY - yVrMouseStart;
      const maxDegreesX = 90;
      const maxDegreesY = 120;
      const degreesForPixelYaw = maxDegreesX / componentWidth;
      const degreesForPixelPitch = maxDegreesY / componentHeight;
      yaw += dx * degreesForPixelYaw;
      pitch += dy * degreesForPixelPitch;
    }
    return [yaw, 0, pitch];
  }

  /**
   * @description check vrViewingDirection existing and return the value
   * @private
   * @param {string} paramName - one of "yaw" or "pitch"
   * @returns {number} value of vrViewingDirection param
   */
  getVrViewingDirectionParamValue = (paramName) => {
    let vrViewingDirectionValue = 0;
    const { controller } = this.props;
    if (
      controller
      && controller.state
      && controller.state.vrViewingDirection
      && typeof controller.state.vrViewingDirection[paramName] === 'number'
    ) {
      vrViewingDirectionValue = controller.state.vrViewingDirection[paramName];
    }
    return vrViewingDirectionValue;
  }

  /**
   * Will handle the keydown event when the player is active and it will restrict
   * tab navigation to elements that are within it when it is in fullscreen mode.
   * Note that this only handles the edge cases that are needed in order to loop the tab
   * focus. Tabbing in between the elements is handled by the browser.
   * @private
   * @param {Event} event Keydown event object.
   */
  onKeyDown = (event) => {
    const { controller } = this.props;
    if (
      !event.target
      || !this.domElement
      || !controller.state.fullscreen
      || event.key !== CONSTANTS.KEY_VALUES.TAB
    ) {
      return;
    }
    // Focusable elements on the player (this.domElement) are expected to have the
    // data-focus-id attribute, this is a convention used throughout this project.
    const selector = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}]:enabled`;
    const focusableElements = this.domElement.querySelectorAll(selector);

    if (focusableElements.length) {
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      // This indicates we're tabbing over the focusable player elements
      if (event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)) {
        event.preventDefault();
        if (event.shiftKey) {
          // Shift + tabbing on first element, focus on last
          if (event.target === firstFocusableElement) {
            lastFocusableElement.focus();
          }
        } else if (event.target === lastFocusableElement) {
          // Tabbing on last element, focus on first
          firstFocusableElement.focus();
        }
        // Keydown happened on a non-player element
      } else if (event.shiftKey) {
        lastFocusableElement.focus();
      } else {
        firstFocusableElement.focus();
      }
    } else {
      OO.log('Skin: No focusable elements found');
    }
  }

  /**
   * This function toggles the current screen (pause/play) and
   * sets current direction for vr video (it is necessary for tilting)
   * when touchend is called on selected screen
   * @public
   */
  handleTouchEndOnWindow = () => {
    const { controller } = this.props;
    if (controller.videoVr) { // only for vr on mobile
      this.setState({
        isVrMouseDown: false,
        isVrMouseMove: false,
        xVrMouseStart: 0,
        yVrMouseStart: 0,
      });

      // @TODO: now function this.props.controller.onEndMove(); is not worked correctly now. Fix it.
      // Related bug is https://jira.corp.ooyala.com/browse/PLAYER-4797
    }
  }

  /**
   * Handles touchEnd Event within the player screen.
   * Should play/pause the video
   * @public
   * @param {Object} event - event object
   */
  handleTouchEndOnPlayer = (event) => {
    const { controller } = this.props;
    const { isVrMouseMove } = this.state;
    if (controller.state.controlBarVisible) {
      let shouldToggle = false;
      if (!controller.videoVr || !isVrMouseMove) {
        shouldToggle = true;
      }
      if (shouldToggle) {
        controller.togglePlayPause(event);
      }
    }
  }

  /**
   * Ask for last direction and set it to vrViewingDirection.
   * @public
   * @param {boolean} useVrViewingDirection - true if function 'getVrViewingDirection' is needed to be used
   * from the plugin, false - if function 'getCurrentDirection' will be used
   */
  updateVrDirection = (useVrViewingDirection) => {
    const { controller } = this.props;
    if (
      typeof controller.checkVrDirection === 'function'
      && typeof controller.setControllerVrViewingDirection === 'function'
    ) {
      controller.checkVrDirection(useVrViewingDirection);
      controller.setControllerVrViewingDirection();
    }
  }

  render() {
    let screen;
    const {
      closedCaptionOptions,
      controller,
      language,
      localizableStrings,
      skinConfig,
    } = this.props;
    const { isReceiver } = controller.state.cast;
    const {
      adStartTime,
      assetId,
      screenToShow,
      buffered,
      contentTree,
      componentWidth,
      componentHeight,
      currentPlayhead,
      currentAdsInfo,
      currentAdPlayhead,
      discoveryData,
      duration,
      forceCountDownTimerOnEndScreen,
      isLiveStream,
      isVrMouseMove,
      fullscreen,
      multiAudioOptions,
      moreOptionsOptions,
      pauseAnimationDisabled,
      playbackSpeedOptions,
      playerParam,
      playerState,
      responsiveClass,
      seeking,
      responsiveId,
      totalTime,
      upNextInfo,
      videoQualityOptions,
    } = this.state;

    // For IE10, use the start screen and that's it.
    if (Utils.isIE10()) {
      if (screenToShow === CONSTANTS.SCREEN.START_SCREEN) {
        screen = (
          <StartScreen
            {...this.props}
            componentWidth={componentWidth}
            contentTree={contentTree}
          />
        );
      } else {
        screen = <div />;
      }
    } else {
      if (controller.state.audioOnly) {
        switch (screenToShow) {
          case CONSTANTS.SCREEN.INITIAL_SCREEN:
          case CONSTANTS.SCREEN.START_SCREEN:
          case CONSTANTS.SCREEN.PLAYING_SCREEN:
          case CONSTANTS.SCREEN.PAUSE_SCREEN:
          case CONSTANTS.SCREEN.END_SCREEN:
            screen = (
              <AudioOnlyScreen
                {...this.props}
                contentTree={contentTree}
                currentPlayhead={currentPlayhead}
                duration={duration}
                totalTime={totalTime}
                playheadTime={this.getPlayheadTime()}
                buffered={buffered}
                fullscreen={fullscreen}
                playerState={playerState}
                seeking={seeking}
                upNextInfo={upNextInfo}
                isLiveStream={isLiveStream}
                responsiveView={responsiveId}
                componentWidth={componentWidth}
                componentHeight={componentHeight}
                videoQualityOptions={videoQualityOptions}
                closedCaptionOptions={closedCaptionOptions}
                captionDirection={controller.captionDirection}
              />
            );
            break;
          default:
            break;
        }
      }
      if (!screen) {
        const PlayingScreenToRender = isReceiver ? PlayingScreen : PlayingScreenWithAutoHide;
        const PauseScreenToRender = isReceiver ? PauseScreen : PauseScreenWithAutoHide;
        switch (screenToShow) {
          case CONSTANTS.SCREEN.INITIAL_SCREEN:
            screen = (
              <StartScreen
                {...this.props}
                componentWidth={componentWidth}
                contentTree={contentTree}
                isInitializing
              />
            );
            break;
          case CONSTANTS.SCREEN.LOADING_SCREEN:
            screen = <Spinner loadingImage={skinConfig.general.loadingImage.imageResource.url} />;
            break;
          case CONSTANTS.SCREEN.START_SCREEN:
            screen = (
              <StartScreen
                {...this.props}
                componentWidth={componentWidth}
                contentTree={contentTree}
                isInitializing={false}
              />
            );
            break;
          case CONSTANTS.SCREEN.START_LOADING_SCREEN:
            screen = (
              <StartScreen
                {...this.props}
                componentWidth={componentWidth}
                contentTree={contentTree}
                isInitializing={false}
                showSpinner
              />
            );
            break;
          case CONSTANTS.SCREEN.PLAYING_SCREEN:
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
                isVrMouseMove={isVrMouseMove}
                contentTree={contentTree}
                currentPlayhead={currentPlayhead}
                duration={duration}
                totalTime={totalTime}
                playheadTime={this.getPlayheadTime()}
                buffered={buffered}
                fullscreen={fullscreen}
                playerState={playerState}
                seeking={seeking}
                upNextInfo={upNextInfo}
                isLiveStream={isLiveStream}
                responsiveView={responsiveId}
                componentWidth={componentWidth}
                componentHeight={componentHeight}
                videoQualityOptions={videoQualityOptions}
                closedCaptionOptions={closedCaptionOptions}
                captionDirection={controller.captionDirection}
                ref="playScreen" // eslint-disable-line
              />
            );
            break;
          case CONSTANTS.SCREEN.SHARE_SCREEN:
            screen = (
              <ContentScreen {...this.props} screen={CONSTANTS.SCREEN.SHARE_SCREEN} icon="share">
                <SharePanel
                  {...this.props}
                  assetId={assetId}
                  playerParam={playerParam}
                  contentTree={contentTree}
                />
              </ContentScreen>
            );
            break;
          case CONSTANTS.SCREEN.VOLUME_SCREEN:
            screen = (
              <ContentScreen {...this.props} screen={CONSTANTS.SCREEN.VOLUME_SCREEN} icon="volume">
                <VolumePanel
                  {...this.props}
                  playerState={playerState}
                  isLiveStream={isLiveStream}
                  a11yControls={controller.accessibilityControls}
                  currentPlayhead={currentPlayhead}
                  duration={duration}
                  totalTime={totalTime}
                  playheadTime={this.getPlayheadTime()}
                  buffered={buffered}
                  responsiveView={responsiveId}
                  componentWidth={componentWidth}
                />
              </ContentScreen>
            );
            break;
          case CONSTANTS.SCREEN.PAUSE_SCREEN:
            screen = (
              <PauseScreenToRender
                {...this.props}
                handleTouchEndOnPlayer={this.handleTouchEndOnPlayer}
                handleVrPlayerMouseDown={this.handleVrPlayerMouseDown}
                handleVrPlayerMouseMove={this.handleVrPlayerMouseMove}
                handleVrPlayerMouseUp={this.handleVrPlayerMouseUp}
                handleVrPlayerClick={this.handleVrPlayerClick}
                handleTouchEndOnWindow={this.handleTouchEndOnWindow}
                isVrMouseMove={isVrMouseMove}
                contentTree={contentTree}
                currentPlayhead={currentPlayhead}
                playerState={playerState}
                duration={duration}
                totalTime={totalTime}
                playheadTime={this.getPlayheadTime()}
                buffered={buffered}
                pauseAnimationDisabled={pauseAnimationDisabled}
                fullscreen={fullscreen}
                seeking={seeking}
                upNextInfo={upNextInfo}
                isLiveStream={isLiveStream}
                responsiveView={responsiveId}
                componentWidth={componentWidth}
                videoQualityOptions={videoQualityOptions}
                captionDirection={controller.captionDirection}
                ref="pauseScreen" // eslint-disable-line
              />
            );
            break;
          case CONSTANTS.SCREEN.END_SCREEN:
            screen = (
              <EndScreen
                {...this.props}
                contentTree={contentTree}
                discoveryData={discoveryData}
                currentPlayhead={currentPlayhead}
                duration={duration}
                totalTime={totalTime}
                playheadTime={this.getPlayheadTime()}
                buffered={buffered}
                fullscreen={fullscreen}
                playerState={playerState}
                seeking={seeking}
                isLiveStream={isLiveStream}
                responsiveView={responsiveId}
                videoQualityOptions={videoQualityOptions}
                componentWidth={componentWidth}
                ref="endScreen" // eslint-disable-line
              />
            );
            break;
          case CONSTANTS.SCREEN.AD_SCREEN:
            screen = (
              <AdScreen
                {...this.props}
                contentTree={contentTree}
                currentAdsInfo={currentAdsInfo}
                currentPlayhead={currentPlayhead}
                currentAdPlayhead={currentAdPlayhead}
                fullscreen={fullscreen}
                playerState={playerState}
                duration={duration}
                adVideoDuration={controller.state.adVideoDuration}
                buffered={buffered}
                seeking={seeking}
                responsiveView={responsiveId}
                componentWidth={componentWidth}
                videoQualityOptions={videoQualityOptions}
                adStartTime={adStartTime}
                ref="adScreen" // eslint-disable-line
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
                  forceCountDownTimer={forceCountDownTimerOnEndScreen}
                  discoveryData={discoveryData}
                  playerState={playerState}
                  responsiveView={responsiveId}
                  componentWidth={componentWidth}
                />
              </ContentScreen>
            );
            break;
          case CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN:
            screen = (
              <ContentScreen
                {...this.props}
                screen={CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN}
                autoFocus={moreOptionsOptions.autoFocus}
              >
                <MoreOptionsPanel
                  {...this.props}
                  responsiveView={responsiveId}
                  fullscreen={fullscreen}
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
                autoFocus={closedCaptionOptions.autoFocus}
                closedCaptionOptions={closedCaptionOptions}
                element={
                  <OnOffSwitch {...this.props} ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS} />
                }
                icon="cc"
              >
                <ClosedCaptionPanel
                  {...this.props}
                  closedCaptionOptions={closedCaptionOptions}
                  dataItemsPerPage={{
                    xs: 1, sm: 4, md: 8, lg: 8,
                  }}
                  responsiveView={responsiveId}
                  componentWidth={componentWidth}
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
                autoFocus={videoQualityOptions.autoFocus}
              >
                <VideoQualityPanel
                  {...this.props}
                  fullscreen={fullscreen}
                  videoQualityOptions={videoQualityOptions}
                  responsiveView={responsiveId}
                />
              </ContentScreen>
            );
            break;
          case CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN:
            console.log(
              'BBB CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN playbackSpeedOptions.autoFocus',
              playbackSpeedOptions.autoFocus
            );
            screen = (
              <ContentScreen
                {...this.props}
                screenClassName="oo-menu-content-screen"
                screen={CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN}
                titleText={CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}
                autoFocus={playbackSpeedOptions.autoFocus}
              >
                <PlaybackSpeedPanel
                  language={language}
                  localizableStrings={localizableStrings}
                  controller={controller}
                  skinConfig={skinConfig}
                  fullscreen={fullscreen}
                  responsiveView={responsiveId}
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
                autoFocus={multiAudioOptions.autoFocus}
                icon="cc"
              >
                <ClosedCaptionMultiAudioMenu {...this.props} />
              </ContentScreen>
            );
            break;
          case CONSTANTS.SCREEN.ERROR_SCREEN:
            screen = <ErrorScreen {...this.props} errorCode={controller.state.errorCode} />;
            break;
          default:
            screen = <div />;
        }
      }
    }

    const className = ClassNames(responsiveClass, 'oo-responsive', {
      'oo-audio-only': controller.state.audioOnly,
    });

    return (
      <div
        ref={(domElement) => { this.domElement = domElement; }}
        className={className}
      >
        {screen}
      </div>
    );
  }
}

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
