var CONSTANTS = require('./../constants/constants');
var Utils = require('./utils');

var AccessibilityControls = function (controller) {
  this.controller = controller;
  this.vrRotationAllowed = true; // flag for checking repeat of keyDown
  this.keyDirectionMap = {};
  this.keyDirectionMap[CONSTANTS.KEYCODES.A] = CONSTANTS.DIRECTIONS.LEFT;
  this.keyDirectionMap[CONSTANTS.KEYCODES.D] = CONSTANTS.DIRECTIONS.RIGHT;
  this.keyDirectionMap[CONSTANTS.KEYCODES.W] = CONSTANTS.DIRECTIONS.UP;
  this.keyDirectionMap[CONSTANTS.KEYCODES.S] = CONSTANTS.DIRECTIONS.DOWN;
  this.state = {
    seekRate: 1,
    lastKeyDownTime: 0,
  };
  this.keyEventDown = this.keyEventDown.bind(this);
  this.keyEventUp = this.keyEventUp.bind(this);
  this.moveVrToDirection = this.moveVrToDirection.bind(this);
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
    if (!this.controller.state.accessibilityControlsEnabled) {
      return;
    }

    var targetTagName = this.getTargetTagName(e);
    var charCode = e.which || e.keyCode;
    this.moveVrToDirection(e, charCode, true, targetTagName); //start rotate 360

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
        if (this.areArrowKeysAllowed()) {
          e.preventDefault();
          var increase = charCode === CONSTANTS.KEYCODES.UP_ARROW_KEY;
          this.changeVolumeBy(CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA, increase);
        }
        break;
      case CONSTANTS.KEYCODES.LEFT_ARROW_KEY:
      case CONSTANTS.KEYCODES.RIGHT_ARROW_KEY:
        if (this.areArrowKeysAllowed()) {
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
   * Determines whether arrow key shortcuts should be active. Arrow key shortcuts
   * should be disabled whenever an element that allows arrow key interaction has focus.
   * Please note that this doesn't cover all possible cases at the moment, only
   * roles that are in use in this project have been added so far.
   * @private
   * @return {Boolean} True if arrow key shortcuts are allowed, false otherwise.
   */
  areArrowKeysAllowed: function() {
    var activeElementRole = '';
    if (document.activeElement) {
      activeElementRole = document.activeElement.getAttribute('role');
    }

    switch (activeElementRole) {
      case CONSTANTS.ARIA_ROLES.SLIDER:
      case CONSTANTS.ARIA_ROLES.MENU_ITEM:
      case CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO:
        return false;
      default:
        return true;
    }
  },

  /**
   * @description handlers for keyup event
   * @private
   * @param e - event
   */
  keyEventUp: function(e) {
    if (!(this.controller.state.accessibilityControlsEnabled || this.controller.state.isClickedOutside)) {
      return;
    }
    var targetTagName = this.getTargetTagName(e);
    var charCode = e.which || e.keyCode;
    this.moveVrToDirection(e, charCode, false, targetTagName);  //stop rotate 360
  },

  /**
   * @description get name of target tag, for example "button" etc
   * @private
   * @param e - event
   * @returns {string} name of the target tag
   */
  getTargetTagName: function(e) {
    var targetTagName = "";
    if (e.target && typeof e.target.tagName === "string") {
      targetTagName = e.target.tagName.toLowerCase();
    }
    return targetTagName;
  },

  /**
   * @description call moveVrToDirection from controller for rotation a vr video
   * @private
   * @param e - event
   * @param charCode {number} - char code;
   * @param isKeyDown {boolean} - true if key is pressed
   * @param targetTagName {string} - name of the clicked tag
   * @returns {boolean} true if moved
   */
  moveVrToDirection: function(e, charCode, isKeyDown, targetTagName) {
    var keyDirectionMap = this.keyDirectionMap;
    if (!(keyDirectionMap[charCode] || targetTagName !== "button")) {
      return false;
    }
    if (!this.controller.videoVr) {
      return false;
    }
    if (e.repeat !== undefined) {
      this.vrRotationAllowed = !e.repeat;
    }
    if (!this.vrRotationAllowed) {
      return false;
    }
    this.vrRotationAllowed = !isKeyDown; //prevent repeat of keyDown
    this.controller.moveVrToDirection(false, keyDirectionMap[charCode]); //stop rotation if isKeyDown === false or prevent prev rotation if press a button (isKeyDown === true)
    if (isKeyDown === true) {
      this.controller.moveVrToDirection(true, keyDirectionMap[charCode]);
      return true;
    }
    return false;
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
   * @return {Boolean} True if seeking is possible, false otherwise.
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
