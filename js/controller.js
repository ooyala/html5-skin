/********************************************************************
  CONTROLLER
*********************************************************************/
OO.plugin("Html5Skin", function (OO, _, $, W) {

  var Html5Skin = function (mb, id) {
    this.mb = mb;
    this.id = id;
    this.state = {
      "contentTree": {},
      "screenToShow": null,
      "playerState": null,
      "discoveryData": null,
      "ccOptions":{
        "enabled": null,
        "language": null,
        "availableLanguages": null
      },

      "upNextInfo": {
        "upNextData": null,
        "countDownFinished": false,
        "countDownCancelled": false,
      },
      "configLoaded": false,
      "fullscreen": false
    };

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi', _.bind(this.onContentTreeFetched, this));
      this.mb.subscribe(OO.EVENTS.PLAYING, 'customerUi', _.bind(this.onPlaying, this));
      this.mb.subscribe(OO.EVENTS.PAUSED, 'customerUi', _.bind(this.onPaused, this));
      this.mb.subscribe(OO.EVENTS.PLAYED, 'customerUi', _.bind(this.onPlayed, this));
      this.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customerUi', _.bind(this.onPlayheadTimeChanged, this));
      this.mb.subscribe(OO.EVENTS.REPORT_DISCOVERY_IMPRESSION, "customerUi", _.bind(this.onReportDiscoveryImpression, this));
      this.mb.subscribe(OO.EVENTS.CLOSED_CAPTIONS_INFO_AVAILABLE, "customerUi", _.bind(this.onClosedCaptionsInfoAvailable, this));
      this.mb.subscribe(OO.EVENTS.CLOSED_CAPTION_CUE_CHANGED, "customerUi", _.bind(this.onClosedCaptionCueChanged, this));
      this.mb.subscribe(OO.EVENTS.DISCOVERY_API.RELATED_VIDEOS_FETCHED, "customerUi", _.bind(this.onRelatedVideosFetched, this));
    },

    /*--------------------------------------------------------------------
      event listeners from core player -> regulate skin STATE
    ---------------------------------------------------------------------*/
    onPlayerCreated: function (event, elementId, params) {
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%; position: absolute; z-index: 10000;'></div>");

      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON("config/skin.json", _.bind(function(data) {
        this.skin = React.render(
          React.createElement(Skin, {skinConfig: data, controller: this, ccOptions: this.state.ccOptions}), document.getElementById("skin")
        );
        this.state.configLoaded = true;
        this.renderSkin();
      }, this));
    },

    onContentTreeFetched: function (event, contentTree) {
      this.resetUpNextInfo();
      this.state.contentTree = contentTree;
      this.state.screenToShow = SCREEN.START_SCREEN;
      this.state.playerState = STATE.START;
      this.renderSkin({"contentTree": contentTree});
    },

    resetUpNextInfo: function () {
      this.state.upNextInfo.upNextData = null;
      this.state.upNextInfo.countDownFinished = false;
      this.state.upNextInfo.countDownCancelled = false;
    },

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered) {
      if (this.state.screenToShow !== SCREEN.AD_SCREEN &&
        this.skin.props.skinConfig.upNextScreen.showUpNext)  {
        this.showUpNextScreenWhenReady(currentPlayhead, duration);
      } else if (this.state.playerState === STATE.PLAYING) {
        this.state.screenToShow = SCREEN.PLAYING_SCREEN;
      } else if (this.state.playerState === STATE.PAUSE) {
        this.state.screenToShow = SCREEN.PAUSE_SCREEN;
      }
      this.skin.updatePlayhead(currentPlayhead, duration, buffered);
      this.renderSkin();
    },

    showUpNextScreenWhenReady: function(currentPlayhead, duration) {
      var timeToShow = 0;
      if (this.skin.props.skinConfig.upNextScreen.timeToShow > 1) {
        // time to show is based on seconds
        timeToShow = this.skin.props.skinConfig.upNextScreen.timeToShow;
      } else {
        // time to show is based on percentage of duration
        timeToShow = (1 - this.skin.props.skinConfig.upNextScreen.timeToShow) * duration;
      }
      if (duration - currentPlayhead <= timeToShow &&
          !this.state.upNextInfo.countDownCancelled &&
          this.state.upNextInfo.upNextData !== null) {
        this.state.screenToShow = SCREEN.UP_NEXT_SCREEN;
      }
    },

    onPlaying: function() {
      this.state.screenToShow = SCREEN.PLAYING_SCREEN;
      this.state.playerState = STATE.PLAYING;
      this.renderSkin();
    },

    onPaused: function() {
      if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "discovery") {
        this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
      } else if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "share") {
        this.state.screenToShow = SCREEN.SHARE_SCREEN;
      } else {
        this.state.screenToShow = SCREEN.PAUSE_SCREEN;
      }
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    onPlayed: function() {
      if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === "discovery") {
        console.log("Should display DISCOVERY_SCREEN on end");
        this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
      } else if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === "share") {
        this.state.screenToShow = SCREEN.SHARE_SCREEN;
      } else {
        this.state.screenToShow = SCREEN.END_SCREEN;
      }
      this.state.playerState = STATE.END;
      this.renderSkin();
    },

    onReportDiscoveryImpression: function(event, discoveryData) {
      console.log("onReportDiscoveryImpression is called");
      this.state.discoveryData = discoveryData;
      this.renderSkin();
    },

    onClosedCaptionsInfoAvailable: function(event, languages) {
      this.state.ccOptions.availableLanguages = languages;
      if (this.state.ccOptions.enabled){
        this.setClosedCaptionsLanguage();
      }
    },

    onClosedCaptionCueChanged: function(event, data) {
      //for the future use
    },

    onRelatedVideosFetched: function(event, relatedVideos) {
      console.log("onRelatedVideosFetched is called");
      this.state.upNextInfo.upNextData = relatedVideos.videos[0];
      this.renderSkin();
    },

    /*--------------------------------------------------------------------
      Skin state -> control skin
    ---------------------------------------------------------------------*/
    renderSkin: function(args) {
      if (this.state.configLoaded) {
        _.extend(this.state, args);
        this.skin.switchComponent(this.state);
      }
    },

    /*--------------------------------------------------------------------
      skin UI-action -> publish event to core player
    ---------------------------------------------------------------------*/
    toggleFullscreen: function() {
      this.state.fullscreen = !this.state.fullscreen;
      this.mb.publish(OO.EVENTS.WILL_CHANGE_FULLSCREEN, this.state.fullscreen);
      this.renderSkin();
    },

    toggleDiscoveryScreen: function() {
      switch(this.state.playerState) {
        case STATE.PLAYING:
          this.togglePlayPause();
          setTimeout(function() {
            this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
            this.state.playerState = STATE.PAUSE;
            this.renderSkin();
            console.log("finished toggleDiscoveryScreen");
          }.bind(this), 1);
          break;
        case STATE.PAUSE:
          if(this.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
            this.state.screenToShow = SCREEN.PAUSE_SCREEN;
          }
          else {
            this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
          }
          break;
        case STATE.END:
          if(this.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
            this.state.screenToShow = SCREEN.END_SCREEN;
          }
          else {
            this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
          }
          break;
      }
      this.renderSkin();
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

    toggleShareScreen: function() {
      if (this.state.screenToShow == SCREEN.SHARE_SCREEN) {
        this.closeShareScreen();
      }
      else {
        this.mb.publish(OO.EVENTS.PAUSE);
        setTimeout(function() {
          this.state.screenToShow = SCREEN.SHARE_SCREEN;
          this.state.playerState = STATE.PAUSE;
          this.renderSkin();
          console.log("finish showShareScreen");
        }.bind(this), 1);
      }
    },

    closeShareScreen: function() {
      this.state.screenToShow = SCREEN.PAUSE_SCREEN;
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    sendDiscoveryClickEvent: function(selectedContentData) {
      this.mb.publish(OO.EVENTS.SET_EMBED_CODE, selectedContentData.clickedVideo.embed_code);
      this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_CLICK_EVENT, selectedContentData);
    },

    setClosedCaptionsLanguage: function(){
      var language = this.state.ccOptions.enabled ? this.state.ccOptions.language : "";
      var mode = this.state.ccOptions.enabled ? "showing" : "disabled";
      this.mb.publish(OO.EVENTS.SET_CLOSED_CAPTIONS_LANGUAGE, language, {"mode": mode});
    },

    toggleClosedCaptionScreen: function() {
      if (this.state.screenToShow == SCREEN.CLOSEDCAPTION_SCREEN) {
        this.closeClosedCaptionScreen();
      }
      else {
        this.mb.publish(OO.EVENTS.PAUSE);
        setTimeout(function() {
          this.state.screenToShow = SCREEN.CLOSEDCAPTION_SCREEN;
          this.state.playerState = STATE.PAUSE;
          this.renderSkin();
        }.bind(this), 1);
      }
    },

    closeClosedCaptionScreen: function() {
      this.state.screenToShow = SCREEN.PAUSE_SCREEN;
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    onClosedCaptionLanguageChange: function(language) {
      this.state.ccOptions.language = language;
      this.setClosedCaptionsLanguage();
      this.renderSkin();
    },

    toggleClosedCaptionEnabled: function() {
      this.state.ccOptions.enabled = !this.state.ccOptions.enabled;
      this.setClosedCaptionsLanguage();
      this.renderSkin();
    },

    upNextDismissButtonClicked: function() {
      this.state.upNextInfo.countDownCancelled = true;
      this.state.screenToShow = SCREEN.PLAYING_SCREEN;
      this.state.playerState = STATE.PLAYING;
      this.renderSkin();
    },
  };

  return Html5Skin;
});

// DEBUG only. Remove after usage
var printlog = function(text) {
  console.log("@@@@@@@@@@@");
  console.log(text);
  console.log("@@@@@@@@@@@");
};