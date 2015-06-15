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
      "currentAdItem": null,
      "adsPlaybackProgress": {}
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
      this.mb.subscribe(OO.EVENTS.WILL_PLAY_ADS, "customerUi", _.bind(this.onWillPlayAds, this));
      this.mb.subscribe(OO.EVENTS.WILL_PAUSE_ADS, "customerUi", _.bind(this.onWillPauseAds, this));
      this.mb.subscribe(OO.EVENTS.PAUSE_STREAM, "customerUi", _.bind(this.onWillPauseAds, this));
      this.mb.subscribe(OO.EVENTS.PLAY_STREAM, "customerUi", _.bind(this.onPlayStream, this));
      this.mb.subscribe(OO.EVENTS.ADS_PLAYED, "customerUi", _.bind(this.onAdsPlayed, this));
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
      this.state.contentTree = contentTree;
      this.state.screenToShow = SCREEN.START_SCREEN;
      this.initAdsInfoStructure();
      this.state.playerState = STATE.START;
      this.renderSkin({"contentTree": contentTree});
    },

    initAdsInfoStructure: function (contentTree) {
      for (var i = 0; i < this.state.contentTree.ads.length; i++) {
        var ad = this.state.contentTree.ads[i];
        var time = ad.time;
        var adPlaybackProgress = {};
        if (!(time in this.state.adsPlaybackProgress)) {
            this.state.adsPlaybackProgress[time] = {};
            adPlaybackProgress = {"total": 1, "played": 0};
        } else {
          var newTotal = this.state.adsPlaybackProgress[time].total + 1;
          adPlaybackProgress = {"total": newTotal, "played": 0};
        }
        this.state.adsPlaybackProgress[time] = adPlaybackProgress;
      }
    },

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered) {
      // console.log(arguments);
      this.skin.updatePlayhead(currentPlayhead, duration, buffered);
    },

    onPlaying: function() {
      if (!this.state.isPlayingAd) {
        this.state.screenToShow = SCREEN.PLAYING_SCREEN;
        this.state.playerState = STATE.PLAYING;
        this.renderSkin();
      }
    },

    onPaused: function() {
      if (!this.state.isPlayingAd) {
        this.state.screenToShow = SCREEN.PAUSE_SCREEN;
        this.state.playerState = STATE.PAUSE;
        this.renderSkin();
      }
    },

    onPlayed: function() {
      this.state.screenToShow = SCREEN.END_SCREEN;
      this.state.playerState = STATE.END;
      this.renderSkin();
    },

    onReportDiscoveryImpression: function(event, discoveryData) {
      console.log("onReportDiscoveryImpression is called");
      this.state.screenToShow = SCREEN.DISCOVERY_SCREEN;
      this.state.discoveryData = discoveryData;
      this.renderSkin();
    },

    onPlayStream: function(event, currentItemUrl, currentItem) {
      if (!this.state.isPlayingAd) {

      } else if (this.state.isPlayingAd) {
        if (this.state.currentAdItem === null || 
            currentItem.item.ad_embed_code != this.state.currentAdItem.ad_embed_code) {
        var time = currentItem.item.time;
        var newPlayed = this.state.adsPlaybackProgress[time].played + 1;
        adPlaybackProgress = {"total": this.state.adsPlaybackProgress[time].total, "played": newPlayed};
        this.state.adsPlaybackProgress[time] = adPlaybackProgress;
        this.state.currentAdItem = currentItem.item;  
        this.renderSkin();
      }
      }
    },

    onWillPlayAds: function(event, adItem) {
      console.log("onWillPlayAds is called");
      // var previousAdItem = this.state.currentAdItem;
      if (this.state.currentAdItem === null || adItem.ad_embed_code != this.state.currentAdItem.ad_embed_code) {
        var time = adItem.time;
        var newPlayed = this.state.adsPlaybackProgress[time].played + 1;
        adPlaybackProgress = {"total": this.state.adsPlaybackProgress[time].total, "played": newPlayed};
        this.state.adsPlaybackProgress[time] = adPlaybackProgress;
      }
      this.state.currentAdItem = adItem;  
      this.state.isPlayingAd = true;
      this.state.screenToShow = SCREEN.AD_SCREEN;
      this.state.playerState = STATE.PLAYING; 
      this.renderSkin();
    },

    updateAdsPlaybackProgress: function(adItem) {
      if (this.state.currentAdItem === null || adItem.ad_embed_code != this.state.currentAdItem.ad_embed_code) {
        var time = adItem.time;
        var newPlayed = this.state.adsPlaybackProgress[time].played + 1;
        adPlaybackProgress = {"total": this.state.adsPlaybackProgress[time].total, "played": newPlayed};
        this.state.adsPlaybackProgress[time] = adPlaybackProgress;
      }
      console.log("updateAdsPlaybackProgress is called for adItem = " + adItem);
    },

    onWillPauseAds: function(event) {
      console.log("onWillPauseAds is called from event = " + event);
      this.state.playerState = STATE.PAUSE;
      this.state.screenToShow = SCREEN.AD_SCREEN;
      this.renderSkin();
    },

    onAdsPlayed: function(event) {
      console.log("onAdsPlayed is called from event = " + event);
      this.state.isPlayingAd = false;
      this.state.screenToShow = SCREEN.PLAYING_SCREEN;
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