import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import CONSTANTS from '../constants/constants';
import ScrubberBar from './scrubberBar';
import Utils from './utils';
import Popover from '../views/popover';
import ControlButton from './controlButton';
import PlaybackSpeedButton from './playbackSpeedButton';
import VolumeControls from './volumeControls';
import VideoQualityPanel from './videoQualityPanel';
import PlaybackSpeedPanel from './playbackSpeedPanel';
import ClosedCaptionPopover from './closed-caption/closedCaptionPopover';
import ClosedCaptionMultiAudioMenu from './closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu';
import preserveKeyboardFocus from './higher-order/preserveKeyboardFocus';
import Logo from './logo';
import SkipControls from './skipControls';

/**
 * The controlBar Component
 */
class ControlBar extends React.Component {
  constructor(props) {
    super(props);
    this.isMobile = props.controller.state.isMobile;
    this.isPhone = Utils.getUserDevice() === 'phone';
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(props.responsiveView);
    this.moreOptionsItems = null;
    this.vr = null;
    if (
      props.controller
      && props.controller.videoVrSource
      && props.controller.videoVrSource.vr
    ) {
      this.vr = props.controller.videoVrSource.vr;
    }
  }

  componentDidMount() {
    window.addEventListener('orientationchange', this.closeOtherPopovers);
    window.addEventListener('orientationchange', this.setLandscapeScreenOrientation, false);
  }

  componentWillReceiveProps(nextProps) {
    const { responsiveView } = this.props;
    // if responsive breakpoint changes
    if (nextProps.responsiveView !== responsiveView) {
      this.responsiveUIMultiple = this.getResponsiveUIMultiple(nextProps.responsiveView);
    }
  }

  componentWillUnmount() {
    const { controller } = this.props;
    controller.cancelTimer();
    this.closeOtherPopovers();
    if (Utils.isAndroid()) {
      controller.hideVolumeSliderBar();
    }
    window.removeEventListener('orientationchange', this.closeOtherPopovers);
    window.removeEventListener('orientationchange', this.setLandscapeScreenOrientation);
  }

  /**
   * Retrieve multiplier paramter from settings
   * @param {string} responsiveView – the string representing responsive breakpoint
   * @returns {number} the multiplier
   */
  getResponsiveUIMultiple = (responsiveView) => {
    const { skinConfig } = this.props;
    return skinConfig.responsive.breakpoints[responsiveView].multiplier;
  };

  /**
   * Handle mouse up event on control bar
   * @param {Object} event – event
   */
  handleControlBarMouseUp = (event) => {
    const { controller } = this.props;
    if (event.type === 'touchend' || !this.isMobile) {
      event.stopPropagation(); // W3C
      controller.state.accessibilityControlsEnabled = true;
      controller.startHideControlBarTimer();
    }
  };

  /**
   * Handle fullscreen click
   * @param {Object} event – event
   */
  handleFullscreenClick = (event) => {
    // On mobile, we get a following click event that fires after the Video
    // has gone full screen, clicking on a different UI element. So we prevent
    // the following click.
    event.stopPropagation();
    event.cancelBubble = true; // eslint-disable-line
    event.preventDefault();
    const { controller } = this.props;
    if (controller) {
      controller.toggleFullscreen();
      if (this.vr && this.isPhone && controller.isVrStereo) {
        this.toggleStereoVr();
      }
    }
  };

  /**
   * Handle stereoVr click
   * @param {Object} event – event
   */
  handleStereoVrClick = (event) => {
    if (!this.vr) {
      return;
    }
    event.stopPropagation();
    event.cancelBubble = true; // eslint-disable-line
    event.preventDefault();

    this.toggleStereoVr();
    const { controller } = this.props;
    if (!controller) {
      return;
    }
    const fullscreen = controller.state.isFullScreenSupported
      || controller.state.isVideoFullScreenSupported
      ? controller.state.fullscreen
      : controller.state.isFullWindow;

    if (!fullscreen && typeof controller.toggleFullscreen === 'function') {
      controller.toggleFullscreen();
    }

    if (controller.isVrStereo) {
      controller.checkDeviceOrientation = true;
      this.setLandscapeScreenOrientation();
    } else {
      this.unlockScreenOrientation();
    }
  };

  /**
   * @description set landscape orientation if it is possible
   * @private
   */
  setLandscapeScreenOrientation = () => {
    const { controller } = this.props;
    if (controller && controller.checkDeviceOrientation) {
      if (Utils.setLandscapeScreenOrientation) {
        Utils.setLandscapeScreenOrientation();
      }
    }
  };

  /**
   * @description set possibility to use all orientations
   * @private
   */
  unlockScreenOrientation = () => {
    if (screen.orientation && screen.orientation.unlock) { // eslint-disable-line
      screen.orientation.unlock(); // eslint-disable-line
    } else if (screen.unlockOrientation) { // eslint-disable-line
      screen.unlockOrientation(); // eslint-disable-line
    } else if (screen.mozUnlockOrientation) { // eslint-disable-line
      screen.mozUnlockOrientation(); // eslint-disable-line
    } else if (screen.msUnlockOrientation) { // eslint-disable-line
      screen.msUnlockOrientation(); // eslint-disable-line
    }
  };

  toggleStereoVr = () => {
    const { controller } = this.props;
    if (controller && typeof controller.toggleStereoVr === 'function') {
      controller.toggleStereoVr();
    }
  };

  /**
   * Handle click on live button
   * @param {Object} event – event object
   */
  handleLiveClick = (event) => {
    event.stopPropagation();
    event.cancelBubble = true; // eslint-disable-line
    event.preventDefault();
    const { controller, duration } = this.props;
    controller.onLiveClick();
    controller.seek(duration);
  };

  /**
   * Handle click on volume button
   * @param {Object} event – the event object
   */
  handleVolumeIconClick = (event) => {
    const {
      clickToVolumeScreen,
      controller,
    } = this.props;
    if (clickToVolumeScreen) {
      controller.toggleScreen(CONSTANTS.SCREEN.VOLUME_SCREEN, true);
    } else if (this.isMobile) {
      controller.startHideControlBarTimer();
      event.stopPropagation(); // W3C
      if (!controller.state.volumeState.volumeSliderVisible) {
        controller.showVolumeSliderBar();
      } else {
        controller.handleMuteClick();
      }
    } else {
      controller.handleMuteClick();
    }
  };

  handlePlayClick = () => {
    const { controller } = this.props;
    controller.togglePlayPause();
  };

  handleShareClick = () => {
    const { controller } = this.props;
    controller.toggleShareScreen();
  };

  /**
   * Generic toggle logic for menus that display as popover on large screen sizes
   * and as a fullscreen menu on smaller ones.
   * @private
   * @param {String} menuOptionsId A string that identifies the menu options object of the menu we want to toggle
   */
  handleMenuToggleClick = (menuOptionsId) => {
    this.configureMenuAutofocus(menuOptionsId);
    const { controller, responsiveView, skinConfig } = this.props;
    if (controller.state.isMobile
      || responsiveView === skinConfig.responsive.breakpoints.xs.id
    ) {
      const screenToToggle = CONSTANTS.MENU_OPTIONS_SCREENS[menuOptionsId];
      controller.toggleScreen(screenToToggle);
    } else {
      this.togglePopover(menuOptionsId);
      this.closeOtherPopovers(menuOptionsId);
    }
  };

  handleAirPlayClick = () => {
    const { controller } = this.props;
    controller.onAirplayButtonClicked();
  };

  handleMultiAudioClick = () => {
    this.configureMenuAutofocus(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
    const { controller, skinConfig, responsiveView } = this.props;
    if (
      skinConfig.responsive
      && skinConfig.responsive.breakpoints
      && skinConfig.responsive.breakpoints.lg
      && responsiveView === skinConfig.responsive.breakpoints.lg.id
    ) {
      this.togglePopover(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
      this.closeOtherPopovers(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO);
    } else {
      controller.toggleMultiAudioScreen();
    }
  };

  /**
   * Configure the autofocus for menu
   * @param {Array} menu - an array of menu items
   */
  configureMenuAutofocus = (menu) => {
    const { controller } = this.props;
    const menuOptions = controller.state[menu] || {};
    const menuToggleButton = this.getToggleButtons(menu);

    if (menuOptions.showPopover) {
      // Reset autoFocus property when closing the menu
      menuOptions.autoFocus = false;
    } else if (menuToggleButton) {
      // If the menu was activated via keyboard we should
      // autofocus on the first element
      menuOptions.autoFocus = menuToggleButton.wasTriggeredWithKeyboard();
    }
  };

  /**
   * @description It gets value of toggleButtons from controller.js by popoverName
   * @param {string} popoverName - the name of the popover
   * @private
   * @returns {Object} - if toggleButtons (object) has key = popoverName it returns the value,
   * otherwise it returns {}
   */
  getToggleButtons = (popoverName) => {
    const { controller } = this.props;
    if (controller && controller.toggleButtons) {
      return controller.toggleButtons[popoverName];
    }
    return {};
  };

  /**
   * @description It sets this.props.controller.toggleButtons value (menu) for key = popoverName
   * @param {string} popoverName - the name of the popover
   * @param {HTMLElement} menu - an accessible button
   * @private
   */
  setToggleButtons = (popoverName, menu) => {
    const { controller } = this.props;
    if (controller && controller.toggleButtons) {
      controller.toggleButtons[popoverName] = menu;
    }
  };

  /**
   * @description It calls function closePopover from controller.js
   * @param {string} menu - the name of the popover to be closed
   * @param {Object} [params] - params for closePopover function
   * @private
   */
  closePopover = (menu, params) => {
    const { controller } = this.props;
    if (controller && typeof controller.closePopover === 'function') {
      controller.closePopover(menu, params);
    }
  };

  /**
   * @description It calls function closeOtherPopovers from controller.js
   * @param {string} popoverName - the name of the popover that does not need to be closed
   * @private
   */
  closeOtherPopovers = (popoverName) => {
    const { controller } = this.props;
    if (controller && typeof controller.closeOtherPopovers === 'function') {
      controller.closeOtherPopovers(popoverName);
    }
  };

  /**
   * show/hide the popover for specified item
   * @param {String} menu - an array of menu items
   */
  togglePopover = (menu) => {
    const { controller } = this.props;
    const menuOptions = controller.state[menu];
    const menuToggleButton = this.getToggleButtons(menu);
    // Reset button flag that tracks keyboard interaction
    if (
      menuToggleButton
      && menuOptions
      && menuOptions.showPopover
    ) {
      menuToggleButton.wasTriggeredWithKeyboard(false);
    }
    controller.togglePopover(menu);
  };

  handleDiscoveryClick = () => {
    const { controller } = this.props;
    controller.toggleDiscoveryScreen();
  };

  handleMoreOptionsClick = () => {
    const { controller } = this.props;
    controller.toggleMoreOptionsScreen(this.moreOptionsItems);
  };

  /**
   * @description Retrieves configuration from server to be applied to audio skin
   * @returns {Array} list of icons to show on a screen
   */
  getAudioControlsConfig = () => {
    const { skinConfig } = this.props;
    // We receive location param in desktopContent, instead of audioOnly.
    // This is necessary to display or not the button, depending on Backlot settings.
    if (!(skinConfig
      && skinConfig.buttons
      && skinConfig.buttons.audioOnly
      && skinConfig.buttons.audioOnly.desktop
      && Array.isArray(skinConfig.buttons.audioOnly.desktop))
    ) {
      return [];
    }

    const audioOnlyButtonsList = skinConfig.buttons.audioOnly.desktop;
    const { desktopContent } = skinConfig.buttons;
    const defaultConfig = JSON.parse(JSON.stringify(audioOnlyButtonsList));

    desktopContent.forEach((item) => {
      if (item.location !== 'none') {
        return;
      }
      defaultConfig.filter(
        field => field.name === item.name
      ).forEach(
        (field) => {
          field.location = 'none'; // eslint-disable-line
        }
      );
    });
    return defaultConfig;
  };

  /**
   * Build the control bar items
   * @returns {Array} the array of control bar items
   */
  populateControlBar = () => {
    const {
      audioOnly,
      componentWidth,
      controller,
      controlBarItems,
      playerState,
      isLiveStream,
      skinConfig,
      currentPlayhead,
      duration,
      totalTime,
      language,
      localizableStrings,
      responsiveView,
      hideVolumeControls,
      playheadTime,
    } = this.props;
    const playButtonDetails = Utils.getPlayButtonDetails(playerState);
    const playIcon = playButtonDetails.icon;
    const playPauseAriaLabel = playButtonDetails.ariaLabel;
    const playButtonTooltip = playButtonDetails.buttonTooltip;

    const mutedInUi = controller.state.volumeState.muted
      || controller.state.volumeState.volume === 0;
    const volumeIcon = mutedInUi ? 'volumeOff' : 'volume';
    const volumeAriaLabel = mutedInUi ? CONSTANTS.ARIA_LABELS.UNMUTE : CONSTANTS.ARIA_LABELS.MUTE;

    const fullscreenIcon = controller.state.fullscreen ? 'compress' : 'expand';
    const fullscreenAriaLabel = controller.state.fullscreen
      ? CONSTANTS.ARIA_LABELS.EXIT_FULLSCREEN
      : CONSTANTS.ARIA_LABELS.FULLSCREEN;

    let stereoIcon;
    let stereoAriaLabel;
    if (this.vr) {
      stereoIcon = 'stereoOff';
      stereoAriaLabel = CONSTANTS.ARIA_LABELS.STEREO_OFF;
      if (controller && controller.isVrStereo) {
        stereoIcon = 'stereoOn';
        stereoAriaLabel = CONSTANTS.ARIA_LABELS.STEREO_ON;
      }
    }

    const durationSetting = { color: skinConfig.controlBar.iconStyle.inactive.color };
    const timeShift = currentPlayhead - duration;
    // checking timeShift < 1 seconds (not === 0) as processing of the click after
    // we rewinded and then went live may take some time
    const isLiveNow = Math.abs(timeShift) < 1;
    const liveClick = isLiveNow ? null : this.handleLiveClick;
    const totalTimeContent = isLiveStream ? null : <span className="oo-total-time">{totalTime}</span>;

    const liveText = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.LIVE,
      localizableStrings
    );

    const liveClass = ClassNames({
      'oo-control-bar-item oo-live oo-live-indicator': true,
      'oo-live-nonclickable': isLiveNow,
    });

    const qualityClass = ClassNames({
      'oo-quality': true,
      'oo-selected': controller.state.videoQualityOptions.showPopover,
    });

    const captionClass = ClassNames({
      'oo-closed-caption': true,
      'oo-selected': controller.state.closedCaptionOptions.showPopover,
    });

    const playbackSpeedClass = ClassNames({
      'oo-selected': controller.state.playbackSpeedOptions.showPopover,
    });

    const multiAudioClass = ClassNames({
      'oo-multiaudio': true,
      'oo-selected': controller.state.multiAudioOptions.showPopover,
    });

    const selectedStyle = { color: skinConfig.general.accentColor || null };

    const moreOptionsStyle = { position: 'relative', textAlign: 'right' };

    // Map of tooltip aligments, which vary depending of the button's order within
    // the control bar. This is populated below.
    const tooltipAlignments = {};
    // Props that need to be passed to all control bar buttons
    const commonButtonProps = {
      language,
      localizableStrings,
      responsiveView,
      skinConfig,
      controller,
      getTooltipAlignment: key => tooltipAlignments[key] || CONSTANTS.TOOLTIP_ALIGNMENT.CENTER,
    };

    const closedCaptionsList = controller.state.closedCaptionOptions.availableLanguages
    && controller.state.closedCaptionOptions.availableLanguages.languages
      ? controller.state.closedCaptionOptions.availableLanguages.languages
      : [];
    const multiAudioList = controller.state.multiAudio && controller.state.multiAudio.tracks
      ? controller.state.multiAudio.tracks
      : [];

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
          role="radio"
        />
      ),

      live: (
        <a // eslint-disable-line
          key={CONSTANTS.CONTROL_BAR_KEYS.LIVE}
          className={liveClass}
          ref="LiveButton" // eslint-disable-line
          onClick={liveClick}
        >
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
            role="radio"
          />
          {!hideVolumeControls && <VolumeControls {...this.props} />}
        </div>
      ),

      timeDuration: (
        <a // eslint-disable-line
          key={CONSTANTS.CONTROL_BAR_KEYS.TIME_DURATION}
          className="oo-time-duration oo-control-bar-duration"
          style={durationSetting}
        >
          <span>{playheadTime}</span>
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
        <div key={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS} className="oo-control-bar-item">
          <ControlButton
            {...commonButtonProps}
            key={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS}
            className="oo-more-options"
            style={moreOptionsStyle}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.MORE_OPTIONS}
            ariaHidden={true} // eslint-disable-line
            icon="ellipsis"
            tooltip={CONSTANTS.SKIN_TEXT.MORE_OPTIONS}
            onClick={this.handleMoreOptionsClick}
          />
        </div>
      ),


      quality: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.QUALITY} className="oo-popover-button-container">
          <ControlButton
            {...commonButtonProps}
            onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY, menu)}
            style={selectedStyle}
            className={qualityClass}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
            ariaLabel={CONSTANTS.ARIA_LABELS.VIDEO_QUALITY}
            ariaHasPopup
            ariaExpanded={controller.state.videoQualityOptions.showPopover ? true : null}
            icon="quality"
            tooltip={CONSTANTS.SKIN_TEXT.VIDEO_QUALITY}
            onClick={() => this.handleMenuToggleClick(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
          />
          {controller.state.videoQualityOptions.showPopover && (
            <Popover
              autoFocus={controller.state.videoQualityOptions.autoFocus}
              closeActionEnabled={controller.state.accessibilityControlsEnabled}
              closeAction={() => this.closePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
            >
              <VideoQualityPanel
                {...this.props}
                onClose={() => this.closePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY)}
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
          ariaHidden={true} // eslint-disable-line
          icon="discovery"
          tooltip={CONSTANTS.SKIN_TEXT.DISCOVER}
          onClick={this.handleDiscoveryClick}
        />
      ),

      closedCaption: (
        <div key={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION} className="oo-popover-button-container">
          <ControlButton
            {...commonButtonProps}
            onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS, menu)}
            style={selectedStyle}
            className={captionClass}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
            ariaLabel={CONSTANTS.ARIA_LABELS.CLOSED_CAPTIONS}
            ariaHasPopup
            ariaExpanded={controller.state.closedCaptionOptions.showPopover ? true : null}
            icon="cc"
            tooltip={CONSTANTS.SKIN_TEXT.CLOSED_CAPTIONS}
            onClick={() => this.handleMenuToggleClick(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
          />
          {controller.state.closedCaptionOptions.showPopover && (
            <Popover
              popoverClassName="oo-popover oo-popover-pull-right"
              autoFocus={controller.state.closedCaptionOptions.autoFocus}
              closeActionEnabled={controller.state.accessibilityControlsEnabled}
              closeAction={() => this.closePopover(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
            >
              <ClosedCaptionPopover
                {...this.props}
                togglePopoverAction={() => this.closePopover(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS)}
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
      chromecast: (
        <div
          key={CONSTANTS.CONTROL_BAR_KEYS.CHROMECAST}
          tooltip={CONSTANTS.SKIN_TEXT.CHROMECAST}
          className="oo-cast oo-control-bar-item"
        >
          <google-cast-launcher class="oo-icon" />
        </div>
      ),

      airPlay: (
        <ControlButton
          {...commonButtonProps}
          key={CONSTANTS.CONTROL_BAR_KEYS.AIRPLAY}
          className="oo-airplay"
          focusId={CONSTANTS.CONTROL_BAR_KEYS.AIRPLAY}
          ariaLabel={CONSTANTS.ARIA_LABELS.AIRPLAY}
          icon={controller.state.airplay && controller.state.airplay.statusIcon}
          tooltip={CONSTANTS.SKIN_TEXT.AIRPLAY}
          onClick={this.handleAirPlayClick}
        />
      ),

      audioAndCC: closedCaptionsList.length === 0 && multiAudioList.length === 0
        ? null
        : (
          <div key={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC} className="oo-popover-button-container">
            <ControlButton
              {...commonButtonProps}
              onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO, menu)}
              style={selectedStyle}
              className={multiAudioClass}
              focusId={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
              ariaLabel={CONSTANTS.ARIA_LABELS.MULTI_AUDIO}
              ariaHasPopup
              ariaExpanded={controller.state.multiAudioOptions.showPopover ? true : null}
              icon="audioAndCC"
              tooltip={CONSTANTS.SKIN_TEXT.AUDIO}
              onClick={this.handleMultiAudioClick}
            />
            {controller.state.multiAudioOptions.showPopover
              && (
              <Popover
                popoverClassName="oo-popover oo-popover-pull-right oo-cc-ma-container"
                autoFocus={controller.state.multiAudioOptions.autoFocus}
                closeActionEnabled={controller.state.accessibilityControlsEnabled}
                closeAction={() => this.closePopover(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
              >
                <ClosedCaptionMultiAudioMenu
                  language={language}
                  localizableStrings={localizableStrings}
                  menuClassName="oo-cc-ma-menu--popover"
                  togglePopoverAction={() => this.closePopover(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO)}
                  {...this.props}
                />
              </Popover>
              )
            }
          </div>
        ),

      playbackSpeed: (
        <div
          key={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
          className="oo-popover-button-container"
        >

          <PlaybackSpeedButton
            {...commonButtonProps}
            onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED, menu)}
            className={playbackSpeedClass}
            style={controller.state.playbackSpeedOptions.showPopover ? selectedStyle : null}
            focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
            ariaHasPopup={true} // eslint-disable-line
            ariaExpanded={controller.state.playbackSpeedOptions.showPopover ? true : null}
            tooltip={CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}
            onClick={() => this.handleMenuToggleClick(CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
          />

          {controller.state.playbackSpeedOptions.showPopover
            && (
            <Popover
              autoFocus={controller.state.playbackSpeedOptions.autoFocus}
              closeActionEnabled={controller.state.accessibilityControlsEnabled}
              closeAction={() => this.closePopover(CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
            >
              <PlaybackSpeedPanel
                isPopover
                language={language}
                localizableStrings={localizableStrings}
                controller={controller}
                skinConfig={skinConfig}
                onClose={() => this.closePopover(CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED)}
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
            controller.state.fullscreen
              ? CONSTANTS.SKIN_TEXT.EXIT_FULL_SCREEN
              : CONSTANTS.SKIN_TEXT.FULL_SCREEN
          }
          onClick={this.handleFullscreenClick}
        />
      ),

      logo: (
        <Logo
          key={CONSTANTS.CONTROL_BAR_KEYS.LOGO}
          imageUrl={skinConfig.controlBar.logo.imageResource.url}
          clickUrl={skinConfig.controlBar.logo.clickUrl}
          target={skinConfig.controlBar.logo.target}
          width={
            responsiveView !== skinConfig.responsive.breakpoints.xs.id
              ? skinConfig.controlBar.logo.width
              : null
          }
          height={skinConfig.controlBar.logo.height}
        />
      ),

      skipControls: (
        <SkipControls
          key={CONSTANTS.CONTROL_BAR_KEYS.SKIP_CONTROLS}
          buttonConfig={Utils.getPropertyValue(
            skinConfig,
            'skipControls.controlBarSkipControls',
            {}
          )}
          forceShowButtons
          className="oo-absolute-centered oo-control-bar-item"
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
          onFocus={this.handleFocus}
        />
      ),
    };

    let defaultItems;
    if (controlBarItems && controlBarItems.length) {
      defaultItems = controlBarItems;
    } else if (audioOnly) {
      defaultItems = skinConfig.buttons.audioOnly ? skinConfig.buttons.audioOnly.desktop : [];
    } else {
      defaultItems = controller.state.isPlayingAd
        ? skinConfig.buttons.desktopAd : skinConfig.buttons.desktopContent;
    }

    // if mobile and not showing the slider or the icon, extra space can be added to control bar width. If volume bar is shown instead of slider, add some space as well:
    const volumeItem = defaultItems.find(item => item.name === 'volume');
    let extraSpaceVolume = 0;
    if (volumeItem) {
      const extraSpaceVolumeSlider = (this.isMobile && !controller.state.volumeState.volumeSliderVisible)
        || (volumeItem && Utils.isIos())
        ? +volumeItem.minWidth
        : 0;
      const extraSpaceVolumeBar = this.isMobile ? 0 : +volumeItem.minWidth / 2; // eslint-disable-line
      extraSpaceVolume = extraSpaceVolumeSlider + extraSpaceVolumeBar;
    }

    // if no hours, add extra space to control bar width:
    const hourInSec = 3600;
    const hours = parseInt(duration / hourInSec, 10);
    const extraSpaceDuration = hours > 0 ? 0 : 45; // eslint-disable-line

    const controlBarLeftRightPadding = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING * 2; // eslint-disable-line

    const defaultControlBarItems = defaultItems.filter((item) => {
      const shareContent = Utils.getPropertyValue(skinConfig, 'shareScreen.shareContent', []);
      const socialContent = Utils.getPropertyValue(skinConfig, 'shareScreen.socialContent', []);
      const onlySocialTab = shareContent.length === 1 && shareContent[0] === 'social';
      const availableLanguages = Utils.getPropertyValue(
        controller,
        'state.closedCaptionOptions.availableLanguages.languages',
        []
      );
      // filter out unrecognized button names
      return typeof controlItemTemplates[item.name] !== 'undefined'
        // filter out disabled buttons
        && item.location !== 'none'
        // filter out speed controls for live, ads and VR
        && (
          item.name !== CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED
          || (
            !isLiveStream
            && !controller.videoVr
            && !controller.state.isOoyalaAds
          )
        )
        // do not show share button if not share options are available
        && (
          item.name !== 'share'
          || (
            !controller.state.isOoyalaAds
            && shareContent.length
            && (!onlySocialTab || socialContent.length)
          )
        )
        // do not show CC button if no CC available
        && (
          item.name !== CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION
          || (
            availableLanguages.length
            && !controller.state.isOoyalaAds
          )
        )
        // do not show quality button if no bitrates available
        && (
          item.name !== 'quality'
          || (!controller.state.isOoyalaAds
            && controller.state.videoQualityOptions.availableBitrates)
        )
        // do not show discovery button if no related videos available
        && (
          item.name !== 'discovery'
          || (!controller.state.isOoyalaAds
            && controller.state.metadata
            && controller.state.metadata.modules
            && controller.state.metadata.modules['discovery-ui']
            && controller.state.discoveryData)
        )
        // do not show logo if no image url available
        && (
          item.name !== 'logo'
          || skinConfig.controlBar.logo.imageResource.url
        )
        && (
          item.name !== 'volume' || !Utils.isIos()
        )
        // not sure what to do when there are multi streams
        && (
          item.name !== 'live'
          || (typeof isLiveStream !== 'undefined' && isLiveStream)
        )
        && (
          item.name !== 'audioAndCC'
          || controller.state.multiAudio
        )
        && (
          item.name !== 'chromecast'
          || controller.state.cast.showButton
        )
        && (
          item.name !== 'airPlay'
          || (controller.state.airplay && controller.state.airplay.available)
        );
    });

    const collapsedResult = Utils.collapse(
      componentWidth
      + this.responsiveUIMultiple * (extraSpaceDuration + extraSpaceVolume - controlBarLeftRightPadding),
      defaultControlBarItems,
      this.responsiveUIMultiple
    );
    const collapsedControlBarItems = collapsedResult.fit || {};
    const collapsedMoreOptionsItems = collapsedResult.overflow || {};
    this.moreOptionsItems = collapsedMoreOptionsItems;

    const finalControlBarItems = [];
    const lastItem = (controller.state.isOoyalaAds || collapsedMoreOptionsItems.length === 0)
      ? collapsedControlBarItems.length - 2 // eslint-disable-line
      : collapsedControlBarItems.length - 1;
    for (let index = 0; index < collapsedControlBarItems.length; index += 1) {
      if (collapsedControlBarItems[index].name === 'moreOptions'
        && (controller.state.isOoyalaAds
        || collapsedMoreOptionsItems.length === 0)
      ) {
        continue; // eslint-disable-line
      }
      let alignment = CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      if (index === lastItem) {
        alignment = CONSTANTS.TOOLTIP_ALIGNMENT.RIGHT;
      } else if (index === 0) {
        alignment = CONSTANTS.TOOLTIP_ALIGNMENT.LEFT;
      }
      tooltipAlignments[collapsedControlBarItems[index].name] = alignment;
      const item = controlItemTemplates[collapsedControlBarItems[index].name];
      finalControlBarItems.push(item);
    }

    return finalControlBarItems;
  };

  render() {
    const {
      audioOnly,
      controlBarVisible,
      animatingControlBar,
      height,
      onFocus,
      onBlur,
      hideScrubberBar,
      skinConfig,
    } = this.props;

    if (
      !(skinConfig
        && skinConfig.controlBar
        && skinConfig.controlBar.enabled)
    ) {
      return null;
    }

    const controlBarClass = ClassNames({
      'oo-control-bar': true,
      'oo-control-bar-hidden': !controlBarVisible,
      'oo-animating-control-bar': animatingControlBar,
    });

    const controlBarItems = this.populateControlBar();
    const controlBarStyle = {};

    if (height) {
      controlBarStyle.height = height;
    }

    const wrapperClass = ClassNames('oo-control-bar-items-wrapper', {
      'oo-flex-row-parent': audioOnly,
      'oo-flex-end': audioOnly && Utils.isIos(),
    });

    return (
      <div
        className={controlBarClass}
        style={controlBarStyle}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseUp={this.handleControlBarMouseUp}
        onTouchEnd={this.handleControlBarMouseUp}
        role="presentation"
      >
        {!hideScrubberBar ? <ScrubberBar {...this.props} /> : null}

        <div className={wrapperClass}>
          {controlBarItems}
        </div>
      </div>
    );
  }
}

ControlBar.propTypes = {
  totalTime: PropTypes.string.isRequired,
  playheadTime: PropTypes.string.isRequired,
  clickToVolumeScreen: PropTypes.bool,
  hideVolumeControls: PropTypes.bool,
  hideScrubberBar: PropTypes.bool,
  audioOnly: PropTypes.bool,
  animatingControlBar: PropTypes.bool,
  controlBarItems: PropTypes.arrayOf(PropTypes.shape({})),
  isLiveStream: PropTypes.bool,
  controlBarVisible: PropTypes.bool,
  playerState: PropTypes.string,
  responsiveView: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  duration: PropTypes.number,
  currentPlayhead: PropTypes.number,
  componentWidth: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  skinConfig: PropTypes.shape({
    responsive: PropTypes.shape({
      breakpoints: PropTypes.shape({}),
    }),
  }),
  controller: PropTypes.shape({
    state: PropTypes.shape({}),
    videoVrSource: PropTypes.shape({
      vr: PropTypes.shape({}),
    }),
    cancelTimer: PropTypes.func,
    startHideControlBarTimer: PropTypes.func,
    hideVolumeSliderBar: PropTypes.func,
    closePopover: PropTypes.func,
    closeOtherPopovers: PropTypes.func,
    isVrStereo: PropTypes.bool,
  }),
};

ControlBar.defaultProps = {
  clickToVolumeScreen: false,
  hideVolumeControls: false,
  hideScrubberBar: false,
  audioOnly: false,
  animatingControlBar: true,
  controlBarItems: [],
  isLiveStream: false,
  controlBarVisible: true,
  playerState: '',
  responsiveView: 'md',
  language: 'en',
  localizableStrings: {},
  duration: 0,
  currentPlayhead: 0,
  componentWidth: 500,
  onFocus: () => {},
  onBlur: () => {},
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
  controller: {
    state: {},
    videoVrSource: {
      vr: {},
    },
    cancelTimer: () => {},
    startHideControlBarTimer: () => {},
    hideVolumeSliderBar: () => {},
    closePopover: () => {},
    closeOtherPopovers: () => {},
    isVrStereo: () => {},
    togglePopover: () => {},
  },
};

module.exports = preserveKeyboardFocus(ControlBar);
