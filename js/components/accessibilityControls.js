var CONSTANTS = require('./../constants/constants');
var Utils = require('./utils');

var AccessibilityControls = function (controller) {
    this.controller = controller;
    this.state = {
      seekRate: 1,
      lastKeyDownTime: 0
    };
    this.keyEvent = this.handleKey.bind(this);
    document.addEventListener('keydown', this.keyEvent);
};

AccessibilityControls.prototype = {
  cleanUp : function() {
    document.removeEventListener('keydown', this.keyEvent);
  },

  handleKey: function(e) {
    if (!this.controller.state.accessibilityControlsEnabled) {
      return;
    }

    var targetTagName;
    if (e.target && typeof e.target.tagName === 'string') {
      targetTagName = e.target.tagName.toLowerCase();
    }
    // Slider interaction requires the arrow keys. When a slider is active we should
    // disable arrow key controls
    var sliderIsActive = document.activeElement && document.activeElement.getAttribute('role') === 'slider';

    switch (e.keyCode) {
      case CONSTANTS.KEYCODES.SPACE_KEY:
        // We override the default behavior when the target element is a button (pressing
        // the spacebar on a button should activate it).
        // Note that this is not a comprehensive fix for all clickable elements, this is
        // mostly meant to enable keyboard navigation on control bar elements.
        if (targetTagName !== 'button') {
          e.preventDefault();
          this.controller.togglePlayPause();
        }
        break;
      case CONSTANTS.KEYCODES.UP_ARROW_KEY:
      case CONSTANTS.KEYCODES.DOWN_ARROW_KEY:
        if (!sliderIsActive) {
          e.preventDefault();
          var increase = e.keyCode === CONSTANTS.KEYCODES.UP_ARROW_KEY ? true : false;
          this.changeVolumeBy(CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA, increase);
        }
        break;
      case CONSTANTS.KEYCODES.LEFT_ARROW_KEY:
      case CONSTANTS.KEYCODES.RIGHT_ARROW_KEY:
        if (!sliderIsActive) {
          e.preventDefault();
          var forward = e.keyCode === CONSTANTS.KEYCODES.RIGHT_ARROW_KEY ? true : false;
          this.seekBy(CONSTANTS.A11Y_CTRLS.SEEK_DELTA, forward);
        }
        break;
      default:
        break;
    }
  },

  /**
   * changeVolumeBy - description
   *
   * @param  {type} percent  description
   * @param  {type} increase description
   * @return {type}          description
   */
  changeVolumeBy: function(percent, increase) {
    var delta = Utils.constrainToRange(percent, 0, 100);

    if (delta) {
      var volume = 0;
      var currentVolumePercent = this.controller.state.volumeState.volume * 100;

      if (increase) {
        volume = Utils.constrainToRange(currentVolumePercent + delta, 0, 100) / 100;
      } else {
        volume = Utils.constrainToRange(currentVolumePercent - delta, 0, 100) / 100;
      }
      if (volume !== this.controller.state.volumeState.volume) {
        this.controller.setVolume(volume);
      }
    }
  },

  /**
   * seekBy - description
   *
   * @param  {type} seconds description
   * @param  {type} forward description
   * @return {type}         description
   */
  seekBy: function(seconds, forward) {
    var shiftSeconds = seconds || 1;
    var shiftSign = forward ? 1 : -1; // Positive 1 for fast forward, negative for rewind
    var seekRateIncrease = 1.1;

    var currentTime = Date.now();
    var timeSinceLastSeek = currentTime - this.state.lastKeyDownTime;

    if (timeSinceLastSeek < 500) {
      // Increasing seek rate to go faster if key is pressed often
      if (this.state.seekRate < 300) {
        this.state.seekRate *= seekRateIncrease;
      }
    } else {
      this.state.seekRate = 1;
    }
    this.state.lastKeyDownTime = currentTime;

    var delta = shiftSeconds * shiftSign * this.state.seekRate;
    var seekTo = this.controller.skin.state.currentPlayhead + delta;
    seekTo = Utils.constrainToRange(seekTo, 0, this.controller.skin.state.duration);

    this.controller.seek(seekTo, true);
  }
};

module.exports = AccessibilityControls;
