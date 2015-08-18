/********************************************************************
  CONTROLLER
*********************************************************************/
OO.plugin("Html5Skin", function (OO, _, $, W) {

  var Html5Skin = function (mb, id) {
    this.mb = mb;
    this.id = id;
    this.state = {
      "contentTree": {},
      "authorization": {},
      "screenToShow": null,
      "playerState": null,
      "discoveryData": null,
      "isPlayingAd": false,
      "configLoaded": false,
      "fullscreen": false,
      "pauseAnimationDisabled": false,
      "seeking": false,

      "currentAdsInfo": {
        "currentAdItem": null,
        "numberOfAds": 0
      },

      "ccOptions":{
        "enabled": null,
        "language": null,
        "availableLanguages": null
      },

      "volumeState":{
        "volume" :null,
        "muted": false,
        "oldVolume": 1,
      },

      "upNextInfo": {
        "upNextData": null,
        "countDownFinished": false,
        "countDownCancelled": false,
      }
    };

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi', _.bind(this.onContentTreeFetched, this));
      this.mb.subscribe(OO.EVENTS.AUTHORIZATION_FETCHED, 'customerUi', _.bind(this.onAuthorizationFetched, this));
      this.mb.subscribe(OO.EVENTS.PLAYING, 'customerUi', _.bind(this.onPlaying, this));
      this.mb.subscribe(OO.EVENTS.PAUSED, 'customerUi', _.bind(this.onPaused, this));
      this.mb.subscribe(OO.EVENTS.PLAYED, 'customerUi', _.bind(this.onPlayed, this));
      this.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customerUi', _.bind(this.onPlayheadTimeChanged, this));
      this.mb.subscribe(OO.EVENTS.SEEKED, 'customerUi', _.bind(this.onSeeked, this));


      /********************************************************************
        ADS RELATED EVENTS
      *********************************************************************/

      this.mb.subscribe(OO.EVENTS.ADS_PLAYED, "customerUi", _.bind(this.onAdsPlayed, this));

      this.mb.subscribe(OO.EVENTS.AD_POD_STARTED, "customerUi", _.bind(this.onAdPodStarted, this));

      this.mb.subscribe(OO.EVENTS.WILL_PLAY_SINGLE_AD , "customerUi", _.bind(this.onWillPlaySingleAd, this));
      this.mb.subscribe(OO.EVENTS.SINGLE_AD_PLAYED , "customerUi", _.bind(this.onSingleAdPlayed, this));

      this.mb.subscribe(OO.EVENTS.WILL_PAUSE_ADS, "customerUi", _.bind(this.onWillPauseAds, this));
      this.mb.subscribe(OO.EVENTS.WILL_RESUME_ADS, "customerUi", _.bind(this.onWillResumeAds, this));

      this.mb.subscribe(OO.EVENTS.REPORT_DISCOVERY_IMPRESSION, "customerUi", _.bind(this.onReportDiscoveryImpression, this));
      this.mb.subscribe(OO.EVENTS.CLOSED_CAPTIONS_INFO_AVAILABLE, "customerUi", _.bind(this.onClosedCaptionsInfoAvailable, this));
      this.mb.subscribe(OO.EVENTS.CLOSED_CAPTION_CUE_CHANGED, "customerUi", _.bind(this.onClosedCaptionCueChanged, this));
      this.mb.subscribe(OO.EVENTS.VOLUME_CHANGED, "customerUi", _.bind(this.onVolumeChanged, this));
      if (OO.EVENTS.DISCOVERY_API) {
        this.mb.subscribe(OO.EVENTS.DISCOVERY_API.RELATED_VIDEOS_FETCHED, "customerUi", _.bind(this.onRelatedVideosFetched, this));
      }
      this.mb.subscribe(OO.EVENTS.FULLSCREEN_CHANGED, "customerUi", _.bind(this.onFullscreenChanged, this));
    },

    /*--------------------------------------------------------------------
      event listeners from core player -> regulate skin STATE
    ---------------------------------------------------------------------*/
    onPlayerCreated: function (event, elementId, params) {
      $(".innerWrapper").append("<div id='skin' style='width:100%; height:100%; overflow:hidden; position: absolute; font-family: &apos;Helvetica Neue&apos;,Helvetica,Arial,sans-serif;'></div>");
      $("#skin").css("z-index", OO.CSS.ALICE_SKIN_Z_INDEX);
      
      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON(params.skin.config, _.bind(function(data) {
        //Override data in skin config with possible inline data input by the user
        $.extend(true, data, params.skin.inline);

        this.skin = React.render(
          React.createElement(Skin, {skinConfig: data, controller: this, ccOptions: this.state.ccOptions, pauseAnimationDisabled: this.state.pauseAnimationDisabled}), document.getElementById("skin")
        );
        var accessibilityControls = new AccessibilityControls(this); //keyboard support
        this.state.configLoaded = true;
        this.renderSkin();
      }, this));
    },

    onAuthorizationFetched: function(event, authorization) {
      this.state.authorization = authorization;
    },

    onContentTreeFetched: function (event, contentTree) {
      this.resetUpNextInfo();
      this.state.contentTree = contentTree;
      this.state.screenToShow = SCREEN.START_SCREEN;
      this.state.playerState = STATE.START;
      this.renderSkin({"contentTree": contentTree});
    },

    onVolumeChanged: function (event, newVolume){
      this.state.volumeState.volume = newVolume;
    },

    resetUpNextInfo: function () {
      this.state.upNextInfo.upNextData = null;
      this.state.upNextInfo.countDownFinished = false;
      this.state.upNextInfo.countDownCancelled = false;
    },

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered) {
      // The code inside if statement is only for up next, however, up next does not apply to Ad screen.
      // So we only need to update the playhead for ad screen.
      if (this.state.screenToShow !== SCREEN.AD_SCREEN ) {
        if (this.skin.props.skinConfig.upNextScreen.showUpNext)  {
          this.showUpNextScreenWhenReady(currentPlayhead, duration);
        } else if (this.state.playerState === STATE.PLAYING) {
          this.state.screenToShow = SCREEN.PLAYING_SCREEN;
        } else if (this.state.playerState === STATE.PAUSE) {
          this.state.screenToShow = SCREEN.PAUSE_SCREEN;
        }
      }
      if (!this.state.seeking) {
        this.skin.updatePlayhead(currentPlayhead, duration, buffered);
      }
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
          this.state.upNextInfo.upNextData !== null && this.state.playerState === STATE.PLAYING) {
        this.state.screenToShow = SCREEN.UP_NEXT_SCREEN;
      }
    },

    onPlaying: function() {
      // pause/resume of Ad playback is handled by different events => WILL_PAUSE_ADS/WILL_RESUME_ADS
      if (this.state.screenToShow != SCREEN.AD_SCREEN) {
        this.state.screenToShow = SCREEN.PLAYING_SCREEN;
        this.state.playerState = STATE.PLAYING;
        this.renderSkin();
      }
    },

    onPaused: function() {
      // pause/resume of Ad playback is handled by different events => WILL_PAUSE_ADS/WILL_RESUME_ADS
      if (this.state.screenToShow != SCREEN.AD_SCREEN) {
        if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "discovery") {
          console.log("Should display DISCOVERY_SCREEN on pause");
          this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
        } else if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "social") {
          // Remove this comment once pause screen implemented
        } else {
          // default
          this.state.screenToShow = SCREEN.PAUSE_SCREEN;
        }
        this.state.playerState = STATE.PAUSE;
        this.renderSkin();
      }
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
      this.skin.updatePlayhead(this.state.contentTree.duration/1000, this.state.contentTree.duration/1000, this.state.contentTree.duration/1000);
      this.state.playerState = STATE.END;
      this.renderSkin();
    },

    onReportDiscoveryImpression: function(event, discoveryData) {
      console.log("onReportDiscoveryImpression is called");
      this.state.discoveryData = discoveryData;
      this.renderSkin();
    },

    onSeeked: function(event) {
      this.state.seeking = false;
      this.renderSkin();
    },

    /********************************************************************
      ADS RELATED EVENTS
    *********************************************************************/

    publishOverlayRenderingEvent: function(marginHeight) {
      this.mb.publish(OO.EVENTS.OVERLAY_RENDERING, {"marginHeight": marginHeight});
    },

    onAdsPlayed: function(event) {
      console.log("onAdsPlayed is called from event = " + event);
      this.state.screenToShow = SCREEN.PLAYING_SCREEN;
      this.renderSkin();
    },

    onAdPodStarted: function(event, numberOfAds) {
      console.log("onAdPodStarted is called from event = " + event + "with " + numberOfAds + "ads");
      this.state.currentAdsInfo.numberOfAds = numberOfAds;
      this.renderSkin();
    },

    onWillPlaySingleAd: function(event, adItem) {
      console.log("onWillPlaySingleAd is called with adItem = " + adItem);
      if (adItem !== null) {
        this.state.screenToShow = SCREEN.AD_SCREEN;
        this.state.isPlayingAd = true;
        this.state.currentAdsInfo.currentAdItem = adItem;
        this.state.playerState = STATE.PLAYING;
        this.skin.state.currentPlayhead = 0;
        this.renderSkin();
      }
    },

    onSingleAdPlayed: function(event) {
      console.log("onSingleAdPlayed is called");
      this.state.isPlayingAd = false;
    },

    onWillPauseAds: function(event) {
      console.log("onWillPauseAds is called");
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    onWillResumeAds: function(event) {
      console.log("onWillResumeAds is called");
      if (this.state.currentAdsInfo.currentAdItem !== null) {
      this.state.playerState = STATE.PLAYING;
      //Set the screen to ad screen in case current screen does not involve video playback, such as discovery
      this.state.screenToShow = SCREEN.AD_SCREEN;
      }
    },

    onAdsClicked: function() {
      console.log("on ads clicked is called");
      this.mb.publish(OO.EVENTS.ADS_CLICKED);
    },

    onClosedCaptionsInfoAvailable: function(event, languages) {
      this.state.ccOptions.availableLanguages = languages;
      if (this.state.ccOptions.enabled){
        this.setClosedCaptionsLanguage();
      }
    },

    onClosedCaptionCueChanged: function(event, data) {
      // saved for the future use
    },

    onRelatedVideosFetched: function(event, relatedVideos) {
      console.log("onRelatedVideosFetched is called");
      this.state.upNextInfo.upNextData = relatedVideos.videos[0];
      this.renderSkin();
    },

    onFullscreenChanged: function(event, fullscreen) {
      this.state.fullscreen = fullscreen;
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
            this.state.pauseAnimationDisabled = true;
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
          this.mb.publish(OO.EVENTS.INITIAL_PLAY);
          break;
        case STATE.END:
          this.mb.publish(OO.EVENTS.REPLAY);
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
      this.state.volumeState.muted = false;
      this.state.volumeState.volume = volume;
      this.mb.publish(OO.EVENTS.CHANGE_VOLUME, volume);
      this.renderSkin();
    },

    handleMuteClick: function() {
      var newVolumeSettings = {};
      if (!this.state.volumeState.muted) {
        //if we're muting, save the current volume so we can
        //restore it when we un-mute
        newVolumeSettings = {
          oldVolume: this.state.volumeState.volume,
          muted: !this.state.volumeState.muted
        };
        this.setVolume(0);
      }
      else {
        //restore the volume to the previous setting
        newVolumeSettings = {
          oldVolume: 0,
          muted: !this.state.volumeState.muted
        };
        this.setVolume(this.state.volumeState.oldVolume);
      }

      this.state.volumeState.oldVolume = newVolumeSettings.oldVolume;
      this.state.volumeState.muted = newVolumeSettings.muted;
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
      this.state.pauseAnimationDisabled = true;
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
      this.state.pauseAnimationDisabled = true;
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

    toggleMoreOptionsScreen: function() {
      if (this.state.screenToShow == SCREEN.MORE_OPTIONS_SCREEN) {
        this.closeMoreOptionsScreen();
      } else {
        this.displayMoreOptionsScreen();
      }
    },

    closeMoreOptionsScreen: function() {
      this.state.pauseAnimationDisabled = true;
      this.state.screenToShow = SCREEN.PAUSE_SCREEN;
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    displayMoreOptionsScreen: function() {
      this.mb.publish(OO.EVENTS.PAUSE);
      setTimeout(function() {
        this.state.screenToShow = SCREEN.MORE_OPTIONS_SCREEN;
        this.state.playerState = STATE.PAUSE;
        this.renderSkin();
      }.bind(this), 1);
    },

    enablePauseAnimation: function(){
      this.state.pauseAnimationDisabled = false;
    },

    beginSeeking: function() {
      this.state.seeking = true;
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