var CONSTANTS = require('./../constants/constants');
var Utils = require('./utils');

var AccessibilityControls = function (controller) {
  this.controller = controller;
  this.allowed = true;
  this.state = {
    seekRate: 1,
    lastKeyDownTime: 0,
    "keyMapsList": [
      {"char": CONSTANTS.KEYCODES.A, "direction": "left"},
      {"char": CONSTANTS.KEYCODES.D, "direction": "right"},
      {"char": CONSTANTS.KEYCODES.W, "direction": "up"},
      {"char": CONSTANTS.KEYCODES.S, "direction": "down"}
    ]
  };
  this.keyEventDown = this.keyEventDown.bind(this);
  this.keyEventUp = this.keyEventUp.bind(this);
  this.handleKeyClick = this.handleKeyClick.bind(this);
  this.getTargetTagName = this.getTargetTagName.bind(this);

  document.addEventListener("keydown", this.keyEventDown);
  document.addEventListener("keyup", this.keyEventUp);
};

AccessibilityControls.prototype = {
  cleanUp : function() {
    document.removeEventListener("keydown", this.keyEventDown);
    document.removeEventListener("keyup", this.keyEventUp);
  },

  keyEventDown: function(e) {
    console.log('BBB I am in keyEventDown this.controller.state.accessibilityControlsEnabled is', this.controller.state.accessibilityControlsEnabled);
    if (!this.controller.state.accessibilityControlsEnabled) {
      return;
    }

    var targetTagName = this.getTargetTagName(e);
    var charCode = e.which || e.keyCode;
    this.handleKeyClick(e, this.state.keyMapsList, charCode, true, targetTagName); //start rotate 360
    // Slider interaction requires the arrow keys. When a slider is active we should
    // disable arrow key controls
    var sliderIsActive = document.activeElement && document.activeElement.getAttribute('role') === 'slider';

    switch (charCode) {
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

  keyEventUp: function(e) {
    console.log('BBB i am in keyEventUp this.controller.state.accessibilityControlsEnabled is', this.controller.state.accessibilityControlsEnabled);
    if (!this.controller.state.accessibilityControlsEnabled) { return; }
    var targetTagName = this.getTargetTagName(e);
    var charCode = e.which || e.keyCode;
    this.handleKeyClick(e, this.state.keyMapsList, charCode, false, targetTagName);  //stop rotate 360
  },

  getTargetTagName: function(e) {
    var targetTagName = "";
    if (e.target && typeof e.target.tagName === "string") {
      targetTagName = e.target.tagName.toLowerCase();
    }
    return targetTagName;
  },

  handleKeyClick: function(e, keyMapsList, char, bool, targetTagName) {
    /*
     * keyMapsList - array of objects {char: 83, direction: 'down'}
     */
    if (!this.controller.videoVr) { return; }
    for (var i=0; i<keyMapsList.length; i++) {
      if (char === keyMapsList[i]['char'] && targetTagName !== "button") {
        if (e.repeat != undefined) {
          this.allowed = !e.repeat;
        }
        if (!this.allowed) {
          return;
        }
        this.allowed = !bool; //prevent repeat of keyDown
        this.controller.moveToDirection(bool, keyMapsList[i]['direction']);
        break;
      }
    }
  },

  /**
   * Increases or decreases the player volume by the specified percentage. Values beyond
   * the minimum or maximum will be constrained to appropriate values.
   * @public
   * @param {Number} percent A value from 0 to 100 that indicates how much to increase or decrease the volume.
   * @param {Boolean} increase True for volume increase, false for descrease.
   */
  changeVolumeBy: function(percent, increase) {
    var delta = Utils.constrainToRange(percent, 0, 100);

    if (delta) {
      var volume = 0;
      var currentVolume = Utils.ensureNumber(this.controller.state.volumeState.volume, 0);
      var currentVolumePercent = currentVolume * 100;

      if (increase) {
        volume = Utils.constrainToRange(currentVolumePercent + delta, 0, 100) / 100;
      } else {
        volume = Utils.constrainToRange(currentVolumePercent - delta, 0, 100) / 100;
      }
      if (volume !== currentVolume) {
        this.controller.setVolume(volume);
      }
    }
  },

  /**
   * Determines whether or not the controller is in a state that allows seeking the video.
   * @private
   * @return {Boolen} True if seeking is possible, false otherwise.
   */
  canSeek: function() {
    var seekingEnabled = false;
    switch (this.controller.state.screenToShow) {
      case CONSTANTS.SCREEN.PLAYING_SCREEN:
      case CONSTANTS.SCREEN.PAUSE_SCREEN:
      case CONSTANTS.SCREEN.END_SCREEN:
        if (this.controller.state.isPlayingAd) {
          seekingEnabled = false;
        } else {
          seekingEnabled = true;
        }
        break;
      default:
        seekingEnabled = false;
        break;
    }
    return seekingEnabled;
  },

  /**
   * Seeks the video by the specified number of seconds. The direction of the playhead
   * can be specified with the forward parameter. If a value exceeds the minimum or maximum
   * seekable range it will be constrained to appropriate values.
   * @public
   * @param {Number} seconds The number of seconds to increase or decrease relative to the current playhead.
   * @param {Boolean} forward True to seek forward, false to seek backward.
   */
  seekBy: function(seconds, forward) {
    if (!this.canSeek()) {
      return;
    }
    var shiftSeconds = Utils.ensureNumber(seconds, 1);
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

    // Calculate the new playhead
    var delta = shiftSeconds * shiftSign * this.state.seekRate;
    var seekTo = Utils.ensureNumber(this.controller.skin.state.currentPlayhead, 0) + delta;
    seekTo = Utils.constrainToRange(seekTo, 0, this.controller.skin.state.duration);

    // Refresh UI and then instruct the player to seek
    this.controller.updateSeekingPlayhead(seekTo);
    this.controller.seek(seekTo);
  }
};

module.exports = AccessibilityControls;
