/********************************************************************
 CONTROLLER
 *********************************************************************/
var React = require('react'),
    Utils = require('./components/utils'),
    CONSTANTS = require('./constants/constants'),
    AccessibilityControls = require('./components/accessibilityControls'),
    Skin = require('./skin'),
    InlineStyle = require('./styles/inlineStyle');

OO.plugin("Html5Skin", function (OO, _, $, W) {
  //Check if the player is at least v4. If not, the skin cannot load.
  if (!OO.playerParams.core_version || OO.playerParams.core_version <= 3) {
    console.error("Html5Skin requires at least player version 4.");
    return null;
  }

  if (OO.publicApi && OO.publicApi.VERSION) {
    // This variable gets filled in by the build script in the insertVersion step
    OO.publicApi.VERSION.skin_version = "<SKIN_VERSION>";
  }

  var Html5Skin = function (mb, id) {
    this.mb = mb;
    this.id = id;
    this.state = {
      "playerParam": {},
      "assetId": null,
      "contentTree": {},
      "authorization": {},
      "screenToShow": null,
      "playerState": null,
      "discoveryData": null,
      "isPlayingAd": false,
      "adOverlayUrl": null,
      "showAdOverlay": false,
      "showAdOverlayCloseButton": false,
      "configLoaded": false,
      "fullscreen": false,
      "pauseAnimationDisabled": false,
      "seeking": false,
      "queuedPlayheadUpdate": null,
      "accessibilityControlsEnabled": false,
      "duration": 0,
      "mainVideoDuration": 0,
      "adVideoDuration": 0,
      "mainVideoElement": null,
      "elementId": null,
      "pluginsElement": null,
      "buffering": false,
      "mainVideoPlayhead": null,

      "currentAdsInfo": {
        "currentAdItem": null,
        "numberOfAds": 0,
        "skipAdButtonEnabled": false
      },

      "closedCaptionOptions": {
        "enabled": null,
        "language": null,
        "availableLanguages": null
      },

      "volumeState": {
        "volume": 1,
        "muted": false,
        "oldVolume": 1,
        "volumeSliderVisible": false
      },

      "upNextInfo": {
        "upNextData": null,
        "countDownFinished": false,
        "countDownCancelled": false,
        "timeToShow": 0,
        "showing": false,
        "delayedSetEmbedCodeEvent": false,
        "delayedContentData": null
      },

      "isMobile": false,
      "controlBarVisible": true,
      "timer": null,
      "errorCode": null
    };

    this.init();
  };

  Html5Skin.prototype = {
    init: function () {
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(OO.EVENTS.VC_VIDEO_ELEMENT_CREATED, 'customerUi', _.bind(this.onVcVideoElementCreated, this));
      this.mb.subscribe(OO.EVENTS.DESTROY, 'customerUi', _.bind(this.onPlayerDestroy, this));
      this.mb.subscribe(OO.EVENTS.EMBED_CODE_CHANGED, 'customerUi', _.bind(this.onEmbedCodeChanged, this));
      this.mb.subscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi', _.bind(this.onContentTreeFetched, this));
      this.mb.subscribe(OO.EVENTS.AUTHORIZATION_FETCHED, 'customerUi', _.bind(this.onAuthorizationFetched, this));
      this.mb.subscribe(OO.EVENTS.VC_PLAYED, 'customerUi', _.bind(this.onVcPlayed, this));
      this.mb.subscribe(OO.EVENTS.VC_PLAYING, 'customerUi', _.bind(this.onPlaying, this));
      this.mb.subscribe(OO.EVENTS.VC_PAUSED, 'customerUi', _.bind(this.onPaused, this));
      this.mb.subscribe(OO.EVENTS.PAUSE, 'customerUi', _.bind(this.onPause, this));
      this.mb.subscribe(OO.EVENTS.PLAYED, 'customerUi', _.bind(this.onPlayed, this));
      this.mb.subscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customerUi', _.bind(this.onPlayheadTimeChanged, this));
      this.mb.subscribe(OO.EVENTS.SEEKED, 'customerUi', _.bind(this.onSeeked, this));
      this.mb.subscribe(OO.EVENTS.PLAYBACK_READY, 'customerUi', _.bind(this.onPlaybackReady, this));
      this.mb.subscribe(OO.EVENTS.BUFFERING, 'customerUi', _.bind(this.onBuffering, this));
      this.mb.subscribe(OO.EVENTS.BUFFERED, 'customerUi', _.bind(this.onBuffered, this));


      /********************************************************************
       ADS RELATED EVENTS
       ********************************************************************/
      if (!Utils.isIPhone()) {
        //since iPhone is always playing in full screen and not showing our skin, don't need to render skin
        this.mb.subscribe(OO.EVENTS.ADS_PLAYED, "customerUi", _.bind(this.onAdsPlayed, this));
        this.mb.subscribe(OO.EVENTS.WILL_PLAY_ADS , "customerUi", _.bind(this.onWillPlayAds, this));
        this.mb.subscribe(OO.EVENTS.AD_POD_STARTED, "customerUi", _.bind(this.onAdPodStarted, this));
        this.mb.subscribe(OO.EVENTS.WILL_PLAY_SINGLE_AD , "customerUi", _.bind(this.onWillPlaySingleAd, this));
        this.mb.subscribe(OO.EVENTS.SINGLE_AD_PLAYED , "customerUi", _.bind(this.onSingleAdPlayed, this));

        this.mb.subscribe(OO.EVENTS.WILL_PLAY_NONLINEAR_AD, "customerUi", _.bind(this.onWillPlayNonlinearAd, this));
        this.mb.subscribe(OO.EVENTS.NONLINEAR_AD_PLAYED, "customerUi", _.bind(this.closeNonlinearAd, this));
        this.mb.subscribe(OO.EVENTS.HIDE_NONLINEAR_AD, "customerUi", _.bind(this.hideNonlinearAd, this));
        this.mb.subscribe(OO.EVENTS.SHOW_NONLINEAR_AD, "customerUi", _.bind(this.showNonlinearAd, this));
        this.mb.subscribe(OO.EVENTS.SHOW_NONLINEAR_AD_CLOSE_BUTTON, "customerUi", _.bind(this.showNonlinearAdCloseButton, this));

        this.mb.subscribe(OO.EVENTS.SHOW_AD_SKIP_BUTTON, "customerUi", _.bind(this.onShowAdSkipButton, this));
      }

      this.mb.subscribe(OO.EVENTS.CLOSED_CAPTIONS_INFO_AVAILABLE, "customerUi", _.bind(this.onClosedCaptionsInfoAvailable, this));
      this.mb.subscribe(OO.EVENTS.CLOSED_CAPTION_CUE_CHANGED, "customerUi", _.bind(this.onClosedCaptionCueChanged, this));
      this.mb.subscribe(OO.EVENTS.VOLUME_CHANGED, "customerUi", _.bind(this.onVolumeChanged, this));
      this.mb.subscribe(OO.EVENTS.FULLSCREEN_CHANGED, "customerUi", _.bind(this.onFullscreenChanged, this));
      this.mb.subscribe(OO.EVENTS.ERROR, "customerUi", _.bind(this.onErrorEvent, this));

      this.mb.addDependent(OO.EVENTS.PLAYBACK_READY, OO.EVENTS.UI_READY);
    },

    externalPluginSubscription: function() {
      if (OO.EVENTS.DISCOVERY_API) {
        this.mb.subscribe(OO.EVENTS.DISCOVERY_API.RELATED_VIDEOS_FETCHED, "customerUi", _.bind(this.onRelatedVideosFetched, this));
      }
    },

    /*--------------------------------------------------------------------
     event listeners from core player -> regulate skin STATE
     ---------------------------------------------------------------------*/
    onPlayerCreated: function (event, elementId, params) {
      $("#" + elementId + " .innerWrapper").append("<div class='player_skin' style='width:100%; height:100%; overflow:hidden; position: absolute; font-family: &apos;Helvetica Neue&apos;,Helvetica,Arial,sans-serif;'></div>");
      $("#" + elementId + " .player_skin").css("z-index", OO.CSS.ALICE_SKIN_Z_INDEX);
      this.state.mainVideoElement = $("#" + elementId + " .video");
      this.state.playerParam = params;
      this.state.elementId = elementId;

      var tmpLocalizableStrings = {};

      // Would be a good idea to also (or only) wait for skin metadata to load. Load metadata here
      $.getJSON(params.skin.config, _.bind(function(data) {
        //load language jsons
        data.localization.availableLanguageFile.forEach(function(languageObj){
          $.getJSON(languageObj.languageFile, _.bind(function(data) {
            tmpLocalizableStrings[languageObj.language] = data;
            this.renderSkin();
          }, this));
        }, this);

        //Override data in skin config with possible inline data input by the user
        $.extend(true, data, params.skin.inline);

        this.skin = React.render(
          React.createElement(Skin, {skinConfig: data, localizableStrings: tmpLocalizableStrings, language: Utils.getLanguageToUse(data), controller: this, closedCaptionOptions: this.state.closedCaptionOptions, pauseAnimationDisabled: this.state.pauseAnimationDisabled}), document.querySelector("#" + elementId + " .player_skin")
        );
        var accessibilityControls = new AccessibilityControls(this); //keyboard support
        this.state.configLoaded = true;
        this.renderSkin();

        $("#" + elementId + " .player_skin").append("<div class='player_skin_plugins'></div>");
        this.state.pluginsElement = $("#" + elementId + " .player_skin_plugins");
        this.state.pluginsElement.mouseover(
          function() {
            this.showControlBar();
            this.renderSkin();
            this.startHideControlBarTimer();
          }.bind(this)
        );
        this.state.pluginsElement.mouseout(
          function() {
            this.hideControlBar();
          }.bind(this)
        );
        this.mb.publish(OO.EVENTS.UI_READY, {
          videoWrapperClass: "innerWrapper",
          pluginsClass: "player_skin_plugins"
        });
      }, this));

      this.state.isMobile = Utils.isMobile();

      this.externalPluginSubscription();
      this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
    },

    onVcVideoElementCreated: function() {
      this.state.mainVideoElement = $("#" + this.state.elementId + " .video");
      if (Utils.isIE10()) {
        this.state.mainVideoElement.attr("controls", "controls");
      }
    },

    onPlayerDestroy: function (event) {
      var elementId = this.state.elementId;
      var mountNode = document.querySelector('#' + elementId + ' .player_skin');
      // remove mounted Skin component
      React.unmountComponentAtNode(mountNode);
      this.mb = null;
    },

    onEmbedCodeChanged: function(event, embedCode, options) {
      this.state.assetId = embedCode;
      $.extend(true, this.state.playerParam, options);
    },

    onAuthorizationFetched: function(event, authorization) {
      this.state.authorization = authorization;
    },

    onContentTreeFetched: function (event, contentTree) {
      this.resetUpNextInfo();
      this.state.contentTree = contentTree;
      this.state.playerState = CONSTANTS.STATE.START;
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

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered, startEnd, videoId) {
      if (videoId == "main") {
        this.state.mainVideoPlayhead = currentPlayhead;
      }
      else if (videoId == OO.VIDEO.ADS) {
        //adVideoDuration is only used in adPanel ad marquee
        this.state.adVideoDuration = duration;
      }
      // The code inside if statement is only for up next, however, up next does not apply to Ad screen.
      // So we only need to update the playhead for ad screen.
      this.state.duration = duration;
      if (this.state.screenToShow !== CONSTANTS.SCREEN.AD_SCREEN ) {
        if (this.skin.props.skinConfig.upNext.showUpNext) {
          if (!(Utils.isIPhone() || (Utils.isIos() && this.state.fullscreen))){//no UpNext for iPhone or fullscreen iPad
            this.showUpNextScreenWhenReady(currentPlayhead, duration);
          }
        } else if (this.state.playerState === CONSTANTS.STATE.PLAYING) {
          this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
        } else if (this.state.playerState === CONSTANTS.STATE.PAUSE) {
          this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        }
      }
      if (!this.state.seeking) {
        this.skin.updatePlayhead(currentPlayhead, duration, buffered);
      } else {
        this.state.queuedPlayheadUpdate = [currentPlayhead, duration, buffered];
      }
    },

    showUpNextScreenWhenReady: function(currentPlayhead, duration) {
      var timeToShow = 0;
      var stringTimeToShow = this.skin.props.skinConfig.upNext.timeToShow;

      if (stringTimeToShow.indexOf('%') === -1){
        // time to show is based on seconds from the end
        timeToShow = parseInt(stringTimeToShow);
      } else {
        // time to show is based on percentage of duration from the beginning
        timeToShow = (1 - parseInt(stringTimeToShow)/100) * duration;
      }

      this.state.upNextInfo.timeToShow = timeToShow;

      if (duration - currentPlayhead <= timeToShow &&
        !this.state.upNextInfo.countDownCancelled &&
        this.state.isPlayingAd !== true &&
        this.state.upNextInfo.upNextData !== null && (this.state.playerState === CONSTANTS.STATE.PLAYING || this.state.playerState === CONSTANTS.STATE.PAUSE)) {
        this.state.upNextInfo.showing = true;
      }
      else {
        this.state.upNextInfo.showing = false;
      }
    },

    onPlaying: function(event, source) {
      if (source == OO.VIDEO.MAIN) {
        this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
        this.state.playerState = CONSTANTS.STATE.PLAYING;
        if (Utils.isSafari()){
          //Safari only can set cc when the video is playing, not before
          this.setClosedCaptionsLanguage();
        }
        this.state.mainVideoElement.css(InlineStyle.pauseScreenStyle.videoUnblur);
        this.renderSkin();
      }
      if (source == OO.VIDEO.ADS) {
        if (this.state.currentAdsInfo.currentAdItem !== null) {
          this.state.playerState = CONSTANTS.STATE.PLAYING;
          //Set the screen to ad screen in case current screen does not involve video playback, such as discovery
          this.state.screenToShow = CONSTANTS.SCREEN.AD_SCREEN;
          this.renderSkin();
        }
      }
    },

    onPause: function(event, props) {
      if (props === CONSTANTS.PAUSE_REASON.AD_PLAYBACK){
        this.state.isPlayingAd = true;
        this.state.pauseAnimationDisabled = true;
      }
    },

    onPaused: function(eventname, videoId) {
      if (videoId == OO.VIDEO.MAIN && this.state.screenToShow != CONSTANTS.SCREEN.AD_SCREEN && this.state.screenToShow != CONSTANTS.SCREEN.LOADING_SCREEN) {
        if (this.state.duration - this.state.mainVideoPlayhead < 0.01) { //when video ends, we get paused event before played event
          this.state.pauseAnimationDisabled = true;
        }
        if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "discovery"
            && !(Utils.isIPhone() || (Utils.isIos() && this.state.fullscreen))) {
          OO.log("Should display DISCOVERY_SCREEN on pause");
          this.sendDiscoveryDisplayEvent("pauseScreen");
          this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
        } else if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === "social") {
          // Remove this comment once pause screen implemented
        } else {
          // default
          this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        }
        this.state.playerState = CONSTANTS.STATE.PAUSE;
        this.state.mainVideoElement.css(InlineStyle.pauseScreenStyle.videoBlur);
        this.renderSkin();
      }
      else if (videoId == OO.VIDEO.ADS){
        this.state.playerState = CONSTANTS.STATE.PAUSE;
        this.renderSkin();
      }
    },

    onPlayed: function() {
      var duration = this.state.mainVideoDuration;
      this.state.duration = duration;
      this.skin.updatePlayhead(duration, duration, duration);

      if (this.state.upNextInfo.delayedSetEmbedCodeEvent) {
        var delayedContentData = this.state.upNextInfo.delayedContentData;
        this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
        this.mb.publish(OO.EVENTS.SET_EMBED_CODE, delayedContentData.clickedVideo.embed_code);
        this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_CLICK_EVENT, delayedContentData);
        this.state.upNextInfo.delayedSetEmbedCodeEvent = false;
        this.state.upNextInfo.delayedContentData = null;
      }
      else if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === "discovery"
               && !(Utils.isIPhone() || (Utils.isIos() && this.state.fullscreen))) {
        OO.log("Should display DISCOVERY_SCREEN on end");
        this.sendDiscoveryDisplayEvent("endScreen");
        this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
      } else if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === "share") {
        this.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
      } else {
        this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
      }
      this.skin.updatePlayhead(this.state.duration, this.state.duration, this.state.duration);
      this.state.playerState = CONSTANTS.STATE.END;
      this.renderSkin();
    },

    onVcPlayed: function(event, source) {
      if (source == OO.VIDEO.MAIN) {
        this.state.mainVideoDuration = this.state.duration;
      }
    },

    onSeeked: function(event) {
      this.state.seeking = false;
      if (this.state.queuedPlayheadUpdate) {
        OO.log("popping queued update");
        this.skin.updatePlayhead.apply(this.skin, this.state.queuedPlayheadUpdate);
        this.state.queuedPlayheadUpdate = null;
        this.renderSkin();
      }
      if (Utils.isIos() && this.state.screenToShow == CONSTANTS.SCREEN.END_SCREEN && this.state.fullscreen) {
        this.state.pauseAnimationDisabled = true;
        this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        this.state.playerState = CONSTANTS.STATE.PAUSE;
      }
    },

    onPlaybackReady: function(event) {
      this.state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
      this.renderSkin({"contentTree": this.state.contentTree});
    },

    onBuffering: function(event) {
      this.state.buffering = true;
      this.renderSkin();
    },

    onBuffered: function(event) {
      if (this.state.buffering === true) {
        this.state.buffering = false;
        this.renderSkin();
      }
    },

    /********************************************************************
      ADS RELATED EVENTS
    *********************************************************************/

    onAdsPlayed: function(event) {
      OO.log("onAdsPlayed is called from event = " + event);
      this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
      this.state.duration = 0;
      this.skin.updatePlayhead(0, 0, 0);
      this.state.isPlayingAd = false;
      this.state.pluginsElement.removeClass("showing");
      this.renderSkin();
    },

    onWillPlayAds: function(event) {
      OO.log("onWillPlayAds is called from event = " + event);
      this.state.isPlayingAd = true;
      this.state.pluginsElement.addClass("showing");
    },

    onAdPodStarted: function(event, numberOfAds) {
      OO.log("onAdPodStarted is called from event = " + event + "with " + numberOfAds + "ads");
      this.state.currentAdsInfo.numberOfAds = numberOfAds;
      this.renderSkin();
    },

    onWillPlaySingleAd: function(event, adItem) {
      OO.log("onWillPlaySingleAd is called with adItem = " + adItem);
      if (adItem !== null) {
        this.state.adVideoDuration = adItem.duration;
        this.state.screenToShow = CONSTANTS.SCREEN.AD_SCREEN;
        this.state.isPlayingAd = true;
        this.state.currentAdsInfo.currentAdItem = adItem;
        this.state.playerState = CONSTANTS.STATE.PLAYING;
        this.skin.state.currentPlayhead = 0;
        this.state.mainVideoElement.css(InlineStyle.pauseScreenStyle.videoUnblur);
        this.renderSkin();
      }
    },

    onSingleAdPlayed: function(event) {
      OO.log("onSingleAdPlayed is called");
      this.state.isPlayingAd = false;
      this.state.adVideoDuration = 0;
      this.state.currentAdsInfo.skipAdButtonEnabled = false;
    },

    onShowAdSkipButton: function(event) {
      this.state.currentAdsInfo.skipAdButtonEnabled = true;
      this.renderSkin();
    },

    onSkipAdClicked: function(event) {
      OO.log("onSkipAdClicked is called");
      this.state.currentAdsInfo.skipAdButtonEnabled = false;
      this.mb.publish(OO.EVENTS.SKIP_AD);
      this.renderSkin();
    },

    onAdsClicked: function(source) {
      OO.log("on ads clicked is called", source);
      this.mb.publish(OO.EVENTS.ADS_CLICKED, {"source": source});
    },

    publishOverlayRenderingEvent: function(marginHeight) {
      this.mb.publish(OO.EVENTS.OVERLAY_RENDERING, {"marginHeight": marginHeight});
    },

    onWillPlayNonlinearAd: function(event, url) {
      if(url.url) {
        this.state.adOverlayUrl = url.url;
        this.state.showAdOverlay = true;
      }
      this.renderSkin();
    },

    closeNonlinearAd: function(event) {
      this.state.adOverlayUrl = null;
      this.state.showAdOverlay = false;
      this.state.showAdOverlayCloseButton = false;
      this.renderSkin();
    },

    hideNonlinearAd: function(event) {
      this.state.showAdOverlay = false;
      this.renderSkin();
    },

    showNonlinearAd: function(event) {
      this.state.showAdOverlay = true;
      this.renderSkin();
    },

    showNonlinearAdCloseButton: function(event) {
      this.state.showAdOverlayCloseButton = true;
      this.renderSkin();
    },

    onClosedCaptionsInfoAvailable: function(event, languages) {
      this.state.closedCaptionOptions.availableLanguages = languages;

      if (languages.languages.length == 1){//if only one language, set it as default language
        this.state.closedCaptionOptions.language = languages.languages[0];
      }

      if (this.state.closedCaptionOptions.enabled){
        this.setClosedCaptionsLanguage();
      }
    },

    onClosedCaptionCueChanged: function(event, data) {
      // saved for the future use
    },

    onRelatedVideosFetched: function(event, relatedVideos) {
      OO.log("onRelatedVideosFetched is called");
      this.state.discoveryData = {relatedVideos: relatedVideos.videos};
      this.state.upNextInfo.upNextData = relatedVideos.videos[0];
      this.renderSkin();
    },

    onFullscreenChanged: function(event, fullscreen, paused) {
      // iPhone end screen is the same as start screen, except for the replay button
      if (Utils.isIPhone() && (this.state.playerState == CONSTANTS.STATE.END || this.state.playerState == CONSTANTS.STATE.PAUSE)){
        this.state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
      }

      this.state.fullscreen = fullscreen;
      this.renderSkin();
    },

    onErrorEvent: function(event, errorCode){
      this.unsubscribeFromMessageBus();

      this.state.screenToShow = CONSTANTS.SCREEN.ERROR_SCREEN;
      this.state.playerState = CONSTANTS.STATE.ERROR;
      this.state.errorCode = errorCode;
      this.renderSkin();
    },

    unsubscribeFromMessageBus: function(){
      this.mb.unsubscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.AUTHORIZATION_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PLAYED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PLAYING, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PAUSED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.SEEKED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYBACK_READY, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.BUFFERING, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.BUFFERED, 'customerUi');

      if (!Utils.isIPhone()) {
        //since iPhone is always playing in full screen and not showing our skin, don't need to render skin
        this.mb.unsubscribe(OO.EVENTS.ADS_PLAYED, "customerUi");
        this.mb.unsubscribe(OO.EVENTS.WILL_PLAY_ADS , "customerUi");

        this.mb.unsubscribe(OO.EVENTS.AD_POD_STARTED, "customerUi");

        this.mb.unsubscribe(OO.EVENTS.WILL_PLAY_SINGLE_AD , "customerUi");
        this.mb.unsubscribe(OO.EVENTS.SINGLE_AD_PLAYED , "customerUi");

        this.mb.unsubscribe(OO.EVENTS.WILL_PLAY_NONLINEAR_AD, "customerUi");
        this.mb.unsubscribe(OO.EVENTS.NONLINEAR_AD_PLAYED, "customerUi");
        this.mb.unsubscribe(OO.EVENTS.HIDE_NONLINEAR_AD, "customerUi");
        this.mb.unsubscribe(OO.EVENTS.SHOW_NONLINEAR_AD, "customerUi");

        this.mb.unsubscribe(OO.EVENTS.SHOW_AD_SKIP_BUTTON, "customerUi");

        if (OO.EVENTS.DISCOVERY_API) {
          this.mb.unsubscribe(OO.EVENTS.DISCOVERY_API.RELATED_VIDEOS_FETCHED, "customerUi");
        }
      }

      this.mb.unsubscribe(OO.EVENTS.CLOSED_CAPTIONS_INFO_AVAILABLE, "customerUi");
      this.mb.unsubscribe(OO.EVENTS.CLOSED_CAPTION_CUE_CHANGED, "customerUi");
      this.mb.unsubscribe(OO.EVENTS.VOLUME_CHANGED, "customerUi");
      this.mb.unsubscribe(OO.EVENTS.FULLSCREEN_CHANGED, "customerUi");
      this.mb.unsubscribe(OO.EVENTS.ERROR, "customerUi");
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
        case CONSTANTS.STATE.PLAYING:
          this.togglePlayPause();
          this.sendDiscoveryDisplayEvent("pauseScreen");
          setTimeout(function() {
            this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
            this.state.playerState = CONSTANTS.STATE.PAUSE;
            this.renderSkin();
            OO.log("finished toggleDiscoveryScreen");
          }.bind(this), 1);
          break;
        case CONSTANTS.STATE.PAUSE:
          if(this.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
            this.state.pauseAnimationDisabled = true;
            this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
          }
          else {
            this.sendDiscoveryDisplayEvent("pauseScreen");
            this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
          }
          break;
        case CONSTANTS.STATE.END:
          if(this.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
            this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
          }
          else {
            this.sendDiscoveryDisplayEvent("endScreen");
            this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
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
        case CONSTANTS.STATE.START:
          this.mb.publish(OO.EVENTS.INITIAL_PLAY);
          break;
        case CONSTANTS.STATE.END:
          this.mb.publish(OO.EVENTS.REPLAY);
          break;
        case CONSTANTS.STATE.PAUSE:
          this.mb.publish(OO.EVENTS.PLAY);
          break;
        case CONSTANTS.STATE.PLAYING:
          this.mb.publish(OO.EVENTS.PAUSE);
          break;
      }
    },

    seek: function(seconds) {
      this.mb.publish(OO.EVENTS.SEEK, seconds);
      if (this.state.screenToShow == CONSTANTS.SCREEN.END_SCREEN) {
        this.state.pauseAnimationDisabled = true;
        this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        this.state.playerState = CONSTANTS.STATE.PAUSE;
        this.renderSkin();
      }
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
      if (this.state.screenToShow == CONSTANTS.SCREEN.SHARE_SCREEN) {
        this.closeScreen();
      }
      else {
        if (this.state.playerState == CONSTANTS.STATE.PLAYING){
          this.mb.publish(OO.EVENTS.PAUSE);
        }
        setTimeout(function() {
          this.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
          this.renderSkin();
        }.bind(this), 1);
      }
    },

    sendDiscoveryClickEvent: function(selectedContentData, isAutoUpNext) {
      this.state.upNextInfo.showing = false;
      if (isAutoUpNext){
        this.state.upNextInfo.delayedContentData = selectedContentData;
        this.state.upNextInfo.delayedSetEmbedCodeEvent = true;
      }
      else {
        this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
        this.renderSkin();
        this.mb.publish(OO.EVENTS.PAUSE);
        this.mb.publish(OO.EVENTS.SET_EMBED_CODE, selectedContentData.clickedVideo.embed_code);
        this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_CLICK_EVENT, selectedContentData);
      }
    },

    sendDiscoveryDisplayEvent: function(screen) {
      var eventData = {
        "relatedVideos" : this.state.discoveryData.relatedVideos,
        "custom" : { "source" : screen}
      };
      this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_DISPLAY_EVENT, eventData);
    },

    setClosedCaptionsLanguage: function(){
      var language = this.state.closedCaptionOptions.enabled ? this.state.closedCaptionOptions.language : "";
      var mode = this.state.closedCaptionOptions.enabled ? "showing" : "disabled";
      this.mb.publish(OO.EVENTS.SET_CLOSED_CAPTIONS_LANGUAGE, language, {"mode": mode});
    },

    toggleClosedCaptionScreen: function() {
      if (this.state.screenToShow == CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN) {
        this.closeScreen();
      }
      else {
        if (this.state.playerState == CONSTANTS.STATE.PLAYING){
          this.mb.publish(OO.EVENTS.PAUSE);
        }
        setTimeout(function() {
          this.state.screenToShow = CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN;
          this.renderSkin();
        }.bind(this), 1);
      }
    },

    closeScreen: function() {
      this.state.pauseAnimationDisabled = true;
      if (this.state.playerState == CONSTANTS.STATE.PAUSE) {
        this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
      }
      else if (this.state.playerState == CONSTANTS.STATE.END) {
        this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
      }
      this.renderSkin();
    },

    onClosedCaptionLanguageChange: function(language) {
      this.state.closedCaptionOptions.language = language;
      this.setClosedCaptionsLanguage();
      this.renderSkin();
    },

    toggleClosedCaptionEnabled: function() {
      this.state.closedCaptionOptions.enabled = !this.state.closedCaptionOptions.enabled;
      this.setClosedCaptionsLanguage();
      this.renderSkin();
    },

    upNextDismissButtonClicked: function() {
      this.state.upNextInfo.countDownCancelled = true;
      this.state.upNextInfo.showing = false;
      this.renderSkin();
    },

    toggleMoreOptionsScreen: function() {
      if (this.state.screenToShow == CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN) {
        this.closeMoreOptionsScreen();
      } else {
        this.displayMoreOptionsScreen();
      }
    },

    closeMoreOptionsScreen: function() {
      this.state.pauseAnimationDisabled = true;
      this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
      this.state.playerState = CONSTANTS.STATE.PAUSE;
      this.renderSkin();
    },

    displayMoreOptionsScreen: function() {
      this.mb.publish(OO.EVENTS.PAUSE);
      setTimeout(function() {
        this.state.screenToShow = CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN;
        this.renderSkin();
      }.bind(this), 1);
    },

    enablePauseAnimation: function(){
      this.state.pauseAnimationDisabled = false;
    },

    beginSeeking: function() {
      this.state.seeking = true;
    },

    updateSeekingPlayhead: function(playhead) {
      playhead = Math.min(Math.max(0, playhead), this.skin.state.duration);
      this.skin.updatePlayhead(playhead, this.skin.state.duration, this.skin.state.buffered);
    },

    hideVolumeSliderBar: function() {
      this.state.volumeState.volumeSliderVisible = false;
      this.renderSkin();
    },

    showVolumeSliderBar: function() {
      this.state.volumeState.volumeSliderVisible = true;
      this.renderSkin();
    },

    startHideControlBarTimer: function() {
      if (this.skin.props.skinConfig.controlBar.autoHide == true) {
        this.cancelTimer();
        var timer = setTimeout(function() {
          if(this.state.controlBarVisible === true){
            this.hideControlBar();
          }
        }.bind(this), 3000);
        this.state.timer = timer;
      }
    },

    showControlBar: function() {
      this.state.controlBarVisible = true;
    },

    hideControlBar: function() {
      this.state.controlBarVisible = false;
    },

    cancelTimer: function() {
      if (this.state.timer !== null){
        clearTimeout(this.state.timer);
        this.state.timer = null;
      }
    }
  };

  return Html5Skin;
});
