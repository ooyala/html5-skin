var AccessibilityControls = function (controller) {
    this.controller = controller;
    this.state = {
      "fastForwardRate": 1,
      "lastKeyDownTime": null
    };
    document.addEventListener("keydown", this.handleKey.bind(this));
};

AccessibilityControls.prototype = {
  handleKey: function(e) {
    var currentTime;
    var newPlayheadTime;
    var newVolume;

    if (e.keyCode === KEYCODES.SPACE_KEY){
      this.controller.togglePlayPause();
    }

    if ((e.keyCode === KEYCODES.DOWN_ARROW_KEY && this.controller.state.volume > 0) || (e.keyCode === KEYCODES.UP_ARROW_KEY && this.controller.state.volume < 1)){
      var volumeSign = 1; // positive 1 for volume increase, negative for decrease

      if (e.keyCode === KEYCODES.DOWN_ARROW_KEY){
        volumeSign = -1;
      }
      else {
        volumeSign = 1;
      }

      newVolume = (this.controller.state.volume * 10 + 1*volumeSign)/10;
      this.controller.setVolume(newVolume);
    }

    if (e.keyCode === KEYCODES.RIGHT_ARROW_KEY || e.keyCode === KEYCODES.LEFT_ARROW_KEY){
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
      if (e.keyCode === KEYCODES.RIGHT_ARROW_KEY){
        shiftSign = 1;
      }
      else {
        shiftSign = -1;
      }

      newPlayheadTime = this.controller.skin.state.currentPlayhead + shiftSign*shiftSeconds * this.state.fastForwardRate;
      this.controller.seek(newPlayheadTime);
    }
  }
};