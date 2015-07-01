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
      "isPlayingAd": false,
      "currentAdsInfo": {
        "currentAdItem": null,
        "numberOfPlayedAd": 0,
        "numberOfAds": 0
      },
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


      /********************************************************************
        ADS RELATED EVENTS
      *********************************************************************/

      this.mb.subscribe(OO.EVENTS.WILL_PLAY_ADS, "customerUi", _.bind(this.onWillPlayAds, this));
      this.mb.subscribe(OO.EVENTS.ADS_PLAYED, "customerUi", _.bind(this.onAdsPlayed, this));

      this.mb.subscribe(OO.EVENTS.AD_POD_STARTED, "customerUi", _.bind(this.onAdPodStarted, this));
      this.mb.subscribe(OO.EVENTS.AD_POD_ENDED, "customerUi", _.bind(this.onAdPodEnded, this));

      this.mb.subscribe(OO.EVENTS.WILL_PLAY_SINGLE_AD , "customerUi", _.bind(this.onWillPlaySingleAd, this));
      this.mb.subscribe(OO.EVENTS.SINGLE_AD_PLAYED , "customerUi", _.bind(this.onSingleAdPlayed, this));

      this.mb.subscribe(OO.EVENTS.WILL_PAUSE_ADS, "customerUi", _.bind(this.onWillPauseAds, this));
      this.mb.subscribe(OO.EVENTS.WILL_RESUME_ADS, "customerUi", _.bind(this.onWillResumeAds, this));
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
        this.mb.publish(OO.EVENTS.PLAYER_EMBEDDED);
      }, this));
    },

    onContentTreeFetched: function (event, contentTree) {
      this.state.contentTree = contentTree;
      this.state.screenToShow = SCREEN.START_SCREEN;
      // this.initAdsPlaybackProgressStructure();
      this.state.playerState = STATE.START;
      this.renderSkin({"contentTree": contentTree});
    },

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered) {
      // console.log(arguments);
      this.setVolume(0);
      this.skin.updatePlayhead(currentPlayhead, duration, buffered);
    },

    onPlaying: function() {
      if (this.state.screenToShow != SCREEN.AD_SCREEN) {
        this.state.screenToShow = SCREEN.PLAYING_SCREEN;
        this.state.playerState = STATE.PLAYING;
        this.renderSkin();
      }
    },

    onPaused: function() {
      // pause/resume of Ad playback is handled by different events
      if (this.state.screenToShow != SCREEN.AD_SCREEN) {
        if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "discovery") {
          console.log("Should display DISCOVERY_SCREEN on pause");
          this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
        } else if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "social") {
          // Remove this comment once pause screen implemented
        } else {
          // default
          this.state.screenToShow = SCREEN.PLAYING_SCREEN;
        }
        this.state.playerState = STATE.PAUSE;
        this.renderSkin();
      }
    },

    onPlayed: function() {
      if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === "discovery") {
        console.log("Should display DISCOVERY_SCREEN on end");
        this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
      } else if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === "social") {
        // Remove this comment once pause screen implemented
      } else {
        // default
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

    /********************************************************************
      ADS RELATED EVENTS
    *********************************************************************/

    onWillPlayAds: function(event) {
      console.log("onWillPlayAds is called");
      this.state.screenToShow = SCREEN.AD_SCREEN;
      this.state.isPlayingAd = true;
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

    onAdPodEnded: function(event, numberOfAds) {
    },

    onWillPlaySingleAd: function(event, adItem) {
      console.log("onWillPlaySingleAd is called with adItem = " + adItem); 
      this.state.currentAdsInfo.currentAdItem = adItem;
      this.state.currentAdsInfo.numberOfPlayedAd += 1;
      this.state.playerState = STATE.PLAYING; 
      this.renderSkin();
    },

    onSingleAdPlayed: function(event) {
      console.log("onSingleAdPlayed is called");
    },

    onWillPauseAds: function(event) {
      console.log("onWillPauseAds is called");
      this.state.playerState = STATE.PAUSE;
      this.renderSkin();
    },

    onWillResumeAds: function(event) {
      console.log("onWillResumeAds is called");
      this.state.playerState = STATE.PLAYING;
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

    toggleDiscoveryScreen: function() {
      switch(this.state.playerState) {
        case STATE.PLAYING:
          this.togglePlayPause();
          this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
          break;
        case STATE.PAUSE:
          if(this.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
            this.state.screenToShow = SCREEN.PLAYING_SCREEN;
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

    sendDiscoveryClickEvent: function(selectedContentData) {
      this.mb.publish(OO.EVENTS.SET_EMBED_CODE, selectedContentData.clickedVideo.embed_code);
      this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_CLICK_EVENT, selectedContentData);
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