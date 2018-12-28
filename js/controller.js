/** ******************************************************************
 CONTROLLER
 *********************************************************************/
var React = require('react');
var ReactDOM = require('react-dom');
var Utils = require('./components/utils');
var CONSTANTS = require('./constants/constants');
var AccessibilityControls = require('./components/accessibilityControls');
var DeepMerge = require('deepmerge');
var Fullscreen = require('screenfull');
var Skin = require('./skin');
var SkinJSON = require('../config/skin');
var Localization = {
  languageFiles: {
    en: require('../config/languageFiles/en.json'),
    es: require('../config/languageFiles/es.json'),
    ja: require('../config/languageFiles/ja.json'),
    ko: require('../config/languageFiles/ko.json'),
    zh: require('../config/languageFiles/zh.json'),
  }
};

module.exports = function(OO, _, $, W) {
  // Check if the player is at least v4. If not, the skin cannot load.
  var UNSUPPORTED_PLAYER_VERSION = 3;

  if (!OO.playerParams.core_version || OO.playerParams.core_version <= UNSUPPORTED_PLAYER_VERSION) {
    console.error('Html5Skin requires at least player version 4.');
    return null;
  }

  if (OO.publicApi && OO.publicApi.VERSION) {
    // This variable gets filled in by the build script
    OO.publicApi.VERSION.skin = { releaseVersion: '<SKIN_VERSION>', rev: '<SKIN_REV>' };
  }

  var Html5Skin = function(mb, id) {
    this.mb = mb;
    this.id = id;
    this.accessibilityControls = null;
    this.videoVrSource = null;
    this.videoVr = false;
    this.captionDirection = '';
    this.isNewVrVideo = true;
    this.vrMobileOrientationChecked = false;
    this.checkDeviceOrientation = false;
    this.isVrStereo = false;
    this.toggleButtons = {};
    this.handleVrMobileOrientation = this.handleVrMobileOrientation.bind(this);
    this.languageList = [];
    this.state = {
      playerParam: {},
      skinMetaData: {},
      attributes: {},
      persistentSettings: {
        closedCaptionOptions: {}
      },
      assetId: null,
      contentTree: {},
      thumbnails: null,
      isLiveStream: false,
      screenToShow: null,
      playerState: null,
      currentVideoId: null,
      discoveryData: null,
      forceCountDownTimerOnEndScreen: false,
      isPlayingAd: false,
      adOverlayUrl: null,
      showAdOverlay: false,
      showAdOverlayCloseButton: false,
      showAdControls: true,
      showAdMarquee: true,
      isOoyalaAds: false,
      afterOoyalaAd: false,
      configLoaded: false,
      config: {},
      customSkinJSON: {},
      fullscreen: false,
      pauseAnimationDisabled: false,
      adPauseAnimationDisabled: true,
      pausedCallback: null,
      seeking: false,
      queuedPlayheadUpdate: null,
      accessibilityControlsEnabled: false,
      duration: 0,
      mainVideoDuration: 0,
      adVideoDuration: 0,
      adStartTime: 0,
      adPausedTime: 0,
      adEndTime: 0,
      adWasPaused: false,
      adPauseDuration: 0,
      adRemainingTime: 0,
      elementId: null,
      mainVideoContainer: null,
      mainVideoInnerWrapper: null,
      mainVideoElement: null,
      mainVideoElementContainer: null, // TODO: Temporary workaround for PBW-6954
      mainVideoMediaType: null,
      mainVideoAspectRatio: 0,
      pluginsElement: null,
      pluginsClickElement: null,
      buffering: false, // Do NOT set manually, call setBufferingState
      mainVideoBuffered: null,
      mainVideoPlayhead: 0,
      adVideoPlayhead: 0,
      focusedElement: null,
      focusedControl: null, // Stores the id of the control button element that is currently focused

      currentAdsInfo: {
        currentAdItem: null,
        numberOfAds: 0,
        skipAdButtonEnabled: false
      },

      closedCaptionsInfoCache: {},
      closedCaptionOptions: {
        enabled: null,
        language: null,
        availableLanguages: null,
        cueText: null,
        showPopover: false,
        autoFocus: false,
        textColor: null,
        windowColor: null,
        backgroundColor: null,
        textOpacity: null,
        backgroundOpacity: null,
        windowOpacity: null,
        fontType: null,
        fontSize: null,
        textEnhancement: null
      },

      videoQualityOptions: {
        availableBitrates: null,
        selectedBitrate: null,
        showPopover: false,
        autoFocus: false
      },

      volumeState: {
        volume: 1,
        muted: false,
        volumeSliderVisible: false,
        mutingForAutoplay: false,
        unmuteIconCollapsed: false
      },

      upNextInfo: {
        upNextData: null,
        countDownFinished: false,
        countDownCancelled: false,
        timeToShow: 0,
        showing: false,
        delayedSetEmbedCodeEvent: false,
        delayedContentData: null
      },

      scrubberBar: {
        isHovering: false
      },

      skipControls: {
        hasPreviousVideos: false,
        hasNextVideos: false,
        requestPreviousTimestamp: 0
      },

      playbackSpeedOptions: {
        currentSpeed: CONSTANTS.PLAYBACK_SPEED.DEFAULT_VALUE,
        showPopover: false,
        autoFocus: false,
      },

      moreOptionsItems: null,

      isMobile: false,
      controlBarVisible: true,
      forceControlBarVisible: false,
      timer: null,
      bufferingTimer: null,
      errorCode: null,
      isSubscribed: false,
      isPlaybackReadySubscribed: false,
      isInitialPlay: false,
      initialPlayHasOccurred: false,
      isFullScreenSupported: false,
      isVideoFullScreenSupported: false,
      isFullWindow: false,
      autoPauseDisabled: false,

      isClickedOutside: false,
      vrViewingDirection: { yaw: 0, roll: 0, pitch: 0 },

      hideMultiAudioIcon: false,
      multiAudio: null,
      multiAudioOptions: {
        enabled: null,
        showPopover: false,
        autoFocus: false
      },

      cast: {
        showButton: false,
        connected: false,
        device: "",
        isReceiver: false
      },

      audioOnly: false
    };

    this.init();
  };

  Html5Skin.prototype = {
    init: function() {
      // player events
      this.mb.subscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi', _.bind(this.onPlayerCreated, this));
      this.mb.subscribe(
        OO.EVENTS.VC_VIDEO_ELEMENT_CREATED,
        'customerUi',
        _.bind(this.onVcVideoElementCreated, this)
      );
      this.mb.subscribe(OO.EVENTS.DESTROY, 'customerUi', _.bind(this.onPlayerDestroy, this));
      this.mb.subscribe(OO.EVENTS.SET_EMBED_CODE, 'customerUi', _.bind(this.onSetEmbedCode, this));
      this.mb.subscribe(OO.EVENTS.EMBED_CODE_CHANGED, 'customerUi', _.bind(this.onEmbedCodeChanged, this));
      this.mb.subscribe(
        OO.EVENTS.EMBED_CODE_CHANGED_AFTER_OOYALA_AD,
        'customerUi',
        _.bind(this.onEmbedCodeChangedAfterOoyalaAd, this)
      );
      this.mb.subscribe(
        OO.EVENTS.CONTENT_TREE_FETCHED,
        'customerUi',
        _.bind(this.onContentTreeFetched, this)
      );
      this.mb.subscribe(OO.EVENTS.THUMBNAILS_FETCHED, 'customerUi', _.bind(this.onThumbnailsFetched, this)); // xenia: to be replaced by a more appropriate event
      this.mb.subscribe(
        OO.EVENTS.AUTHORIZATION_FETCHED,
        'customerUi',
        _.bind(this.onAuthorizationFetched, this)
      );
      this.mb.subscribe(
        OO.EVENTS.SKIN_METADATA_FETCHED,
        'customerUi',
        _.bind(this.onSkinMetaDataFetched, this)
      );
      this.mb.subscribe(OO.EVENTS.ATTRIBUTES_FETCHED, 'customerUi', _.bind(this.onAttributesFetched, this));
      this.mb.subscribe(OO.EVENTS.ASSET_CHANGED, 'customerUi', _.bind(this.onAssetChanged, this));
      this.mb.subscribe(OO.EVENTS.ASSET_UPDATED, 'customerUi', _.bind(this.onAssetUpdated, this));
      this.mb.subscribe(OO.EVENTS.PLAYBACK_READY, 'customerUi', _.bind(this.onPlaybackReady, this));
      this.mb.subscribe(OO.EVENTS.VIDEO_VR, 'customerUi', _.bind(this.onSetVideoVr, this));
      this.mb.subscribe(OO.EVENTS.VIDEO_TYPE_CHANGED, 'customerUi', _.bind(this.onClearVideoType, this));
      this.mb.subscribe(
        OO.EVENTS.VR_DIRECTION_CHANGED,
        'customerUi',
        _.bind(this.setVrViewingDirection, this)
      );
      this.mb.subscribe(OO.EVENTS.RECREATING_UI, 'customerUi', _.bind(this.recreatingUI, this));
      this.mb.subscribe(
        OO.EVENTS.POSITION_IN_PLAYLIST_DETERMINED,
        'customerUi',
        _.bind(this.onPositionInPlaylistDetermined, this)
      );
      this.mb.subscribe(OO.EVENTS.ERROR, 'customerUi', _.bind(this.onErrorEvent, this));
      this.mb.addDependent(OO.EVENTS.PLAYBACK_READY, OO.EVENTS.UI_READY);
      this.mb.subscribe(OO.EVENTS.CHROMECAST_START_CAST, 'customerUi', _.bind(this.onChromecastStartCast, this));
      this.mb.subscribe(OO.EVENTS.CHROMECAST_END_CAST, 'customerUi', _.bind(this.onChromecastEndCast, this));
      this.state.isPlaybackReadySubscribed = true;
    },

    subscribeBasicPlaybackEvents: function() {
      if (!this.state.isSubscribed) {
        this.mb.subscribe(
          OO.EVENTS.SEND_QUALITY_CHANGE,
          'customerUi',
          _.bind(this.receiveVideoQualityChangeEvent, this)
        );
        this.mb.subscribe(OO.EVENTS.INITIAL_PLAY, 'customerUi', _.bind(this.onInitialPlay, this));
        this.mb.subscribe(OO.EVENTS.VC_PLAY, 'customerUi', _.bind(this.onVcPlay, this));
        this.mb.subscribe(OO.EVENTS.VC_PLAYED, 'customerUi', _.bind(this.onVcPlayed, this));
        this.mb.subscribe(OO.EVENTS.VC_PLAYING, 'customerUi', _.bind(this.onPlaying, this));
        this.mb.subscribe(OO.EVENTS.VC_PAUSED, 'customerUi', _.bind(this.onPaused, this));
        this.mb.subscribe(OO.EVENTS.VC_PAUSE, 'customerUi', _.bind(this.onPause, this));
        this.mb.subscribe(OO.EVENTS.PLAYED, 'customerUi', _.bind(this.onPlayed, this));
        this.mb.subscribe(
          OO.EVENTS.PLAYHEAD_TIME_CHANGED,
          'customerUi',
          _.bind(this.onPlayheadTimeChanged, this)
        );
        this.mb.subscribe(OO.EVENTS.SEEK, 'customerUi', this.onSeek.bind(this));
        this.mb.subscribe(OO.EVENTS.SEEKED, 'customerUi', _.bind(this.onSeeked, this));
        this.mb.subscribe(OO.EVENTS.BUFFERING, 'customerUi', _.bind(this.onBuffering, this));
        this.mb.subscribe(OO.EVENTS.BUFFERED, 'customerUi', _.bind(this.onBuffered, this));
        this.mb.subscribe(
          OO.EVENTS.CLOSED_CAPTIONS_INFO_AVAILABLE,
          'customerUi',
          _.bind(this.onClosedCaptionsInfoAvailable, this)
        );
        this.mb.subscribe(OO.EVENTS.MULTI_AUDIO_FETCHED, 'customerUi', _.bind(this.onMultiAudioFetched, this));
        this.mb.subscribe(OO.EVENTS.MULTI_AUDIO_CHANGED, 'customerUi', _.bind(this.onMultiAudioChanged, this));
        this.mb.subscribe(
          OO.EVENTS.BITRATE_INFO_AVAILABLE,
          'customerUi',
          _.bind(this.onBitrateInfoAvailable, this)
        );
        this.mb.subscribe(
          OO.EVENTS.CLOSED_CAPTION_CUE_CHANGED,
          'customerUi',
          _.bind(this.onClosedCaptionCueChanged, this)
        );
        this.mb.subscribe(
          OO.EVENTS.CHANGE_CLOSED_CAPTION_LANGUAGE,
          'customerUi',
          _.bind(this.onChangeClosedCaptionLanguage, this)
        );
        this.mb.subscribe(OO.EVENTS.VOLUME_CHANGED, 'customerUi', _.bind(this.onVolumeChanged, this));
        this.mb.subscribe(OO.EVENTS.MUTE_STATE_CHANGED, 'customerUi', _.bind(this.onMuteStateChanged, this));
        this.mb.subscribe(
          OO.EVENTS.PLAYBACK_SPEED_CHANGED,
          'customerUi',
          _.bind(this.onPlaybackSpeedChanged, this)
        );
        this.mb.subscribe(
          OO.EVENTS.VC_VIDEO_ELEMENT_IN_FOCUS,
          'customerUi',
          _.bind(this.onVideoElementFocus, this)
        );
        this.mb.subscribe(OO.EVENTS.REPLAY, 'customerUi', _.bind(this.onReplay, this));
        this.mb.subscribe(
          OO.EVENTS.ASSET_DIMENSION,
          'customerUi',
          _.bind(this.onAssetDimensionsReceived, this)
        );

        this.mb.subscribe(OO.EVENTS.HA_WILL_FAILOVER, 'customerUi', _.bind(this.onHAWillFailover, this));
        this.mb.subscribe(
          OO.EVENTS.HA_FAILOVER_COMPLETE,
          'customerUi',
          _.bind(this.onHAFailoverComplete, this)
        );
        this.mb.subscribe(OO.EVENTS.HA_FAILOVER_ERROR, 'customerUi', _.bind(this.onHAFailoverError, this));

        // PLAYBACK_READY is a fundamental event in the init process that can be unsubscribed by errors.
        // If and only if such has occured, it needs a route to being resubscribed.
        if (!this.state.isPlaybackReadySubscribed) {
          this.mb.subscribe(OO.EVENTS.PLAYBACK_READY, 'customerUi', _.bind(this.onPlaybackReady, this));
        }

        // ad events
        if (Utils.canRenderSkin()) {
          // since iPhone < iOS10 is always playing in full screen and not showing our skin, don't need to render skin
          this.mb.subscribe(OO.EVENTS.ADS_PLAYED, 'customerUi', _.bind(this.onAdsPlayed, this));
          this.mb.subscribe(OO.EVENTS.WILL_PLAY_ADS, 'customerUi', _.bind(this.onWillPlayAds, this));
          this.mb.subscribe(OO.EVENTS.AD_POD_STARTED, 'customerUi', _.bind(this.onAdPodStarted, this));
          this.mb.subscribe(
            OO.EVENTS.WILL_PLAY_SINGLE_AD,
            'customerUi',
            _.bind(this.onWillPlaySingleAd, this)
          );
          this.mb.subscribe(OO.EVENTS.SINGLE_AD_PLAYED, 'customerUi', _.bind(this.onSingleAdPlayed, this));
          this.mb.subscribe(OO.EVENTS.PLAY_NONLINEAR_AD, 'customerUi', _.bind(this.onPlayNonlinearAd, this));
          this.mb.subscribe(OO.EVENTS.NONLINEAR_AD_PLAYED, 'customerUi', _.bind(this.closeNonlinearAd, this));
          this.mb.subscribe(OO.EVENTS.HIDE_NONLINEAR_AD, 'customerUi', _.bind(this.hideNonlinearAd, this));
          this.mb.subscribe(OO.EVENTS.SHOW_NONLINEAR_AD, 'customerUi', _.bind(this.showNonlinearAd, this));
          this.mb.subscribe(
            OO.EVENTS.SHOW_NONLINEAR_AD_CLOSE_BUTTON,
            'customerUi',
            _.bind(this.showNonlinearAdCloseButton, this)
          );
          this.mb.subscribe(
            OO.EVENTS.SHOW_AD_SKIP_BUTTON,
            'customerUi',
            _.bind(this.onShowAdSkipButton, this)
          );
          this.mb.subscribe(OO.EVENTS.SHOW_AD_CONTROLS, 'customerUi', _.bind(this.onShowAdControls, this));
          this.mb.subscribe(OO.EVENTS.SHOW_AD_MARQUEE, 'customerUi', _.bind(this.onShowAdMarquee, this));
        }
      }
      this.state.isSubscribed = true;
    },

    externalPluginSubscription: function() {
      if (OO.EVENTS.DISCOVERY_API) {
        this.mb.subscribe(
          OO.EVENTS.DISCOVERY_API.RELATED_VIDEOS_FETCHED,
          'customerUi',
          _.bind(this.onRelatedVideosFetched, this)
        );
      }
    },

    onHAWillFailover: function() {
      this.state.failoverInProgress = true;
      this.state.pauseAnimationDisabled = true;
      this.renderSkin();
    },

    onHAFailoverComplete: function() {
      this.state.failoverInProgress = false;
      this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
      this.renderSkin();
    },

    onHAFailoverError: function() {
      this.state.failoverInProgress = false;
      // this.state.screenToShow = CONSTANTS.SCREEN.ERROR_SCREEN;
      this.renderSkin();
    },

    /* --------------------------------------------------------------------
     event listeners from core player -> regulate skin STATE
     ---------------------------------------------------------------------*/
    onPlayerCreated: function(event, elementId, params, settings) {
      // subscribe to plugin events
      this.externalPluginSubscription();

      // set state variables
      this.state.mainVideoContainer = $('#' + elementId);
      this.state.mainVideoInnerWrapper = $('#' + elementId + ' .innerWrapper');
      this.state.playerParam = params;
      this.state.persistentSettings = settings;
      this.state.elementId = elementId;
      this.state.isMobile = Utils.isMobile();
      this.state.browserSupportsTouch = Utils.browserSupportsTouch();

      this.state.hideMultiAudioIcon = !!params.hideMultiAudioIcon;

      // initial DOM manipulation
      this.state.mainVideoContainer.addClass('oo-player-container');
      this.state.mainVideoInnerWrapper.addClass('oo-player');
      this.state.mainVideoInnerWrapper.attr('aria-label', CONSTANTS.ARIA_LABELS.VIDEO_PLAYER);
      // Setting the tabindex will let some screen readers recognize this element as a group
      // identified with the ARIA label above. We set it to -1 in order to prevent actual keyboard focus
      this.state.mainVideoInnerWrapper.attr('tabindex', '-1');

      if (!this.state.mainVideoInnerWrapper.children('.oo-player-skin').length) {
        this.state.mainVideoInnerWrapper.append('<div class=\'oo-player-skin\'></div>');
      }

      this.setInlineStyles();

      // load player with page level config param if exist
      if (params.skin && params.skin.config) {
        $.getJSON(
          params.skin.config,
          function(data) {
            this.state.customSkinJSON = data;
            this.loadConfigData(
              this.state.playerParam,
              this.state.persistentSettings,
              data,
              this.state.skinMetaData
            );
          }.bind(this)
        );
      } else {
        this.loadConfigData(
          this.state.playerParam,
          this.state.persistentSettings,
          this.state.customSkinJSON,
          this.state.skinMetaData
        );
      }

      this.accessibilityControls = this.accessibilityControls || new AccessibilityControls(this); // keyboard support
      this.state.screenToShow = CONSTANTS.SCREEN.INITIAL_SCREEN;
    },


    isChromecastEnabled: function (params) {
      var chromecastConfig = params.chromecast;
      var appId = Utils.getPropertyValue(chromecastConfig, 'appId', '');
      if (typeof appId === 'string' && appId !== '' && Utils.getPropertyValue(chromecastConfig, 'enable', false)) {
          return true;
        }
      return false;
    },

    onChromecastStartCast: function (event, deviceName) {
      OO.log("Chromecast Skin:", event, deviceName);
      this.state.pauseAnimationDisabled = true;
      this.renderSkin({cast: {connected:true, device: deviceName}});
    },

    onChromecastEndCast: function (event) {
      OO.log("Chromecast Skin:", event);
      this.state.pauseAnimationDisabled  = false;
      this.renderSkin({cast: {connected:false, device: ""}});
    },

    /**
     * Set style "touch-action: none" only for video 360 on mobile devices
     * see details: https://stackoverflow.com/questions/42206645/konvajs-unable-to-preventdefault-inside-passive-event-listener-due-to-target-be
     */
    setInlineStyles: function() {
      if (this.videoVr && this.state.isMobile) {
        this.state.mainVideoInnerWrapper.attr('style', 'touch-action: none');
      }
    },

    onSetVideoVr: function(event, params) {
      this.videoVr = true;
      this.setInlineStyles();
      if (params) {
        this.videoVrSource = params.source || null; // if we need video vr params
      }
    },

    /**
     * @description
     * Should be used with deviceorientation event listener.
     * Uses for video 360 on mobile devices for setting necessary coordinates (relevant with start device orientation)
     * Before playing this.vrMobileOrientationChecked is equal false,
     * if need to check value for device orientation set this.checkDeviceOrientation = true
     * @param {object} event The event object
     */
    handleVrMobileOrientation: function(event) {
      if (!this.vrMobileOrientationChecked || this.checkDeviceOrientation) {
        const beta = event.beta;
        const gamma = event.gamma;
        const yaw = this.state.vrViewingDirection['yaw'];
        let pitch = this.state.vrViewingDirection['pitch'];
        let dir = beta;
        let orientationType = Utils.getOrientationType();
        if (
          orientationType &&
          (orientationType === 'landscape-secondary' || orientationType === 'landscape-primary')
        ) {
          dir = gamma;
        }
        if (dir !== undefined && dir !== null && Utils.ensureNumber(dir, 0)) {
          const halfAngle = 90; // in degrees
          pitch += -halfAngle + Math.abs(Math.round(dir));
          let params = [yaw, 0, pitch];
          this.setVrViewingDirection(event, yaw, 0, pitch);
          this.onTouchMove(params);
        }
        this.checkDeviceOrientation = false;
      }
    },

    onClearVideoType: function(event, params) {
      this.videoVr = false;
      this.videoVrSource = null;
      this.vrMobileOrientationChecked = false;
    },

    /**
     * Pass into onTouchMove current controller state values for vrViewingDirection
     */
    setControllerVrViewingDirection: function() {
      let vrViewingDirectionList = [
        this.state.vrViewingDirection.yaw,
        this.state.vrViewingDirection.roll,
        this.state.vrViewingDirection.pitch
      ];
      this.onTouchMove(vrViewingDirectionList);
    },

    onVcVideoElementCreated: function(event, params) {
      var videoElement = params.videoElement;
      videoElement = this.findMainVideoElement(videoElement);

      // add loadedmetadata event listener to main video element
      if (videoElement) {
        videoElement.addEventListener('loadedmetadata', this.metaDataLoaded.bind(this));
      }

      if (Utils.isIE10()) {
        videoElement.attr('controls', 'controls');
      }

      if (params.videoId === OO.VIDEO.MAIN) {
        // [PBW-6954]
        // We store mainVideoElementContainer as a temporary workaround in order to
        // make sure that we don't leave the oo-blur class on the wrong element (since
        // the skin can pick the container rather than the video due to a race condition).
        // Note that this could end up being the video itself, but it shouldn't matter.
        var videoElementContainer = params.videoElement;
        if (videoElementContainer && videoElementContainer.length) {
          videoElementContainer = videoElementContainer[0];
        }
        this.state.mainVideoElementContainer = videoElementContainer;

        this.state.mainVideoElement = videoElement;
        this.enableFullScreen();
        this.updateAspectRatio();
      }
      if (this.videoVr) {
        if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', this.handleVrMobileOrientation, false);
        }
      }
    },

    // functions dependent on video metadata
    metaDataLoaded: function() {
      this.enableIosFullScreen();
    },

    onPlayerDestroy: function(event) {
      var elementId = this.state.elementId;
      var mountNode = document.querySelector('#' + elementId + ' .oo-player-skin');
      // remove mounted Skin component
      if (mountNode) {
        ReactDOM.unmountComponentAtNode(mountNode);
      }
      this.stopBufferingTimer();
      this.cleanUpEventListeners();
      document.removeEventListener('deviceorientation', this.handleVrMobileOrientation);
      this.mb = null;
    },

    cleanUpEventListeners: function() {
      this.accessibilityControls.cleanUp();
    },

    /**
     * Event handler for SET_EMBED_CODE message bus event.
     * @private
     * @param {string} event The event's name.
     * @param {string} embedCode The video embed code that will be set.
     */
    onSetEmbedCode: function(event, embedCode) {
      // If a video has played and we're setting a new embed code it means that we
      // will be transitioning to a new video. We make sure to display the loading screen.
      if (this.state.initialPlayHasOccurred && this.state.assetId !== embedCode) {
        this.state.isPlayingAd = false;
        this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
        this.renderSkin();
      }
    },

    onEmbedCodeChangedAfterOoyalaAd: function(event, embedCode, options) {
      if (options) {
        this.state.playerParam = DeepMerge(this.state.playerParam, options);
      }
      this.state.isOoyalaAds = false;
      this.state.afterOoyalaAd = true;
    },

    onEmbedCodeChanged: function(event, embedCode, options) {
      this.state.videoQualityOptions.availableBitrates = null;
      this.state.videoQualityOptions.selectedBitrate = null;
      this.state.closedCaptionOptions.availableLanguages = null;
      this.state.closedCaptionOptions.cueText = null;
      this.state.closedCaptionsInfoCache = {};
      this.state.discoveryData = null;
      this.state.thumbnails = null;
      this.state.afterOoyalaAd = false;
      this.state.currentVideoId = null;
      this.state.multiAudio = null;
      this.resetUpNextInfo(true);

      if (options && options.ooyalaAds === true) {
        this.state.isOoyalaAds = true;
      } else {
        this.state.isOoyalaAds = false;
      }

      this.state.assetId = embedCode;
      if (options) {
        this.state.playerParam = DeepMerge(this.state.playerParam, options);
      }
      this.subscribeBasicPlaybackEvents();
      // New video starts at 0, duration is still unknown.
      // Setting this here will prevent flashing a full progress bar on video transitions.
      if (this.skin) {
        this.skin.updatePlayhead(0, 0, 0, 0)
          .catch(() => {OO.log('onEmbedCodeChanged: Could not set new state for skin')})
      }
    },

    onAuthorizationFetched: function(event, authorization) {
      this.state.isLiveStream = authorization.streams[0].is_live_stream;
    },

    onContentTreeFetched: function(event, contentTree) {
      this.state.contentTree = contentTree;
      this.state.playerState = CONSTANTS.STATE.START;
      var duration = Utils.ensureNumber(contentTree.duration, 0) / 1000;
      if (this.skin) {
        this.skin.updatePlayhead(null, duration)
        .catch(() => {OO.log('onContentTreeFetched: Could not set new state for skin')});
      }
    },

    onSkinMetaDataFetched: function(event, skinMetaData) {
      this.state.skinMetaData = skinMetaData;
      this.loadConfigData(
        this.state.playerParam,
        this.state.persistentSettings,
        this.state.customSkinJSON,
        this.state.skinMetaData
      );
    },

    onAttributesFetched: function(event, attributes) {
      this.state.attributes = attributes;
      // This is the first point at which we know whether the video is anamorphic or not,
      // apply fix if necessary
      this.trySetAnamorphicFixState(true);
    },

    onThumbnailsFetched: function(event, thumbnails) {
      this.state.thumbnails = thumbnails;
    },

    onAssetChanged: function(event, asset) {
      this.state.videoQualityOptions.availableBitrates = null;
      this.state.closedCaptionOptions.availableLanguages = null;
      this.state.closedCaptionsInfoCache = {};
      this.state.discoveryData = null;
      this.subscribeBasicPlaybackEvents();

      this.resetUpNextInfo(true);
      this.state.isOoyalaAds = false;

      this.state.isLiveStream = asset.content.streams[0].is_live_stream;

      var contentTree = {};
      contentTree.title = asset.content.title;
      contentTree.description = asset.content.description;
      contentTree.duration = asset.content.duration;
      contentTree.promo_image = asset.content.posterImages[0].url;

      this.state.contentTree = contentTree;
      this.state.playerState = CONSTANTS.STATE.START;
      // Make sure playhead is reset when we switch to a new video
      this.skin.updatePlayhead(0, contentTree.duration, 0, 0);
    },

    onAssetUpdated: function(event, asset) {
      this.resetUpNextInfo(true);

      this.state.isLiveStream = asset.content.streams[0].is_live_stream;

      this.state.contentTree.title = asset.content.title;
      this.state.contentTree.description = asset.content.description;
      this.state.contentTree.duration = asset.content.duration;
      this.state.contentTree.promo_image = asset.content.posterImages[0].url;

      this.renderSkin({ contentTree: this.state.contentTree });
    },

    isPlaying: function() {
      return (
        this.state.currentVideoId &&
        this.state.playerState !== CONSTANTS.STATE.START &&
        this.state.playerState !== CONSTANTS.STATE.ERROR
      );
    },

    onVolumeChanged: function(event, newVolume, videoId) {
      // ignore the volume change if it came from a source other than the currently playing video
      // but only if currently playing a video. This is to prevent desyncs between video volume
      // and the UI
      if (videoId && videoId !== this.state.currentVideoId && this.isPlaying()) {
        return;
      }
      if (newVolume <= 0) {
        this.state.volumeState.volume = 0;
      } else {
        this.state.volumeState.volume = newVolume;
      }
      this.renderSkin();
    },

    onMuteStateChanged: function(event, muted, videoId, forAutoplay) {
      // ignore the volume change if it came from a source other than the currently playing video
      // but only if currently playing a video. This is to prevent desyncs between video volume
      // and the UI
      if (videoId && videoId !== this.state.currentVideoId && this.isPlaying()) {
        return;
      }
      this.state.volumeState.muted = muted;
      if (muted && forAutoplay) {
        this.state.volumeState.mutingForAutoplay = true;
      }

      if (!muted) {
        this.state.volumeState.mutingForAutoplay = false;
      }
      this.renderSkin();
    },

    /**
     * Handles the PLAYBACK_SPEED_CHANGED message bus event.
     * @private
     * @param {String} eventName The name of the message bus event
     * @param {String} videoId The id of the video whose playback speed change
     * @param {Number} playbackSpeed A number that represents the new playback rate
     */
    onPlaybackSpeedChanged: function(eventName, videoId, playbackSpeed) {
      // Note that we don't constrain to min/max values in this case since
      // the new speed is already set, but we make sure that the value we get can
      // be displayed in a user-friendly way
      playbackSpeed = Utils.sanitizePlaybackSpeed(playbackSpeed, true);
      // Add speed to options if it's not one of the predefined values
      var playbackSpeedOptions = Utils.getPropertyValue(
        this.skin,
        'props.skinConfig.playbackSpeed.options'
      );
      if (
        playbackSpeedOptions &&
        playbackSpeedOptions.indexOf(playbackSpeed) < 0
      ) {
        playbackSpeedOptions.push(playbackSpeed);
      }
      // Store new current speed and update UI
      this.state.playbackSpeedOptions.currentSpeed = playbackSpeed;
      this.renderSkin();
    },

    resetUpNextInfo: function(purge) {
      if (purge) {
        this.state.upNextInfo.upNextData = null;
      }
      this.state.upNextInfo.countDownFinished = false;
      this.state.upNextInfo.countDownCancelled = false;
    },

    onPlayheadTimeChanged: function(event, currentPlayhead, duration, buffered, startEnd, videoId) {
      if (videoId === OO.VIDEO.MAIN) {
        this.state.mainVideoPlayhead = currentPlayhead;
        this.state.mainVideoDuration = duration;
        this.state.mainVideoBuffered = buffered;
      }
      if (videoId === OO.VIDEO.ADS || this.state.isPlayingAd) {
        // adVideoDuration is only used in adPanel ad marquee
        this.state.adVideoDuration = duration;
        this.state.adVideoPlayhead = currentPlayhead;
        this.state.adRemainingTime = this.getAdRemainingTime();
      }
      this.state.duration = duration;

      // For the off chance that a video plugin resumes playback without firing
      // the ON_BUFFERED event. This will have no effect if it was set previously
      if (this.state.buffering) {
        this.setBufferingState(false);
      }

      // lower skin z-index if Chrome auto-pauses flash content
      if (
        !this.state.autoPauseDisabled &&
        Utils.isChrome() &&
        this.state.mainVideoMediaType === CONSTANTS.MEDIA_TYPE.FLASH
      ) {
        var skinElement = $('#' + this.state.elementId + ' .oo-player-skin');
        if (currentPlayhead === 0 && this.state.playerState === CONSTANTS.STATE.PLAYING) {
          skinElement.addClass('oo-z-index-auto');
        } else {
          skinElement.removeClass('oo-z-index-auto');
          this.state.autoPauseDisabled = true;
        }
      }

      // The code inside if statement is only for up next, however, up next does not apply to Ad screen.
      // So we only need to update the playhead for ad screen.
      if (this.state.screenToShow !== CONSTANTS.SCREEN.AD_SCREEN) {
        if (this.skin.props.skinConfig.upNext.showUpNext) {
          if (!(!Utils.canRenderSkin() || (Utils.isIos() && this.state.fullscreen))) {
            // no UpNext for iPhone < iOS10 or fullscreen iOS
            this.showUpNextScreenWhenReady(currentPlayhead, duration);
          }
        } else if (
          this.state.playerState === CONSTANTS.STATE.PLAYING &&
          this.state.screenToShow !== CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN
        ) {
          this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
        } else if (
          this.state.playerState === CONSTANTS.STATE.PAUSE &&
          this.state.screenToShow !== CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN
        ) {
          this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        }
      }
      if (!this.state.seeking) {
        this.skin.updatePlayhead(currentPlayhead, duration, buffered, this.state.adVideoPlayhead);
      } else {
        this.state.queuedPlayheadUpdate = [currentPlayhead, duration, buffered];
      }
    },

    showUpNextScreenWhenReady: function(currentPlayhead, duration) {
      var timeToShow = this.skin.props.skinConfig.upNext.timeToShow;

      if (timeToShow < 1) {
        // time to show is based on percentage of duration from the beginning
        timeToShow = (1 - timeToShow) * duration;
      }

      this.state.upNextInfo.timeToShow = timeToShow;

      if (
        this.state.mainVideoPlayhead !== 0 &&
        currentPlayhead !== 0 &&
        duration !== 0 &&
        duration - currentPlayhead <= timeToShow &&
        !this.state.upNextInfo.countDownCancelled &&
        this.state.isPlayingAd !== true &&
        this.state.upNextInfo.upNextData !== null &&
        (this.state.playerState === CONSTANTS.STATE.PLAYING ||
          this.state.playerState === CONSTANTS.STATE.PAUSE)
      ) {
        // Trigger discovery event only the first time we
        // switch from hidden to showing
        if (!this.state.upNextInfo.showing) {
          var upNextEmbedCode = Utils.getPropertyValue(this.state.upNextInfo, "upNextData.embed_code");
          this.sendDiscoveryDisplayEventRelatedVideos('endScreen', upNextEmbedCode);
          this.state.discoverySource = CONSTANTS.SCREEN.END_SCREEN;
          var customData = { 'playheadPercent' : currentPlayhead / duration};
          this.sendDiscoveryDisplayEvent(1, 1, CONSTANTS.UI_TAG.UP_NEXT, this.state.upNextInfo.upNextData, customData);
        }
        this.state.upNextInfo.showing = true;
      } else {
        this.state.upNextInfo.showing = false;
      }
    },

    onInitialPlay: function() {
      this.state.isInitialPlay = true;
      this.state.initialPlayHasOccurred = true;
      //TODO: Why do we start a hide-control-bar timer here?
      this.startHideControlBarTimer();
      if (this.videoVr) {
        this.vrMobileOrientationChecked = true;
      }
    },

    onVcPlay: function(event, source) {

      if (this.state.cast.isReceiver) {
        this.hideControlBar();
      }

      this.state.currentVideoId = source;
      if (this.state.adWasPaused &&
        this.state.currentAdsInfo &&
        this.state.currentAdsInfo.currentAdItem &&
        this.state.currentAdsInfo.currentAdItem.ssai) {
        this.state.adPauseDuration = Date.now() - this.state.adPausedTime;
        //we calculate new ad end time, based on the time that the ad was paused.
        this.state.adEndTime = this.state.adEndTime + this.state.adPauseDuration; //milliseconds
        this.state.adWasPaused = false;
        this.state.adPauseDuration = 0;
      }
    },

    onPlaying: function(event, source) {
      if (source === OO.VIDEO.MAIN) {
        // set mainVideoElement if not set during video plugin initialization
        if (!this.state.mainVideoMediaType) {
          this.state.mainVideoElement = this.findMainVideoElement(this.state.mainVideoElement);
        }
        this.state.pauseAnimationDisabled = this.state.cast.connected;
        this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
        this.state.playerState = CONSTANTS.STATE.PLAYING;
        this.setClosedCaptionsLanguage();
        this.removeBlur();
        this.state.isInitialPlay = false;
        this.renderSkin();
      }
      if (source === OO.VIDEO.ADS || this.state.isPlayingAd) {
        this.state.adPauseAnimationDisabled = true;
        this.state.pluginsElement.addClass('oo-showing');
        this.state.pluginsClickElement.removeClass('oo-showing');
        if (this.state.currentAdsInfo.currentAdItem !== null) {
          this.state.playerState = CONSTANTS.STATE.PLAYING;
          // Set the screen to ad screen in case current screen does not involve video playback, such as discovery
          this.state.screenToShow = CONSTANTS.SCREEN.AD_SCREEN;
          this.renderSkin();
        }
      }
    },

    onPause: function(event, source, pauseReason) {
      if (this.state.failoverInProgress) {
        return;
      }

      if (this.state.cast.isReceiver) {
        this.showControlBar();
      }

      if (pauseReason === CONSTANTS.PAUSE_REASON.TRANSITION) {
        this.state.pauseAnimationDisabled = true;
        this.endSeeking();
      }
      // If an ad using the custom ad element has issued a pause, activate the click layer
      if (this.state.isPlayingAd) {
        this.state.pluginsClickElement.addClass('oo-showing');
      }
    },

    onPaused: function(event, videoId) {
      if (this.state.failoverInProgress) {
        return;
      }

      if (videoId !== this.focusedElement || this.state.screenToShow === CONSTANTS.SCREEN.END_SCREEN) {
        return;
      }
      if (
        videoId === OO.VIDEO.MAIN &&
        this.state.screenToShow !== CONSTANTS.SCREEN.AD_SCREEN &&
        this.state.screenToShow !== CONSTANTS.SCREEN.LOADING_SCREEN
      ) {
        var PLAYHEAD_STARTING_TIME = 0.01;
        if (this.state.duration - this.state.mainVideoPlayhead < PLAYHEAD_STARTING_TIME) {
          // when video ends, we get paused event before played event
          this.state.pauseAnimationDisabled = true;
        }
        if (
          this.state.pauseAnimationDisabled == false &&
          this.state.discoveryData &&
          this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === 'discovery' &&
          !(!Utils.canRenderSkin() || (Utils.isIos() && this.state.fullscreen))
        ) {
          OO.log('Should display DISCOVERY_SCREEN on pause');
          this.sendDiscoveryDisplayEventRelatedVideos('pauseScreen');
          this.state.discoverySource = CONSTANTS.SCREEN.PAUSE_SCREEN;
          this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
          this.addBlur();
        } else if (this.skin.props.skinConfig.pauseScreen.screenToShowOnPause === 'social') {
          // Remove this comment once pause screen implemented
        } else {
          // default
          this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        }
        if (!Utils.canRenderSkin()) {
          // iPhone < iOS10 pause screen is the same as start screen
          this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        }
        this.state.playerState = CONSTANTS.STATE.PAUSE;
        this.renderSkin();
      } else if (videoId === OO.VIDEO.ADS || this.state.isPlayingAd) {
        // If we pause during an ad (such as for clickthroughs or when autoplay fails)
        // we'll show the control bar so that the user has an indication that the video
        // must be unpaused to resume
        this.state.config.adScreen.showControlBar = true;
        this.state.adPauseAnimationDisabled = false;
        if (this.state.currentAdsInfo &&
          this.state.currentAdsInfo.currentAdItem &&
          this.state.currentAdsInfo.currentAdItem.ssai) {
          this.state.adWasPaused = true;
          this.state.adPausedTime = Date.now(); //milliseconds
        }
        this.state.playerState = CONSTANTS.STATE.PAUSE;
        this.renderSkin();
      }
      if (this.pausedCallback) {
        this.pausedCallback();
        this.pausedCallback = null;
      }
    },

    onPlayed: function() {
      var duration = this.state.mainVideoDuration;
      this.state.duration = duration;
      this.state.playerState = CONSTANTS.STATE.END;

      if (this.state.upNextInfo.delayedSetEmbedCodeEvent) {
        const delayedContentData = this.state.upNextInfo.delayedContentData;
        this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;

        if (delayedContentData.clickedVideo.embed_code) {
          this.mb.publish(
            OO.EVENTS.SET_EMBED_CODE,
            delayedContentData.clickedVideo.embed_code,
            this.state.playerParam
          );
        } else if (delayedContentData.clickedVideo.asset) {
          this.mb.publish(OO.EVENTS.SET_ASSET, delayedContentData.clickedVideo.asset, this.state.playerParam);
        }

        this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_CLICK_EVENT, delayedContentData);
        this.state.upNextInfo.showing = false;
        this.state.upNextInfo.delayedSetEmbedCodeEvent = false;
        this.state.upNextInfo.delayedContentData = null;
      } else if (
        this.state.discoveryData &&
        this.skin.props.skinConfig.endScreen.screenToShowOnEnd === 'discovery' &&
        !(!Utils.canRenderSkin() || (Utils.isIos() && this.state.fullscreen))
      ) {
        OO.log('Should display DISCOVERY_SCREEN on end');
        this.sendDiscoveryDisplayEventRelatedVideos('endScreen');
        this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
      } else if (this.skin.props.skinConfig.endScreen.screenToShowOnEnd === 'share') {
        this.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
      } else {
        this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
        this.renderSkin();
        //TODO: END_SCREEN_SHOWN is not consumed by anyone, should we remove? If not, should
        //we publish this when the end screen is actually shown?
        this.mb.publish(OO.EVENTS.END_SCREEN_SHOWN);
      }
      if (!Utils.canRenderSkin()) {
        // iPhone < iOS10 end screen is the same as start screen, except for the replay button
        this.state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
      }
      // In case a video plugin fires PLAYED event after stalling without firing BUFFERED or PLAYING first
      this.setBufferingState(false);
      this.skin.updatePlayhead(duration, duration, duration);
    },

    onVcPlayed: function(event, source) {
      this.onBuffered();
      if (source === OO.VIDEO.MAIN) {
        var language = '';
        var mode = 'disabled';
        this.mb.publish(OO.EVENTS.SET_CLOSED_CAPTIONS_LANGUAGE, language, {
          mode: mode,
          isFullScreen: this.state.fullscreen
        });
        this.state.mainVideoDuration = this.state.duration;
      }
    },

    onTouchMove: function(params) {
      if (this.videoVr) {
        this.mb.publish(OO.EVENTS.TOUCH_MOVE, this.focusedElement, params);
      }
    },

    onEndMove: function() {
      if (this.videoVr) {
        this.mb.publish(OO.EVENTS.END_VR_MOVE, this.focusedElement);
      }
    },

    /**
     * Get current vr viewing directions
     * @param {boolean} useVrViewingDirection flag says to use function 'getVrViewingDirection' from the plugin
     * @fires OO.EVENTS.CHECK_VR_DIRECTION
     */
    checkVrDirection: function(useVrViewingDirection) {
      if (this.videoVr) {
        this.mb.publish(OO.EVENTS.CHECK_VR_DIRECTION, this.focusedElement, useVrViewingDirection);
      }
    },

    setVrViewingDirection: function(event, yaw, roll, pitch) {
      this.state.vrViewingDirection = { yaw: yaw, roll: roll, pitch: pitch };
    },

    recreatingUI: function(event, elementId, params, settings) {
      if (!$('.oo-player-skin').length) {
        this.state.mainVideoInnerWrapper.append('<div class=\'oo-player-skin\'></div>');
      }
      this.loadConfigData(
        this.state.playerParam,
        this.state.persistentSettings,
        this.state.customSkinJSON,
        this.state.skinMetaData
      );
    },

    /**
     * The function is called when event MULTI_AUDIO_FETCHED was caught;
     * The function sets value for this.state.multiAudio
     * @param {String} event  name of a event
     * @param {Object} multiAudio - audio which fetched for the current video
     * @param {Array} multiAudio.tracks - list of objects with data for each audio
     * @param {Array} multiAudio.languageList - list of objects with all languages
     */
    onMultiAudioFetched: function(event, multiAudio) {
      if (!this.state.hideMultiAudioIcon) {
        // if param hideMultiAudioIcon is set to false
        if (typeof multiAudio !== 'undefined') {
          let multiAudioValue = null;
          if (this.containsMultiAudio(multiAudio)) {
            multiAudioValue = { tracks: multiAudio.tracks };
          }
          this.state.multiAudio = multiAudioValue;
          this.languageList = multiAudio.languageList || this.languageList;
        }
        this.renderSkin();
      }
    },

    /**
     * The function is called when event MULTI_AUDIO_CHANGED was caught;
     * The function sets value for this.state.multiAudio
     * @param {String} event - name of a event
     * @param {Object} multiAudio - audio which fetched for the current video
     * @param {Array} multiAudio.tracks - list of objects with data for each audio
     */
    onMultiAudioChanged: function(event, multiAudio) {
      if (!this.state.hideMultiAudioIcon) {
        if (this.containsMultiAudio(multiAudio)) {
          this.state.multiAudio = multiAudio;
        } else {
          this.state.multiAudio = null;
        }

        this.renderSkin();
      }
    },

    /**
     * Checks to see if we have multiple audio tracks
     * @param {Object} multiAudio The multiAudio object that is fetched from the current video
     * @returns {boolean} True if the provided object contains more than one track, false otherwise
     */
    containsMultiAudio: function(multiAudio) {
      var hasMoreThanOneTrack = !!(multiAudio && multiAudio.tracks && multiAudio.tracks.length > 1);
      return hasMoreThanOneTrack;
    },

    /**
     * The function is called when we want to change audio track
     * @fires OO.EVENTS.SET_CURRENT_AUDIO
     * @param {{id: String, label: String, lang: String}} currentTrack  - current active audio track
     */
    setCurrentAudio: function(currentTrack) {
      // user selected track should be saved to localstorage
      var currentAudioTrack = JSON.stringify(currentTrack);
      OO.setItem(OO.CONSTANTS.SELECTED_AUDIO, currentAudioTrack);

      this.mb.publish(OO.EVENTS.SET_CURRENT_AUDIO, this.state.currentVideoId, currentTrack);
    },

    onSeek: function(_, time) {

      if (this.state.cast.isReceiver) {
        this.skin.updatePlayhead(time).then(() => {
          if (this.state.playerState === CONSTANTS.STATE.PLAYING) {
            this.showControlBar();
          }
        });
      }

    },

    onSeeked: function() {
      this.state.seeking = false;
      if (this.state.queuedPlayheadUpdate) {
        OO.log('popping queued update');
        this.skin.updatePlayhead.apply(this.skin, this.state.queuedPlayheadUpdate).then(() => {
          this.state.queuedPlayheadUpdate = null;
        }).catch(() => {OO.log('onSeeked: Could not set new state for skin')});
      }

      if (this.state.cast.isReceiver && this.state.playerState === CONSTANTS.STATE.PLAYING) {
        this.startHideControlBarTimer();
      }

      if (Utils.isIos() && this.state.screenToShow === CONSTANTS.SCREEN.END_SCREEN && this.state.fullscreen) {
        this.state.pauseAnimationDisabled = true;
        this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        this.state.playerState = CONSTANTS.STATE.PAUSE;
      }
    },

    onPlaybackReady: function(event, timeSincePlayerCreated, params) {
      if (this.state.failoverInProgress) {
        return;
      }

      params = params || {};

      if (this.state.afterOoyalaAd) {
        this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
      } else {
        // If the core tells us that it will autoplay then we display the loading
        // spinner (with the thumbnail and description if it's the first video, or just a
        // black background when transitioning to a new one), otherwise we need to render
        // the big play button.
        if (params.willAutoplay) {
          // Show just the loading spinner when transitioning to another Discovery or
          // Playlist video, otherwise show the spinner and thumbnail.
          if (this.state.initialPlayHasOccurred) {
            this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
          } else {
            this.state.screenToShow = CONSTANTS.SCREEN.START_LOADING_SCREEN;
          }
        } else {
          this.state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
        }
      }

      this.renderSkin({ contentTree: this.state.contentTree });
    },

    /**
     * Fired by the video plugin when the video stalls due to buffering.
     * @private
     * @param {Event} event - message bus event
     */
    onBuffering: function(event) {
      if (this.state.isInitialPlay === false && this.state.screenToShow === CONSTANTS.SCREEN.START_SCREEN) {
        this.setBufferingState(false);
      } else {
        this.startBufferingTimer();
      }
    },

    /**
     * Fired by the video plugin when video stalling has ended.
     * @private
     * @param {Event} event - message bus event
     */
    onBuffered: function(event) {
      this.setBufferingState(false);
    },

    /**
     * Starts a timer that will call setBufferingState() with a value of true after the
     * time specified in BUFFERING_SPINNER_DELAY has elapsed.
     * @private
     */
    startBufferingTimer: function() {
      this.stopBufferingTimer();
      var bufferingSpinnerDelay = Utils.getPropertyValue(
        this.skin.props.skinConfig,
        'general.bufferingSpinnerDelay'
      );
      bufferingSpinnerDelay = Utils.constrainToRange(
        bufferingSpinnerDelay,
        0,
        CONSTANTS.UI.MAX_BUFFERING_SPINNER_DELAY
      );

      this.state.bufferingTimer = setTimeout(
        function() {
          this.setBufferingState(true);
        }.bind(this),
        bufferingSpinnerDelay
      );
    },

    /**
     * Cancels the timer that displays the loading spinner. Should be called when
     * stalling (buffering) ends, playback resumes, etc.
     * @private
     */
    stopBufferingTimer: function() {
      clearTimeout(this.state.bufferingTimer);
      this.state.bufferingTimer = null;
    },

    /**
     * Applies the 'buffering' state of the skin which determines whether the
     * player is stalled. This also determines whether the loading spinner is displayed or not.
     * IMPORTANT:
     * The value of this.state.buffering should never be set manually. This function
     * should be called whenever setting this value.
     * @private
     * @param {Boolean} value Must pass true if the player is in buffering state, false otherwise
     */
    setBufferingState: function(value) {
      var buffering = !!value;
      // Always make sure buffering timer is disabled when buffering has stopped.
      // This will have no effect if timer hasn't been started.
      if (!buffering) {
        this.stopBufferingTimer();
      }
      // Only render skin if new state is different
      if (this.state.buffering !== buffering) {
        this.state.buffering = buffering;
        this.renderSkin();
      }
    },

    onReplay: function(event) {
      this.resetUpNextInfo(false);
    },

    onAssetDimensionsReceived: function(event, params) {
      if (
        params.videoId === OO.VIDEO.MAIN &&
        (this.skin.props.skinConfig.responsive.aspectRatio === 'auto' ||
          !this.skin.props.skinConfig.responsive.aspectRatio)
      ) {
        this.state.mainVideoAspectRatio = this.calculateAspectRatio(params.width, params.height);
        // Do not set aspect ratio if content is not playing. The aspect ratio will be set
        // when switching back to content
        if (this.state.currentVideoId === OO.VIDEO.MAIN) {
          this.setAspectRatio();
        }
      }
    },

    /** ******************************************************************
      ADS RELATED EVENTS
    *********************************************************************/

    onAdsPlayed: function(event) {
      OO.log('onAdsPlayed is called from event = ' + event);
      if (this.state.playerState === CONSTANTS.STATE.END) {
        this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
      } else {
        this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
      }
      this.state.duration = this.state.contentTree.duration / 1000;
      this.state.isPlayingAd = false;
      this.state.pluginsElement.removeClass('oo-showing');
      this.state.pluginsClickElement.removeClass('oo-showing');
      // Restore anamorphic videos fix after ad playback if necessary
      this.trySetAnamorphicFixState(true);
      // In case ad was skipped or errored while stalled
      this.setBufferingState(false);

      // Set current position for video 360 after Ads.
      if (this.videoVr && this.state.isMobile) { // only for vr on mobile
        this.setControllerVrViewingDirection();
      }
      this.skin.updatePlayhead(
        this.state.mainVideoPlayhead,
        this.state.mainVideoDuration,
        this.state.mainVideoBuffered
      ).catch(() => {OO.log('onAdsPlayed: Could not set new state for skin')});
    },

    onWillPlayAds: function(event) {
      OO.log('onWillPlayAds is called from event = ' + event);
      this.state.isPlayingAd = true;
      // Anamorphic videos fix should not be active during ad playback
      this.trySetAnamorphicFixState(false);
      this.state.pluginsElement.addClass('oo-showing');
      this.state.pluginsElement.css({
        height: '',
        width: ''
      });
      this.cancelTimer();
      this.hideControlBar();
      if (this.state.mainVideoPlayhead > 0) {
        this.isNewVrVideo = false;
      }
      this.state.adPausedTime = 0;

      if (this.videoVr && this.state.isMobile) { // only for vr on mobile
        // Check current a vr video position (an user could change position using tilting)
        // for setting this value after Ads in onAdsPlayed
        const useVrViewingDirection = true;
        this.checkVrDirection(useVrViewingDirection);
      }
    },

    onAdPodStarted: function(event, numberOfAds) {
      OO.log('onAdPodStarted is called from event = ' + event + ' with ' + numberOfAds + ' ads');
      this.state.currentAdsInfo.numberOfAds = numberOfAds;
      this.renderSkin();
    },

    onWillPlaySingleAd: function(event, adItem) {
      OO.log('onWillPlaySingleAd is called with adItem = ' + adItem);
      if (adItem !== null) {
        this.state.adVideoDuration = adItem.duration * 1000;
        this.state.screenToShow = CONSTANTS.SCREEN.AD_SCREEN;
        this.state.isPlayingAd = true;
        this.state.currentAdsInfo.currentAdItem = adItem;
        this.state.playerState = CONSTANTS.STATE.PLAYING;
        if (adItem.isLive) {
          this.state.adStartTime = Date.now();
        } else {
          this.state.adStartTime = 0;
        }
        this.state.adEndTime = this.state.adStartTime + this.state.adVideoDuration;
        this.skin.state.currentPlayhead = 0;
        this.removeBlur();
      }
    },

    onSingleAdPlayed: function(event) {
      OO.log('onSingleAdPlayed is called');
      this.state.isPlayingAd = false;
      this.state.adVideoDuration = 0;
      this.state.currentAdsInfo.skipAdButtonEnabled = false;
    },

    onShowAdSkipButton: function(event) {
      this.state.currentAdsInfo.skipAdButtonEnabled = true;
      this.renderSkin();
    },

    onShowAdControls: function(event, showAdControls, autoHide) {
      this.state.showAdControls = showAdControls;
      this.state.forceControlBarVisible = false;
      if (showAdControls && this.state.config.adScreen.showControlBar) {
        this.state.pluginsElement.removeClass('oo-full');
        this.state.pluginsClickElement.removeClass('oo-full');
        if (typeof autoHide === 'boolean') {
          this.state.forceControlBarVisible = !autoHide;
        }
      } else {
        this.state.pluginsElement.addClass('oo-full');
        this.state.pluginsClickElement.addClass('oo-full');
      }

      this.renderSkin();
    },

    onShowAdMarquee: function(event, showAdMarquee) {
      this.state.showAdMarquee = showAdMarquee;
      this.renderSkin();
    },

    onSkipAdClicked: function() {
      OO.log('onSkipAdClicked is called');
      this.skin.updatePlayhead(
        this.state.mainVideoPlayhead,
        this.state.mainVideoDuration,
        this.state.mainVideoBuffered
      ).then(() => {
        this.state.currentAdsInfo.skipAdButtonEnabled = false;
        this.mb.publish(OO.EVENTS.SKIP_AD);
      }).catch(() => {OO.log('onSkipAdClicked: Could not set new state for skin')});
    },

    onAdsClicked: function(source) {
      OO.log('on ads clicked is called', source);
      this.mb.publish(OO.EVENTS.ADS_CLICKED, { source: source });
    },

    publishOverlayRenderingEvent: function(marginHeight) {
      this.mb.publish(OO.EVENTS.OVERLAY_RENDERING, { marginHeight: marginHeight });
    },

    onPlayNonlinearAd: function(event, adInfo) {
      if (adInfo.url) {
        this.state.adOverlayUrl = adInfo.url;
        this.state.showAdOverlay = true;
      }
      this.state.pluginsElement.addClass('oo-overlay-showing');
      var skinElement = $('#' + this.state.elementId + ' .oo-player-skin');
      var elementWidth = skinElement.width();
      var elementHeight = skinElement.height();
      var newCSS = {};
      if (adInfo.ad.height && adInfo.ad.height !== -1) {
        var padding = adInfo.ad.paddingHeight ? adInfo.ad.paddingHeight : 0;
        newCSS.height = adInfo.ad.height + padding + 'px';
        newCSS.top = 'auto';
      } else {
        newCSS.top = 0;
        newCSS.bottom = 0;
      }
      if (adInfo.ad.width && adInfo.ad.width !== -1) {
        var padding = adInfo.ad.paddingWidth ? adInfo.ad.paddingWidth : 0;
        newCSS.width = adInfo.ad.width + padding + 'px';
        newCSS.left = '50%';
        newCSS.transform = 'translateX(-50%)';
      }
      this.state.pluginsElement.css(newCSS);
      this.renderSkin();
    },

    onAdOverlayLoaded: function() {
      this.mb.publish(OO.EVENTS.NONLINEAR_AD_DISPLAYED);
    },

    onVideoElementFocus: function(event, source) {
      // Switching to another element, clear buffering state which applies to current element
      if (this.focusedElement !== source) {
        this.setBufferingState(false);
      }
      this.focusedElement = source;
      // Make sure that the skin uses the captions that correspond
      // to the newly focused video element
      this.setClosedCaptionsInfo(source);
      if (source === OO.VIDEO.MAIN) {
        this.state.pluginsElement.removeClass('oo-showing');
        this.state.pluginsClickElement.removeClass('oo-showing');
      }
      this.state.currentVideoId = source;
    },

    closeNonlinearAd: function(event) {
      this.state.adOverlayUrl = null;
      this.state.showAdOverlay = false;
      this.state.showAdOverlayCloseButton = false;
      this.state.pluginsElement.removeClass('oo-overlay-showing');
      this.state.pluginsElement.css({
        top: '',
        left: '',
        right: '',
        bottom: '',
        height: '0',
        width: '0',
        transform: ''
      });
      this.renderSkin();
    },

    hideNonlinearAd: function(event) {
      this.state.showAdOverlay = false;
      this.state.pluginsElement.removeClass('oo-overlay-showing');
      this.renderSkin();
    },

    showNonlinearAd: function(event) {
      this.state.showAdOverlay = true;
      this.state.pluginsElement.addClass('oo-overlay-showing');
      this.renderSkin();
    },

    showNonlinearAdCloseButton: function(event) {
      this.state.showAdOverlayCloseButton = true;
      this.renderSkin();
    },

    /**
     * Returns ad remaining time that will be displayed in ad marquee
     * when playing ads.
     * @private
     * @returns {Number} remainingTime
     */
    getAdRemainingTime: function() {
      var remainingTime = 0;

      var isLive = this.state.currentAdsInfo.currentAdItem ?
        this.state.currentAdsInfo.currentAdItem.isLive
        :
        false;
      var isSSAI = this.state.currentAdsInfo.currentAdItem ?
        this.state.currentAdsInfo.currentAdItem.ssai
        :
        false;

      if (isLive) {
        remainingTime = parseInt((this.state.adStartTime + this.state.adVideoDuration - Date.now()) / 1000);
        if (isSSAI) {
          if (this.state.playerState !== CONSTANTS.STATE.PAUSE) {
            remainingTime = (this.state.adEndTime - Date.now()) / 1000;
          } else {
            remainingTime = (this.state.adEndTime - this.state.adPausedTime) / 1000;
          }
        }
      } else {
        remainingTime = parseInt(this.state.adVideoDuration - this.state.adVideoPlayhead);
      }
      return remainingTime;
    },

    /** ******************************************************************
     MAIN VIDEO RELATED EVENTS
     *********************************************************************/

    // merge and load config data
    loadConfigData: function(params, settings, data, skinMetaData) {
      var localSettings = Utils.sanitizeConfigData(settings);
      var inlinePageParams = Utils.sanitizeConfigData(Utils.getPropertyValue(params, 'skin.inline'));
      var customSkinJSON = Utils.sanitizeConfigData(data);
      var metaDataSettings = Utils.sanitizeConfigData(skinMetaData);
      var buttonArrayFusion = params.buttonMerge ? params.buttonMerge : 'replace';

      // override data in skin config with possible local storage settings, inline data input by user, and CMS settings in backlot/themebuilder
      var mergedMetaData = DeepMerge(SkinJSON, metaDataSettings, {
        arrayMerge: Utils.arrayDeepMerge.bind(Utils),
        arrayUnionBy: 'name',
        buttonArrayFusion: 'prepend'
      });
      this.state.config = DeepMerge.all([mergedMetaData, customSkinJSON, inlinePageParams, localSettings], {
        arrayMerge: Utils.arrayDeepMerge.bind(Utils),
        arrayUnionBy: 'name',
        buttonArrayFusion: buttonArrayFusion
      });
      this.state.closedCaptionOptions = this.state.config.closedCaptionOptions;

      // remove 'url' from the list until the tab is worked on
      var shareContent = Utils.getPropertyValue(this.state.config, 'shareScreen.shareContent');
      if (shareContent) {
        for (var i = 0; i < shareContent.length; i++) {
          if (shareContent[i] === 'url') {
            shareContent.splice(i, 1);
          }
        }
        this.state.config.shareScreen.shareContent = shareContent;
      }

      // load config language json if exist
      if (this.state.config.localization.availableLanguageFile) {
        this.state.config.localization.availableLanguageFile.forEach(function(languageObj) {
          if (languageObj.languageFile) {
            $.getJSON(languageObj.languageFile, function(data) {
              Localization.languageFiles[languageObj.language] = data;
            });
          }
        });
      }

      // backwards compatibility with string parameters in skin.json
      this.state.config.upNext.timeToShow = Utils.convertStringToNumber(this.state.config.upNext.timeToShow);
      this.state.config.discoveryScreen.countDownTime = Utils.convertStringToNumber(
        this.state.config.discoveryScreen.countDownTime
      );

      var uiLanguage = Utils.getLanguageToUse(this.state.config);
      this.mb.publish(OO.EVENTS.SKIN_UI_LANGUAGE, uiLanguage);

      this.state.audioOnly = params.playerType === OO.CONSTANTS.PLAYER_TYPE.AUDIO;
      this.state.cast.showButton = this.isChromecastEnabled(params);
      this.state.cast.isReceiver = params.chromecast && params.chromecast.isReceiver;

      // load player
      this.skin = ReactDOM.render(
        React.createElement(Skin, {
          skinConfig: this.state.config,
          localizableStrings: Localization.languageFiles,
          language: uiLanguage,
          controller: this,
          closedCaptionOptions: this.state.closedCaptionOptions,
          pauseAnimationDisabled: this.state.pauseAnimationDisabled
        }),
        document.querySelector('#' + this.state.elementId + ' .oo-player-skin')
      );

      this.state.configLoaded = true;

      if (!this.state.audioOnly) {
        this.state.mainVideoInnerWrapper.addClass('oo-video-player');
      } else {
        this.state.mainVideoInnerWrapper.removeClass('oo-video-player');
        //If height was not provided for an audio only player, set a height of 138px.
        //Note that our debug page that QA uses does not currently set a height
        //138px was the value recommended by Fernando. See JIRA ticket PLAYER-4170
        var containerHeight = this.state.mainVideoContainer.height();
        if (!containerHeight) {
          this.state.mainVideoContainer.height(CONSTANTS.UI.AUDIO_ONLY_DEFAULT_HEIGHT);
        }
      }

      this.mb.publish(OO.EVENTS.SKIN_CONFIG_LOADED, this.state.config);

      this.renderSkin();
      this.createPluginElements();

      if (
        typeof this.state.config.closedCaptionOptions === 'object' &&
        this.state.config.closedCaptionOptions.language !== undefined
      ) {
        this.setCaptionDirection(this.state.config.closedCaptionOptions.language);
      }
    },

    // create plugin container elements
    createPluginElements: function() {
      this.state.config.adScreen = this.state.config.adScreen || {};
      // if playerControlsOverAds is true then we need to override the setting
      // for showing the control bar during ads.
      if (this.state.playerParam && this.state.playerParam.playerControlsOverAds) {
        if (this.state.config) {
          this.state.config.adScreen.showControlBar = true;
        }
      }

      var fullClass = '';
      if (!this.state.config || !this.state.config.adScreen || !this.state.config.adScreen.showControlBar) {
        fullClass = ' oo-full';
      }
      $('#' + this.state.elementId + ' .oo-player-skin').append(
        '<div class=\'oo-player-skin-plugins' +
          fullClass +
          '\'></div><div class=\'oo-player-skin-plugins-click-layer' +
          fullClass +
          '\'></div>'
      );
      this.state.pluginsElement = $('#' + this.state.elementId + ' .oo-player-skin-plugins');
      this.state.pluginsClickElement = $('#' + this.state.elementId + ' .oo-player-skin-plugins-click-layer');

      // if playerControlsOverAds is true, then we need to set the size of the
      // elements to be the full size of the player and not end where the control bar begins.
      if (this.state.playerParam && this.state.playerParam.playerControlsOverAds) {
        this.state.pluginsElement.css('bottom', 0);
        this.state.pluginsClickElement.css('bottom', 0);
      }

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

      //PLAYER-4041: It seems like 'click' events started when a div's pointerEvents is initially 'none' but is changed to
      //'auto' prior to the 'click' event ending will trigger 'click' event listeners on Android. We'll instead listen to
      //'touchend' and 'touchcancel' on Android and iOs.
      if (OO.isAndroid || OO.isIos) {
        this.state.pluginsClickElement.on('touchend touchcancel',
          this.resumePlaybackAfterClickthrough.bind(this)
        );
      } else {
        this.state.pluginsClickElement.click(this.resumePlaybackAfterClickthrough.bind(this));
      }

      this.state.pluginsClickElement.mouseover(
        function() {
          this.showControlBar();
          this.renderSkin();
          this.startHideControlBarTimer();
        }.bind(this)
      );
      this.state.pluginsClickElement.mouseout(
        function() {
          this.hideControlBar();
        }.bind(this)
      );
      this.mb.publish(OO.EVENTS.UI_READY, {
        videoWrapperClass: 'innerWrapper',
        pluginsClass: 'oo-player-skin-plugins'
      });
    },

    /**
     * Resumes playback and hides the plugins click element. To be called after an ad clickthrough
     * was handled by the player.
     * @private
     */
    resumePlaybackAfterClickthrough: function() {
      this.state.pluginsClickElement.removeClass('oo-showing');
      this.mb.publish(OO.EVENTS.PLAY);
    },

    onBitrateInfoAvailable: function(event, bitrates) {
      if (bitrates && bitrates.bitrates) {
        var qualityFormat = Utils.getPropertyValue(
          this.skin,
          'props.skinConfig.controlBar.qualitySelection.format'
        );
        // Bitrates will be presorted by the VTC which will work in most cases, however,
        // when displaying only bitrates we need to give priority to bitrates over
        // resolutions when sorting, otherwise the quality display might appear unsorted to the user.
        if (qualityFormat === CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE) {
          bitrates.bitrates = Utils.sortQualitiesByBitrate(bitrates.bitrates);
        }

        this.state.videoQualityOptions.availableBitrates = bitrates.bitrates;
        this.renderSkin({
          videoQualityOptions: {
            availableBitrates: bitrates.bitrates,
            selectedBitrate: this.state.videoQualityOptions.selectedBitrate
          }
        });
      }
    },

    onClosedCaptionsInfoAvailable: function(event, info) {
      if (!info || !info.videoId || !info.languages) {
        return;
      }
      // Store info in cache in order to be able to restore it
      // if this video element looses and then regains focus (like when an ad plays)
      this.state.closedCaptionsInfoCache[info.videoId] = info;
      this.setClosedCaptionsInfo(info.videoId);
    },

    onClosedCaptionCueChanged: function(event, data) {
      if (data && data.length > 0) {
        this.state.closedCaptionOptions.cueText = data;
      } else {
        this.state.closedCaptionOptions.cueText = null;
      }
      this.renderSkin();
    },

    onRelatedVideosFetched: function(event, relatedVideos) {
      OO.log('onRelatedVideosFetched is called');
      if (relatedVideos.videos && relatedVideos.videos.length) {
        this.state.discoveryData = { relatedVideos: relatedVideos.videos };

        if (relatedVideos.upNextVideo) {
          this.state.upNextInfo.upNextData = relatedVideos.upNextVideo;
        } else {
          this.state.upNextInfo.upNextData = relatedVideos.videos[0];
        }
        this.renderSkin();
      }
    },

    // check if fullscreen is supported natively, set flag, add event listener for change
    enableFullScreen: function() {
      if (Fullscreen.enabled) {
        this.state.isFullScreenSupported = true;
        document.addEventListener(Fullscreen.raw.fullscreenchange, this.onFullscreenChanged.bind(this));
      }
    },

    // iOS webkitSupportsFullscreen property is not valid until metadata has loaded
    // https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW13
    enableIosFullScreen: function() {
      if (!this.state.isFullScreenSupported) {
        if (this.state.mainVideoElement.webkitSupportsFullscreen) {
          this.state.isVideoFullScreenSupported = true;
          this.state.mainVideoElement.addEventListener(
            'webkitbeginfullscreen',
            this.webkitBeginFullscreen.bind(this)
          );
          this.state.mainVideoElement.addEventListener(
            'webkitendfullscreen',
            this.webkitEndFullscreen.bind(this)
          );
        }
      }
    },

    // called when event listener triggered
    onFullscreenChanged: function() {
      if (this.state.isFullScreenSupported) {
        this.state.fullscreen = Fullscreen.isFullscreen;
      } else {
        this.toggleFullscreen();
      }
      if (this.videoVr && this.state.isMobile && this.isVrStereo && !this.state.fullscreen) {
        this.toggleStereoVr();
      }
      if (!this.state.fullscreen) {
        this.closeOtherPopovers();
      }
      this.renderSkin();
    },

    /**
     * @description the function closes popovers (closedCaptionPopover, videoQualityPopover, multiAudioPopover);
     * if the parameter specifies the name of the popover, then its state does not change
     * @param {string} popoverOptionsName - the name of the popover that does not need to be closed
     * @public
     */
    closeOtherPopovers: function(popoverOptionsName) {
      for (var menuName in CONSTANTS.MENU_OPTIONS) {
        var currentOptionsName = CONSTANTS.MENU_OPTIONS[menuName];

        if (currentOptionsName !== popoverOptionsName) {
          this.closePopover(currentOptionsName);
        }
      }
    },

    /**
     * @description It close popover with name = menu
     * @param {string} menu - the name of the popover to be closed
     * @param {Object} [params] - params for the function
     * @public
     */
    closePopover: function(menu, params) {
      params = params || {};
      var menuOptions = this.state[menu];
      var menuToggleButton = this.toggleButtons[menu];

      if (menuOptions && menuOptions.showPopover) {
        // Re-focus on toggle button when closing the menu popover if the latter
        // was originally opened with a key press.
        if (
          params.restoreToggleButtonFocus &&
          menuToggleButton &&
          menuToggleButton.wasTriggeredWithKeyboard()
        ) {
          menuToggleButton.focus();
        }
        if (menuToggleButton) {
          menuToggleButton.wasTriggeredWithKeyboard(false);
        }
        this.togglePopover(menu);
      }
    },

    // called when user selects fullscreen icon
    toggleFullscreen: function() {
      // full support, any element
      if (this.state.isFullScreenSupported) {
        Fullscreen.toggle(this.state.mainVideoInnerWrapper.get(0));
      } else if (this.state.isVideoFullScreenSupported && !this.videoVr) {
        // partial support, video element only (iOS) and not vr
        this.toggleIOSNativeFullscreen();
      } else {
        // no support
        if (this.videoVr) {
          // if videoVr we don't use native fullscreen (IOS)
          this.mb.publish(OO.EVENTS.TOGGLE_FULLSCREEN_VR, this.focusedElement);
        }
        this.togglePseudoFullscreenMode();
      }

      this.state.fullscreen = !this.state.fullscreen;
      this.renderSkin();
    },

    /**
     * Toggle fullscreen for video element only (iOS)
     * @private
     */
    toggleIOSNativeFullscreen: function() {
      if (this.state.fullscreen) {
        this.state.mainVideoElement.webkitExitFullscreen();
      } else {
        // PLAYER-4216
        // iOS will only recognize active text tracks and show the selected state
        // checkmark if these are set to "showing" mode prior to entering fullscreen.
        // The isGoingFullScreen flag will ensure that the correct mode is set on the
        // active track (if existent) right before entering fullscreen
        this.setClosedCaptionsLanguage({
          isGoingFullScreen: true
        });
        this.state.mainVideoElement.webkitEnterFullscreen();
      }
    },

    /**
     * Toggle fullscreen if native fullscreen is not supported (pseudo fullscreen)
     * @private
     */
    togglePseudoFullscreenMode: function() {
      if (this.state.isFullWindow) {
        this.exitFullWindow();
      } else {
        this.enterFullWindow();
      }
    },

    // if fullscreen is not supported natively, "full window" style
    // is applied to video wrapper to fill browser window
    enterFullWindow: function() {
      this.state.isFullWindow = this.state.fullscreen = true;

      // add listener for esc key
      document.addEventListener('keydown', this.exitFullWindowOnEscKey.bind(this));
      // hide scroll bars
      document.documentElement.style.overflow = 'hidden';
      // apply full window style
      this.state.mainVideoInnerWrapper.addClass('oo-fullscreen');
    },

    // remove "full window" style and event listener
    exitFullWindow: function() {
      this.state.isFullWindow = this.state.fullscreen = false;

      // remove event listener
      document.removeEventListener('keydown', this.exitFullWindowOnEscKey);
      // unhide scroll bars
      document.documentElement.style.overflow = 'visible';
      // remove full window style
      this.state.mainVideoInnerWrapper.removeClass('oo-fullscreen');
    },

    // iOS event fires when a video enters full-screen mode
    webkitBeginFullscreen: function() {
      this.state.fullscreen = true;
    },

    // iOS event fires when a video exits full-screen mode
    webkitEndFullscreen: function() {
      this.state.fullscreen = false;
      var showUpNext =
        this.skin.props.skinConfig.upNext.showUpNext ||
        this.skin.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen;

      // [PLAYER-212]
      // We can't show UI such as the "Up Next" countdown on fullscreen iOS. If a countdown
      // is configured, we wait until the user exits fullscreen and then we display it.
      if (showUpNext && this.state.playerState === CONSTANTS.STATE.END) {
        this.state.forceCountDownTimerOnEndScreen = true;
        this.sendDiscoveryDisplayEventRelatedVideos('endScreen');
        this.state.discoverySource = CONSTANTS.SCREEN.END_SCREEN;
        this.state.pluginsElement.addClass('oo-overlay-blur');
        this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
        this.renderSkin();
        this.state.forceCountDownTimerOnEndScreen = false;
      }
    },

    // exit full window on ESC key
    exitFullWindowOnEscKey: function(event) {
      if (event.keyCode === CONSTANTS.KEYCODES.ESCAPE_KEY) {
        event.preventDefault();
        this.exitFullWindow();
      }
    },

    onErrorEvent: function(event, errorCode) {
      this.unsubscribeBasicPlaybackEvents();
      this.setBufferingState(false);

      this.state.currentVideoId = null;
      this.state.screenToShow = CONSTANTS.SCREEN.ERROR_SCREEN;
      this.state.playerState = CONSTANTS.STATE.ERROR;
      this.state.errorCode = errorCode;
      this.renderSkin();
    },

    unsubscribeFromMessageBus: function() {
      // basic playback events
      this.unsubscribeBasicPlaybackEvents();

      // player events
      this.mb.unsubscribe(OO.EVENTS.PLAYER_CREATED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CONTENT_TREE_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.SKIN_METADATA_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.ATTRIBUTES_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.AUTHORIZATION_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.ASSET_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.ASSET_UPDATED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYBACK_READY, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.ERROR, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.SET_EMBED_CODE_AFTER_OOYALA_AD, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.SET_EMBED_CODE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.POSITION_IN_PLAYLIST_DETERMINED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CHROMECAST_START_CAST, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CHROMECAST_END_CAST, 'customerUi');
    },

    unsubscribeBasicPlaybackEvents: function() {
      this.mb.unsubscribe(OO.EVENTS.INITIAL_PLAY, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PLAY, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PLAYED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PLAYING, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PAUSE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VC_PAUSED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYHEAD_TIME_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.SEEK, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.SEEKED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.BUFFERING, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.BUFFERED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CLOSED_CAPTIONS_INFO_AVAILABLE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.BITRATE_INFO_AVAILABLE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CLOSED_CAPTION_CUE_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CHANGE_CLOSED_CAPTION_LANGUAGE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VOLUME_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYBACK_SPEED_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.PLAYBACK_READY, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.CHECK_VR_DIRECTION, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.TOUCH_MOVE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.END_VR_MOVE, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VR_DIRECTION_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VIDEO_VR, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.VIDEO_TYPE_CHANGED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.RECREATING_UI, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.MULTI_AUDIO_FETCHED, 'customerUi');
      this.mb.unsubscribe(OO.EVENTS.MULTI_AUDIO_CHANGED, 'customerUi');
      this.state.isPlaybackReadySubscribed = false;

      // ad events
      if (Utils.canRenderSkin()) {
        // since iPhone < iOS10 is always playing in full screen and not showing our skin, don't need to render skin
        this.mb.unsubscribe(OO.EVENTS.ADS_PLAYED, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.WILL_PLAY_ADS, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.AD_POD_STARTED, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.WILL_PLAY_SINGLE_AD, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.SINGLE_AD_PLAYED, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.PLAY_NONLINEAR_AD, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.NONLINEAR_AD_PLAYED, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.HIDE_NONLINEAR_AD, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.SHOW_NONLINEAR_AD, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.SHOW_AD_SKIP_BUTTON, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.SHOW_AD_CONTROLS, 'customerUi');
        this.mb.unsubscribe(OO.EVENTS.SHOW_AD_MARQUEE, 'customerUi');

        if (OO.EVENTS.DISCOVERY_API) {
          this.mb.unsubscribe(OO.EVENTS.DISCOVERY_API.RELATED_VIDEOS_FETCHED, 'customerUi');
        }
      }
      this.state.isSubscribed = false;
    },

    /* --------------------------------------------------------------------
     Skin state -> control skin
     ---------------------------------------------------------------------*/
    renderSkin: function(args) {
      if (this.state.configLoaded) {
        if (args) {
          this.state = DeepMerge(this.state, args);
        }
        this.skin.switchComponent(this.state);
      }
    },

    /* --------------------------------------------------------------------
     skin UI-action -> publish event to core player
     ---------------------------------------------------------------------*/
    toggleDiscoveryScreen: function() {
      switch (this.state.playerState) {
        case CONSTANTS.STATE.PLAYING:
          this.pausedCallback = function() {
            this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
            this.state.playerState = CONSTANTS.STATE.PAUSE;
            this.state.pluginsElement.addClass('oo-overlay-blur');
            this.renderSkin();
            OO.log('finished toggleDiscoveryScreen');
          }.bind(this);
          this.togglePlayPause();
          this.sendDiscoveryDisplayEventRelatedVideos('pauseScreen');
          this.state.discoverySource = CONSTANTS.SCREEN.PAUSE_SCREEN;
          break;
        case CONSTANTS.STATE.PAUSE:
          if (this.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
            this.state.pauseAnimationDisabled = true;
            this.state.pluginsElement.removeClass('oo-overlay-blur');
            this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
          }
          else {
            this.sendDiscoveryDisplayEventRelatedVideos('pauseScreen');
            this.state.discoverySource = CONSTANTS.SCREEN.PAUSE_SCREEN;
            this.state.pluginsElement.addClass('oo-overlay-blur');
            this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
          }
          break;
        case CONSTANTS.STATE.END:
          if (this.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
            this.state.pluginsElement.removeClass('oo-overlay-blur');
            this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
          }
          else {
            this.sendDiscoveryDisplayEventRelatedVideos('endScreen');
            this.state.discoverySource = CONSTANTS.SCREEN.END_SCREEN;
            this.state.pluginsElement.addClass('oo-overlay-blur');
            this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
            this.skin.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen = false;
          }
          break;
        default:
          break;
      }
      this.renderSkin();
    },

    toggleMute: function(muted, fromUser) {
      this.mb.publish(OO.EVENTS.CHANGE_MUTE_STATE, muted, null, fromUser);
    },

    toggleStereoVr: function() {
      this.isVrStereo = !this.isVrStereo;
      this.mb.publish(OO.EVENTS.TOGGLE_STEREO_VR);
    },

    moveVrToDirection: function(rotate, direction) {
      this.mb.publish(OO.EVENTS.MOVE_VR_TO_DIRECTION, this.focusedElement, rotate, direction);
    },

    togglePlayPause: function() {
      switch (this.state.playerState) {
        case CONSTANTS.STATE.START:
          if (!this.state.isInitialPlay) {
            this.mb.publish(OO.EVENTS.INITIAL_PLAY, Date.now(), false);
          }
          break;
        case CONSTANTS.STATE.END:
          this.mb.publish(OO.EVENTS.REPLAY);
          break;
        case CONSTANTS.STATE.PAUSE:
          this.isNewVrVideo = false;
          this.mb.publish(OO.EVENTS.PLAY);
          break;
        case CONSTANTS.STATE.PLAYING:
          this.isNewVrVideo = false;
          // In some cases the controlBarVisible var might get out of sync if not
          // set explicitly when pausing. When this happens the control bar flashes
          // when the playingScreen is rendered, so we want to avoid that.
          this.showControlBar();
          this.mb.publish(OO.EVENTS.PAUSE);
          break;
        default:
          break;
      }
    },

    seek: function(seconds) {
      if (this.state.playerState === CONSTANTS.STATE.END) {
        this.endSeeking();
        this.mb.publish(OO.EVENTS.REPLAY, seconds);
      } else {
        this.mb.publish(OO.EVENTS.SEEK, seconds);
      }
    },

    onLiveClick: function() {
      this.mb.publish(OO.EVENTS.LIVE_BUTTON_CLICKED);
    },

    setVolume: function(volume) {
      this.mb.publish(OO.EVENTS.CHANGE_VOLUME, volume);
    },

    handleMuteClick: function() {
      this.toggleMute(!this.state.volumeState.muted, true);
    },

    toggleShareScreen: function() {
      if (this.state.screenToShow === CONSTANTS.SCREEN.SHARE_SCREEN) {
        this.closeScreen();
      } else {
        if (
          this.state.playerState === CONSTANTS.STATE.PLAYING
        ) {
          this.pausedCallback = function() {
            this.state.pluginsElement.addClass('oo-overlay-blur');
            this.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
            this.renderSkin();
          }.bind(this);
          this.mb.publish(OO.EVENTS.PAUSE);
        } else {
          this.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
          this.state.pluginsElement.addClass('oo-overlay-blur');
          this.renderSkin();
        }
      }
    },

    /**
     * Toggles the provided screen. Will switch to the provided screen
     * if that screen is not active, otherwise it will close the screen.
     * @param screen The screen to toggle
     * @param {boolean} doNotPause Set to true to avoid pausing when toggling the screen
     */
    toggleScreen: function(screen, doNotPause = false) {
      this.isNewVrVideo = false;
      if (this.state.screenToShow === screen) {
        this.closeScreen();
      } else {
        if (this.state.playerState === CONSTANTS.STATE.PLAYING) {
          this.pausedCallback = function() {
            this.state.pluginsElement.addClass('oo-overlay-blur');
            this.state.screenToShow = screen;
            this.renderSkin();
          }.bind(this);
          if (doNotPause) {
            this.pausedCallback();
            this.pausedCallback = null;
          } else {
            this.mb.publish(OO.EVENTS.PAUSE);
          }
        } else {
          this.state.screenToShow = screen;
          this.state.pluginsElement.addClass('oo-overlay-blur');
          this.renderSkin();
        }
      }
    },

    /**
     * The function handles a click on multiAudio icon
     */
    toggleMultiAudioScreen: function() {
      if (this.state.screenToShow === CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN) {
        if (this.state.playerState === CONSTANTS.STATE.END) {
          this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
        } else if (this.state.playerState === CONSTANTS.STATE.PAUSE) {
          this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
        } else {
          this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
        }
      } else {
        this.state.screenToShow = CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN;
      }
      this.renderSkin();
    },

    /**
     * Handler for the POSITION_IN_PLAYLIST_DETERMINED event, which controls whether
     * the Previous/Next video buttons are displayed.
     * @private
     * @param {type} eventName The name of the event
     * @param {type} params The event's parameters
     */
    onPositionInPlaylistDetermined: function(eventName, params) {
      params = params || {};
      this.state.skipControls.hasPreviousVideos = !!params.hasPreviousVideos;
      this.state.skipControls.hasNextVideos = !!params.hasNextVideos;
    },

    /**
     * Update the scrubber bar hover state for other components that react to it.
     * Called by the scrubber bar component when its hover state changes.
     * @private
     * @param {boolean} isHovering True if the control bar is hovered, false otherwise
     */
    setScrubberBarHoverState: function(isHovering) {
      if (this.state.scrubberBar.isHovering !== isHovering) {
        this.state.scrubberBar.isHovering = isHovering;
        this.renderSkin();
      }
    },

    /**
     * "Previous video" button handler. Either rewinds the video or requests the
     * previous video if the playhead is close to the beginning of the video or the
     * button is clicked repeatedly in quick succession.
     * @private
     */
    rewindOrRequestPreviousVideo: function() {
      var currentTimestamp = Utils.getCurrentTimestamp();
      var timeElapsed = currentTimestamp - this.state.skipControls.requestPreviousTimestamp;
      // Button has been clicked once more in a short amount of time, playhead
      // is below a certain threshold, or player is stalled after seeking, request previous video.
      if (
        this.state.seeking ||
        timeElapsed < CONSTANTS.UI.REQUEST_PREVIOUS_TIME_THRESHOLD ||
        this.state.mainVideoPlayhead < CONSTANTS.UI.REQUEST_PREVIOUS_PLAYHEAD_THRESHOLD
      ) {
        this.mb.publish(OO.EVENTS.REQUEST_PREVIOUS_VIDEO);
      } else {
        this.updateSeekingPlayhead(0);
        this.seek(0);
      }
      this.state.skipControls.requestPreviousTimestamp = currentTimestamp;
    },

    /**
     * Requests the next video from either the Playlists or Discovery plugins.
     * @private
     */
    requestNextVideo: function() {
      this.mb.publish(OO.EVENTS.REQUEST_NEXT_VIDEO);
    },

    /**
     * Requests that the player set its playback speed to the specified value.
     * @private
     * @param {Number} playbackSpeed A number representing the rate by which playback should advance
     */
    setPlaybackSpeed: function(playbackSpeed) {
      this.mb.publish(OO.EVENTS.SET_PLAYBACK_SPEED, playbackSpeed);
    },

    /**
     * Stores the focus id of the currently focused element in the controller's state.
     * @private
     * @param {String} focusedControl The value of the focusId property of the currently focused control or null if no control is focused
     */
    setFocusedControl: function(focusedControl) {
      this.state.focusedControl = focusedControl;
    },

    sendDiscoveryClickEvent: function(selectedContentData, isAutoUpNext) {
      this.state.pluginsElement.removeClass('oo-overlay-blur');
      if (isAutoUpNext) {
        this.state.upNextInfo.delayedContentData = selectedContentData;
        this.state.upNextInfo.delayedSetEmbedCodeEvent = true;
      } else {
        this.state.upNextInfo.showing = false;
        this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
        this.renderSkin();
        this.mb.publish(OO.EVENTS.PAUSE);
        if (selectedContentData.clickedVideo.embed_code) {
          this.mb.publish(
            OO.EVENTS.SET_EMBED_CODE,
            selectedContentData.clickedVideo.embed_code,
            this.state.playerParam
          );
        } else if (selectedContentData.clickedVideo.asset) {
          this.mb.publish(OO.EVENTS.SET_ASSET, selectedContentData.clickedVideo.asset);
        }
        this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_CLICK_EVENT, selectedContentData);
      }
    },

    sendDiscoveryDisplayEvent: function(assetPosition, pageSize, uiTag, asset, customData) {
      customData.source = this.state.discoverySource;
      // With "Up Next" panel we only pass the data of the asset
      // that is currently shown
      if (asset.embed_code) {
        var eventData = {
          metadata : Utils.getDiscoveryEventData(assetPosition, pageSize, uiTag, asset, customData)
        };
        this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_DISPLAY_EVENT, eventData);
      }
    },

    /**
     * This event is for compatability with the old thrift analytics pipeline that expects
     * the discovery display event to contain a single list of all displayed
     * discovery assets in one event as "relatedVideos".
     */
    sendDiscoveryDisplayEventRelatedVideos: function(screenName, embedCode) {
      var relatedVideosData = Utils.getPropertyValue(this.state.discoveryData, 'relatedVideos', []);
      var relatedVideos = relatedVideosData;

      // With "Up Next" panel we only pass the data of the asset
      // that is currently shown
      if (embedCode) {
        var eventAsset = _.find(relatedVideosData, function(relatedVideo) {
          return relatedVideo.embed_code === embedCode;
        });
        relatedVideos = eventAsset ? [eventAsset] : [];
      }

      var eventData = {
        relatedVideos: relatedVideos,
        custom: { source: screenName }
      };
      this.mb.publish(OO.EVENTS.DISCOVERY_API.SEND_DISPLAY_EVENT, eventData);
    },

    togglePopover: function(menu) {
      var menuOptions = this.state[menu];

      if (menuOptions) {
        menuOptions.showPopover = !menuOptions.showPopover;
        this.renderSkin();
      }
    },

    receiveVideoQualityChangeEvent: function(event, targetBitrate) {
      this.state.videoQualityOptions.selectedBitrate = {
        id: targetBitrate
      };
      this.renderSkin({
        videoQualityOptions: {
          availableBitrates: this.state.videoQualityOptions.availableBitrates,
          selectedBitrate: this.state.videoQualityOptions.selectedBitrate,
          showPopover: this.state.videoQualityOptions.showPopover
        }
      });
      if (this.state.videoQualityOptions.showPopover === true) {
        this.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
      }
    },

    sendVideoQualityChangeEvent: function(selectedContentData) {
      this.state.videoQualityOptions.selectedBitrate = {
        id: selectedContentData.id
      };
      this.mb.publish(OO.EVENTS.SET_TARGET_BITRATE, selectedContentData.id);
    },

    setClosedCaptionsInfo: function(videoId) {
      var closedCaptionsInfo = this.state.closedCaptionsInfoCache[videoId];
      if (!closedCaptionsInfo) {
        return;
      }
      // Load the CC info for the video with the given id onto the state
      this.state.closedCaptionOptions.availableLanguages = closedCaptionsInfo;
      if (this.state.closedCaptionOptions.enabled) {
        this.setClosedCaptionsLanguage();
      }
    },

    /**
     * Requests that closed captions either be set with the currently active
     * language or be disabled.
     * @private
     * @param {Object} An object with properties that provide additional information
     * about the requested operation.
     *  - isGoingFullScreen: {Boolean} Determines whether or not the player is about
     * to enter fullscreen mode when this operation is requested.
     */
    setClosedCaptionsLanguage: function(params) {
      var params = params || {};
      var availableLanguages = this.state.closedCaptionOptions.availableLanguages;
      // if saved language not in available languages, set to first available language
      if (
        availableLanguages &&
        (this.state.closedCaptionOptions.language === null ||
          !_.contains(availableLanguages.languages, this.state.closedCaptionOptions.language))
      ) {
        this.state.closedCaptionOptions.language = availableLanguages.languages[0];
      }
      var language = this.state.closedCaptionOptions.enabled ? this.state.closedCaptionOptions.language : '';
      var mode = this.state.closedCaptionOptions.enabled
        ? OO.CONSTANTS.CLOSED_CAPTIONS.HIDDEN
        : OO.CONSTANTS.CLOSED_CAPTIONS.DISABLED;
      this.mb.publish(OO.EVENTS.SET_CLOSED_CAPTIONS_LANGUAGE, language, {
        mode: mode,
        isFullScreen: this.state.fullscreen,
        isGoingFullScreen: !!params.isGoingFullScreen
      });
    },

    /**
     * @description Close an extra screen
     * @private
     */
    closeScreen: function() {
      this.state.pluginsElement.removeClass('oo-overlay-blur');
      this.state.pauseAnimationDisabled = true;
      if (this.state.playerState === CONSTANTS.STATE.PAUSE) {
        this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
      } else if (this.state.playerState === CONSTANTS.STATE.END) {
        this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
      } else if (this.state.playerState === CONSTANTS.STATE.START) {
        this.state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
      } else {
        this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
      }
      this.renderSkin();
    },

    /**
     * Handles the CHANGE_CLOSED_CAPTION_LANGUAGE event. Fired by the core when
     * a change in closed captions language is requested.
     * @private
     * @param {String} eventName The name of the event that was fired
     * @param {String} language The new closed captions language to set, or 'none' if captions are to be disabled
     * @param {Object} params An object with additional options for this operation
     *  - forceEnabled: {Boolean} If true this will ensure that captions are also turned on after the new language is set
     */
    onChangeClosedCaptionLanguage: function(event, language, params = {}) {
      if (language === CONSTANTS.CLOSED_CAPTIONS.NO_LANGUAGE) {
        if (this.state.closedCaptionOptions.enabled) {
          this.toggleClosedCaptionEnabled();
        }
        return;
      }
      var availableLanguages = this.state.closedCaptionOptions.availableLanguages;

      // validate language is available before update and save
      if (language && availableLanguages && _.contains(availableLanguages.languages, language)) {
        // The act of changing the CC language doesn't currently enable captions
        // automatically. The core will set the forceEnabled parameter to true when
        // it is necessary to also enable captions themselves
        if (params.forceEnabled) {
          this.state.closedCaptionOptions.enabled = true;
          this.state.persistentSettings.closedCaptionOptions.enabled = true;
        }

        this.state.closedCaptionOptions.language =
          this.state.persistentSettings.closedCaptionOptions.language = language;
        var captionLanguage = this.state.closedCaptionOptions.enabled ? language : '';
        var mode = this.state.closedCaptionOptions.enabled
          ? OO.CONSTANTS.CLOSED_CAPTIONS.HIDDEN
          : OO.CONSTANTS.CLOSED_CAPTIONS.DISABLED;
        // publish set closed caption event
        this.mb.publish(OO.EVENTS.SET_CLOSED_CAPTIONS_LANGUAGE, captionLanguage, {
          mode: mode,
          isFullScreen: this.state.fullscreen
        });
        // update skin, save new closed caption language
        this.renderSkin();
        this.mb.publish(OO.EVENTS.SAVE_PLAYER_SETTINGS, this.state.persistentSettings);
      } else {
        // if language not in available languages, log error
        OO.log('Invalid closed caption language.');
      }
    },

    onClosedCaptionChange: function(name, value) {
      this.state.closedCaptionOptions[name] = this.state.persistentSettings.closedCaptionOptions[
        name
      ] = value;
      if (name === 'language') {
        this.setClosedCaptionsLanguage();
        this.setCaptionDirection(value);
      }
      this.renderSkin();
      this.mb.publish(OO.EVENTS.SAVE_PLAYER_SETTINGS, this.state.persistentSettings);
    },

    /**
     * @description the function set direction for CC;
     * if chosen language is right-to-left language set rtl as value for this.captionDirection
     * else set this.captionDirection as ''
     * @private
     * @param {String} languageCode - ISO-639 language code
     */
    setCaptionDirection: function(languageCode) {
      if (
        typeof languageCode === 'string' &&
        languageCode.length === 2 &&
        this.state.config.languageDirections !== null &&
        typeof this.state.config.languageDirections === 'object'
      ) {
        if (this.state.config.languageDirections[languageCode]) {
          this.captionDirection = this.state.config.languageDirections[languageCode];
        } else {
          this.captionDirection = '';
        }
      }
    },

    /**
     * Used to enable or disable the CSS workaround that prevents anamorphic videos from
     * being distorted on Firefox. The fix will only be enabled if ots_stretch_to_output
     * is set to true in the player attributes.
     * Note that currently the oo-anamorphic class has effect only on Firefox.
     * @param {boolen} enabled A value that determines whether to enable or disable the anamorphic videos CSS fix.
     */
    trySetAnamorphicFixState: function(enabled) {
      if (!this.state || !this.state.mainVideoInnerWrapper) {
        return;
      }

      if (enabled) {
        var isAnamorphic = Utils.getPropertyValue(this.state.attributes, 'provider.ots_stretch_to_output');

        // Only enable anamorphic videos fix if video actually requires it
        if (isAnamorphic === true || isAnamorphic === 'true') {
          this.state.mainVideoInnerWrapper.addClass('oo-anamorphic');
          OO.log('Anamorphic video fix: ON');
        }
      } else {
        this.state.mainVideoInnerWrapper.removeClass('oo-anamorphic');
        OO.log('Anamorphic video fix: OFF');
      }
    },

    toggleClosedCaptionEnabled: function() {
      this.state.closedCaptionOptions.enabled = !this.state.closedCaptionOptions.enabled;
      this.state.persistentSettings.closedCaptionOptions['enabled'] = !!this.state.closedCaptionOptions
        .enabled;
      this.setClosedCaptionsLanguage();
      this.renderSkin();
      this.mb.publish(OO.EVENTS.SAVE_PLAYER_SETTINGS, this.state.persistentSettings);
    },

    upNextDismissButtonClicked: function() {
      this.state.upNextInfo.countDownCancelled = true;
      this.state.upNextInfo.showing = false;
      this.renderSkin();
    },

    toggleMoreOptionsScreen: function(moreOptionsItems) {
      if (this.state.screenToShow === CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN) {
        this.closeMoreOptionsScreen();
      } else {
        this.displayMoreOptionsScreen(moreOptionsItems);
      }
    },

    closeMoreOptionsScreen: function() {
      this.state.pauseAnimationDisabled = true;
      this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
      this.state.playerState = CONSTANTS.STATE.PAUSE;
      this.state.moreOptionsItems = null;
      this.state.pluginsElement.removeClass('oo-overlay-blur');
      this.renderSkin();
    },

    displayMoreOptionsScreen: function(moreOptionsItems) {
      if (this.state.playerState === CONSTANTS.STATE.PLAYING) {
        this.pausedCallback = function() {
          this.state.screenToShow = CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN;
          this.state.pluginsElement.addClass('oo-overlay-blur');
          this.renderSkin();
        }.bind(this);
        this.mb.publish(OO.EVENTS.PAUSE);
      } else {
        this.state.screenToShow = CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN;
        this.state.pluginsElement.addClass('oo-overlay-blur');
        this.renderSkin();
      }
      this.state.moreOptionsItems = moreOptionsItems;
    },

    enablePauseAnimation: function() {
      this.state.pauseAnimationDisabled = false;
    },

    beginSeeking: function() {
      this.state.seeking = true;
    },

    endSeeking: function() {
      this.state.seeking = false;
    },

    updateSeekingPlayhead: function(playhead) {
      playhead = Math.min(Math.max(0, playhead), this.skin.state.duration);
      this.skin.updatePlayhead(
        playhead,
        this.skin.state.duration,
        this.skin.state.buffered
      ).catch(() => {OO.log('updateSeekingPlayhead: Could not set new state for skin')});
    },

    hideVolumeSliderBar: function() {
      this.state.volumeState.volumeSliderVisible = false;
      this.renderSkin();
    },

    showVolumeSliderBar: function() {
      this.state.volumeState.volumeSliderVisible = true;
      if (Utils.isAndroid()) {
        this.startHideVolumeSliderTimer();
      }
      this.renderSkin();
    },

    startHideVolumeSliderTimer: function() {
      this.cancelTimer();
      var timer = setTimeout(
        function() {
          if (this.state.volumeState.volumeSliderVisible === true) {
            this.hideVolumeSliderBar();
          }
        }.bind(this),
        3000
      );
      this.state.timer = timer;
    },

    startHideControlBarTimer: function() {
      if (this.skin.props.skinConfig.controlBar.autoHide === true && !this.state.audioOnly) {
        this.cancelTimer();
        var timer = setTimeout(
          function() {
            if (this.state.controlBarVisible === true) {
              this.hideControlBar();
            }
          }.bind(this),
          3000
        );
        this.state.timer = timer;
      }
    },

    showControlBar: function() {
      var oldState = this.state.controlBarVisible;
      this.state.controlBarVisible = true;
      if (this.state.controlBarVisible !== oldState) {
        this.renderSkin();
      }
    },

    hideControlBar: function() {
      if (!this.state.audioOnly) {
        var oldState = this.state.controlBarVisible;
        this.state.controlBarVisible = false;
        if (Utils.isAndroid()) {
          this.hideVolumeSliderBar();
        }
        if (this.state.controlBarVisible !== oldState) {
          this.renderSkin();
        }
      }
    },

    cancelTimer: function() {
      if (this.state.timer !== null) {
        clearTimeout(this.state.timer);
        this.state.timer = null;
      }
    },

    // use fixed aspect ratio number from skinConfig
    updateAspectRatio: function() {
      if (
        this.skin &&
        this.skin.props.skinConfig.responsive.aspectRatio &&
        this.skin.props.skinConfig.responsive.aspectRatio !== 'auto'
      ) {
        if (this.skin.props.skinConfig.responsive.aspectRatio === 'fluid') {
          const container = this.state.mainVideoContainer[0].parentNode;
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          this.state.mainVideoAspectRatio = this.calculateAspectRatio(containerWidth, containerHeight);
        } else {
          this.state.mainVideoAspectRatio = this.skin.props.skinConfig.responsive.aspectRatio;
        }
        this.setAspectRatio();
      }
    },

    // returns original video aspect ratio
    calculateAspectRatio: function(width, height) {
      var aspectRatio = (height / width * 100).toFixed(2);
      return aspectRatio;
    },

    // set Main Video Element Wrapper padding-top to aspect ratio
    setAspectRatio: function() {
      if (this.state.mainVideoAspectRatio > 0 && !this.state.audioOnly) {
        this.state.mainVideoInnerWrapper.css('padding-top', this.state.mainVideoAspectRatio + '%');
      }
    },

    // find descendant video element
    findMainVideoElement: function(element) {
      var elements = [];
      // use actual element
      if (element[0]) {
        element = element[0];
      }

      // find html5 video
      if (element.tagName && element.tagName.toLowerCase().indexOf(CONSTANTS.MEDIA_TYPE.VIDEO) !== -1) {
        this.state.mainVideoMediaType = CONSTANTS.MEDIA_TYPE.HTML5;
      } else if (element.getElementsByTagName(CONSTANTS.MEDIA_TYPE.VIDEO).length) {
        elements = element.getElementsByTagName(CONSTANTS.MEDIA_TYPE.VIDEO);
        if (elements.length) {
          element = elements[0];
          this.state.mainVideoMediaType = CONSTANTS.MEDIA_TYPE.HTML5;
        }
      } else if (
        element.tagName &&
        element.tagName.toLowerCase().indexOf(CONSTANTS.MEDIA_TYPE.OBJECT) !== -1
      ) {
        // find flash object
        this.state.mainVideoMediaType = CONSTANTS.MEDIA_TYPE.FLASH;
      } else if (element.getElementsByTagName(CONSTANTS.MEDIA_TYPE.OBJECT).length) {
        elements = element.getElementsByTagName(CONSTANTS.MEDIA_TYPE.OBJECT);
        if (elements.length) {
          element = elements[0];
          this.state.mainVideoMediaType = CONSTANTS.MEDIA_TYPE.FLASH;
        }
      }
      return element;
    },

    /**
     * Adds a blur effect to the video
     * @protected
     * @method Html5Skin#addBlur
     */
    addBlur: function() {
      // [PLAYER-2220]: videoVr should not blur. This prevents a circular review on a pause.
      if (!this.videoVr && this.state.mainVideoElement && this.state.mainVideoElement.classList) {
        this.state.mainVideoElement.classList.add('oo-blur');
      }
    },

    removeBlur: function() {
      if (this.state.mainVideoElement && this.state.mainVideoElement.classList) {
        this.state.mainVideoElement.classList.remove('oo-blur');
      }
      // [PBW-6954]
      // A race condition is causing the skin to pick the div container rather than
      // the actual video element when VC_VIDEO_ELEMENT_CREATED is fired. As a temporary
      // workaround, we remove the blur class from both the video element and it's container.
      if (this.state.mainVideoElementContainer && this.state.mainVideoElementContainer.classList) {
        this.state.mainVideoElementContainer.classList.remove('oo-blur');
      }
    }
  };

  return Html5Skin;
};
