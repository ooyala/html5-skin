import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ControlButton from './controlButton';
import HoldControlButton from './holdControlButton';
import preserveKeyboardFocus from './higher-order/preserveKeyboardFocus';
import CONSTANTS from '../constants/constants';
import MACROS from '../constants/macros';
import Utils from './utils';

/**
 * The implemenation of controls to skip asset
 */
class SkipControls extends React.Component {
  constructor(props) {
    super(props);
    this.storeRef = this.storeRef.bind(this);
    this.onPreviousVideo = this.onPreviousVideo.bind(this);
    this.onNextVideo = this.onNextVideo.bind(this);
    this.onSkipBackward = this.onSkipBackward.bind(this);
    this.onSkipForward = this.onSkipForward.bind(this);
    this.isAtVideoEdge = this.isAtVideoEdge.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onPlayPauseClick = this.onPlayPauseClick.bind(this);
  }

  /**
   * Fired when the component is mounted. Notifies its parent about it's position
   * and dimensions (client rect).
   * @private
   */
  componentDidMount() {
    const { onMount } = this.props;
    if (this.domElement && typeof onMount === 'function') {
      const clientRect = this.domElement.getBoundingClientRect();
      onMount(clientRect);
    }
  }

  /**
   * Previous Video button click handler.
   * @private
   */
  onPreviousVideo() {
    const { controller } = this.props;
    if (typeof controller.rewindOrRequestPreviousVideo === 'function') {
      controller.rewindOrRequestPreviousVideo();
    }
  }

  /**
   * Next Video button click handler.
   * @private
   */
  onNextVideo() {
    const { controller } = this.props;
    if (typeof controller.requestNextVideo === 'function') {
      controller.requestNextVideo();
    }
  }

  /**
   * Skip Backward button click handler.
   * @private
   */
  onSkipBackward() {
    const { a11yControls, skinConfig } = this.props;
    if (typeof a11yControls.seekBy === 'function') {
      const skipTimes = Utils.getSkipTimes(skinConfig);
      a11yControls.seekBy(skipTimes.backward, false, true);
    }
  }

  /**
   * Skip Forward button click handler.
   * @private
   */
  onSkipForward() {
    const { a11yControls, skinConfig } = this.props;
    if (typeof a11yControls.seekBy === 'function') {
      const skipTimes = Utils.getSkipTimes(skinConfig);
      a11yControls.seekBy(skipTimes.forward, true, true);
    }
  }

  /**
   * Handles the mouseenter event. Given that the SkipControls have pointer-events
   * set to 'none' in order to allow clicking through them, this event is only fired
   * when the mouse is over a button. Whenever this happens we cancel the auto-hide
   * controls timer.
   * @private
   */
  onMouseEnter() {
    const { controller } = this.props;
    controller.cancelTimer();
  }

  /**
   * Play/Pause button click handler.
   * @private
   */
  onPlayPauseClick() {
    const { controller } = this.props;
    controller.togglePlayPause();
  }

  /**
   * Parses the skin.json's skip button configuration and returns the ids (button
   * names from the skin config) of the enabled buttons sorted by index in ascending order.
   * @private
   * @returns {array} An array of button objects. Each object contains the id and index
   * of the button.
   */
  getSortedButtonEntries() {
    const { buttonConfig, skinConfig } = this.props;
    const buttons = buttonConfig || Utils.getPropertyValue(
      skinConfig,
      'skipControls.buttons',
      {}
    );
    // Find the ids and indexes of all enabled buttons
    const sorted = Object.keys(buttons).filter(
      buttonId => this.shouldDisplayButton(buttonId, buttons[buttonId])
    ).map(
      buttonId => ({ id: buttonId, index: buttons[buttonId].index })
    ).sort(
      (current, next) => current.index - next.index
    );
    return sorted;
  }

  /**
   * Gets a map which contains templates for each of the available buttons in
   * this component.
   * @private
   * @returns {object} An object whose keys are the ids of the skip buttons (as
   * defined in the skin.json) and whose values are the button components that
   * match each id.
   */
  getButtonTemplate() {
    const buttonTemplate = {};
    const buttonStyle = {};
    const {
      config,
      controller,
      isInactive,
      skinConfig,
    } = this.props;
    const skipTimes = Utils.getSkipTimes(skinConfig);

    const skipBackwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_BACKWARD.replace(
      MACROS.SECONDS,
      skipTimes.backward
    );
    const skipForwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_FORWARD.replace(
      MACROS.SECONDS,
      skipTimes.forward
    );
    // Note that the button elements are still in the DOM even when the controls
    // are hidden. When controls are inactive we disable pointer events so that
    // the user won't accidentally trigger a button when bringing up the controls
    // on touch devices.
    if (isInactive) {
      buttonStyle.pointerEvents = 'none';
    }

    const playButtonDetails = Utils.getPlayButtonDetails(controller.state.playerState);
    const duration = Utils.getPropertyValue(controller, 'state.duration');

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO] = (
      <ControlButton
        {...this.props}
        key={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        style={buttonStyle}
        className="oo-previous-video"
        icon="previous"
        ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_VIDEO}
        disabled={!config.hasPreviousVideos}
        onClick={this.onPreviousVideo}
      />
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD] = (
      <HoldControlButton
        {...this.props}
        key={CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD}
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD}
        style={buttonStyle}
        className="oo-center-button oo-skip-backward"
        icon="replay"
        ariaLabel={skipBackwardAriaLabel}
        disabled={!duration}
        onClick={this.onSkipBackward}
      >
        <span className="oo-btn-counter">{skipTimes.backward}</span>
      </HoldControlButton>
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD] = (
      <HoldControlButton
        {...this.props}
        key={CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD}
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD}
        style={buttonStyle}
        className="oo-center-button oo-skip-forward"
        icon="forward"
        ariaLabel={skipForwardAriaLabel}
        disabled={this.isAtVideoEdge() || !duration}
        onClick={this.onSkipForward}
      >
        <span className="oo-btn-counter">{skipTimes.forward}</span>
      </HoldControlButton>
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO] = (
      <ControlButton
        {...this.props}
        key={CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO}
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO}
        style={buttonStyle}
        className="oo-next-video"
        icon="next"
        ariaLabel={CONSTANTS.ARIA_LABELS.NEXT_VIDEO}
        disabled={!config.hasNextVideos}
        onClick={this.onNextVideo}
      />
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.PLAY_PAUSE] = (
      <ControlButton
        {...this.props}
        key={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
        className="oo-play-pause"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAY_PAUSE}
        ariaLabel={playButtonDetails.ariaLabel}
        icon={playButtonDetails.icon}
        onClick={this.onPlayPauseClick}
      />
    );

    return buttonTemplate;
  }

  /**
   * Stores a ref to this component's main element.
   * @private
   * @param {HTMLElement} domElement - the real DOM element
   */
  storeRef(domElement) {
    this.domElement = domElement;
  }

  /**
   * Determines whether or not the current video is at the end (VOD) or at the
   * live edge (DVR Live Streams) based on the playhead state and duration.
   * @private
   * @returns {Boolean} True if the video is at the video end/live edge, false otherwise.
   */
  isAtVideoEdge() {
    const { controller, currentPlayhead } = this.props;
    const isLiveStream = Utils.getPropertyValue(
      controller,
      'state.isLiveStream',
      false
    );
    const duration = Utils.getPropertyValue(controller, 'state.duration', 0);
    const sanitizedCurrentPlayhead = Utils.ensureNumber(currentPlayhead, 0);

    const isVideoEdge = isLiveStream
      ? Math.abs(sanitizedCurrentPlayhead - duration) < 1
      : sanitizedCurrentPlayhead >= duration;
    return isVideoEdge;
  }

  /**
   * Determines whether or not the button with the particular id can be displayed
   * considering the current player state and configuration.
   * @private
   * @param {string} buttonId The id of the button we want to check
   * @param {object} buttonConfig The configuration object from the skin config for the given button
   * @returns {boolean} True if the button should be displayed, false otherwise
   */
  shouldDisplayButton(buttonId, buttonConfig) {
    const { config, controller, forceShowButtons } = this.props;
    const isSingleVideo = !config.hasPreviousVideos && !config.hasNextVideos;
    const duration = Utils.getPropertyValue(controller, 'state.duration');

    const isPrevNextButton = (
      buttonId === CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO
      || buttonId === CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO
    );
    const isSkipButton = (
      buttonId === CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD
      || buttonId === CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD
    );

    if (
      buttonConfig && buttonConfig.enabled === false && (isPrevNextButton || isSkipButton)
    ) {
      return false;
    }

    const isDisabled = !forceShowButtons && (
      (isSkipButton && !duration)
      || (isPrevNextButton && isSingleVideo)
      || !(buttonConfig && buttonConfig.enabled)
    );
    return !isDisabled;
  }

  render() {
    const buttons = this.getSortedButtonEntries();
    // Nothing to render if we don't have buttons
    if (!buttons.length) {
      return null;
    }

    const {
      className,
      isInactive,
      isInBackground,
      onFocus,
      onBlur,
    } = this.props;
    const finalClassName = classNames('oo-skip-controls', className, {
      'oo-inactive': isInactive,
      'oo-in-background': isInBackground,
    });
    const buttonTemplate = this.getButtonTemplate();

    return (
      <div
        ref={this.storeRef}
        className={finalClassName}
        onMouseEnter={this.onMouseEnter}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {buttons.map(button => buttonTemplate[button.id])}
      </div>
    );
  }
}

SkipControls.propTypes = {
  className: PropTypes.string,
  maxWidth: PropTypes.number,
  forceShowButtons: PropTypes.bool,
  buttonConfig: PropTypes.shape({}),
  isInactive: PropTypes.bool,
  isInBackground: PropTypes.bool,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  responsiveView: PropTypes.string.isRequired,
  skinConfig: PropTypes.shape({}).isRequired,
  currentPlayhead: PropTypes.number.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  config: PropTypes.shape({
    hasPreviousVideos: PropTypes.bool.isRequired,
    hasNextVideos: PropTypes.bool.isRequired,
  }).isRequired,
  controller: PropTypes.shape({
    state: PropTypes.shape({
      isMobile: PropTypes.bool.isRequired,
      isLiveStream: PropTypes.bool.isRequired,
      duration: PropTypes.number.isRequired,
      scrubberBar: PropTypes.shape({
        isHovering: PropTypes.bool,
      }),
    }),
    rewindOrRequestPreviousVideo: PropTypes.func.isRequired,
    requestNextVideo: PropTypes.func.isRequired,
    setFocusedControl: PropTypes.func.isRequired,
    startHideControlBarTimer: PropTypes.func.isRequired,
    cancelTimer: PropTypes.func.isRequired,
    togglePlayPause: PropTypes.func.isRequired,
  }).isRequired,
  a11yControls: PropTypes.shape({
    seekBy: PropTypes.func.isRequired,
  }),
};

SkipControls.defaultProps = {
  className: '',
  maxWidth: 0,
  forceShowButtons: false,
  buttonConfig: undefined,
  isInactive: false,
  isInBackground: false,
  language: 'en',
  localizableStrings: {},
  onFocus: () => {},
  onBlur: () => {},
  a11yControls: { seekBy: () => {} },
};

module.exports = preserveKeyboardFocus(SkipControls);
