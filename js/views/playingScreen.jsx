import React from 'react';
import ClassNames from 'classnames';
import Utils from '../components/utils';
import ControlBar from '../components/controlBar';
import AdOverlay from '../components/adOverlay';
import UpNextPanel from '../components/upNextPanel';
import Spinner from '../components/spinner';
import TextTrackPanel from '../components/textTrackPanel';
import Watermark from '../components/watermark';
import CONSTANTS from '../constants/constants';
import ViewControlsVr from '../components/viewControlsVr';
import Icon from '../components/icon';
import SkipControls from '../components/skipControls';
import UnmuteIcon from '../components/unmuteIcon';
import withAutoHide from './higher-order/withAutoHide';
import CastPanel from '../components/castPanel';

/**
 * Represents a screen when a video is playing
 */
class PlayingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.isMobile = props.controller.state.isMobile;
    this.skipControlsClientRect = null;
    this.hasCheckedMouseOverControls = false;
    this.mousePosition = { clientX: 0, clientY: 0 };

    this.state = {
      isVrNotificationHidden: false,
      isVrIconHidden: false,
    };
  }

  componentWillMount() {
    const { handleVrPlayerMouseUp } = this.props;
    handleVrPlayerMouseUp();
  }

  componentDidMount() {
    const { controller, handleTouchEndOnWindow } = this.props;
    if (controller.videoVr) {
      document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
      document.addEventListener('mouseup', this.handlePlayerMouseUp, false);
      document.addEventListener('touchmove', this.handlePlayerMouseMove, { passive: false });
      document.addEventListener('touchend', handleTouchEndOnWindow, { passive: false });
      this.handleVrAnimationEnd(this.vrNotificatioContainer, 'isVrNotificationHidden');
      this.handleVrAnimationEnd(this.vrIconContainer, 'isVrIconHidden');
    }
  }

  componentWillUnmount() {
    const { controller, handleTouchEndOnWindow } = this.props;
    if (controller.videoVr) {
      document.removeEventListener('mousemove', this.handlePlayerMouseMove);
      document.removeEventListener('touchmove', this.handlePlayerMouseMove);
      document.removeEventListener('mouseup', this.handlePlayerMouseUp);
      document.removeEventListener('touchend', handleTouchEndOnWindow);
    }
  }

  /**
   * @description need to show special information labels (or/and icons).
   * The labels should be animated.
   * Need to remove the labels (icons) after animation
   * Animation should be only one time
   * @param {string} ref - unique identificator of the label(icon)
   * @param {string} stateName - name for a state which indicates about necessary to show the label(icon)
   */
  handleVrAnimationEnd = (ref, stateName) => {
    if (!ref) {
      return;
    }
    const animationEndHandler = () => {
      if (stateName) {
        const newState = {};
        newState[stateName] = true;
        this.setState(newState);
      }
      ref.removeEventListener('animationend', animationEndHandler, false);
    };
    ref.addEventListener('animationend', animationEndHandler, false);
  }

  /**
   * The keydown event is not fired when the scrubber bar is first focused with
   * a tab unless playback was activated with a click. As a workaround, we make sure
   * that the controls are shown when a focusable element is focused.
   * @private
   * @param {object} event Focus event object.
   */
  handleFocus = (event) => {
    const {
      controller,
      showControlBar,
      startHideControlBarTimer,
    } = this.props;
    const isFocusableElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    // Only do this if the control bar hasn't been shown by now and limit to focus
    // events that are triggered on known focusable elements (control bar items and
    // skip buttons). Note that controlBarVisible controls both the control bar and
    // the skip buttons
    if (!controller.state.controlBarVisible && isFocusableElement) {
      if (typeof showControlBar === 'function') {
        showControlBar();
      }

      if (typeof startHideControlBarTimer === 'function') {
        startHideControlBarTimer();
      }
      controller.state.accessibilityControlsEnabled = true;
      controller.state.isClickedOutside = false;
    }
  }

  /**
   * call handlePlayerMouseDown when mouseDown was called on document and videoType is Vr
   * @param {Event} event - mouse down event object
   */
  handlePlayerMouseDown = (event) => {
    const { controller, handleVrPlayerMouseDown } = this.props;
    event.preventDefault();
    if (controller.videoVr) {
      event.persist();
    }
    handleVrPlayerMouseDown(event);
  }

  /**
   * call handlePlayerMouseMove when mouseMove was called on document and videoType is Vr
   * @param {Event} event - mouse move event object
   */
  handlePlayerMouseMove = (event) => {
    const { handleVrPlayerMouseMove } = this.props;
    this.storeMousePosition(event);
    handleVrPlayerMouseMove(event);
  }

  /**
   * it prevents propagetion, changes screens and sets states to support accessibility
   * @param {Event} event - event object
   */
  handlePlayerMouseUp = (event) => {
    const { controller, handleVrPlayerMouseUp } = this.props;
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      event.stopPropagation();
      if (!controller.videoVr) {
        controller.togglePlayPause(event); // if clicked on selectableSceen
      }
      // the order of the loop and controller.state is not important
      controller.state.accessibilityControlsEnabled = true;
      controller.state.isClickedOutside = false;
    }

    handleVrPlayerMouseUp(event);
  }

  /**
   * Handles the mouseover event.
   * @private
   * @param {Event} event The mouseover event object
   */
  handleMouseOver = (event) => {
    this.storeMousePosition(event);
  }

  /**
   * Handles the touchstart event. Note that this handler is for the main element.
   * There's a similar handler for an inner element that handles 360 video interactions.
   * @private
   */
  handleTouchStart = () => {
    // Disable "mouse over controls" check for all touch interactions
    this.hasCheckedMouseOverControls = true;
  }

  /**
   * Extracts and stores the clientX and clientY values from a mouse event. This
   * is used in order to keep track of the last known position. Triggers a check
   * that determines whether the mouse is over the skip controls.
   * @param {Event} event - event object
   */
  storeMousePosition = (event) => {
    if (!event) {
      return;
    }
    this.mousePosition.clientX = event.clientX;
    this.mousePosition.clientY = event.clientY;
    this.tryCheckMouseOverControls();
  }

  /**
   * Called by the SkipControls component when it's done mounting. It informs this
   * component about the position of the SkipControls so that it can determine
   * whether or not the mouse cursor is over the controls.
   * @private
   * @param {DOMRect} clientRect A DOMRect returned by an element's getBoundingClientRect() function
   */
  onSkipControlsMount = (clientRect) => {
    this.skipControlsClientRect = clientRect;
    this.tryCheckMouseOverControls();
  }

  /**
   * Checks to see whether or not the mouse is over the skip controls element and
   * prevents the controls from autohiding if that is the case.
   *
   * IMPORTANT:
   * There's a much simpler way to do this which is just listening to the
   * mouseenter event inside the SkipControls, however, the SkipControls have
   * pointer-events set to 'none' in order to allow clicking through it, so we
   * are unable to listen to any mouse events on said component. This workaround
   * is a bit convoluted but it's needed in order to get a decent user experience.
   * @private
   */
  tryCheckMouseOverControls = () => {
    if (
      this.hasCheckedMouseOverControls
      || !this.skipControlsClientRect
      || !(this.mousePosition.clientX && this.mousePosition.clientY)
    ) {
      return;
    }
    // Cancel auto-hide controls timer if mouse is over controls
    if (
      Utils.isMouseInsideRect(this.mousePosition, this.skipControlsClientRect)
    ) {
      const { cancelHideControlBarTimer } = this.props;
      if (typeof cancelHideControlBarTimer === 'function') {
        cancelHideControlBarTimer();
      }
    }
    this.hasCheckedMouseOverControls = true;
  }

  /**
   * call handlePlayerClicked when an user clicked on document
   * @param {Event} event - event object
   */
  handlePlayerClicked = (event) => {
    const { isVrMouseMove, controller, handleVrPlayerClick } = this.props;
    if (
      (!isVrMouseMove && !this.isMobile)
      || typeof controller.state.playerParam.onTogglePlayPause === 'function'
    ) {
      controller.togglePlayPause(event);
    }
    handleVrPlayerClick();
  };

  /**
   * call handlePlayerFocus when the player is in focus
   */
  handlePlayerFocus = () => {
    const { handleVrPlayerFocus } = this.props;
    handleVrPlayerFocus();
  }

  /**
   *
   * @param {number} vrDuration - key for duration in config
   * @param {number} userDefaultDuration - default value for duration
   * @returns {object} empty object or object with animationDuration
   */
  setAnimationDuration = (vrDuration, userDefaultDuration) => {
    const { controller } = this.props;
    let style = {};
    const functionDefaultfDuration = 3; // default value for Duration if userDefaultDuration is undefined
    const defaultDuration = Utils.ensureNumber(userDefaultDuration, functionDefaultfDuration);
    const { animationDurations } = controller.state.config;
    if (
      animationDurations !== null
      && typeof animationDurations === 'object'
      && typeof animationDurations[vrDuration] !== 'undefined'
    ) {
      const duration = `${Utils.ensureNumber(
        animationDurations[vrDuration],
        defaultDuration
      )}s`;
      style = {
        animationDuration: duration,
        webkitAnimationDuration: duration,
      };
    }
    return style;
  }

  render() {
    const {
      controller,
      currentPlayhead,
      skinConfig,
      contentTree,
      buffered,
      handleTouchEndOnPlayer,
      language,
      localizableStrings,
      responsiveView,
      closedCaptionOptions,
      playerState,
      isLiveStream,
    } = this.props;

    const { isVrNotificationHidden, isVrIconHidden } = this.state;

    const adOverlay = controller.state.adOverlayUrl
      && controller.state.showAdOverlay
      ? (
        <AdOverlay
          {...this.props}
          overlay={controller.state.adOverlayUrl}
          showOverlay={controller.state.showAdOverlay}
          showOverlayCloseButton={controller.state.showAdOverlayCloseButton}
        />
      ) : null;

    const upNextPanel = controller.state.upNextInfo.showing
      && controller.state.upNextInfo.upNextData
      ? (
        <UpNextPanel
          {...this.props}
          controlBarVisible={controller.state.controlBarVisible}
          currentPlayhead={currentPlayhead}
        />
      ) : null;

    const viewControlsVr = controller.videoVr ? (
      <ViewControlsVr {...this.props} controlBarVisible={controller.state.controlBarVisible} />
    ) : null;

    const showUnmute = controller.state.volumeState.mutingForAutoplay
      && controller.state.volumeState.muted;

    let vrNotification = null;
    if (
      controller.state.config.isVrAnimationEnabled !== null
      && typeof controller.state.config.isVrAnimationEnabled === 'object'
      && controller.state.config.isVrAnimationEnabled.vrNotification
      && controller.videoVr
      && !isVrNotificationHidden
      && controller.isNewVrVideo
    ) {
      // @Todo: When we know about the rules for vrIcon, change checking "if isNewVrVideo"
      const defaultDuration = 5;
      const style = this.setAnimationDuration('vrNotification', defaultDuration);
      vrNotification = (
        <div
          ref={(notification) => { this.vrNotificatioContainer = notification; }}
          className="oo-state-screen-vr-notification-container"
        >
          <p className="oo-state-screen-vr-notification" style={style}>
            {'Select and drag to look around'}
          </p>
        </div>
      );
    }

    let vrIcon = null;
    if (
      controller.state.config.isVrAnimationEnabled !== null
      && typeof controller.state.config.isVrAnimationEnabled === 'object'
      && controller.state.config.isVrAnimationEnabled.vrIcon
      && controller.videoVr
      && !isVrIconHidden
      && controller.isNewVrVideo
    ) {
      const defaultDuration = 3;
      const style = this.setAnimationDuration('vrIcon', defaultDuration);
      vrIcon = (
        <div
          ref={(icon) => { this.vrIconContainer = icon; }}
          className="oo-state-screen-vr-container"
          style={style}
        >
          <div className="oo-state-screen-vr-bg">
            <Icon {...this.props} icon="vrIcon" className="oo-state-screen-vr-icon" />
          </div>
        </div>
      );
    }

    const skipControlsEnabled = Utils.getPropertyValue(
      skinConfig,
      'skipControls.enabled',
      false
    );
    const isTextTrackInBackground = (
      controller.state.scrubberBar.isHovering
      || (skipControlsEnabled && controller.state.controlBarVisible)
    );
    const className = ClassNames('oo-state-screen oo-playing-screen', {
      'oo-controls-active': skipControlsEnabled && controller.state.controlBarVisible,
      'oo-hide-cursor': !controller.state.controlBarVisible
        && controller.state.fullscreen,
    });

    // Always show the poster image on cast session
    const posterImageUrl = skinConfig.startScreen.showPromo
      ? contentTree.promo_image
      : '';
    const posterStyle = {};
    if (Utils.isValidString(posterImageUrl)) {
      posterStyle.backgroundImage = `url('${posterImageUrl}')`;
    }

    const stateScreenPosterClass = ClassNames({
      'oo-blur': true,
      'oo-state-screen-poster': skinConfig.startScreen.promoImageSize !== 'small',
      'oo-state-screen-poster-small': skinConfig.startScreen.promoImageSize === 'small',
    });

    // Depends of there's another element/panel at the center of the player we will push down
    // the cast panel to allow both elements be visible to the user
    const castPanelClass = ClassNames({
      'oo-info-panel-cast-bottom': skipControlsEnabled,
    });

    // Add a blur only when the content it being casted on a chromecast device and a fading layer
    if (controller.state.cast.connected) {
      controller.addBlur();
    } else {
      controller.removeBlur();
    }

    const fadeUnderlayClass = ClassNames({
      'oo-fading-underlay': true,
      'oo-fading-underlay-active': controller.state.cast.connected,
      'oo-animate-fade': true,
    });

    const { buffering } = controller.state;
    const showSpinner = buffering || (buffered === 0 && !isLiveStream);

    const interactiveContainerClasses = ClassNames('oo-interactive-container');

    return (
      <div // eslint-disable-line
        className={className}
        onTouchStart={this.handleTouchStart}
        onMouseOver={this.handleMouseOver}
      >
        {controller.state.cast.connected
          && <div className={stateScreenPosterClass} style={posterStyle} />}

        {controller.state.cast.connected && <div className={fadeUnderlayClass} />}

        <div // eslint-disable-line
          className={CONSTANTS.CLASS_NAMES.SELECTABLE_SCREEN}
          onMouseDown={this.handlePlayerMouseDown}
          onTouchStart={this.handlePlayerMouseDown}
          onTouchEnd={handleTouchEndOnPlayer}
          onClick={this.handlePlayerClicked}
          onFocus={this.handlePlayerFocus}
        />

        {vrNotification}
        {vrIcon}

        <Watermark {...this.props} controlBarVisible={controller.state.controlBarVisible} />

        {
          controller.state.cast.connected
          && (
          <CastPanel
            language={language}
            localizableStrings={localizableStrings}
            device={controller.state.cast.device}
            className={castPanelClass}
          />
          )
        }

        {showSpinner && (
          <Spinner loadingImage={skinConfig.general.loadingImage.imageResource.url} />
        )}

        {viewControlsVr}

        {skipControlsEnabled
          && (
          <SkipControls
            className="oo-absolute-centered"
            config={controller.state.skipControls}
            language={language}
            localizableStrings={localizableStrings}
            responsiveView={responsiveView}
            skinConfig={skinConfig}
            controller={controller}
            currentPlayhead={currentPlayhead}
            a11yControls={controller.accessibilityControls}
            isInactive={!controller.state.controlBarVisible}
            isInBackground={controller.state.scrubberBar.isHovering}
            onMount={this.onSkipControlsMount}
            onFocus={this.handleFocus}
          />
          )
        }

        <div className={interactiveContainerClasses} onFocus={this.handleFocus}>
          {closedCaptionOptions.enabled && (
            <TextTrackPanel
              closedCaptionOptions={closedCaptionOptions}
              cueText={closedCaptionOptions.cueText}
              responsiveView={responsiveView}
              isInBackground={isTextTrackInBackground}
            />
          )}

          {adOverlay}

          {upNextPanel}

          <ControlBar
            {...this.props}
            height={skinConfig.controlBar.height}
            animatingControlBar
            controlBarVisible={controller.state.controlBarVisible}
            playerState={playerState}
            isLiveStream={isLiveStream}
          />
        </div>

        {showUnmute ? <UnmuteIcon {...this.props} /> : null}
      </div>
    );
  }
}

const PlayingScreenWithAutoHide = withAutoHide(PlayingScreen);

export { PlayingScreen, PlayingScreenWithAutoHide };
