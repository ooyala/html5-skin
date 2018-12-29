const React = require('react');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const ControlButton = require('./controlButton');
const HoldControlButton = require('./holdControlButton');
const Icon = require('./icon');
const Utils = require('./utils');
const preserveKeyboardFocus = require('./higher-order/preserveKeyboardFocus');
const CONSTANTS = require('../constants/constants');
const MACROS = require('../constants/macros');

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
   * Stores a ref to this component's main element.
   * @private
   * @param {HTMLElement} domElement
   */
  storeRef(domElement) {
    this.domElement = domElement;
  }

  /**
   * Fired when the component is mounted. Notifies its parent about it's position
   * and dimensions (client rect).
   * @private
   */
  componentDidMount() {
    if (this.domElement && typeof this.props.onMount === 'function') {
      const clientRect = this.domElement.getBoundingClientRect();
      this.props.onMount(clientRect);
    }
  }

  /**
   * Previous Video button click handler.
   * @private
   */
  onPreviousVideo() {
    if (typeof this.props.controller.rewindOrRequestPreviousVideo === 'function') {
      this.props.controller.rewindOrRequestPreviousVideo();
    }
  }

  /**
   * Next Video button click handler.
   * @private
   */
  onNextVideo() {
    if (typeof this.props.controller.requestNextVideo === 'function') {
      this.props.controller.requestNextVideo();
    }
  }

  /**
   * Skip Backward button click handler.
   * @private
   */
  onSkipBackward() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      const skipTimes = Utils.getSkipTimes(this.props.skinConfig);
      this.props.a11yControls.seekBy(skipTimes.backward, false, true);
    }
  }

  /**
   * Skip Forward button click handler.
   * @private
   */
  onSkipForward() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      const skipTimes = Utils.getSkipTimes(this.props.skinConfig);
      this.props.a11yControls.seekBy(skipTimes.forward, true, true);
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
    this.props.controller.cancelTimer();
  }

  /**
   * Determines whether or not the current video is at the end (VOD) or at the
   * live edge (DVR Live Streams) based on the playhead state and duration.
   * @private
   * @returns {Boolean} True if the video is at the video end/live edge, false otherwise.
   */
  isAtVideoEdge() {
    const isLiveStream = Utils.getPropertyValue(
      this.props.controller,
      'state.isLiveStream',
      false
    );
    let isVideoEdge = false;
    const duration = Utils.getPropertyValue(this.props.controller, 'state.duration', 0);
    const currentPlayhead = Utils.ensureNumber(this.props.currentPlayhead, 0);

    if (isLiveStream) {
      isVideoEdge = Math.abs(currentPlayhead - duration) < 1;
    } else {
      isVideoEdge = currentPlayhead >= duration;
    }
    return isVideoEdge;
  }

  /**
   * Play/Pause button click handler.
   * @private
   */
  onPlayPauseClick() {
    this.props.controller.togglePlayPause();
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
    const skipTimes = Utils.getSkipTimes(this.props.skinConfig);

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
    if (this.props.isInactive) {
      buttonStyle.pointerEvents = 'none';
    }

    const playButtonDetails = Utils.getPlayButtonDetails(this.props.controller.state.playerState);
    const duration = Utils.getPropertyValue(this.props.controller, 'state.duration');

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO] = (
      <ControlButton
        {...this.props}
        key={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        style={buttonStyle}
        className="oo-previous-video"
        icon="previous"
        ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_VIDEO}
        disabled={!this.props.config.hasPreviousVideos}
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
        disabled={!this.props.config.hasNextVideos}
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
   * Determines whether or not the button with the particular id can be displayed
   * considering the current player state and configuration.
   * @private
   * @param {string} buttonId The id of the button we want to check
   * @param {object} buttonConfig The configuration object from the skin config for the given button
   * @returns {boolean} True if the button should be displayed, false otherwise
   */
  shouldDisplayButton(buttonId, buttonConfig) {
    const { config, controller } = this.props;
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

    const isDisabled = !this.props.forceShowButtons && (
      (isSkipButton && !duration)
      || (isPrevNextButton && isSingleVideo)
      || !(buttonConfig && buttonConfig.enabled)
    );
    return !isDisabled;
  }

  /**
   * Parses the skin.json's skip button configuration and returns the ids (button
   * names from the skin config) of the enabled buttons sorted by index in ascending order.
   * @private
   * @returns {array} An array of button objects. Each object contains the id and index
   * of the button.
   */
  getSortedButtonEntries() {
    const buttons = [];
    const buttonConfig = this.props.buttonConfig ? this.props.buttonConfig
      : Utils.getPropertyValue(
        this.props.skinConfig,
        'skipControls.buttons',
        {}
      );
    // Find the ids and indexes of all enabled buttons
    for (const buttonId in buttonConfig) {
      const button = buttonConfig[buttonId];

      if (this.shouldDisplayButton(buttonId, button)) {
        buttons.push({
          id: buttonId,
          index: button.index,
        });
      }
    }
    // Sort by index in ascending order
    buttons.sort((a, b) => a.index - b.index);
    return buttons;
  }

  render() {
    const buttons = this.getSortedButtonEntries();
    // Nothing to render if we don't have buttons
    if (!buttons.length) {
      return null;
    }

    const className = classNames('oo-skip-controls', this.props.className, {
      'oo-inactive': this.props.isInactive,
      'oo-in-background': this.props.isInBackground,
    });
    const buttonTemplate = this.getButtonTemplate();

    return (
      <div
        ref={this.storeRef}
        className={className}
        onMouseEnter={this.onMouseEnter}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
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
  buttonConfig: PropTypes.object,
  isInactive: PropTypes.bool,
  isInBackground: PropTypes.bool,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
  responsiveView: PropTypes.string.isRequired,
  skinConfig: PropTypes.object.isRequired,
  currentPlayhead: PropTypes.number.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  config: PropTypes.shape({
    hasPreviousVideos: PropTypes.bool.isRequired,
    hasNextVideos: PropTypes.bool.isRequired,
  }),
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
  }),
  a11yControls: PropTypes.shape({
    seekBy: PropTypes.func.isRequired,
  }),
};

module.exports = preserveKeyboardFocus(SkipControls);
