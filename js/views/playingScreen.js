/** ******************************************************************
  PLAYING SCREEN
*********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    Utils = require('../components/utils'),
    ControlBar = require('../components/controlBar'),
    AdOverlay = require('../components/adOverlay'),
    ClassNames = require('classnames'),
    UpNextPanel = require('../components/upNextPanel'),
    Spinner = require('../components/spinner'),
    TextTrackPanel = require('../components/textTrackPanel'),
    Watermark = require('../components/watermark'),
    ResizeMixin = require('../mixins/resizeMixin'),
    CONSTANTS = require('../constants/constants'),
    ViewControlsVr = require('../components/viewControlsVr'),
    Icon = require('../components/icon'),
    Tooltip = require('../components/tooltip'),
    SkipControls = require('../components/skipControls'),
    UnmuteIcon = require('../components/unmuteIcon');
const withAutoHide = require('./higher-order/withAutoHide.js');

class PlayingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.isMobile = this.props.controller.state.isMobile;
    this.browserSupportsTouch = this.props.controller.state.browserSupportsTouch;
    this.skipControlsClientRect = null;
    this.hasCheckedMouseOverControls = false;
    this.mousePosition = { clientX: 0, clientY: 0 };

    this.state = {
      isVrNotificationHidden: false,
      isVrIconHidden: false,
      timer: null
    };

    this.handlePlayerMouseMove = this.handlePlayerMouseMove.bind(this);
    this.handleVrMouseUp = this.handleVrMouseUp.bind(this);
    this.handleVrTouchEnd = this.handleVrTouchEnd.bind(this);
    this.onSkipControlsMount = this.onSkipControlsMount.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handlePlayerClicked = this.handlePlayerClicked.bind(this);
    this.handlePlayerFocus = this.handlePlayerFocus.bind(this);
    this.handlePlayerMouseDown = this.handlePlayerMouseDown.bind(this);
    this.handlePlayerMouseUp = this.handlePlayerMouseUp.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  componentWillMount() {
    this.props.handleVrPlayerMouseUp();
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
    document.addEventListener('touchmove', this.handlePlayerMouseMove, false);
    document.addEventListener('mouseup', this.handleVrMouseUp, false);
    document.addEventListener('touchend', this.handleVrTouchEnd, false);

    if (this.props.controller.videoVr) {
      this.handleVrAnimationEnd('vrNotificatioContainer', 'isVrNotificationHidden');
      this.handleVrAnimationEnd('vrIconContainer', 'isVrIconHidden');
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handlePlayerMouseMove);
    document.removeEventListener('touchmove', this.handlePlayerMouseMove);
    document.removeEventListener('mouseup', this.handleVrMouseUp);
    document.removeEventListener('touchend', this.handleVrTouchEnd);
  }

  /**
   * The keydown event is not fired when the scrubber bar is first focused with
   * a tab unless playback was activated with a click. As a workaround, we make sure
   * that the controls are shown when a focusable element is focused.
   * @private
   * @param {object} event Focus event object.
   */
  handleFocus(event) {
    var isFocusableElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    // Only do this if the control bar hasn't been shown by now and limit to focus
    // events that are triggered on known focusable elements (control bar items and
    // skip buttons). Note that controlBarVisible controls both the control bar and
    // the skip buttons
    if (!this.props.controller.state.controlBarVisible && isFocusableElement) {
      if (typeof this.props.showControlBar === 'function') {
        this.props.showControlBar();
      }

      if (typeof this.props.startHideControlBarTimer === 'function') {
        this.props.startHideControlBarTimer();
      }
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
  }

  /**
   * @description need to show special information labels (or/and icons).
   * The labels should be animated.
   * Need to remove the labels (icons) after animation
   * Animation should be only one time
   * @param {string} id - unique identificator of the label(icon)
   * @param {string} stateName - name for a state which indicates about necessary to show the label(icon)
   */
  handleVrAnimationEnd(id, stateName) {
    var vrContainer = document.getElementById(id);
    if (vrContainer) {
      var listener = function() {
        var newState = {};
        newState[stateName] = true;
        this.setState(newState);
      };
      vrContainer.addEventListener('animationend', listener.bind(this), false);
    }
  }

  handleMouseOver(event) {
    this.storeMousePosition(event);
  }

  /**
   * call handleTouchEnd when touchend was called on selectedScreen
   * @param {Event} event - event object
   */
  handleTouchEnd(event) {
    event.preventDefault(); // to prevent mobile from propagating click to discovery shown on pause
    if (this.props.controller.state.controlBarVisible) {
      var shouldToggle = false;
      if (this.props.controller.videoVr) {
        if (!this.props.isVrMouseMove) {
          shouldToggle = true;
        }
      } else {
        shouldToggle = true;
      }
      if (shouldToggle) {
        this.props.controller.togglePlayPause(event);
      }
    }
  }

  /**
   * call handleVrTouchEnd when touchend was called on document and videoType is Vr
   * @param {Event} e - event object
   */
  handleVrTouchEnd(e) {
    this.props.handleVrPlayerMouseUp(e);
  }

  handlePlayerMouseDown(e) {
    if (this.props.controller.videoVr) {
      e.persist();
    }
    this.props.handleVrPlayerMouseDown(e);
  }

  handlePlayerMouseMove(e) {
    this.storeMousePosition(e);
    this.props.handleVrPlayerMouseMove(e);
  }

  /**
   * call handleVrMouseUp when mouseup was called on selectedScreen
   * @param {Event} e - event object
   */
  handlePlayerMouseUp(e) {
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE
      if (!this.props.controller.videoVr) {
        this.props.controller.togglePlayPause(); // if clicked on selectableSceen
      }
      // the order of the loop and this.props.controller.state is not important
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
    // for mobile, touch is handled in handleTouchEnd
  }

  /**
   * Handles the touchstart event. Note that this handler is for the main element.
   * There's a similar handler for an inner element that handles 360 video interactions.
   * @private
   * @param {Event} event The touchstart event object
   */
  handleTouchStart(event) {
    // Disable "mouse over controls" check for all touch interactions
    this.hasCheckedMouseOverControls = true;
  }

  /**
   * Extracts and stores the clientX and clientY values from a mouse event. This
   * is used in order to keep track of the last known position. Triggers a check
   * that determines whether the mouse is over the skip controls.
   * @param {Event} event
   */
  storeMousePosition(event) {
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
  onSkipControlsMount(clientRect) {
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
  tryCheckMouseOverControls() {
    if (
      this.hasCheckedMouseOverControls ||
      !this.skipControlsClientRect ||
      !(this.mousePosition.clientX && this.mousePosition.clientY)
    ) {
      return;
    }
    // Cancel auto-hide controls timer if mouse is over controls
    if (
      Utils.isMouseInsideRect(this.mousePosition, this.skipControlsClientRect)
    ) {
      if (typeof this.props.cancelHideControlBarTimer === 'function') {
        this.props.cancelHideControlBarTimer();
      }
    }
    this.hasCheckedMouseOverControls = true;
  }

  /**
   * call handleVrMouseUp when mouseup was called on document
   * @param {Event} e - event object
   */
  handleVrMouseUp(e) {
    this.props.handleVrPlayerMouseUp(e);
  }

  handlePlayerClicked(event) {
    if (!this.props.isVrMouseMove && !this.isMobile) {
      this.props.controller.togglePlayPause(event);
    }
    this.props.handleVrPlayerClick();
  }

  handlePlayerFocus() {
    this.props.handleVrPlayerFocus();
  }

  unmuteClick(event) {
    this.props.controller.handleMuteClick();
  }

  /**
   *
   * @param {number} vrDuration - key for duraction in config
   * @param {number} defaultDuration - default value for duration
   * @returns {object} empty object or object with animationDuration
   */
  setAnimationDuration(vrDuration, defaultDuration) {
    var style = {};
    defaultDuration = Utils.ensureNumber(defaultDuration, 3);
    if (
      this.props.controller.state.config.animationDurations !== null &&
      typeof this.props.controller.state.config.animationDurations === 'object' &&
      this.props.controller.state.config.animationDurations[vrDuration] !== undefined
    ) {
      var duration =
        Utils.ensureNumber(
          this.props.controller.state.config.animationDurations[vrDuration],
          defaultDuration
        ) + 's';
      style = {
        animationDuration: duration,
        webkitAnimationDuration: duration
      };
    }
    return style;
  }

  render() {
    var adOverlay =
      this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay ? (
        <AdOverlay
          {...this.props}
          overlay={this.props.controller.state.adOverlayUrl}
          showOverlay={this.props.controller.state.showAdOverlay}
          showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}
        />
      ) : null;

    var upNextPanel =
      this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData ? (
        <UpNextPanel
          {...this.props}
          controlBarVisible={this.props.controller.state.controlBarVisible}
          currentPlayhead={this.props.currentPlayhead}
        />
      ) : null;

    var viewControlsVr = this.props.controller.videoVr ? (
      <ViewControlsVr {...this.props} controlBarVisible={this.props.controller.state.controlBarVisible} />
    ) : null;

    var showUnmute =
      this.props.controller.state.volumeState.mutingForAutoplay &&
      this.props.controller.state.volumeState.muted;

    var vrNotification = null;
    if (
      this.props.controller.state.config.isVrAnimationEnabled !== null &&
      typeof this.props.controller.state.config.isVrAnimationEnabled === 'object' &&
      this.props.controller.state.config.isVrAnimationEnabled.vrNotification &&
      this.props.controller.videoVr &&
      !this.state.isVrNotificationHidden &&
      this.props.controller.isNewVrVideo
    ) {
      // @Todo: When we know about the rules for vrIcon, change checking "if isNewVrVideo"
      var defaultDuration = 5;
      var style = this.setAnimationDuration('vrNotification', defaultDuration);
      vrNotification = (
        <div id="vrNotificatioContainer" className="oo-state-screen-vr-notification-container">
          <p className="oo-state-screen-vr-notification" style={style}>
            {'Select and drag to look around'}
          </p>
        </div>
      );
    }

    var vrIcon = null;
    if (
      this.props.controller.state.config.isVrAnimationEnabled !== null &&
      typeof this.props.controller.state.config.isVrAnimationEnabled === 'object' &&
      this.props.controller.state.config.isVrAnimationEnabled.vrIcon &&
      this.props.controller.videoVr &&
      !this.state.isVrIconHidden &&
      this.props.controller.isNewVrVideo
    ) {
      var defaultDuration = 3;
      var style = this.setAnimationDuration('vrIcon', defaultDuration);
      vrIcon = (
        <div id="vrIconContainer" className="oo-state-screen-vr-container" style={style}>
          <div className="oo-state-screen-vr-bg">
            <Icon {...this.props} icon="vrIcon" className="oo-state-screen-vr-icon" />
          </div>
        </div>
      );
    }

    var skipControlsEnabled = Utils.getPropertyValue(
      this.props.skinConfig,
      'skipControls.enabled',
      false
    );
    var isTextTrackInBackground = (
      this.props.controller.state.scrubberBar.isHovering ||
      (skipControlsEnabled && this.props.controller.state.controlBarVisible)
    );
    var className = ClassNames('oo-state-screen oo-playing-screen', {
      'oo-controls-active': skipControlsEnabled && this.props.controller.state.controlBarVisible
    });

    return (
      <div
        className={className}
        onMouseOver={this.handleMouseOver}
      >
        <div
          className={CONSTANTS.CLASS_NAMES.SELECTABLE_SCREEN}
          onMouseDown={this.handlePlayerMouseDown}
          onTouchStart={this.handlePlayerMouseDown}
          onClick={this.handlePlayerClicked}
          onFocus={this.handlePlayerFocus}
          onMouseUp={this.handlePlayerMouseUp}
          onTouchEnd={this.handleTouchEnd} />

        {vrNotification}
        {vrIcon}

        <Watermark {...this.props} controlBarVisible={this.props.controller.state.controlBarVisible} />

        {this.props.controller.state.buffering ? (
          <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url} />
        ) : null}

        {viewControlsVr}

        {skipControlsEnabled &&
          <SkipControls
            config={this.props.controller.state.skipControls}
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            responsiveView={this.props.responsiveView}
            skinConfig={this.props.skinConfig}
            controller={this.props.controller}
            currentPlayhead={this.props.currentPlayhead}
            a11yControls={this.props.controller.accessibilityControls}
            isInactive={!this.props.controller.state.controlBarVisible}
            isInBackground={this.props.controller.state.scrubberBar.isHovering}
            onMount={this.onSkipControlsMount}
            onFocus={this.handleFocus} />
        }

        <div className="oo-interactive-container" onFocus={this.handleFocus}>
          {this.props.closedCaptionOptions.enabled && (
            <TextTrackPanel
              closedCaptionOptions={this.props.closedCaptionOptions}
              cueText={this.props.closedCaptionOptions.cueText}
              direction={this.props.captionDirection}
              responsiveView={this.props.responsiveView}
              isInBackground={isTextTrackInBackground} />
          )}

          {adOverlay}

          {upNextPanel}

          <ControlBar
            {...this.props}
            controlBarVisible={this.props.controller.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream} />
        </div>

        {showUnmute ? <UnmuteIcon {...this.props} /> : null}
      </div>
    );
  }
}

const PlayingScreenWithAutoHide = withAutoHide(PlayingScreen);

export {PlayingScreen, PlayingScreenWithAutoHide};
