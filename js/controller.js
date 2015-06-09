/********************************************************************
  CONTROLLER
*********************************************************************/
OO.plugin("Html5Skin", function (OO, _, $, W) {

  var Html5Skin = function (mb, id) {
    this.mb = mb;
    this.id = id;
    this.state = {
      "screenToShow": null,
      "playerState": null,
      "contentTree": {}
    };

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi', _.bind(this.onContentTreeFetched, this));
      this.mb.subscribe(OO.EVENTS.PLAYING, 'customerUi', _.bind(this.onPlaying, this));
      this.mb.subscribe(OO.EVENTS.PAUSED, 'customerUi', _.bind(this.onPaused, this));
      this.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customerUi', _.bind(this.onPlayheadTimeChanged, this));
    },

    /*--------------------------------------------------------------------
      event listeners from core player -> regulate skin STATE
    ---------------------------------------------------------------------*/
    onPlayerCreated: function (event, elementId, params) {
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%; position: absolute; z-index: 10000;'></div>");

      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON("config/skin.json", _.bind(function(data) {
        this.skin = React.render(
          React.createElement(Skin, {skinConfig: data, controller: this}), document.getElementById("skin")
        );
      }, this));
    },

    onContentTreeFetched: function (event, contentTree) {
      this.state.screenToShow = STATE.START;
      this.state.playerState = STATE.START;
      this.state.contentTree = contentTree;
      this.renderSkin({"contentTree": this.state.contentTree});
    },

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered) {
      //console.log(arguments);
      this.skin.updatePlayhead(currentPlayhead, duration, buffered);
    },

    onPlaying: function() {
      this.state.screenToShow = STATE.PLAYING;
      this.state.playerState = STATE.PLAYING;
      this.renderSkin();
    },

    onPaused: function() {
      this.state.screenToShow = STATE.PLAYING;
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    /*--------------------------------------------------------------------
      Skin state -> control skin
    ---------------------------------------------------------------------*/
    renderSkin: function(args) {
      _.extend(this.state, args);
      this.skin.switchComponent(this.state);
    },

    /*--------------------------------------------------------------------
      skin UI-action -> publish event to core player
    ---------------------------------------------------------------------*/
    toggleFullscreen: function(fullscreen) {
      this.mb.publish(OO.EVENTS.WILL_CHANGE_FULLSCREEN, fullscreen);
    },

    toggleMute: function(muted) {
      this.mb.publish(OO.EVENTS.CHANGE_VOLUME, (muted ? 0 : 1));
    },

    togglePlayPause: function() {
      switch (this.state.playerState) {
        case STATE.START:
        case STATE.END:
          this.mb.publish(OO.EVENTS.INITIAL_PLAY);
          break;
        case STATE.PAUSE:
          this.mb.publish(OO.EVENTS.PLAY);
          break;
        case STATE.PLAYING:
          this.mb.publish(OO.EVENTS.PAUSE);
          break;
      }
    },

    seek: function(seconds) {
      this.mb.publish(OO.EVENTS.SEEK, seconds);
    },

    setVolume: function(volume){
      this.mb.publish(OO.EVENTS.CHANGE_VOLUME, volume);
    },

    showShareScreen: function() {
      if (this.state.screenToShow == STATE.SHARE_SCREEN) {
        this.closeShareScreen();
      }
      else {
        this.mb.publish(OO.EVENTS.PAUSE);
        setTimeout(function() {
          this.state.screenToShow = STATE.SHARE_SCREEN;
          this.state.playerState = STATE.PAUSE;
          this.renderSkin();
          console.log("finish showShareScreen");
        }.bind(this), 1);
      }
    },

    closeShareScreen: function() {
      console.log(this.state.screenToShow, this.state.playerState);
      this.state.screenToShow = this.state.playerState;
      this.renderSkin();
    }
  };

  return Html5Skin;
});

// DEBUG only. Remove after usage
var printlog = function(text) {
  console.log("@@@@@@@@@@@");
  console.log(text);
  console.log("@@@@@@@@@@@");
};