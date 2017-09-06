var CONSTANTS = require('./../constants/constants');

var AccessibilityControls = function (controller) {
  this.controller = controller;
  this.allowed = true;
  this.state = {
    "fastForwardRate": 1,
    "lastKeyDownTime": null,
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
    if (!this.controller.state.accessibilityControlsEnabled) { return; }

    var currentTime;
    var newPlayheadTime;
    var newVolume;
    var targetTagName = this.getTargetTagName(e);

    // We override the default behavior when the target element is a button (pressing
    // the spacebar on a button should activate it).
    // Note that this is not a comprehensive fix for all clickable elements, this is
    // mostly meant to enable keyboard navigation on control bar elements.
    var charCode = e.which || e.keyCode;
    this.handleKeyClick(e, this.state.keyMapsList, charCode, true, targetTagName); //start rotate 360

    if (charCode === CONSTANTS.KEYCODES.SPACE_KEY && targetTagName !== "button") {
      e.preventDefault();
      this.controller.togglePlayPause();
    }

    else if ((charCode === CONSTANTS.KEYCODES.DOWN_ARROW_KEY && this.controller.state.volumeState.volume > 0) || (e.keyCode === CONSTANTS.KEYCODES.UP_ARROW_KEY && this.controller.state.volumeState.volume < 1)){
      e.preventDefault();
      var deltaVolumeSign = 1; // positive 1 for volume increase, negative for decrease

      if (charCode === CONSTANTS.KEYCODES.DOWN_ARROW_KEY){
        deltaVolumeSign = -1;
      }
      else {
        deltaVolumeSign = 1;
      }

      newVolume = (this.controller.state.volumeState.volume * 10 + 1*deltaVolumeSign)/10;
      this.controller.setVolume(newVolume);
    }

    else if (charCode === CONSTANTS.KEYCODES.RIGHT_ARROW_KEY || charCode === CONSTANTS.KEYCODES.LEFT_ARROW_KEY){
      e.preventDefault();
      var shiftSign = 1; // positive 1 for fast forward, negative for rewind back

      var shiftSeconds = 1;
      var fastForwardRateIncrease = 1.1;

      currentTime = Date.now();
      if (this.state.lastKeyDownTime && currentTime - this.state.lastKeyDownTime < 500){
        //increasing the fast forward rate to go faster if key is pressed often
        if (this.state.fastForwardRate < 300){
          this.state.fastForwardRate *= fastForwardRateIncrease;
        }
      }
      else {
        this.state.fastForwardRate = 1;
      }

      this.state.lastKeyDownTime = currentTime;
      if (charCode === CONSTANTS.KEYCODES.RIGHT_ARROW_KEY){
        shiftSign = 1;
      }
      else {
        shiftSign = -1;
      }

      newPlayheadTime = this.controller.skin.state.currentPlayhead + shiftSign*shiftSeconds * this.state.fastForwardRate;
      this.controller.seek(newPlayheadTime);
    }
  },

  keyEventUp: function(e) {
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
    if (!this.controller.state.isVideo360) { return; }
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
  }
};

module.exports = AccessibilityControls;
