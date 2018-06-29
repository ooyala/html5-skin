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
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var PlayingScreen = createReactClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.browserSupportsTouch = this.props.controller.state.browserSupportsTouch;
    this.skipControlsClientRect = null;
    this.hasCheckedMouseOverControls = false;
    this.mousePosition = { clientX: 0, clientY: 0 };

    return {
      controlBarVisible: this.props.controller.state.controlBarVisible,
      isVrNotificationHidden: false,
      isVrIconHidden: false,
      timer: null
    };
  },

  componentWillMount: function() {
    this.props.handleVrPlayerMouseUp();
  },

  componentDidMount: function() {
    document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
    document.addEventListener('touchmove', this.handlePlayerMouseMove, false);
    document.addEventListener('mouseup', this.handleVrMouseUp, false);
    document.addEventListener('touchend', this.handleVrTouchEnd, false);

    // for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen || this.browserSupportsTouch) {
      this.props.controller.startHideControlBarTimer();
    }
    if (this.props.controller.videoVr) {
      this.handleVrAnimationEnd('vrNotificatioContainer', 'isVrNotificationHidden');
      this.handleVrAnimationEnd('vrIconContainer', 'isVrIconHidden');
    }
  },

  componentWillUpdate: function(nextProps) {
    if (nextProps) {
      if (nextProps.controller.state.controlBarVisible === false && this.state.controlBarVisible === true) {
        this.hideControlBar();
      }
      if (!this.props.fullscreen && nextProps.fullscreen) {
        this.props.controller.startHideControlBarTimer();
      }
      if (this.props.fullscreen && !nextProps.fullscreen && this.isMobile) {
        this.setState({ controlBarVisible: true });
        this.props.controller.showControlBar();
        this.props.controller.startHideControlBarTimer();
      }
    }
  },

  componentWillUnmount: function() {
    this.props.controller.cancelTimer();
    document.removeEventListener('mousemove', this.handlePlayerMouseMove);
    document.removeEventListener('touchmove', this.handlePlayerMouseMove);
    document.removeEventListener('mouseup', this.handleVrMouseUp);
    document.removeEventListener('touchend', this.handleVrTouchEnd);
  },

  /**
   * @description need to show special information labels (or/and icons).
   * The labels should be animated.
   * Need to remove the labels (icons) after animation
   * Animation should be only one time
   * @param {string} id - unique identificator of the label(icon)
   * @param {string} stateName - name for a state which indicates about necessary to show the label(icon)
   */
  handleVrAnimationEnd: function(id, stateName) {
    var vrContainer = document.getElementById(id);
    if (vrContainer) {
      var listener = function() {
        var newState = {};
        newState[stateName] = true;
        this.setState(newState);
      };
      vrContainer.addEventListener('animationend', listener.bind(this), false);
    }
  },

  handleResize: function() {
    if (this.isMounted()) {
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleKeyDown: function(event) {
    // Show control bar when any of the following keys are pressed:
    // - Tab: Focus on next control
    // - Space/Enter: Press active control
    // - Arrow keys: Either seek forward/back, volume up/down or interact with focused slider
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.TAB:
      case CONSTANTS.KEY_VALUES.SPACE:
      case CONSTANTS.KEY_VALUES.ENTER:
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        this.showControlBar();
        this.props.controller.startHideControlBarTimer();
        break;
      default:
        break;
    }
  },

  /**
   * The keydown event is not fired when the scrubber bar is first focused with
   * a tab unless playback was activated with a click. As a workaround, we make sure
   * that the controls are shown when a focusable element is focused.
   * @private
   * @param {object} event Focus event object.
   */
  handleFocus: function(event) {
    var isFocusableElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    // Only do this if the control bar hasn't been shown by now and limit to focus
    // events that are triggered on known focusable elements (control bar items and
    // skip buttons). Note that controlBarVisible controls both the control bar and
    // the skip buttons
    if (!this.state.controlBarVisible && isFocusableElement) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
  },

  /**
   * call handleTouchEnd when touchend was called on selectedScreen
   * @param {Event} event - event object
   */
  handleTouchEnd: function(event) {
    event.preventDefault(); // to prevent mobile from propagating click to discovery shown on pause
    if (!this.state.controlBarVisible) {
      this.showControlBar(event);
      this.props.controller.startHideControlBarTimer();
    } else {
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
  },

  /**
   * call handleVrTouchEnd when touchend was called on document and videoType is Vr
   * @param {Event} e - event object
   */
  handleVrTouchEnd: function(e) {
    this.props.handleVrPlayerMouseUp(e);
  },

  handlePlayerMouseDown: function(e) {
    if (this.props.controller.videoVr) {
      e.persist();
    }
    this.props.handleVrPlayerMouseDown(e);
  },

  handlePlayerMouseMove: function(e) {
    this.storeMousePosition(e);
    if (!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
    this.props.handleVrPlayerMouseMove(e);
  },

  /**
   * call handleVrMouseUp when mouseup was called on selectedScreen
   * @param {Event} e - event object
   */
  handlePlayerMouseUp: function(e) {
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
  },

  /**
   * Handles the mouseover event.
   * @private
   * @param {Event} event The mouseover event object
   */
  handleMouseOver: function(event) {
    this.storeMousePosition(event);
    this.showControlBar();
  },

  /**
   * Handles the touchstart event. Note that this handler is for the main element.
   * There's a similar handler for an inner element that handles 360 video interactions.
   * @private
   * @param {Event} event The touchstart event object
   */
  handleTouchStart: function(event) {
    // Disable "mouse over controls" check for all touch interactions
    this.hasCheckedMouseOverControls = true;
  },

  /**
   * Extracts and stores the clientX and clientY values from a mouse event. This
   * is used in order to keep track of the last known position. Triggers a check
   * that determines whether the mouse is over the skip controls.
   * @param {Event} event
   */
  storeMousePosition: function(event) {
    if (!event) {
      return;
    }
    this.mousePosition.clientX = event.clientX;
    this.mousePosition.clientY = event.clientY;
    this.tryCheckMouseOverControls();
  },

  /**
   * Called by the SkipControls component when it's done mounting. It informs this
   * component about the position of the SkipControls so that it can determine
   * whether or not the mouse cursor is over the controls.
   * @private
   * @param {DOMRect} clientRect A DOMRect returned by an element's getBoundingClientRect() function
   */
  onSkipControlsMount: function(clientRect) {
    this.skipControlsClientRect = clientRect;
    this.tryCheckMouseOverControls();
  },

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
  tryCheckMouseOverControls: function() {
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
      this.props.controller.cancelTimer();
    }
    this.hasCheckedMouseOverControls = true;
  },

  /**
   * call handleVrMouseUp when mouseup was called on document
   * @param {Event} e - event object
   */
  handleVrMouseUp: function(e) {
    this.props.handleVrPlayerMouseUp(e);
  },

  handlePlayerClicked: function(event) {
    if (!this.props.isVrMouseMove) {
      this.props.controller.togglePlayPause(event);
    }
    this.props.handleVrPlayerClick();
  },

  handlePlayerFocus: function() {
    this.props.handleVrPlayerFocus();
  },

  showControlBar: function(event) {
    if (!this.isMobile || (event && event.type === 'touchend')) {
      this.setState({ controlBarVisible: true });
      this.props.controller.showControlBar();
      ReactDOM.findDOMNode(this.refs.PlayingScreen).style.cursor = 'auto';
    }
  },

  hideControlBar: function(event) {
    if (this.props.controlBarAutoHide === true && !(this.isMobile && event)) {
      this.setState({ controlBarVisible: false });
      this.props.controller.hideControlBar();
      ReactDOM.findDOMNode(this.refs.PlayingScreen).style.cursor = 'none';
    }
  },

  unmuteClick: function(event) {
    this.props.controller.handleMuteClick();
  },

  /**
   *
   * @param {number} vrDuration - key for duraction in config
   * @param {number} defaultDuration - default value for duration
   * @returns {object} empty object or object with animationDuration
   */
  setAnimationDuration: function(vrDuration, defaultDuration) {
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
  },

  render: function() {
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
          controlBarVisible={this.state.controlBarVisible}
          currentPlayhead={this.props.currentPlayhead}
        />
      ) : null;

    var viewControlsVr = this.props.controller.videoVr ? (
      <ViewControlsVr {...this.props} controlBarVisible={this.state.controlBarVisible} />
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
        ref="PlayingScreen"
        onTouchStart={this.handleTouchStart}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.hideControlBar}
        onKeyDown={this.handleKeyDown}>
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

        <Watermark {...this.props} controlBarVisible={this.state.controlBarVisible} />

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
            controlBarVisible={this.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream} />
        </div>

        {showUnmute ? <UnmuteIcon {...this.props} /> : null}
      </div>
    );
  }
});
module.exports = PlayingScreen;
