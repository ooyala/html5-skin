/** ******************************************************************
  CONTROL BAR
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    ClassNames = require('classnames'),
    ScrubberBar = require('./scrubberBar'),
    Utils = require('./utils'),
    Popover = require('../views/popover'),
    AccessibleButton = require('./accessibleButton'),
    VolumeControls = require('./volumeControls'),
    VideoQualityPanel = require('./videoQualityPanel'),
    ClosedCaptionPopover = require('./closed-caption/closedCaptionPopover'),
    ClosedCaptionMultiAudioMenu = require('./closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu'),
    Logo = require('./logo'),
    Icon = require('./icon'),
    Tooltip = require('./tooltip');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var ControlBar = createReactClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.domNode = null;
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(this.props.responsiveView);
    this.moreOptionsItems = null;
    this.vr = null;
    if (
      this.props.controller &&
      this.props.controller.videoVrSource &&
      this.props.controller.videoVrSource.vr
    ) {
      this.vr = this.props.controller.videoVrSource.vr;
    }
    return {};
  },

  componentDidMount: function() {
    window.addEventListener('orientationchange', this.closeOtherPopovers);
    window.addEventListener('orientationchange', this.setLandscapeScreenOrientation, false);
    document.addEventListener('keydown', this.handleControlBarKeyDown);
    this.restoreFocusedControl();
  },

  componentWillReceiveProps: function(nextProps) {
    // if responsive breakpoint changes
    if (nextProps.responsiveView !== this.props.responsiveView) {
      this.responsiveUIMultiple = this.getResponsiveUIMultiple(nextProps.responsiveView);
    }
  },

  componentWillUnmount: function() {
    this.props.controller.cancelTimer();
    this.closeOtherPopovers();
    if (Utils.isAndroid()) {
      this.props.controller.hideVolumeSliderBar();
    }
    window.removeEventListener('orientationchange', this.closeOtherPopovers);
    window.removeEventListener('orientationchange', this.setLandscapeScreenOrientation);
    document.removeEventListener('keydown', this.handleControlBarKeyDown);
  },

  /**
   * Restores the focus of a previously selected control bar item.
   * This is needed as a workaround because switching between play and pause states
   * currently causes the control bar to re-render.
   * @private
   */
  restoreFocusedControl: function() {
    if (!this.props.controller.state.focusedControl || !this.domNode) {
      return;
    }
    var selector =
      '[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + '="' + this.props.controller.state.focusedControl + '"]';
    var control = this.domNode.querySelector(selector);

    if (control && typeof control.focus === 'function') {
      control.focus();
      // If we got to this point it means that play was triggered using the spacebar
      // (since a click would've cleared the focused element) and we need to
      // trigger control bar auto hide
      if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
        this.props.controller.startHideControlBarTimer();
      }
    }
  },

  getResponsiveUIMultiple: function(responsiveView) {
    var multiplier = this.props.skinConfig.responsive.breakpoints[responsiveView].multiplier;
    return multiplier;
  },

  handleControlBarMouseUp: function(evt) {
    if (evt.type === 'touchend' || !this.isMobile) {
      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleFullscreenClick: function(evt) {
    // On mobile, we get a following click event that fires after the Video
    // has gone full screen, clicking on a different UI element. So we prevent
    // the following click.
    evt.stopPropagation();
    evt.cancelBubble = true;
    evt.preventDefault();
    if (this.props.controller) {
      this.props.controller.toggleFullscreen();
      if (this.vr && this.isMobile && this.props.controller.isVrStereo) {
        this.toggleStereoVr();
      }
    }
  },

  handleStereoVrClick: function(evt) {
    if (this.vr) {
      evt.stopPropagation();
      evt.cancelBubble = true;
      evt.preventDefault();

      this.toggleStereoVr();

      if (this.props.controller) {
        var fullscreen = false;
        // depends on the switching type

        if (
          this.props.controller.state.isFullScreenSupported ||
          this.props.controller.state.isVideoFullScreenSupported
        ) {
          fullscreen = this.props.controller.state.fullscreen;
        } else {
          fullscreen = this.props.controller.state.isFullWindow;
        }

        if (!fullscreen && typeof this.props.controller.toggleFullscreen === 'function') {
          this.props.controller.toggleFullscreen();
        }

        if (this.props.controller.isVrStereo) {
          this.props.controller.checkDeviceOrientation = true;
          this.setLandscapeScreenOrientation();
        } else {
          this.unlockScreenOrientation();
        }
      }
    }
  },

  /**
   * @description set landscape orientation if it is possible
   * @private
   */
  setLandscapeScreenOrientation: function() {
    if (this.props.controller && this.props.controller.checkDeviceOrientation) {
      if (Utils.setLandscapeScreenOrientation) {
        Utils.setLandscapeScreenOrientation();
      }
    }
  },

  /**
   * @description set possibility to use all orientations
   * @private
   */
  unlockScreenOrientation: function() {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    } else if (screen.unlockOrientation) {
      screen.unlockOrientation();
    } else if (screen.mozUnlockOrientation) {
      screen.mozUnlockOrientation();
    } else if (screen.msUnlockOrientation) {
      screen.msUnlockOrientation();
    }
  },

  toggleStereoVr: function() {
    if (this.props.controller && typeof this.props.controller.toggleStereoVr === 'function') {
      this.props.controller.toggleStereoVr();
    }
  },

  handleLiveClick: function(evt) {
    evt.stopPropagation();
    evt.cancelBubble = true;
    evt.preventDefault();
    this.props.controller.onLiveClick();
    this.props.controller.seek(this.props.duration);
  },

  handleVolumeIconClick: function(evt) {
    if (this.isMobile) {
      this.props.controller.startHideControlBarTimer();
      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE
      if (!this.props.controller.state.volumeState.volumeSliderVisible) {
        this.props.controller.showVolumeSliderBar();
      } else {
        this.props.controller.handleMuteClick();
      }
    } else {
      this.props.controller.handleMuteClick();
    }
  },

  handlePlayClick: function() {
    this.props.controller.togglePlayPause();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleQualityClick: function() {
    this.configureMenuAutofocus(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);

    if (this.props.responsiveView === this.props.skinConfig.responsive.breakpoints.xs.id) {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
    } else {
      this.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
      this.closeOtherPopovers(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
    }
  },

  handleClosedCaptionClick: function() {
    this.configureMenuAutofocus(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS);

    if (this.props.responsiveView === this.props.skinConfig.responsive.breakpoints.xs.id) {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
    } else {
      this.togglePopover(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS);
      this.closeOtherPopovers(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS);
    }
  },

  handleMultiAudioClick: function() {
    this.configureMenuAutofocus(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);

    if (
      this.props.skinConfig.responsive &&
      this.props.skinConfig.responsive.breakpoints &&
      this.props.skinConfig.responsive.breakpoints.lg &&
      this.props.responsiveView === this.props.skinConfig.responsive.breakpoints.lg.id
    ) {
      this.togglePopover(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
      this.closeOtherPopovers(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
    } else {
      this.props.controller.toggleMultiAudioScreen();
    }
  },

  configureMenuAutofocus: function(menu) {
    var menuOptions = this.props.controller.state[menu] || {};
    var menuToggleButton = this.getToggleButtons(menu);

    if (menuOptions.showPopover) {
      // Reset autoFocus property when closing the menu
      menuOptions.autoFocus = false;
    } else if (menuToggleButton) {
      // If the menu was activated via keyboard we should
      // autofocus on the first element
      menuOptions.autoFocus = menuToggleButton.wasTriggeredWithKeyboard();
    }
  },

  /**
   * @description It gets value of toggleButtons from controller.js by popoverName
   * @param {string} popoverName - the name of the popover
   * @private
   * @returns {Object} - if toggleButtons (object) has key = popoverName it returns the value,
   * otherwise it returns empty object
   */
  getToggleButtons: function(popoverName) {
    if (this.props.controller && this.props.controller.toggleButtons) {
      return this.props.controller.toggleButtons[popoverName];
    }
    return {};
  },

  /**
   * @description It sets this.props.controller.toggleButtons value (menu) for key = popoverName
   * @param {string} popoverName - the name of the popover
   * @param {HTMLElement} menu - an accessible button
   * @private
   */
  setToggleButtons: function(popoverName, menu) {
    if (this.props.controller && this.props.controller.toggleButtons) {
      this.props.controller.toggleButtons[popoverName] = menu;
    }
  },

  /**
   * @description It calls function closePopover from controller.js
   * @param {string} menu - the name of the popover to be closed
   * @param {Object} [params] - params for closePopover function
   * @private
   */
  closePopover: function(menu, params) {
    if (this.props.controller && typeof this.props.controller.closePopover === 'function') {
      this.props.controller.closePopover(menu, params);
    }
  },

  /**
   * @description It calls function closeOtherPopovers from controller.js
   * @param {string} popoverName - the name of the popover that does not need to be closed
   * @private
   */
  closeOtherPopovers: function(popoverName) {
    if (this.props.controller && typeof this.props.controller.closeOtherPopovers === 'function') {
      this.props.controller.closeOtherPopovers(popoverName);
    }
  },

  togglePopover: function(menu) {
    var menuOptions = this.props.controller.state[menu];
    var menuToggleButton = this.getToggleButtons(menu);
    // Reset button flag that tracks keyboard interaction
    if (
      menuToggleButton &&
      menuOptions &&
      menuOptions.showPopover
    ) {
      menuToggleButton.wasTriggeredWithKeyboard(false);
    }
    this.props.controller.togglePopover(menu);
  },

  handleDiscoveryClick: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleMoreOptionsClick: function() {
    this.props.controller.toggleMoreOptionsScreen(this.moreOptionsItems);
  },

  // TODO(dustin) revisit this, doesn't feel like the "react" way to do this.
  highlight: function(evt) {
    if (!this.isMobile) {
      var iconElement = Utils.getEventIconElement(evt);
      if (iconElement) {
        var color = this.props.skinConfig.controlBar.iconStyle.active.color ?
          this.props.skinConfig.controlBar.iconStyle.active.color
          :
          this.props.skinConfig.general.accentColor;
        var opacity = this.props.skinConfig.controlBar.iconStyle.active.opacity;
        Utils.highlight(iconElement, opacity, color);
      }
    }
  },

  removeHighlight: function(evt) {
    var iconElement = Utils.getEventIconElement(evt);
    if (iconElement) {
      var color = this.props.skinConfig.controlBar.iconStyle.inactive.color;
      var opacity = this.props.skinConfig.controlBar.iconStyle.inactive.opacity;
      Utils.removeHighlight(iconElement, opacity, color);
    }
  },

  /**
   * Fires whenever an item is focused inside the control bar. Stores the id of
   * the focused control.
   * @param {FocusEvent} evt - Focus event object
   * @private
   */
  handleControlBarFocus: function(evt) {
    var focusId = evt.target ?
      evt.target.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)
      :
      null;
    if (focusId) {
      this.props.controller.state.focusedControl = focusId;
    }
  },

  /**
   * Clears the currently focused control.
   * @private
   */
  handleControlBarBlur: function() {
    this.props.controller.state.focusedControl = null;
  },

  /**
   * Will handle the keydown event when the controlBar is active and it will restrict
   * tab navigation to elements that are within it when the player is in fullscreen mode.
   * Note that this only handles the edge cases that are needed in order to loop the tab
   * focus. Tabbing in between the elements is handled by the browser.
   * @private
   * @param {Object} evt Keydown event object.
   */
  handleControlBarKeyDown: function(evt) {
    if (
      evt.key !== CONSTANTS.KEY_VALUES.TAB ||
      !this.props.controller.state.fullscreen ||
      !this.domNode ||
      !evt.target
    ) {
      return;
    }
    // Focusable elements on the control bar (this.domNode) are expected to have the
    // data-focus-id attribute
    var focusableElements = this.domNode.querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']');

    if (focusableElements.length) {
      var firstFocusableElement = focusableElements[0];
      var lastFocusableElement = focusableElements[focusableElements.length - 1];
      // This indicates we're tabbing over the focusable control bar elements
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
        // Keydown happened on a non-controlbar element
      } else {
        evt.preventDefault();

        if (evt.shiftKey) {
          lastFocusableElement.focus();
        } else {
          firstFocusableElement.focus();
        }
      }
    } else {
      OO.log('ControlBar: No focusable elements found');
    }
  },

  populateControlBar: function() {
    var dynamicStyles = this.setupItemStyle();
    var playIcon;
    var playPauseAriaLabel;
    if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
      playIcon = 'pause';
      playPauseAriaLabel = CONSTANTS.ARIA_LABELS.PAUSE;
    } else if (this.props.playerState === CONSTANTS.STATE.END) {
      playIcon = 'replay';
      playPauseAriaLabel = CONSTANTS.ARIA_LABELS.REPLAY;
    } else {
      playIcon = 'play';
      playPauseAriaLabel = CONSTANTS.ARIA_LABELS.PLAY;
    }

    var volumeIcon;
    var volumeAriaLabel;
    var mutedInUi = this.props.controller.state.volumeState.muted ||
      this.props.controller.state.volumeState.volume === 0;
    if (mutedInUi) {
      volumeIcon = 'volumeOff';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.UNMUTE;
    } else {
      volumeIcon = 'volume';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.MUTE;
    }

    var fullscreenIcon;
    var fullscreenAriaLabel;
    if (this.props.controller.state.fullscreen) {
      fullscreenIcon = 'compress';
      fullscreenAriaLabel = CONSTANTS.ARIA_LABELS.EXIT_FULLSCREEN;
    } else {
      fullscreenIcon = 'expand';
      fullscreenAriaLabel = CONSTANTS.ARIA_LABELS.FULLSCREEN;
    }

    var stereoIcon;
    var stereoAriaLabel;
    if (this.vr) {
      stereoIcon = 'stereoOff';
      stereoAriaLabel = CONSTANTS.ARIA_LABELS.STEREO_OFF;
      if (this.props.controller && this.props.controller.isVrStereo) {
        stereoIcon = 'stereoOn';
        stereoAriaLabel = CONSTANTS.ARIA_LABELS.STEREO_ON;
      }
    }

    var totalTime = 0;
    if (
      this.props.duration === null ||
      typeof this.props.duration === 'undefined' ||
      this.props.duration === ''
    ) {
      totalTime = Utils.formatSeconds(0);
    } else {
      totalTime = Utils.formatSeconds(this.props.duration);
    }

    // TODO - Replace time display logic with Utils.getTimeDisplayValues()
    var playheadTime = isFinite(parseInt(this.props.currentPlayhead)) ?
      Utils.formatSeconds(parseInt(this.props.currentPlayhead))
      :
      null;
    var isLiveStream = this.props.isLiveStream;
    var durationSetting = { color: this.props.skinConfig.controlBar.iconStyle.inactive.color };
    var timeShift = this.props.currentPlayhead - this.props.duration;
    // checking timeShift < 1 seconds (not === 0) as processing of the click after we rewinded and then went live may take some time
    var isLiveNow = Math.abs(timeShift) < 1;
    var liveClick = isLiveNow ? null : this.handleLiveClick;
    var playheadTimeContent = isLiveStream ?
      (isLiveNow ? null : Utils.formatSeconds(timeShift))
      :
      playheadTime;
    var totalTimeContent = isLiveStream ? null : <span className="oo-total-time">{totalTime}</span>;

    // TODO: Update when implementing localization
    var liveText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.LIVE,
      this.props.localizableStrings
    );

    var liveClass = ClassNames({
      'oo-control-bar-item oo-live oo-live-indicator': true,
      'oo-live-nonclickable': isLiveNow
    });

    var qualityClass = ClassNames({
      'oo-quality': true,
      'oo-control-bar-item': true,
      'oo-selected': this.props.controller.state.videoQualityOptions.showPopover
    });

    var captionClass = ClassNames({
      'oo-closed-caption': true,
      'oo-control-bar-item': true,
      'oo-selected': this.props.controller.state.closedCaptionOptions.showPopover
    });

    var multiAudioClass = ClassNames({
      'oo-multiaudio': true,
      'oo-control-bar-item': true,
      'oo-selected': this.props.controller.state.multiAudioOptions.showPopover
    });

    var selectedStyle = {};
    selectedStyle['color'] = this.props.skinConfig.general.accentColor ?
      this.props.skinConfig.general.accentColor
      :
      null;

    var isTooltipEnabled = false;
    if (!this.isMobile && this.props.skinConfig.controlBar.tooltips) {
      isTooltipEnabled = this.props.skinConfig.controlBar.tooltips.enabled;
    }

    var tooltipAlignments = {};
    var tooltipConfig = {
      enabled: isTooltipEnabled,
      responsivenessMultiplier: this.responsiveUIMultiple,
      bottom: this.responsiveUIMultiple * this.props.skinConfig.controlBar.height,
      language: this.props.language,
      localizableStrings: this.props.localizableStrings,
      getAlignment: function(key) {
        return tooltipAlignments[key] || CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      }
    };

    var playBtnTooltip;
    if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
      playBtnTooltip = CONSTANTS.SKIN_TEXT.PAUSE;
    } else if (this.props.playerState === CONSTANTS.STATE.END) {
      playBtnTooltip = CONSTANTS.SKIN_TEXT.REPLAY;
    } else {
      playBtnTooltip = CONSTANTS.SKIN_TEXT.PLAY;
    }

    var controlItemTemplates = {
      playPause: (
        <AccessibleButton
          key={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
          className="oo-play-pause oo-control-bar-item"
          onClick={this.handlePlayClick}
          onMouseOver={this.highlight}
          onMouseOut={this.removeHighlight}
          focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}
          ariaLabel={playPauseAriaLabel}>
          <Icon {...this.props} icon={playIcon} style={dynamicStyles.iconCharacter} />
          <Tooltip
            {...tooltipConfig}
            parentKey={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
            text={playBtnTooltip}>
          </Tooltip>
        </AccessibleButton>
      ),

      live: (
        <a key={CONSTANTS.CONTROL_BAR_KEYS.LIVE} className={liveClass} ref="LiveButton" onClick={liveClick}>
          <div className="oo-live-circle" />
          <span className="oo-live-text">{liveText}</span>
        </a>
      ),

      volume: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.VOLUME} className="oo-volume oo-control-bar-item">
          <AccessibleButton
            className="oo-mute-unmute oo-control-bar-item"
            onClick={this.handleVolumeIconClick}
            onMouseOver={this.highlight}
            onMouseOut={this.removeHighlight}
            focusId={CONSTANTS.FOCUS_IDS.MUTE_UNMUTE}
            ariaLabel={volumeAriaLabel}>
            <Icon
              {...this.props}
              icon={volumeIcon}
              ref="volumeIcon"
              style={this.props.skinConfig.controlBar.iconStyle.inactive} />
            <Tooltip
              {...tooltipConfig}
              parentKey={CONSTANTS.CONTROL_BAR_KEYS.VOLUME}
              text={mutedInUi ? CONSTANTS.SKIN_TEXT.UNMUTE : CONSTANTS.SKIN_TEXT.MUTE} />
          </AccessibleButton>
          <VolumeControls {...this.props} />
        </div>
      ),

      timeDuration: (
        <a
          key={CONSTANTS.CONTROL_BAR_KEYS.TIME_DURATION}
          className="oo-time-duration oo-control-bar-duration"
          style={durationSetting}>
          <span>{playheadTimeContent}</span>{totalTimeContent}
        </a>
      ),

      flexibleSpace: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.FLEXIBLE_SPACE} className="oo-flexible-space oo-control-bar-flex-space" />
      ),

      moreOptions: (
        <a
          key={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS}
          className="oo-more-options oo-control-bar-item"
          onClick={this.handleMoreOptionsClick}
          aria-hidden="true">
          <Icon
            {...this.props}
            icon="ellipsis"
            style={dynamicStyles.iconCharacter}
            onMouseOver={this.highlight}
            onMouseOut={this.removeHighlight} />
          <Tooltip
            {...tooltipConfig}
            parentKey={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS}
            text={CONSTANTS.SKIN_TEXT.MORE_OPTIONS} />
        </a>
      ),

      quality: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.QUALITY} className="oo-popover-button-container">
          <AccessibleButton
            ref={function(e) {
              this.setToggleButtons(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY, e);
            }.bind(this)}
            style={selectedStyle}
            className={qualityClass}
            focusId={CONSTANTS.FOCUS_IDS.VIDEO_QUALITY}
            ariaLabel={CONSTANTS.ARIA_LABELS.VIDEO_QUALITY}
            ariaHasPopup={true}
            ariaExpanded={this.props.controller.state.videoQualityOptions.showPopover ? true : null}
            onClick={this.handleQualityClick}>
            <Icon
              {...this.props}
              icon="quality"
              style={dynamicStyles.iconCharacter}
              onMouseOver={this.highlight}
              onMouseOut={this.removeHighlight} />
            <Tooltip
              {...tooltipConfig}
              parentKey={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
              text={CONSTANTS.SKIN_TEXT.VIDEO_QUALITY} />
          </AccessibleButton>
          {this.props.controller.state.videoQualityOptions.showPopover && (
            <Popover
              autoFocus={this.props.controller.state.videoQualityOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}>
              <VideoQualityPanel
                {...this.props}
                closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
                popover={true} />
            </Popover>
          )}
        </div>
      ),

      discovery: (
        <a
          key={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
          className="oo-discovery oo-control-bar-item"
          onClick={this.handleDiscoveryClick}
          aria-hidden="true">
          <Icon
            {...this.props}
            icon="discovery"
            style={dynamicStyles.iconCharacter}
            onMouseOver={this.highlight}
            onMouseOut={this.removeHighlight} />
          <Tooltip
            {...tooltipConfig}
            parentKey={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
            text={CONSTANTS.SKIN_TEXT.DISCOVER} />
        </a>
      ),

      closedCaption: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION} className="oo-popover-button-container">
          <AccessibleButton
            ref={function(e) {
              this.setToggleButtons(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS, e);
            }.bind(this)}
            style={selectedStyle}
            className={captionClass}
            focusId={CONSTANTS.FOCUS_IDS.CLOSED_CAPTIONS}
            ariaLabel={CONSTANTS.ARIA_LABELS.CLOSED_CAPTIONS}
            ariaHasPopup={true}
            ariaExpanded={this.props.controller.state.closedCaptionOptions.showPopover ? true : null}
            onClick={this.handleClosedCaptionClick}>
            <Icon
              {...this.props}
              icon="cc"
              style={dynamicStyles.iconCharacter}
              onMouseOver={this.highlight}
              onMouseOut={this.removeHighlight} />
            <Tooltip
              {...tooltipConfig}
              parentKey={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
              text={CONSTANTS.SKIN_TEXT.CLOSED_CAPTIONS} />
          </AccessibleButton>
          {this.props.controller.state.closedCaptionOptions.showPopover && (
            <Popover
              popoverClassName="oo-popover oo-popover-pull-right"
              autoFocus={this.props.controller.state.closedCaptionOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}>
              <ClosedCaptionPopover
                {...this.props}
                togglePopoverAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)} />
            </Popover>
          )}
        </div>
      ),

      audioAndCC: function() {
        var closedCaptionsList = [];
        var multiAudioList = [];

        if (
          this.props.controller.state.closedCaptionOptions.availableLanguages &&
          this.props.controller.state.closedCaptionOptions.availableLanguages.languages
        ) {
          closedCaptionsList = this.props.controller.state.closedCaptionOptions.availableLanguages.languages;
        }

        if (this.props.controller.state.multiAudio && this.props.controller.state.multiAudio.tracks) {
          multiAudioList = this.props.controller.state.multiAudio.tracks;
        }

        if (closedCaptionsList.length === 0 && multiAudioList.length === 0) {
          return null;
        }

        return (
          <div key={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC} className="oo-popover-button-container">
            <AccessibleButton
              ref={function(e) {
                this.setToggleButtons(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO, e);
              }.bind(this)}
              style={selectedStyle}
              className={multiAudioClass}
              focusId={CONSTANTS.FOCUS_IDS.MULTI_AUDIO}
              ariaLabel={CONSTANTS.ARIA_LABELS.MULTI_AUDIO}
              ariaHasPopup={true}
              ariaExpanded={this.props.controller.state.multiAudioOptions.showPopover ? true : null}
              onClick={this.handleMultiAudioClick}>
              <Icon
                {...this.props}
                icon="audioAndCC"
                style={dynamicStyles.iconCharacter}
                onMouseOver={this.highlight}
                onMouseOut={this.removeHighlight} />
              <Tooltip
                {...tooltipConfig}
                parentKey={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
                text={CONSTANTS.SKIN_TEXT.AUDIO} />
            </AccessibleButton>
            {this.props.controller.state.multiAudioOptions.showPopover &&
              <Popover
                popoverClassName="oo-popover oo-popover-pull-right oo-cc-ma-container"
                autoFocus={this.props.controller.state.multiAudioOptions.autoFocus}
                closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
                closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}>
                <ClosedCaptionMultiAudioMenu
                  language={this.props.language}
                  localizableStrings={this.props.localizableStrings}
                  menuClassName={"oo-cc-ma-menu--popover"}
                  togglePopoverAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
                  {...this.props} />
              </Popover>
            }
          </div>
        );
      }.bind(this)(),

      share: (
        <a
          key={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
          className="oo-share oo-control-bar-item"
          onClick={this.handleShareClick}
          aria-hidden="true">
          <Icon
            {...this.props}
            icon="share"
            style={dynamicStyles.iconCharacter}
            onMouseOver={this.highlight}
            onMouseOut={this.removeHighlight} />
          <Tooltip
            {...tooltipConfig}
            parentKey={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
            text={CONSTANTS.SKIN_TEXT.SHARE} />
        </a>
      ),

      stereoscopic: !!(this.vr && this.isMobile) && (
        <AccessibleButton
          key={CONSTANTS.CONTROL_BAR_KEYS.STEREOSCOPIC}
          className="oo-video-type oo-control-bar-item oo-vr-stereo-button"
          onClick={this.handleStereoVrClick}
          onMouseOver={this.highlight}
          onMouseOut={this.removeHighlight}
          focusId={CONSTANTS.FOCUS_IDS.STEREO}
          ariaLabel={stereoAriaLabel}>
          <Icon {...this.props} icon={stereoIcon} style={dynamicStyles.iconCharacter} />
        </AccessibleButton>
      ),

      fullscreen: (
        <AccessibleButton
          key={CONSTANTS.CONTROL_BAR_KEYS.FULLSCREEN}
          className="oo-fullscreen oo-control-bar-item"
          onClick={this.handleFullscreenClick}
          onMouseOver={this.highlight}
          onMouseOut={this.removeHighlight}
          focusId={CONSTANTS.FOCUS_IDS.FULLSCREEN}
          ariaLabel={fullscreenAriaLabel}>
          <Icon {...this.props} icon={fullscreenIcon} style={dynamicStyles.iconCharacter} />
          <Tooltip
            {...tooltipConfig}
            parentKey={CONSTANTS.CONTROL_BAR_KEYS.FULLSCREEN}
            text={this.props.controller.state.fullscreen ?
              CONSTANTS.SKIN_TEXT.EXIT_FULL_SCREEN
              :
              CONSTANTS.SKIN_TEXT.FULL_SCREEN
            } />
        </AccessibleButton>
      ),

      logo: (
        <Logo
          key={CONSTANTS.CONTROL_BAR_KEYS.LOGO}
          imageUrl={this.props.skinConfig.controlBar.logo.imageResource.url}
          clickUrl={this.props.skinConfig.controlBar.logo.clickUrl}
          target={this.props.skinConfig.controlBar.logo.target}
          width={
            this.props.responsiveView !== this.props.skinConfig.responsive.breakpoints.xs.id ?
              this.props.skinConfig.controlBar.logo.width
              :
              null
          }
          height={this.props.skinConfig.controlBar.logo.height} />
      )
    };

    var controlBarItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ?
      this.props.skinConfig.buttons.desktopAd
      :
      this.props.skinConfig.buttons.desktopContent;

    // if mobile and not showing the slider or the icon, extra space can be added to control bar width. If volume bar is shown instead of slider, add some space as well:
    var volumeItem = null;
    var extraSpaceVolume = 0;

    for (var j = 0; j < defaultItems.length; j++) {
      if (defaultItems[j].name === 'volume') {
        volumeItem = defaultItems[j];

        var extraSpaceVolumeSlider =
          (volumeItem && this.isMobile && !this.props.controller.state.volumeState.volumeSliderVisible) ||
          (volumeItem && Utils.isIos()) ?
            parseInt(volumeItem.minWidth)
            : 0;
        var extraSpaceVolumeBar = this.isMobile ? 0 : parseInt(volumeItem.minWidth) / 2;
        extraSpaceVolume = extraSpaceVolumeSlider + extraSpaceVolumeBar;

        break;
      }
    }

    // if no hours, add extra space to control bar width:
    var hourInSec = 3600;
    var hours = parseInt(this.props.duration / hourInSec, 10);
    var extraSpaceDuration = hours > 0 ? 0 : 45;

    var controlBarLeftRightPadding = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING * 2;

    for (var k = 0; k < defaultItems.length; k++) {
      // filter out unrecognized button names
      if (typeof controlItemTemplates[defaultItems[k].name] === 'undefined') {
        continue;
      }

      // filter out disabled buttons
      if (defaultItems[k].location === 'none') {
        continue;
      }

      // do not show share button if not share options are available
      if (defaultItems[k].name === 'share') {
        var shareContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.shareContent', []);
        var socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
        var onlySocialTab = shareContent.length === 1 && shareContent[0] === 'social';
        // skip if no tabs were specified or if only the social tab is present but no social buttons are specified
        if (
          this.props.controller.state.isOoyalaAds ||
          !shareContent.length ||
          (onlySocialTab && !socialContent.length)
        ) {
          continue;
        }
      }

      // do not show CC button if no CC available
      if (
        (this.props.controller.state.isOoyalaAds ||
          !this.props.controller.state.closedCaptionOptions.availableLanguages) &&
        defaultItems[k].name === 'closedCaption'
      ) {
        continue;
      }

      // do not show quality button if no bitrates available
      if (
        (this.props.controller.state.isOoyalaAds ||
          !this.props.controller.state.videoQualityOptions.availableBitrates) &&
        defaultItems[k].name === 'quality'
      ) {
        continue;
      }

      // do not show discovery button if no related videos available
      if (
        (this.props.controller.state.isOoyalaAds || !this.props.controller.state.discoveryData) &&
        defaultItems[k].name === 'discovery'
      ) {
        continue;
      }

      // do not show logo if no image url available
      if (!this.props.skinConfig.controlBar.logo.imageResource.url && defaultItems[k].name === 'logo') {
        continue;
      }

      if (Utils.isIos() && defaultItems[k].name === 'volume' && !this.vr) {
        continue;
      }

      // not sure what to do when there are multi streams
      if (
        defaultItems[k].name === 'live' &&
        (typeof this.props.isLiveStream === 'undefined' || !this.props.isLiveStream)
      ) {
        continue;
      }

      if (defaultItems[k].name === 'audioAndCC' && !this.props.controller.state.multiAudio) {
        continue;
      }

      controlBarItems.push(defaultItems[k]);
    }

    var collapsedResult = Utils.collapse(
      this.props.componentWidth +
      this.responsiveUIMultiple * (extraSpaceDuration + extraSpaceVolume - controlBarLeftRightPadding),
      controlBarItems,
      this.responsiveUIMultiple
    );
    var collapsedControlBarItems = collapsedResult.fit;
    var collapsedMoreOptionsItems = collapsedResult.overflow;
    this.moreOptionsItems = collapsedMoreOptionsItems;

    var finalControlBarItems = [];
    var lastItem = (this.props.controller.state.isOoyalaAds || collapsedMoreOptionsItems.length === 0) ?
      collapsedControlBarItems.length - 2
      :
      collapsedControlBarItems.length - 1;
    for (var k = 0; k < collapsedControlBarItems.length; k++) {
      if (collapsedControlBarItems[k].name === 'moreOptions' &&
        (this.props.controller.state.isOoyalaAds ||
        collapsedMoreOptionsItems.length === 0)
      ) {
        continue;
      }
      var alignment = CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      if (k === lastItem) {
        alignment = CONSTANTS.TOOLTIP_ALIGNMENT.RIGHT;
      } else if (k === 0) {
        alignment = CONSTANTS.TOOLTIP_ALIGNMENT.LEFT;
      }
      tooltipAlignments[collapsedControlBarItems[k].name] = alignment;
      finalControlBarItems.push(controlItemTemplates[collapsedControlBarItems[k].name]);
    }
    return finalControlBarItems;
  },

  setupItemStyle: function() {
    var returnStyles = {};

    returnStyles.iconCharacter = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity
    };
    return returnStyles;
  },

  render: function() {
    var controlBarClass = ClassNames({
      'oo-control-bar': true,
      'oo-control-bar-hidden': !this.props.controlBarVisible
    });

    var controlBarItems = this.populateControlBar();
    var controlBarStyle = {
      height: this.props.skinConfig.controlBar.height
    };

    return (
      <div
        ref={function(domNode) {
          this.domNode = domNode;
        }.bind(this)}
        className={controlBarClass}
        style={controlBarStyle}
        onFocus={this.handleControlBarFocus}
        onBlur={this.handleControlBarBlur}
        onMouseUp={this.handleControlBarMouseUp}
        onTouchEnd={this.handleControlBarMouseUp}
      >
        <ScrubberBar {...this.props} />

        <div className="oo-control-bar-items-wrapper">
          {controlBarItems}
        </div>
      </div>
    );
  }
});

ControlBar.defaultProps = {
  isLiveStream: false,
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: { id: 'xs' },
        sm: { id: 'sm' },
        md: { id: 'md' },
        lg: { id: 'lg' }
      }
    }
  },
  responsiveView: 'md'
};

ControlBar.propTypes = {
  isLiveStream: PropTypes.bool,
  controlBarVisible: PropTypes.bool,
  playerState: PropTypes.string,
  responsiveView: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.string,
  duration: PropTypes.number,
  currentPlayhead: PropTypes.number,
  componentWidth: PropTypes.number,
  skinConfig: PropTypes.shape({
    responsive: PropTypes.shape({
      breakpoints: PropTypes.object
    })
  }),
  controller: PropTypes.shape({
    state: PropTypes.object,
    videoVrSource: PropTypes.shape({
      vr: PropTypes.object
    }),
    cancelTimer: PropTypes.func,
    startHideControlBarTimer: PropTypes.func,
    hideVolumeSliderBar: PropTypes.func,
    closePopover: PropTypes.func,
    closeOtherPopovers: PropTypes.func,
    isVrStereo: PropTypes.bool
  })
};

module.exports = ControlBar;
