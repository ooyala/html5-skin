/** ******************************************************************
  CONTROL BAR
******************************************************************** */
const React = require('react');

const ClassNames = require('classnames');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const CONSTANTS = require('../constants/constants');


const ScrubberBar = require('./scrubberBar');

const Utils = require('./utils');

const Popover = require('../views/popover');

const AccessibleButton = require('./accessibleButton');

const ControlButton = require('./controlButton');

const PlaybackSpeedButton = require('./playbackSpeedButton');

const VolumeControls = require('./volumeControls');

const VideoQualityPanel = require('./videoQualityPanel');

const PlaybackSpeedPanel = require('./playbackSpeedPanel');

const ClosedCaptionPopover = require('./closed-caption/closedCaptionPopover');

const ClosedCaptionMultiAudioMenu = require('./closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');

const preserveKeyboardFocus = require('./higher-order/preserveKeyboardFocus');

const Logo = require('./logo');

const Icon = require('./icon');

const Tooltip = require('./tooltip');

const MACROS = require('../constants/macros');
const SkipControls = require('../components/skipControls');

const ControlBar = createReactClass({
  getInitialState() {
    this.isMobile = this.props.controller.state.isMobile;
    this.isPhone = Utils.getUserDevice() === 'phone';
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(this.props.responsiveView);
    this.moreOptionsItems = null;
    this.vr = null;
    if (
      this.props.controller
      && this.props.controller.videoVrSource
      && this.props.controller.videoVrSource.vr
    ) {
      this.vr = this.props.controller.videoVrSource.vr;
    }
    return {};
  },

  componentDidMount() {
    window.addEventListener('orientationchange', this.closeOtherPopovers);
    window.addEventListener('orientationchange', this.setLandscapeScreenOrientation, false);
  },

  componentWillReceiveProps(nextProps) {
    // if responsive breakpoint changes
    if (nextProps.responsiveView !== this.props.responsiveView) {
      this.responsiveUIMultiple = this.getResponsiveUIMultiple(nextProps.responsiveView);
    }
  },

  componentWillUnmount() {
    this.props.controller.cancelTimer();
    this.closeOtherPopovers();
    if (Utils.isAndroid()) {
      this.props.controller.hideVolumeSliderBar();
    }
    window.removeEventListener('orientationchange', this.closeOtherPopovers);
    window.removeEventListener('orientationchange', this.setLandscapeScreenOrientation);
  },

  getResponsiveUIMultiple(responsiveView) {
    const multiplier = this.props.skinConfig.responsive.breakpoints[responsiveView].multiplier;
    return multiplier;
  },

  handleControlBarMouseUp(evt) {
    if (evt.type === 'touchend' || !this.isMobile) {
      evt.stopPropagation(); // W3C
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleFullscreenClick(evt) {
    // On mobile, we get a following click event that fires after the Video
    // has gone full screen, clicking on a different UI element. So we prevent
    // the following click.
    evt.stopPropagation();
    evt.cancelBubble = true;
    evt.preventDefault();
    if (this.props.controller) {
      this.props.controller.toggleFullscreen();
      if (this.vr && this.isPhone && this.props.controller.isVrStereo) {
        this.toggleStereoVr();
      }
    }
  },

  handleStereoVrClick(evt) {
    if (this.vr) {
      evt.stopPropagation();
      evt.cancelBubble = true;
      evt.preventDefault();

      this.toggleStereoVr();

      if (this.props.controller) {
        let fullscreen = false;
        // depends on the switching type

        if (
          this.props.controller.state.isFullScreenSupported
          || this.props.controller.state.isVideoFullScreenSupported
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
  setLandscapeScreenOrientation() {
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
  unlockScreenOrientation() {
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

  toggleStereoVr() {
    if (this.props.controller && typeof this.props.controller.toggleStereoVr === 'function') {
      this.props.controller.toggleStereoVr();
    }
  },

  handleLiveClick(evt) {
    evt.stopPropagation();
    evt.cancelBubble = true;
    evt.preventDefault();
    this.props.controller.onLiveClick();
    this.props.controller.seek(this.props.duration);
  },

  handleVolumeIconClick(evt) {
    if (this.props.clickToVolumeScreen) {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.VOLUME_SCREEN, true);
    } else if (this.isMobile) {
      this.props.controller.startHideControlBarTimer();
      evt.stopPropagation(); // W3C
      if (!this.props.controller.state.volumeState.volumeSliderVisible) {
        this.props.controller.showVolumeSliderBar();
      } else {
        this.props.controller.handleMuteClick();
      }
    } else {
      this.props.controller.handleMuteClick();
    }
  },

  handlePlayClick() {
    this.props.controller.togglePlayPause();
  },

  handleShareClick() {
    this.props.controller.toggleShareScreen();
  },

  /**
   * Generic toggle logic for menus that display as popover on large screen sizes
   * and as a fullscreen menu on smaller ones.
   * @private
   * @param {String} menuOptionsId A string that identifies the menu options object of the menu we want to toggle
   */
  handleMenuToggleClick(menuOptionsId) {
    this.configureMenuAutofocus(menuOptionsId);

    if (
      this.props.controller.state.isMobile
      || this.props.responsiveView === this.props.skinConfig.responsive.breakpoints.xs.id
    ) {
      const screenToToggle = CONSTANTS.MENU_OPTIONS_SCREENS[menuOptionsId];
      this.props.controller.toggleScreen(screenToToggle);
    } else {
      this.togglePopover(menuOptionsId);
      this.closeOtherPopovers(menuOptionsId);
    }
  },

  handleMultiAudioClick() {
    this.configureMenuAutofocus(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);

    if (
      this.props.skinConfig.responsive
      && this.props.skinConfig.responsive.breakpoints
      && this.props.skinConfig.responsive.breakpoints.lg
      && this.props.responsiveView === this.props.skinConfig.responsive.breakpoints.lg.id
    ) {
      this.togglePopover(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
      this.closeOtherPopovers(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
    } else {
      this.props.controller.toggleMultiAudioScreen();
    }
  },

  configureMenuAutofocus(menu) {
    const menuOptions = this.props.controller.state[menu] || {};
    const menuToggleButton = this.getToggleButtons(menu);

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
  getToggleButtons(popoverName) {
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
  setToggleButtons(popoverName, menu) {
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
  closePopover(menu, params) {
    if (this.props.controller && typeof this.props.controller.closePopover === 'function') {
      this.props.controller.closePopover(menu, params);
    }
  },

  /**
   * @description It calls function closeOtherPopovers from controller.js
   * @param {string} popoverName - the name of the popover that does not need to be closed
   * @private
   */
  closeOtherPopovers(popoverName) {
    if (this.props.controller && typeof this.props.controller.closeOtherPopovers === 'function') {
      this.props.controller.closeOtherPopovers(popoverName);
    }
  },

  togglePopover(menu) {
    const menuOptions = this.props.controller.state[menu];
    const menuToggleButton = this.getToggleButtons(menu);
    // Reset button flag that tracks keyboard interaction
    if (
      menuToggleButton
      && menuOptions
      && menuOptions.showPopover
    ) {
      menuToggleButton.wasTriggeredWithKeyboard(false);
    }
    this.props.controller.togglePopover(menu);
  },

  handleDiscoveryClick() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleMoreOptionsClick() {
    this.props.controller.toggleMoreOptionsScreen(this.moreOptionsItems);
  },

  populateControlBar() {
    const playButtonDetails = Utils.getPlayButtonDetails(this.props.playerState);
    const playIcon = playButtonDetails.icon;
    const playPauseAriaLabel = playButtonDetails.ariaLabel;
    const playButtonTooltip = playButtonDetails.buttonTooltip;

    let volumeIcon;
    let volumeAriaLabel;
    const mutedInUi = this.props.controller.state.volumeState.muted
      || this.props.controller.state.volumeState.volume === 0;
    if (mutedInUi) {
      volumeIcon = 'volumeOff';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.UNMUTE;
    } else {
      volumeIcon = 'volume';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.MUTE;
    }

    let fullscreenIcon;
    let fullscreenAriaLabel;
    if (this.props.controller.state.fullscreen) {
      fullscreenIcon = 'compress';
      fullscreenAriaLabel = CONSTANTS.ARIA_LABELS.EXIT_FULLSCREEN;
    } else {
      fullscreenIcon = 'expand';
      fullscreenAriaLabel = CONSTANTS.ARIA_LABELS.FULLSCREEN;
    }

    let stereoIcon;
    let stereoAriaLabel;
    if (this.vr) {
      stereoIcon = 'stereoOff';
      stereoAriaLabel = CONSTANTS.ARIA_LABELS.STEREO_OFF;
      if (this.props.controller && this.props.controller.isVrStereo) {
        stereoIcon = 'stereoOn';
        stereoAriaLabel = CONSTANTS.ARIA_LABELS.STEREO_ON;
      }
    }

    // TODO - Replace time display logic with Utils.getTimeDisplayValues()
    const isLiveStream = this.props.isLiveStream;
    const durationSetting = { color: this.props.skinConfig.controlBar.iconStyle.inactive.color };
    const timeShift = this.props.currentPlayhead - this.props.duration;
    // checking timeShift < 1 seconds (not === 0) as processing of the click after we rewinded and then went live may take some time
    const isLiveNow = Math.abs(timeShift) < 1;
    const liveClick = isLiveNow ? null : this.handleLiveClick;
    const totalTimeContent = isLiveStream ? null : <span className="oo-total-time">{this.props.totalTime}</span>;

    // TODO: Update when implementing localization
    const liveText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.LIVE,
      this.props.localizableStrings
    );

    const liveClass = ClassNames({
      'oo-control-bar-item oo-live oo-live-indicator': true,
      'oo-live-nonclickable': isLiveNow,
    });

    const qualityClass = ClassNames({
      'oo-quality': true,
      'oo-selected': this.props.controller.state.videoQualityOptions.showPopover,
    });

    const captionClass = ClassNames({
      'oo-closed-caption': true,
      'oo-selected': this.props.controller.state.closedCaptionOptions.showPopover,
    });

    const playbackSpeedClass = ClassNames({
      'oo-selected': this.props.controller.state.playbackSpeedOptions.showPopover,
    });

    const multiAudioClass = ClassNames({
      'oo-multiaudio': true,
      'oo-selected': this.props.controller.state.multiAudioOptions.showPopover,
    });

    const selectedStyle = {};
    selectedStyle.color = this.props.skinConfig.general.accentColor
      ? this.props.skinConfig.general.accentColor
      : null;

    // Map of tooltip aligments, which vary depending of the button's order within
    // the control bar. This is populated below.
    const tooltipAlignments = {};
    // Props that need to be passed to all control bar buttons
    const commonButtonProps = {
      language: this.props.language,
      localizableStrings: this.props.localizableStrings,
      responsiveView: this.props.responsiveView,
      skinConfig: this.props.skinConfig,
      controller: this.props.controller,
      getTooltipAlignment(key) {
        return tooltipAlignments[key] || CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      },
    };

    const controlItemTemplates = {
      playPause: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
          className="oo-play-pause"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
          ariaLabel={playPauseAriaLabel}
          icon={playIcon}
          tooltip={playButtonTooltip}
          onClick={this.handlePlayClick}
        />
      ),

      live: (
        <a key={CONSTANTS.CONTROL_BAR_KEYS.LIVE} className={liveClass} ref="LiveButton" onClick={liveClick}>
          <div className="oo-live-circle" />
          <span className="oo-live-text">{liveText}</span>
        </a>
      ),

      volume: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.VOLUME} className="oo-volume oo-control-bar-item">
          <ControlButton
            {...commonButtonProps}
            className="oo-mute-unmute"
            focusId={CONSTANTS.CONTROL_BAR_KEYS.VOLUME}
            ariaLabel={volumeAriaLabel}
            icon={volumeIcon}
            tooltip={mutedInUi ? CONSTANTS.SKIN_TEXT.UNMUTE : CONSTANTS.SKIN_TEXT.MUTE}
            onClick={this.handleVolumeIconClick}
          />
          {!this.props.hideVolumeControls && <VolumeControls {...this.props} />}
        </div>
      ),

      timeDuration: (
        <a
          key={CONSTANTS.CONTROL_BAR_KEYS.TIME_DURATION}
          className="oo-time-duration oo-control-bar-duration"
          style={durationSetting}
        >
          <span>{this.props.playheadTime}</span>
          {totalTimeContent}
        </a>
      ),

      flexibleSpace: (
        <div
          key={CONSTANTS.CONTROL_BAR_KEYS.FLEXIBLE_SPACE}
          className="oo-flexible-space oo-control-bar-flex-space"
        />
      ),

      moreOptions: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS}
          className="oo-more-options"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS}
          ariaHidden
          icon="ellipsis"
          tooltip={CONSTANTS.SKIN_TEXT.MORE_OPTIONS}
          onClick={this.handleMoreOptionsClick}
        />
      ),

      quality: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.QUALITY} className="oo-popover-button-container">
          <ControlButton
            {...commonButtonProps}
            onRef={this.setToggleButtons.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
            style={selectedStyle}
            className={qualityClass}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
            ariaLabel={CONSTANTS.ARIA_LABELS.VIDEO_QUALITY}
            ariaHasPopup
            ariaExpanded={this.props.controller.state.videoQualityOptions.showPopover ? true : null}
            icon="quality"
            tooltip={CONSTANTS.SKIN_TEXT.VIDEO_QUALITY}
            onClick={this.handleMenuToggleClick.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
          />
          {this.props.controller.state.videoQualityOptions.showPopover && (
            <Popover
              autoFocus={this.props.controller.state.videoQualityOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
            >
              <VideoQualityPanel
                {...this.props}
                onClose={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
                isPopover
              />
            </Popover>
          )}
        </div>
      ),

      discovery: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
          className="oo-discovery"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
          ariaHidden
          icon="discovery"
          tooltip={CONSTANTS.SKIN_TEXT.DISCOVER}
          onClick={this.handleDiscoveryClick}
        />
      ),

      closedCaption: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION} className="oo-popover-button-container">
          <ControlButton
            {...commonButtonProps}
            onRef={this.setToggleButtons.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
            style={selectedStyle}
            className={captionClass}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
            ariaLabel={CONSTANTS.ARIA_LABELS.CLOSED_CAPTIONS}
            ariaHasPopup
            ariaExpanded={this.props.controller.state.closedCaptionOptions.showPopover ? true : null}
            icon="cc"
            tooltip={CONSTANTS.SKIN_TEXT.CLOSED_CAPTIONS}
            onClick={this.handleMenuToggleClick.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
          />
          {this.props.controller.state.closedCaptionOptions.showPopover && (
            <Popover
              popoverClassName="oo-popover oo-popover-pull-right"
              autoFocus={this.props.controller.state.closedCaptionOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
            >
              <ClosedCaptionPopover
                {...this.props}
                togglePopoverAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
              />
            </Popover>
          )}
        </div>
      ),

      /**
       * This function returns the chromecast button definition using
       * the provided button from the sdk (agnostic web component)
       * @private
       * @returns {Object} The button definition
       */
      chromecast: (function() {
        return (
          <div
            key={CONSTANTS.CONTROL_BAR_KEYS.CHROMECAST}
            tooltip={CONSTANTS.SKIN_TEXT.CHROMECAST}
            className="oo-cast oo-control-bar-item"
          >
            <google-cast-launcher class="oo-icon" />
          </div>
        );
      }()),

      audioAndCC: function() {
        let closedCaptionsList = [];
        let multiAudioList = [];

        if (
          this.props.controller.state.closedCaptionOptions.availableLanguages
          && this.props.controller.state.closedCaptionOptions.availableLanguages.languages
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
            <ControlButton
              {...commonButtonProps}
              onRef={this.setToggleButtons.bind(this, CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
              style={selectedStyle}
              className={multiAudioClass}
              focusId={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
              ariaLabel={CONSTANTS.ARIA_LABELS.MULTI_AUDIO}
              ariaHasPopup
              ariaExpanded={this.props.controller.state.multiAudioOptions.showPopover ? true : null}
              icon="audioAndCC"
              tooltip={CONSTANTS.SKIN_TEXT.AUDIO}
              onClick={this.handleMultiAudioClick}
            />
            {this.props.controller.state.multiAudioOptions.showPopover
              && (
              <Popover
                popoverClassName="oo-popover oo-popover-pull-right oo-cc-ma-container"
                autoFocus={this.props.controller.state.multiAudioOptions.autoFocus}
                closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
                closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
              >
                <ClosedCaptionMultiAudioMenu
                  language={this.props.language}
                  localizableStrings={this.props.localizableStrings}
                  menuClassName="oo-cc-ma-menu--popover"
                  togglePopoverAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
                  {...this.props}
                />
              </Popover>
              )
            }
          </div>
        );
      }.bind(this)(),

      playbackSpeed: (
        <div
          key={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
          className="oo-popover-button-container"
        >

          <PlaybackSpeedButton
            {...commonButtonProps}
            onRef={this.setToggleButtons.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
            className={playbackSpeedClass}
            style={this.props.controller.state.playbackSpeedOptions.showPopover ? selectedStyle : null}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
            ariaHasPopup
            ariaExpanded={this.props.controller.state.playbackSpeedOptions.showPopover ? true : null}
            tooltip={CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}
            onClick={this.handleMenuToggleClick.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
          />

          {this.props.controller.state.playbackSpeedOptions.showPopover
            && (
            <Popover
              autoFocus={this.props.controller.state.playbackSpeedOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
            >
              <PlaybackSpeedPanel
                isPopover
                language={this.props.language}
                localizableStrings={this.props.localizableStrings}
                controller={this.props.controller}
                skinConfig={this.props.skinConfig}
                onClose={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
              />
            </Popover>
            )
          }

        </div>
      ),

      share: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
          className="oo-share"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
          ariaHidden
          icon="share"
          tooltip={CONSTANTS.SKIN_TEXT.SHARE}
          onClick={this.handleShareClick}
        />
      ),

      stereoscopic: !!(this.vr && this.isPhone) && (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.STEREOSCOPIC}
          className="oo-video-type oo-vr-stereo-button"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.STEREOSCOPIC}
          ariaLabel={stereoAriaLabel}
          icon={stereoIcon}
          onClick={this.handleStereoVrClick}
        />
      ),

      fullscreen: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.FULLSCREEN}
          className="oo-fullscreen"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.FULLSCREEN}
          ariaLabel={fullscreenAriaLabel}
          icon={fullscreenIcon}
          tooltip={
            this.props.controller.state.fullscreen
              ? CONSTANTS.SKIN_TEXT.EXIT_FULL_SCREEN
              : CONSTANTS.SKIN_TEXT.FULL_SCREEN
          }
          onClick={this.handleFullscreenClick}
        />
      ),

      logo: (
        <Logo
          key={CONSTANTS.CONTROL_BAR_KEYS.LOGO}
          imageUrl={this.props.skinConfig.controlBar.logo.imageResource.url}
          clickUrl={this.props.skinConfig.controlBar.logo.clickUrl}
          target={this.props.skinConfig.controlBar.logo.target}
          width={
            this.props.responsiveView !== this.props.skinConfig.responsive.breakpoints.xs.id
              ? this.props.skinConfig.controlBar.logo.width
              : null
          }
          height={this.props.skinConfig.controlBar.logo.height}
        />
      ),

      skipControls: (
        <SkipControls
          key={CONSTANTS.CONTROL_BAR_KEYS.SKIP_CONTROLS}
          buttonConfig={Utils.getPropertyValue(
            this.props.skinConfig,
            'skipControls.controlBarSkipControls',
            {}
          )}
          forceShowButtons
          className="oo-absolute-centered oo-control-bar-item"
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
          onFocus={this.handleFocus}
        />
      ),
    };

    const controlBarItems = [];
    let defaultItems;

    if (this.props.controlBarItems) {
      defaultItems = this.props.controlBarItems;
    } else if (this.props.audioOnly) {
      defaultItems = this.props.skinConfig.buttons.audioOnly;
    } else {
      defaultItems = this.props.controller.state.isPlayingAd
        ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;
    }

    // if mobile and not showing the slider or the icon, extra space can be added to control bar width. If volume bar is shown instead of slider, add some space as well:
    let volumeItem = null;
    let extraSpaceVolume = 0;

    for (let j = 0; j < defaultItems.length; j++) {
      if (defaultItems[j].name === 'volume') {
        volumeItem = defaultItems[j];

        const extraSpaceVolumeSlider = (volumeItem && this.isMobile && !this.props.controller.state.volumeState.volumeSliderVisible)
          || (volumeItem && Utils.isIos())
          ? parseInt(volumeItem.minWidth)
          : 0;
        const extraSpaceVolumeBar = this.isMobile ? 0 : parseInt(volumeItem.minWidth) / 2;
        extraSpaceVolume = extraSpaceVolumeSlider + extraSpaceVolumeBar;

        break;
      }
    }

    // if no hours, add extra space to control bar width:
    const hourInSec = 3600;
    const hours = parseInt(this.props.duration / hourInSec, 10);
    const extraSpaceDuration = hours > 0 ? 0 : 45;

    const controlBarLeftRightPadding = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING * 2;

    for (var k = 0; k < defaultItems.length; k++) {
      // filter out unrecognized button names
      if (typeof controlItemTemplates[defaultItems[k].name] === 'undefined') {
        continue;
      }

      // filter out disabled buttons
      if (defaultItems[k].location === 'none') {
        continue;
      }

      if (
        defaultItems[k].name === CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED
        && (
          this.props.isLiveStream
          || this.props.controller.videoVr
          || this.props.controller.state.isOoyalaAds
        )
      ) {
        continue;
      }

      // do not show share button if not share options are available
      if (defaultItems[k].name === 'share') {
        const shareContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.shareContent', []);
        const socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
        const onlySocialTab = shareContent.length === 1 && shareContent[0] === 'social';
        // skip if no tabs were specified or if only the social tab is present but no social buttons are specified
        if (
          this.props.controller.state.isOoyalaAds
          || !shareContent.length
          || (onlySocialTab && !socialContent.length)
        ) {
          continue;
        }
      }

      const availableLanguages = Utils.getPropertyValue(
        this.props.controller,
        'state.closedCaptionOptions.availableLanguages.languages',
        []
      );

      // do not show CC button if no CC available
      if (
        defaultItems[k].name === CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION
        && (
          !availableLanguages.length
          || this.props.controller.state.isOoyalaAds
        )
      ) {
        continue;
      }

      // do not show quality button if no bitrates available
      if (
        (this.props.controller.state.isOoyalaAds
          || !this.props.controller.state.videoQualityOptions.availableBitrates)
        && defaultItems[k].name === 'quality'
      ) {
        continue;
      }

      // do not show discovery button if no related videos available
      if (
        (this.props.controller.state.isOoyalaAds || !this.props.controller.state.discoveryData)
        && defaultItems[k].name === 'discovery'
      ) {
        continue;
      }

      // do not show logo if no image url available
      if (!this.props.skinConfig.controlBar.logo.imageResource.url && defaultItems[k].name === 'logo') {
        continue;
      }

      if (Utils.isIos() && defaultItems[k].name === 'volume') {
        continue;
      }

      // not sure what to do when there are multi streams
      if (
        defaultItems[k].name === 'live'
        && (typeof this.props.isLiveStream === 'undefined' || !this.props.isLiveStream)
      ) {
        continue;
      }

      if (defaultItems[k].name === 'audioAndCC' && !this.props.controller.state.multiAudio) {
        continue;
      }

      if (defaultItems[k].name === 'chromecast' && !this.props.controller.state.cast.showButton) {
        continue;
      }

      controlBarItems.push(defaultItems[k]);
    }

    const collapsedResult = Utils.collapse(
      this.props.componentWidth
      + this.responsiveUIMultiple * (extraSpaceDuration + extraSpaceVolume - controlBarLeftRightPadding),
      controlBarItems,
      this.responsiveUIMultiple
    );
    const collapsedControlBarItems = collapsedResult.fit || {};
    const collapsedMoreOptionsItems = collapsedResult.overflow || {};
    this.moreOptionsItems = collapsedMoreOptionsItems;

    const finalControlBarItems = [];
    const lastItem = (this.props.controller.state.isOoyalaAds || collapsedMoreOptionsItems.length === 0)
      ? collapsedControlBarItems.length - 2
      : collapsedControlBarItems.length - 1;
    for (var k = 0; k < collapsedControlBarItems.length; k++) {
      if (collapsedControlBarItems[k].name === 'moreOptions'
        && (this.props.controller.state.isOoyalaAds
        || collapsedMoreOptionsItems.length === 0)
      ) {
        continue;
      }
      let alignment = CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      if (k === lastItem) {
        alignment = CONSTANTS.TOOLTIP_ALIGNMENT.RIGHT;
      } else if (k === 0) {
        alignment = CONSTANTS.TOOLTIP_ALIGNMENT.LEFT;
      }
      tooltipAlignments[collapsedControlBarItems[k].name] = alignment;
      const item = controlItemTemplates[collapsedControlBarItems[k].name];
      finalControlBarItems.push(item);
    }

    return finalControlBarItems;
  },

  render() {
    const controlBarClass = ClassNames({
      'oo-control-bar': true,
      'oo-control-bar-hidden': !this.props.controlBarVisible,
      'oo-animating-control-bar': this.props.animatingControlBar,
    });

    const controlBarItems = this.populateControlBar();
    const controlBarStyle = {};

    if (this.props.height) {
      controlBarStyle.height = this.props.height;
    }

    const wrapperClass = ClassNames('oo-control-bar-items-wrapper', {
      'oo-flex-row-parent': this.props.audioOnly,
      'oo-flex-end': this.props.audioOnly && Utils.isIos(),
    });

    return (
      <div
        className={controlBarClass}
        style={controlBarStyle}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onMouseUp={this.handleControlBarMouseUp}
        onTouchEnd={this.handleControlBarMouseUp}
      >
        {!this.props.hideScrubberBar ? <ScrubberBar {...this.props} /> : null}

        <div className={wrapperClass}>
          {controlBarItems}
        </div>
      </div>
    );
  },
});

ControlBar.defaultProps = {
  isLiveStream: false,
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: { id: 'xs' },
        sm: { id: 'sm' },
        md: { id: 'md' },
        lg: { id: 'lg' },
      },
    },
  },
  responsiveView: 'md',
};

ControlBar.propTypes = {
  totalTime: PropTypes.string.isRequired,
  playheadTime: PropTypes.string.isRequired,
  clickToVolumeScreen: PropTypes.bool,
  hideVolumeControls: PropTypes.bool,
  hideScrubberBar: PropTypes.bool,
  audioOnly: PropTypes.bool,
  animatingControlBar: PropTypes.bool,
  controlBarItems: PropTypes.array,
  isLiveStream: PropTypes.bool,
  controlBarVisible: PropTypes.bool,
  playerState: PropTypes.string,
  responsiveView: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
  duration: PropTypes.number,
  currentPlayhead: PropTypes.number,
  componentWidth: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  skinConfig: PropTypes.shape({
    responsive: PropTypes.shape({
      breakpoints: PropTypes.object,
    }),
  }),
  controller: PropTypes.shape({
    state: PropTypes.object,
    videoVrSource: PropTypes.shape({
      vr: PropTypes.object,
    }),
    cancelTimer: PropTypes.func,
    startHideControlBarTimer: PropTypes.func,
    hideVolumeSliderBar: PropTypes.func,
    closePopover: PropTypes.func,
    closeOtherPopovers: PropTypes.func,
    isVrStereo: PropTypes.bool,
  }),
};

module.exports = preserveKeyboardFocus(ControlBar);
