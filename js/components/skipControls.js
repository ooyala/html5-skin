var React = require('react');
var classNames = require('classnames');
var ControlButton = require('./controlButton');
var HoldControlButton = require('./holdControlButton');
var Icon = require('./icon');
var Utils = require('./utils');
var preserveKeyboardFocus = require('./higher-order/preserveKeyboardFocus');
var CONSTANTS = require('../constants/constants');
var MACROS = require('../constants/macros');

var SkipControls = React.createClass({
  /**
   * Stores a ref to this component's main element.
   * @private
   * @param {HTMLElement} domElement
   */
  storeRef: function(domElement) {
    this.domElement = domElement;
  },

  /**
   * Fired when the component is mounted. Notifies its parent about it's position
   * and dimensions (client rect).
   * @private
   */
  componentDidMount: function() {
    if (this.domElement && typeof this.props.onMount === 'function') {
      var clientRect = this.domElement.getBoundingClientRect();
      this.props.onMount(clientRect);
    }
  },

  /**
   * Previous Video button click handler.
   * @private
   */
  onPreviousVideo: function() {
    if (typeof this.props.controller.rewindOrRequestPreviousVideo === 'function') {
      this.props.controller.rewindOrRequestPreviousVideo();
    }
  },

  /**
   * Next Video button click handler.
   * @private
   */
  onNextVideo: function() {
    if (typeof this.props.controller.requestNextVideo === 'function') {
      this.props.controller.requestNextVideo();
    }
  },

  /**
   * Skip Backward button click handler.
   * @private
   */
  onSkipBackward: function() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      var skipTimes = Utils.getSkipTimes(this.props.skinConfig);
      this.props.a11yControls.seekBy(skipTimes.backward, false, true);
    }
  },

  /**
   * Skip Forward button click handler.
   * @private
   */
  onSkipForward: function() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      var skipTimes = Utils.getSkipTimes(this.props.skinConfig);
      this.props.a11yControls.seekBy(skipTimes.forward, true, true);
    }
  },

  /**
   * Handles the mouseenter event. Given that the SkipControls have pointer-events
   * set to 'none' in order to allow clicking through them, this event is only fired
   * when the mouse is over a button. Whenever this happens we cancel the auto-hide
   * controls timer.
   * @private
   */
  onMouseEnter: function() {
    this.props.controller.cancelTimer();
  },

  /**
   * Gets a map which contains templates for each of the available buttons in
   * this component.
   * @private
   * @return {object} An object whose keys are the ids of the skip buttons (as
   * defined in the skin.json) and whose values are the button components that
   * match each id.
   */
  getButtonTemplate: function() {
    var buttonTemplate = {};
    var buttonStyle = {};
    var skipTimes = Utils.getSkipTimes(this.props.skinConfig);

    var skipBackwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_BACKWARD.replace(
      MACROS.SECONDS,
      skipTimes.backward
    );
    var skipForwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_FORWARD.replace(
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

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO] = (
      <ControlButton
        {...this.props}
        key={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        style={buttonStyle}
        className="oo-previous-video"
        icon="nextVideo"
        ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_VIDEO}
        disabled={!this.props.config.hasPreviousVideos}
        onClick={this.onPreviousVideo}>
      </ControlButton>
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
        onClick={this.onSkipBackward}>
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
        icon="replay"
        ariaLabel={skipForwardAriaLabel}
        onClick={this.onSkipForward}>
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
        icon="nextVideo"
        ariaLabel={CONSTANTS.ARIA_LABELS.NEXT_VIDEO}
        disabled={!this.props.config.hasNextVideos}
        onClick={this.onNextVideo}>
      </ControlButton>
    );
    return buttonTemplate;
  },

  /**
   * Determines whether or not the button with the particular id can be displayed
   * considering the current player state and configuration.
   * @private
   * @param {string} buttonId The id of the button we want to check
   * @param {object} buttonConfig The configuration object from the skin config for the given button
   * @return {boolean} True if the button should be displayed, false otherwise
   */
  shouldDisplayButton: function(buttonId, buttonConfig) {
    var config = this.props.config;
    var isSingleVideo = !config.hasPreviousVideos && !config.hasNextVideos;
    var duration = Utils.getPropertyValue(this.props.controller, 'state.duration');

    var isPrevNextButton = (
      buttonId === CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO ||
      buttonId === CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO
    );
    var isSkipButton = (
      buttonId === CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD ||
      buttonId === CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD
    );

    var isDisabled = (
      (isSkipButton && !duration) ||
      (isPrevNextButton && isSingleVideo) ||
      !(buttonConfig && buttonConfig.enabled)
    );
    return !isDisabled;
  },

  /**
   * Parses the skin.json's skip button configuration and returns the ids (button
   * names from the skin config) of the enabled buttons sorted by index in ascending order.
   * @private
   * @return {array} An array of button objects. Each object contains the id and index
   * of the button.
   */
  getSortedButtonEntries: function() {
    var buttons = [];
    var buttonConfig = Utils.getPropertyValue(
      this.props.skinConfig,
      'skipControls.buttons',
      {}
    );
    // Find de ids and indexes of all enabled buttons
    for (var buttonId in buttonConfig) {
      var button = buttonConfig[buttonId];

      if (this.shouldDisplayButton(buttonId, button)) {
        buttons.push({
          id: buttonId,
          index: button.index
        });
      }
    }
    // Sort by index in ascending order
    buttons.sort(function(a, b) {
      return a.index - b.index;
    });
    return buttons;
  },

  render: function() {
    var buttons = this.getSortedButtonEntries();
    // Nothing to render if we don't have buttons
    if (!buttons.length) {
      return null;
    }

    var className = classNames('oo-skip-controls', {
      'oo-inactive': this.props.isInactive,
      'oo-in-background': this.props.isInBackground
    });
    var buttonTemplate = this.getButtonTemplate();

    return (
      <div
        ref={this.storeRef}
        className={className}
        onMouseEnter={this.onMouseEnter}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}>
        {buttons.map(function(button) {
          return buttonTemplate[button.id];
        })}
      </div>
    );
  }

});

SkipControls.propTypes = {
  isInactive: React.PropTypes.bool,
  isInBackground: React.PropTypes.bool,
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object,
  responsiveView: React.PropTypes.bool.isRequired,
  skinConfig: React.PropTypes.object.isRequired,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  config: React.PropTypes.shape({
    hasPreviousVideos: React.PropTypes.bool.isRequired,
    hasNextVideos: React.PropTypes.bool.isRequired
  }),
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool.isRequired,
      duration: React.PropTypes.number.isRequired,
      scrubberBar: React.PropTypes.shape({
        isHovering: React.PropTypes.bool
      })
    }),
    rewindOrRequestPreviousVideo: React.PropTypes.func.isRequired,
    requestNextVideo: React.PropTypes.func.isRequired,
    cancelTimer: React.PropTypes.func.isRequired,
  }),
  a11yControls: React.PropTypes.shape({
    seekBy: React.PropTypes.func.isRequired
  })
};

module.exports = preserveKeyboardFocus(SkipControls);
