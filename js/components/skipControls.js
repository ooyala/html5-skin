var React = require('react');
var classNames = require('classnames');
var ControlButton = require('./controlButton');
var HoldControlButton = require('./holdControlButton');
var Icon = require('./icon');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');
var MACROS = require('../constants/macros');

var SkipControls = React.createClass({

  onPreviousVideo: function() {
    if (typeof this.props.controller.rewindOrRequestPreviousVideo === 'function') {
      this.props.controller.rewindOrRequestPreviousVideo();
    }
  },

  onNextVideo: function() {
    if (typeof this.props.controller.requestNextVideo === 'function') {
      this.props.controller.requestNextVideo();
    }
  },

  onSkipBackward: function() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      var skipTimes = this.getSkipTimes();
      this.props.a11yControls.seekBy(skipTimes.backward, false, true);
    }
  },

  onSkipForward: function() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      var skipTimes = this.getSkipTimes();
      this.props.a11yControls.seekBy(skipTimes.forward, true, true);
    }
  },

  /**
   * Gets the values of skip forward/back times configured in skin.json.
   * Falls back to default values.
   * @private
   * @return {object} An object with two properties, 'forward' and 'backward',
   * which represent the amount of seconds to skip in each respective direction.
   */
  getSkipTimes: function() {
    var skipTimes = {};
    skipTimes.backward = Utils.getPropertyValue(
      this.props.skinConfig,
      'skipControls.skipBackwardTime'
    );
    skipTimes.forward = Utils.getPropertyValue(
      this.props.skinConfig,
      'skipControls.skipForwardTime'
    );
    skipTimes.backward = Utils.ensureNumber(
      skipTimes.backward,
      CONSTANTS.UI.DEFAULT_SKIP_BACKWARD_TIME
    );
    skipTimes.forward = Utils.ensureNumber(
      skipTimes.forward,
      CONSTANTS.UI.DEFAULT_SKIP_FORWARD_TIME
    );
    return skipTimes;
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
    var skipTimes = this.getSkipTimes();

    var skipBackwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_BACKWARD.replace(
      MACROS.SECONDS,
      skipTimes.backward
    );
    var skipForwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_FORWARD.replace(
      MACROS.SECONDS,
      skipTimes.forward
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO] = (
      <ControlButton
        {...this.props}
        icon="nextVideo"
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.PREVIOUS_VIDEO}
        ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_VIDEO}
        onClick={this.onPreviousVideo}>
      </ControlButton>
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD] = (
      <HoldControlButton
        {...this.props}
        className="oo-center-button"
        icon="replay"
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.SKIP_BACKWARD}
        ariaLabel={skipBackwardAriaLabel}
        onClick={this.onSkipBackward}>
        <span className="oo-btn-counter">{skipTimes.backward}</span>
      </HoldControlButton>
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD] = (
      <HoldControlButton
        {...this.props}
        className="oo-center-button"
        icon="replay"
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.SKIP_FORWARD}
        ariaLabel={skipForwardAriaLabel}
        onClick={this.onSkipForward}>
        <span className="oo-btn-counter">{skipTimes.forward}</span>
      </HoldControlButton>
    );

    buttonTemplate[CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO] = (
      <ControlButton
        {...this.props}
        icon="nextVideo"
        focusId={CONSTANTS.SKIP_CTRLS_KEYS.NEXT_VIDEO}
        ariaLabel={CONSTANTS.ARIA_LABELS.NEXT_VIDEO}
        onClick={this.onNextVideo}>
      </ControlButton>
    );
    return buttonTemplate;
  },

  /**
   * Parses the skin.json's skip button configuration and returns the ids of the
   * enabled buttons sorted by index in ascending order.
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

      if (button && button.enabled) {
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
    var className = classNames('oo-skip-controls', {
      'oo-inactive': this.props.inactive
    });
    var buttons = this.getSortedButtonEntries();
    var buttonTemplate = this.getButtonTemplate();

    return (
      <div className={className}>
        {buttons.map(function(button) {
          return buttonTemplate[button.id];
        })}
      </div>
    );
  }

});

SkipControls.propTypes = {
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object,
  responsiveView: React.PropTypes.bool.isRequired,
  skinConfig: React.PropTypes.object.isRequired,
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool.isRequired
    }),
    rewindOrRequestPreviousVideo: React.PropTypes.func.isRequired,
    requestNextVideo: React.PropTypes.func.isRequired,
  }),
  a11yControls: React.PropTypes.shape({
    seekBy: React.PropTypes.func.isRequired
  })
};

module.exports = SkipControls;
