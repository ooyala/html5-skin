import CONSTANTS from '../constants/constants';
import Utils from './utils';

/**
 * Wrapper that adds accessibility controls tracking
 * @param {Object} controller - the global state controller
 */
function AccessibilityControls(controller) {
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
  this.prevKeyPressedArr = []; // list of codes of pressed buttons
  this.keyEventDown = this.keyEventDown.bind(this);
  this.keyEventUp = this.keyEventUp.bind(this);
  this.moveVrToDirection = this.moveVrToDirection.bind(this);
  this.getTargetTagName = this.getTargetTagName.bind(this);

  document.addEventListener('keydown', this.keyEventDown);
  document.addEventListener('keyup', this.keyEventUp);
}

AccessibilityControls.prototype = {

  SEEK_RATE: {
    // Factor by which the seeking rate is increased
    INCREASE: 1.1,
    // Maximum allowed value of seeking rate
    MAXIMUM: 300,
    // Calling getSeekRate() with a frequency below this threshold
    // will result in a seek rate increase
    TIME_THRESHOLD: 500,
  },

  cleanUp() {
    document.removeEventListener('keydown', this.keyEventDown);
    document.removeEventListener('keyup', this.keyEventUp);
  },

  keyEventDown(event) {
    if (!this.controller.state.accessibilityControlsEnabled) {
      return;
    }

    const targetTagName = this.getTargetTagName(event);
    const charCode = event.which || event.keyCode;
    if (this.controller.videoVr) {
      this.moveVrToDirection(event, charCode, true, targetTagName); // start rotate 360
    }

    switch (charCode) {
      case CONSTANTS.KEYCODES.SPACE_KEY:
        // We override the default behavior when the target element is a button (pressing
        // the spacebar on a button should activate it).
        // Note that this is not a comprehensive fix for all clickable elements, this is
        // mostly meant to enable keyboard navigation on control bar elements.
        if (targetTagName !== 'button') {
          event.preventDefault();
          this.controller.togglePlayPause();
        }
        break;
      case CONSTANTS.KEYCODES.UP_ARROW_KEY:
      case CONSTANTS.KEYCODES.DOWN_ARROW_KEY:
        if (this.areArrowKeysAllowed()) {
          event.preventDefault();
          const increase = charCode === CONSTANTS.KEYCODES.UP_ARROW_KEY;
          this.changeVolumeBy(CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA, increase);
        }
        break;
      case CONSTANTS.KEYCODES.LEFT_ARROW_KEY:
      case CONSTANTS.KEYCODES.RIGHT_ARROW_KEY:
        if (this.areArrowKeysAllowed()) {
          event.preventDefault();
          const forward = event.keyCode === CONSTANTS.KEYCODES.RIGHT_ARROW_KEY;
          const skinConfig = Utils.getPropertyValue(this.controller, 'skin.props.skinConfig');
          const skipTimes = Utils.getSkipTimes(skinConfig);
          const delta = forward ? skipTimes.forward : skipTimes.backward;

          this.seekBy(delta, forward, true);
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
   * @returns {Boolean} True if arrow key shortcuts are allowed, false otherwise.
   */
  areArrowKeysAllowed() {
    let activeElementRole = '';
    if (document.activeElement) {
      activeElementRole = document.activeElement.getAttribute('role');
    }

    switch (activeElementRole) {
      case CONSTANTS.ARIA_ROLES.SLIDER:
      case CONSTANTS.ARIA_ROLES.MENU_ITEM:
      case CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO:
      case CONSTANTS.ARIA_ROLES.MENU_ITEM_CHECKBOX:
        return false;
      default:
        return true;
    }
  },

  /**
   * @description handlers for keyup event
   * @private
   * @param {Event} event - event
   */
  keyEventUp(event) {
    if (!(this.controller.state.accessibilityControlsEnabled || this.controller.state.isClickedOutside)) {
      return;
    }
    if (this.controller.videoVr) {
      const targetTagName = this.getTargetTagName(event);
      const charCode = event.which || event.keyCode;
      this.moveVrToDirection(event, charCode, false, targetTagName); // stop rotate 360
    }
  },

  /**
   * @description get name of target tag, for example "button" etc
   * @private
   * @param {Event} event - event
   * @returns {string} name of the target tag
   */
  getTargetTagName(event) {
    let targetTagName = '';
    if (event.target && typeof event.target.tagName === 'string') {
      targetTagName = event.target.tagName.toLowerCase();
    }
    return targetTagName;
  },

  /**
   * @description call moveVrToDirection from controller for rotation a vr video
   * @private
   * @param {Event} event - event
   * @param {number} charCode - char code;
   * @param {boolean} isKeyDown - true if key is pressed
   * @param {string} targetTagName - name of the clicked tag
   * @returns {boolean} true if moved
   */
  moveVrToDirection(event, charCode, isKeyDown, targetTagName) {
    const { keyDirectionMap } = this;
    if (!(this.controller.videoVr || keyDirectionMap[charCode] || targetTagName !== 'button')) {
      return false;
    }
    if (event.repeat !== undefined) {
      this.vrRotationAllowed = !event.repeat;
    }
    if (!this.vrRotationAllowed) {
      return false;
    }
    this.vrRotationAllowed = !isKeyDown; // prevent repeat of keyDown
    this.controller.moveVrToDirection(false, keyDirectionMap[charCode]); // stop rotation if isKeyDown === false or prevent prev rotation if press a button (isKeyDown === true)

    if (isKeyDown === true) {
      const newBtn = this.prevKeyPressedArr.some(address => address === charCode);
      if (newBtn) {
        this.prevKeyPressedArr.push(charCode);
      }
    } else {
      const inPrevKeyPressedArrIndex = this.prevKeyPressedArr.findIndex(address => address === charCode);
      if (inPrevKeyPressedArrIndex > -1) {
        this.prevKeyPressedArr.splice(inPrevKeyPressedArrIndex, 1);
      }
    }
    if (this.prevKeyPressedArr.length) {
      isKeyDown = true; // eslint-disable-line
      charCode = this.prevKeyPressedArr[this.prevKeyPressedArr.length - 1]; // eslint-disable-line
    }
    // rotate if a button is pressed, stop rotate if other case
    this.controller.moveVrToDirection(isKeyDown, keyDirectionMap[charCode]);
    return isKeyDown;
  },

  /**
   * Increases or decreases the player volume by the specified percentage. Values beyond
   * the minimum or maximum will be constrained to appropriate values.
   * @public
   * @param {Number} percent A value from 0 to 100 that indicates how much to increase or decrease the volume.
   * @param {Boolean} increase True for volume increase, false for descrease.
   */
  changeVolumeBy(percent, increase) {
    const percentsMax = 100;
    const delta = Utils.constrainToRange(percent, 0, percentsMax);

    if (delta) {
      let volume = 0;
      const currentVolume = Utils.ensureNumber(this.controller.state.volumeState.volume, 0);
      const currentVolumePercent = currentVolume * percentsMax;

      if (increase) {
        volume = Utils.constrainToRange(currentVolumePercent + delta, 0, percentsMax) / percentsMax;
      } else {
        volume = Utils.constrainToRange(currentVolumePercent - delta, 0, percentsMax) / percentsMax;
      }
      if (volume !== currentVolume) {
        this.controller.setVolume(volume);
      }
    }
  },

  /**
   * Determines whether or not the controller is in a state that allows seeking the video.
   * @private
   * @returns {Boolean} True if seeking is possible, false otherwise.
   */
  canSeek() {
    let seekingEnabled;
    switch (this.controller.state.screenToShow) {
      case CONSTANTS.SCREEN.PLAYING_SCREEN:
      case CONSTANTS.SCREEN.PAUSE_SCREEN:
      case CONSTANTS.SCREEN.END_SCREEN:
        seekingEnabled = !this.controller.state.isPlayingAd;
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
   * seekable range it will be constrained to appropriate values. By default, the seeking rate
   * (i.e. amount of seconds) will increase automatically when this function is called repeatedly
   * (e.g. when the user holds down the arrow key).
   * @public
   * @param {Number} seconds The number of seconds to increase or decrease relative to the current playhead.
   * @param {Boolean} forward True to seek forward, false to seek backward.
   * @param {Boolean} useConstantRate Determines whether or not the seeking rate is kept constant when the method is called repeatedly.
   */
  seekBy(seconds, forward, useConstantRate) {
    if (!this.canSeek()) {
      return;
    }
    const shiftSeconds = Utils.ensureNumber(seconds, 1);
    const shiftSign = forward ? 1 : -1; // Positive 1 for fast forward, negative for rewind
    let seekRate = 1;

    if (!useConstantRate) {
      seekRate = this.getSeekRate();
    }

    // Calculate the new playhead
    const delta = shiftSeconds * shiftSign * seekRate;
    let seekTo = Utils.ensureNumber(this.controller.skin.state.currentPlayhead, 0) + delta;
    seekTo = Utils.constrainToRange(seekTo, 0, this.controller.skin.state.duration);

    // Refresh UI and then instruct the player to seek
    this.controller.updateSeekingPlayhead(seekTo);
    this.controller.seek(seekTo);
  },

  /**
   * Linearly increases the seeking rate every time that the function is called
   * within a certain time threshold. The seeking rate is reset when the last time
   * the function was called exceeds the time threshold.
   * @public
   * @returns {Number} A number between 1 and this.SEEK_RATE.MAXIMUM which represents the current seeking rate.
   */
  getSeekRate() {
    const currentTime = Date.now();
    const timeSinceLastSeek = currentTime - this.state.lastKeyDownTime;

    if (timeSinceLastSeek < this.SEEK_RATE.TIME_THRESHOLD) {
      // Increasing seek rate to go faster if key is pressed often
      if (this.state.seekRate < this.SEEK_RATE.MAXIMUM) {
        this.state.seekRate *= this.SEEK_RATE.INCREASE;
      }
    } else {
      this.state.seekRate = 1;
    }
    this.state.lastKeyDownTime = currentTime;
    return this.state.seekRate;
  },

};

module.exports = AccessibilityControls;
