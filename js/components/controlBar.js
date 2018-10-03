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
    ControlButton = require('./controlButton'),
    PlaybackSpeedButton = require('./playbackSpeedButton'),
    VolumeControls = require('./volumeControls'),
    VideoQualityPanel = require('./videoQualityPanel'),
    PlaybackSpeedPanel = require('./playbackSpeedPanel'),
    ClosedCaptionPopover = require('./closed-caption/closedCaptionPopover'),
    ClosedCaptionMultiAudioMenu = require('./closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu'),
    preserveKeyboardFocus = require('./higher-order/preserveKeyboardFocus'),
    Logo = require('./logo'),
    Icon = require('./icon'),
    Tooltip = require('./tooltip');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

const MACROS = require('../constants/macros');
const SkipControls = require('../components/skipControls');

var ControlBar = createReactClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.isPhone = Utils.getUserDevice() === 'phone';
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
  },

  getResponsiveUIMultiple: function(responsiveView) {
    var multiplier = this.props.skinConfig.responsive.breakpoints[responsiveView].multiplier;
    return multiplier;
  },

  handleControlBarMouseUp: function(evt) {
    if (evt.type === 'touchend' || !this.isMobile) {
      evt.stopPropagation(); // W3C
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
      if (this.vr && this.isPhone && this.props.controller.isVrStereo) {
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
    if (this.props.clickToVolumeScreen) {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.VOLUME_SCREEN, true);
    } else {
      if (this.isMobile) {
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
    }
  },

  handlePlayClick: function() {
    this.props.controller.togglePlayPause();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  /**
   * Generic toggle logic for menus that display as popover on large screen sizes
   * and as a fullscreen menu on smaller ones.
   * @private
   * @param {String} menuOptionsId A string that identifies the menu options object of the menu we want to toggle
   */
  handleMenuToggleClick: function(menuOptionsId) {
    this.configureMenuAutofocus(menuOptionsId);

    if (
      this.props.controller.state.isMobile ||
      this.props.responsiveView === this.props.skinConfig.responsive.breakpoints.xs.id
    ) {
      var screenToToggle = CONSTANTS.MENU_OPTIONS_SCREENS[menuOptionsId];
      this.props.controller.toggleScreen(screenToToggle);
    } else {
      this.togglePopover(menuOptionsId);
      this.closeOtherPopovers(menuOptionsId);
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

  populateControlBar: function() {
    var playButtonDetails = Utils.getPlayButtonDetails(this.props.playerState);
    var playIcon = playButtonDetails.icon;
    var playPauseAriaLabel = playButtonDetails.ariaLabel;
    var playButtonTooltip = playButtonDetails.buttonTooltip;

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

    // TODO - Replace time display logic with Utils.getTimeDisplayValues()
    var isLiveStream = this.props.isLiveStream;
    var durationSetting = { color: this.props.skinConfig.controlBar.iconStyle.inactive.color };
    var timeShift = this.props.currentPlayhead - this.props.duration;
    // checking timeShift < 1 seconds (not === 0) as processing of the click after we rewinded and then went live may take some time
    var isLiveNow = Math.abs(timeShift) < 1;
    var liveClick = isLiveNow ? null : this.handleLiveClick;
    var totalTimeContent = isLiveStream ? null : <span className="oo-total-time">{this.props.totalTime}</span>;

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
      'oo-selected': this.props.controller.state.videoQualityOptions.showPopover
    });

    var captionClass = ClassNames({
      'oo-closed-caption': true,
      'oo-selected': this.props.controller.state.closedCaptionOptions.showPopover
    });

    var playbackSpeedClass = ClassNames({
      'oo-selected': this.props.controller.state.playbackSpeedOptions.showPopover
    });

    var multiAudioClass = ClassNames({
      'oo-multiaudio': true,
      'oo-selected': this.props.controller.state.multiAudioOptions.showPopover
    });

    var selectedStyle = {};
    selectedStyle['color'] = this.props.skinConfig.general.accentColor ?
      this.props.skinConfig.general.accentColor
      :
      null;

    // Map of tooltip aligments, which vary depending of the button's order within
    // the control bar. This is populated below.
    var tooltipAlignments = {};
    // Props that need to be passed to all control bar buttons
    var commonButtonProps = {
      language: this.props.language,
      localizableStrings: this.props.localizableStrings,
      responsiveView: this.props.responsiveView,
      skinConfig: this.props.skinConfig,
      controller: this.props.controller,
      getTooltipAlignment: function(key) {
        return tooltipAlignments[key] || CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      }
    };

    var controlItemTemplates = {
      playPause: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
          className="oo-play-pause"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
          ariaLabel={playPauseAriaLabel}
          icon={playIcon}
          tooltip={playButtonTooltip}
          onClick={this.handlePlayClick}>
        </ControlButton>
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
            onClick={this.handleVolumeIconClick}>
          </ControlButton>
          {!this.props.hideVolumeControls && <VolumeControls {...this.props} />}
        </div>
      ),

      timeDuration: (
        <a
          key={CONSTANTS.CONTROL_BAR_KEYS.TIME_DURATION}
          className="oo-time-duration oo-control-bar-duration"
          style={durationSetting}>
          <span>{this.props.playheadTime}</span>{totalTimeContent}
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
          ariaHidden={true}
          icon="ellipsis"
          tooltip={CONSTANTS.SKIN_TEXT.MORE_OPTIONS}
          onClick={this.handleMoreOptionsClick}>
        </ControlButton>
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
            ariaHasPopup={true}
            ariaExpanded={this.props.controller.state.videoQualityOptions.showPopover ? true : null}
            icon="quality"
            tooltip={CONSTANTS.SKIN_TEXT.VIDEO_QUALITY}
            onClick={this.handleMenuToggleClick.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}>
          </ControlButton>
          {this.props.controller.state.videoQualityOptions.showPopover && (
            <Popover
              autoFocus={this.props.controller.state.videoQualityOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}>
              <VideoQualityPanel
                {...this.props}
                onClose={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
                isPopover={true} />
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
          ariaHidden={true}
          icon="discovery"
          tooltip={CONSTANTS.SKIN_TEXT.DISCOVER}
          onClick={this.handleDiscoveryClick}>
        </ControlButton>
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
            ariaHasPopup={true}
            ariaExpanded={this.props.controller.state.closedCaptionOptions.showPopover ? true : null}
            icon="cc"
            tooltip={CONSTANTS.SKIN_TEXT.CLOSED_CAPTIONS}
            onClick={this.handleMenuToggleClick.bind(this, CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}>
          </ControlButton>
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

      /**
       * This function returns the chromecast button definition using
       * the provided button from the sdk (agnostic web component) 
       * @private
       * @return {Object} The button definition
       */
      chromecast: function() {
        return (
          <div 
            key={CONSTANTS.CONTROL_BAR_KEYS.CHROMECAST}
            tooltip={CONSTANTS.SKIN_TEXT.CHROMECAST}
            className="oo-cast oo-control-bar-item">
              <google-cast-launcher class="oo-icon"/>
          </div>
        )
      }.bind(this)(),

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
            <ControlButton
              {...commonButtonProps}
              onRef={this.setToggleButtons.bind(this, CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
              style={selectedStyle}
              className={multiAudioClass}
              focusId={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
              ariaLabel={CONSTANTS.ARIA_LABELS.MULTI_AUDIO}
              ariaHasPopup={true}
              ariaExpanded={this.props.controller.state.multiAudioOptions.showPopover ? true : null}
              icon="audioAndCC"
              tooltip={CONSTANTS.SKIN_TEXT.AUDIO}
              onClick={this.handleMultiAudioClick}>
            </ControlButton>
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

      playbackSpeed: (
        <div
          key={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
          className="oo-popover-button-container">

          <PlaybackSpeedButton
            {...commonButtonProps}
            onRef={this.setToggleButtons.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
            className={playbackSpeedClass}
            style={this.props.controller.state.playbackSpeedOptions.showPopover ? selectedStyle : null}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
            ariaHasPopup={true}
            ariaExpanded={this.props.controller.state.playbackSpeedOptions.showPopover ? true : null}
            tooltip={CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}
            onClick={this.handleMenuToggleClick.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}>
          </PlaybackSpeedButton>

          {this.props.controller.state.playbackSpeedOptions.showPopover &&
            <Popover
              autoFocus={this.props.controller.state.playbackSpeedOptions.autoFocus}
              closeActionEnabled={this.props.controller.state.accessibilityControlsEnabled}
              closeAction={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}>
              <PlaybackSpeedPanel
                isPopover={true}
                language={this.props.language}
                localizableStrings={this.props.localizableStrings}
                controller={this.props.controller}
                skinConfig={this.props.skinConfig}
                onClose={this.closePopover.bind(this, CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}/>
            </Popover>
          }

        </div>
      ),

      share: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
          className="oo-share"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
          ariaHidden={true}
          icon="share"
          tooltip={CONSTANTS.SKIN_TEXT.SHARE}
          onClick={this.handleShareClick}>
        </ControlButton>
      ),

      stereoscopic: !!(this.vr && this.isPhone) && (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.STEREOSCOPIC}
          className="oo-video-type oo-vr-stereo-button"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.STEREOSCOPIC}
          ariaLabel={stereoAriaLabel}
          icon={stereoIcon}
          onClick={this.handleStereoVrClick}>
        </ControlButton>
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
            this.props.controller.state.fullscreen ?
              CONSTANTS.SKIN_TEXT.EXIT_FULL_SCREEN
            :
              CONSTANTS.SKIN_TEXT.FULL_SCREEN
          }
          onClick={this.handleFullscreenClick}>
        </ControlButton>
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
      ),

      skipControls: (
        <SkipControls
          key={CONSTANTS.CONTROL_BAR_KEYS.SKIP_CONTROLS}
          buttonConfig={Utils.getPropertyValue(
            this.props.skinConfig,
            'skipControls.controlBarSkipControls',
            {}
          )}
          forceShowButtons={true}
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
          onFocus={this.handleFocus} />
      )
    };

    var controlBarItems = [];
    var defaultItems;

    if (this.props.controlBarItems) {
      defaultItems = this.props.controlBarItems;
    } else if (this.props.audioOnly) {
      defaultItems = this.props.skinConfig.buttons.audioOnly;
    } else {
      defaultItems = this.props.controller.state.isPlayingAd ?
        this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;
    }

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

      if (
        defaultItems[k].name === CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED &&
        (
          this.props.isLiveStream ||
          this.props.controller.videoVr ||
          this.props.controller.state.isOoyalaAds
        )
      ) {
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

      var availableLanguages = Utils.getPropertyValue(
        this.props.controller,
        'state.closedCaptionOptions.availableLanguages.languages',
        []
      );

      // do not show CC button if no CC available
      if (
        defaultItems[k].name === CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION &&
        (
          !availableLanguages.length ||
          this.props.controller.state.isOoyalaAds
        )
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

      if (Utils.isIos() && defaultItems[k].name === 'volume') {
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

      if (defaultItems[k].name === 'chromecast' && !this.props.controller.state.enableChromecast) {
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
    var collapsedControlBarItems = collapsedResult.fit || {};
    var collapsedMoreOptionsItems = collapsedResult.overflow || {};
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
      var item = controlItemTemplates[collapsedControlBarItems[k].name];
      finalControlBarItems.push(item);
    }

    return finalControlBarItems;
  },

  render: function() {
    var controlBarClass = ClassNames({
      'oo-control-bar': true,
      'oo-control-bar-hidden': !this.props.controlBarVisible,
      'oo-animating-control-bar': this.props.animatingControlBar
    });

    var controlBarItems = this.populateControlBar();
    var controlBarStyle = {};

    if (this.props.height) {
      controlBarStyle.height = this.props.height;
    }

    var wrapperClass = ClassNames('oo-control-bar-items-wrapper', {
      'oo-flex-row-parent': this.props.audioOnly
    });

    return (
      <div
        className={controlBarClass}
        style={controlBarStyle}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        onMouseUp={this.handleControlBarMouseUp}
        onTouchEnd={this.handleControlBarMouseUp}>
        {!this.props.hideScrubberBar ? <ScrubberBar {...this.props} /> : null}

        <div className={wrapperClass}>
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

module.exports = preserveKeyboardFocus(ControlBar);
