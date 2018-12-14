/*
 *
 *  !!!IMPORTANT!!!
 *
 *  This file is deprecated. Please use html5skin-test.js for all new controller unit tests.
 *
 *  !!!IMPORTANT!!!
 *
 */

jest.dontMock('../js/controller');
jest.dontMock('screenfull');
jest.dontMock('../js/constants/constants');
jest.dontMock('../js/components/utils');
jest.dontMock('../js/components/higher-order/accessibleMenu');
jest.dontMock('../config/skin');
jest.dontMock('deepmerge');
jest.dontMock('underscore');
jest.dontMock('jquery');

var CONSTANTS = require('../js/constants/constants');
var sinon = require('sinon');

var plugin;
var Html5Skin;
/**
 * Mock OO
 */
OO = {
  playerParams: {
    core_version: 4
  },
  publicApi: {
    VERSION: {
      skin: {}
    }
  },
  EVENTS: {
    DISCOVERY_API: {}
  },
  CONSTANTS: {
    CLOSED_CAPTIONS: {}
  },
  VIDEO: {
    ADS: 'ads',
    MAIN: 'main'
  },
  mb: {
    subscribe: function() {},
    unsubscribe: function() {},
    publish: function() {},
    addDependent: function() {}
  },
  log: function(a) {
    console.info(a);
  },
  init: function() {},
  handleVrMobileOrientation: function() {},
  plugin: function(module, callback) {
    _ = require('underscore');
    $ = require('jquery');
    plugin = callback(OO, _, $);
    plugin.call(OO, OO.mb, 0);

    // mock controller
    var controllerMock = {
      focusedElement: 'video-id-123587dsjhkewu',
      state: {
        persistentSettings: {
          closedCaptionOptions: {}
        },
        config: {
          adScreen: {
            showControlBar: true
          }
        },
        isPlaybackReadySubscribed: false,
        configLoaded: true,
        attributes: {},
        elementId: 'oo-video',
        isLiveStream: false,
        contentTree: {},
        discoveryData: {},
        fullscreen: false,
        queuedPlayheadUpdate: true,
        currentAdsInfo: {},
        videoQualityOptions: {},
        closedCaptionsInfoCache: {},
        closedCaptionOptions: {
          enabled: null,
          language: null,
          availableLanguages: {
            languages: ['en', 'es']
          },
          cueText: null,
          showPopover: false,
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
        upNextInfo: {
          countDownCancelled: false,
          showing: null,
          upNextData: { data: 2 },
          delayedSetEmbedCodeEvent: {},
          delayedContentData: {
            clickedVideo: {
              embed_code: true,
              asset: true
            }
          }
        },
        isPlayingAd: false,
        mainVideoAspectRatio: 6,
        mainVideoInnerWrapper: {
          css: function(a, b) {},
          addClass: function(a) {},
          removeClass: function(a) {}
        },
        timer: 8.45,
        controlBarVisible: null,
        volumeState: {
          volumeSliderVisible: null,
          volume: null
        },
        seeking: null,
        pauseAnimationDisabled: null,
        playerState: null,
        screenToShow: null,
        pluginsElement: {
          addClass: function(a) {},
          removeClass: function(a) {},
          css: function(a, b) {},
          children: function() {
            return { length: 2 };
          }
        },
        pluginsClickElement: {
          addClass: function(a) {},
          removeClass: function(a) {}
        },
        mainVideoElement: {
          classList: {
            add: function(a) {},
            remove: function(a) {}
          },
          webkitSupportsFullscreen: true,
          webkitEnterFullscreen: function() {},
          webkitExitFullscreen: function() {},
          addEventListener: function(a, b) {}
        },
        mainVideoMediaType: CONSTANTS.MEDIA_TYPE.FLASH
      },
      skin: {
        state: {
          duration: 10,
          buffered: 6
        },
        props: {
          skinConfig: {
            responsive: {
              aspectRatio: 45
            },
            controlBar: {
              autoHide: true
            },
            upNext: {
              showUpNext: true,
              timeToShow: '10'
            },
            pauseScreen: {},
            endScreen: {
              screenToShowOnEnd: 'discovery'
            },
            discoveryScreen: {
              showCountDownTimerOnEndScreen: false
            }
          }
        },
        updatePlayhead: function(playhead, duration, buffered) {},
        switchComponent: function(a) {}
      },
      enableFullScreen: function() {},
      enableIosFullScreen: function() {},
      onFullscreenChanged: function() {},
      toggleFullscreen: function() {},
      webkitBeginFullscreen: function() {},
      webkitEndFullscreen: function() {},
      enterFullWindow: function() {},
      exitFullWindow: function() {},
      exitFullWindowOnEscKey: function() {},
      onBuffered: function() {},
      setBufferingState: function() {},
      startBufferingTimer: function() {},
      stopBufferingTimer: function() {},
      onInitialPlayRequested: function() {},
      unsubscribeBasicPlaybackEvents: function() {},
      resetUpNextInfo: function(a) {},
      showUpNextScreenWhenReady: function(a, b) {},
      subscribeBasicPlaybackEvents: function() {},
      externalPluginSubscription: function() {},
      addDependent: function() {},
      endSeeking: function() {},
      sendDiscoveryDisplayEventRelatedVideos: function(a) {},
      sendDiscoveryDisplayEvent: function(a, b, c, d, e) {},
      togglePlayPause: function() {},
      closeScreen: function(a) {},
      closePopovers: function() {},
      setVolume: function(a) {},
      toggleMute: function(a) {},
      togglePopover: function(a) {},
      setClosedCaptionsInfo: function(a) {},
      setClosedCaptionsLanguage: function() {},
      displayMoreOptionsScreen: function(a) {},
      closeMoreOptionsScreen: function() {},
      pausedCallback: function() {},
      trySetAnamorphicFixState: function() {},
      renderSkin: function() {},
      cancelTimer: function() {},
      startHideControlBarTimer: function() {},
      startHideVolumeSliderTimer: function() {},
      hideControlBar: function() {},
      hideVolumeSliderBar: function() {},
      updateAspectRatio: function() {},
      calculateAspectRatio: function(a, b) {},
      setAspectRatio: function() {},
      createPluginElements: function() {},
      findMainVideoElement: function(a) {},
      loadConfigData: function(a, b, c, d) {},
      cleanUpEventListeners: function() {},
      toggleStereoVr: function() {}
    };

    /**
     * The unit tests
     */

    var elementId = 'adrfgyi';
    var videoId = 'ag5dfdtooon2cncj714i';
    var videoElement = document.createElement('video');
    videoElement.className = 'video';
    videoElement.id = videoId;
    videoElement.preload = 'none';
    videoElement.src =
      'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DOcJ-FxaFrRg4gtDEwOmY1OjA4MTtU7o?_=hihx01nww4iqldo893sor';
    var persistentSettings = {
      closedCaptionOptions: {
        textColor: 'Blue',
        backgroundColor: 'Transparent',
        windowColor: 'Yellow',
        windowOpacity: '0.3',
        fontType: 'Proportional Serif',
        fontSize: 'Medium',
        textEnhancement: 'Shadow',
        enabled: true,
        language: 'unknown',
        backgroundOpacity: '0.2',
        textOpacity: '1'
      }
    };
    // setup document body for valid DOM elements
    document.body.innerHTML =
      '<div id=' + elementId + '>' + '  <div class="oo-player-skin">' + videoElement + '</div>' + '</div>';

    // test mb subscribe
    Html5Skin = new plugin(OO.mb, 'id');
    Html5Skin.init();
    Html5Skin.state.isPlaybackReadySubscribed = false;
    Html5Skin.subscribeBasicPlaybackEvents();
    Html5Skin.externalPluginSubscription();

    // test player state
    Html5Skin.onPlayerCreated('customerUi', elementId, { skin: { config: {} } }, persistentSettings);
    Html5Skin.onSkinMetaDataFetched('customerUi', {});
    Html5Skin.onAttributesFetched('customerUi', {
      attributes: { provider: { ots_stretch_to_output: 'true' } }
    });
    Html5Skin.loadConfigData('customerUi', { skin: { config: {} } }, {}, {}, {});
    Html5Skin.loadConfigData('customerUi', { skin: { config: [] } }, {}, {}, {}); // invalid
    Html5Skin.loadConfigData('customerUi', { skin: { inline: {} } }, {}, {}, {});
    Html5Skin.loadConfigData('customerUi', { skin: { inline: [] } }, {}, {}, {}); // invalid
    Html5Skin.createPluginElements();
    Html5Skin.skin = controllerMock.skin; // reset skin, onPlayerCreated updates skin

    Html5Skin.onVcVideoElementCreated('customerUi', { videoId: OO.VIDEO.MAIN, videoElement: videoElement });
    Html5Skin.state.mainVideoElement = controllerMock.state.mainVideoElement;

    Html5Skin.metaDataLoaded();
    Html5Skin.onAuthorizationFetched('customerUi', { streams: [{ is_live_stream: true }] });
    Html5Skin.onContentTreeFetched('customerUi', { someContent: true });
    Html5Skin.onThumbnailsFetched('customerUi', { thumb: 'nail' });

    Html5Skin.onVolumeChanged('customerUi', 0.5);

    Html5Skin.onPlayheadTimeChanged('customerUi', 5, 10, 7, null, 'main');
    Html5Skin.onPlayheadTimeChanged('customerUi', 5, 0, 7, null, OO.VIDEO.ADS);
    Html5Skin.state.fullscreen = true;
    Html5Skin.onPlayheadTimeChanged('customerUi', 5, 0, 7, null, 'child');
    Html5Skin.state.fullscreen = false;
    Html5Skin.onInitialPlay();

    Html5Skin.onPlaying('customerUi', OO.VIDEO.MAIN);
    Html5Skin.onPlaying('customerUi', OO.VIDEO.ADS);

    Html5Skin.onPause('customerUi', OO.VIDEO.ADS, CONSTANTS.PAUSE_REASON.TRANSITION);
    Html5Skin.onPaused('customerUi', 'video-id-123587dsjhkewu');
    Html5Skin.onPaused('customerUi', OO.VIDEO.MAIN);
    Html5Skin.focusedElement = OO.VIDEO.MAIN;
    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
    Html5Skin.onPaused('customerUi', OO.VIDEO.MAIN);

    Html5Skin.onPlayed();
    Html5Skin.state.upNextInfo.delayedContentData = { clickedVideo: { embed_code: false } };
    Html5Skin.onPlayed();
    Html5Skin.state.upNextInfo.delayedContentData = { clickedVideo: { embed_code: false } };
    Html5Skin.state.upNextInfo.delayedSetEmbedCodeEvent = null;
    Html5Skin.state.fullscreen = true;
    Html5Skin.onPlayed();
    Html5Skin.state.upNextInfo.delayedContentData = { clickedVideo: { embed_code: false } };
    Html5Skin.state.fullscreen = false;
    Html5Skin.onVcPlayed('customerUi', OO.VIDEO.MAIN);

    Html5Skin.onSeeked('customerUi');
    Html5Skin.onSeeked('customerUi');
    Html5Skin.state.fullscreen = false;
    Html5Skin.onPlaybackReady('customerUi');

    Html5Skin.onBuffering('customerUi');
    Html5Skin.state.isInitialPlay = true;
    Html5Skin.onBuffering('customerUi');
    Html5Skin.state.isInitialPlay = false;

    Html5Skin.onBuffered('customerUi');
    Html5Skin.state.buffering = true;
    Html5Skin.onBuffered('customerUi');

    Html5Skin.onReplay('customerUi');

    Html5Skin.onAssetDimensionsReceived('customerUi', {});
    Html5Skin.skin.props.skinConfig.responsive.aspectRatio = 'auto';
    Html5Skin.onAssetDimensionsReceived('customerUi', { videoId: OO.VIDEO.MAIN });

    // test ad events
    Html5Skin.onAdsPlayed('customerUi');
    Html5Skin.onWillPlayAds('customerUi');

    Html5Skin.onAdPodStarted('customerUi', 2);
    Html5Skin.onWillPlaySingleAd('customerUi', { isLive: true, duration: 10 });

    Html5Skin.onSingleAdPlayed('customerUi');
    Html5Skin.onShowAdSkipButton('customerUi');

    Html5Skin.onShowAdControls('customerUi', true);
    Html5Skin.onShowAdControls('customerUi', false);

    Html5Skin.onShowAdMarquee('customerUi', true);
    Html5Skin.onSkipAdClicked('customerUi');
    Html5Skin.onAdsClicked(OO.VIDEO.ADS);
    Html5Skin.publishOverlayRenderingEvent(20);
    Html5Skin.onPlayNonlinearAd('customerUi', {
      isLive: true,
      duration: 10,
      url: 'www.ooyala.com',
      ad: { height: 12, width: 14 }
    });
    Html5Skin.onAdOverlayLoaded();
    Html5Skin.onVideoElementFocus('customerUi', OO.VIDEO.MAIN);
    Html5Skin.closeNonlinearAd('customerUi');
    Html5Skin.hideNonlinearAd('customerUi');
    Html5Skin.showNonlinearAd('customerUi');
    Html5Skin.showNonlinearAdCloseButton('customerUi');
    Html5Skin.onBitrateInfoAvailable('customerUi', { bitrates: {} });

    Html5Skin.state.closedCaptionOptions.enabled = true;
    Html5Skin.onClosedCaptionsInfoAvailable('customerUi', { languages: ['en', 'es'] });

    Html5Skin.onClosedCaptionCueChanged('customerUi', ['Hi, this is caption text', 'more captions']);
    Html5Skin.onClosedCaptionCueChanged('customerUi', []);

    Html5Skin.onRelatedVideosFetched('customerUi', { videos: ['vid1', 'vid2'] });
    Html5Skin.enableFullScreen();
    Html5Skin.enableIosFullScreen();
    Html5Skin.onFullscreenChanged();

    Html5Skin.state.isFullWindow = true;
    Html5Skin.state.isVideoFullScreenSupported = false;
    Html5Skin.toggleFullscreen();
    Html5Skin.state.isFullWindow = false;
    Html5Skin.toggleFullscreen();
    // Html5Skin.state.isFullScreenSupported = true;
    // Html5Skin.toggleFullscreen();
    Html5Skin.state.isFullScreenSupported = false;
    Html5Skin.state.isVideoFullScreenSupported = true;
    Html5Skin.toggleFullscreen();
    Html5Skin.state.fullscreen = true;
    Html5Skin.toggleFullscreen();

    Html5Skin.enterFullWindow();
    Html5Skin.exitFullWindow();
    Html5Skin.webkitBeginFullscreen();
    Html5Skin.webkitEndFullscreen();
    Html5Skin.exitFullWindowOnEscKey({
      keyCode: CONSTANTS.KEYCODES.ESCAPE_KEY,
      preventDefault: function() {}
    });
    Html5Skin.onErrorEvent({}, '404');

    // test up next
    Html5Skin.showUpNextScreenWhenReady(5, 100);
    Html5Skin.skin.props.skinConfig.upNext.timeToShow = '10%';
    Html5Skin.state.playerState = CONSTANTS.STATE.PLAYING;
    Html5Skin.showUpNextScreenWhenReady(5, 10);
    Html5Skin.resetUpNextInfo(true);

    // test mb unsubscribe events
    Html5Skin.unsubscribeFromMessageBus();
    Html5Skin.unsubscribeBasicPlaybackEvents();

    // test render skin
    Html5Skin.renderSkin({ state: 'state extended' });

    // test UI functions
    Html5Skin.state.playerState = CONSTANTS.STATE.PLAYING;
    Html5Skin.toggleDiscoveryScreen();
    Html5Skin.pausedCallback();
    Html5Skin.state.playerState = CONSTANTS.STATE.PAUSE;
    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
    Html5Skin.toggleDiscoveryScreen();
    Html5Skin.state.screenToShow = null;
    Html5Skin.toggleDiscoveryScreen();

    Html5Skin.state.playerState = CONSTANTS.STATE.END;
    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
    Html5Skin.toggleDiscoveryScreen();
    Html5Skin.state.screenToShow = null;
    Html5Skin.toggleDiscoveryScreen();

    Html5Skin.toggleMute(true);
    Html5Skin.toggleMute(false);
    Html5Skin.toggleStereoVr();

    Html5Skin.state.playerState = CONSTANTS.STATE.START;
    Html5Skin.togglePlayPause();
    Html5Skin.state.playerState = CONSTANTS.STATE.END;
    Html5Skin.state.isSkipAdClicked = true;
    Html5Skin.togglePlayPause();
    Html5Skin.state.isSkipAdClicked = false;
    Html5Skin.togglePlayPause();
    Html5Skin.togglePlayPause();
    Html5Skin.state.playerState = CONSTANTS.STATE.PAUSE;
    Html5Skin.togglePlayPause();
    Html5Skin.state.playerState = CONSTANTS.STATE.PLAYING;
    Html5Skin.togglePlayPause();

    Html5Skin.seek(5);
    Html5Skin.state.playerState = CONSTANTS.STATE.END;
    Html5Skin.seek(5);

    Html5Skin.onLiveClick();

    Html5Skin.setVolume(1);
    Html5Skin.setVolume(0);

    Html5Skin.state.volumeState.muted = true;
    Html5Skin.handleMuteClick();
    Html5Skin.state.volumeState.muted = false;
    Html5Skin.handleMuteClick();

    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
    Html5Skin.toggleShareScreen();
    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
    Html5Skin.state.playerState = CONSTANTS.STATE.PLAYING;
    Html5Skin.toggleShareScreen();
    Html5Skin.pausedCallback();
    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.ERROR_SCREEN;
    Html5Skin.state.playerState = CONSTANTS.STATE.END;
    Html5Skin.toggleShareScreen();

    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
    Html5Skin.toggleScreen(CONSTANTS.SCREEN.SHARE_SCREEN);
    Html5Skin.state.screenToShow = null;
    Html5Skin.state.playerState = CONSTANTS.STATE.PLAYING;
    Html5Skin.toggleScreen(CONSTANTS.SCREEN.SHARE_SCREEN);
    Html5Skin.pausedCallback();
    Html5Skin.state.screenToShow = null;
    Html5Skin.state.playerState = CONSTANTS.STATE.END;
    Html5Skin.toggleScreen(CONSTANTS.SCREEN.SHARE_SCREEN);

    Html5Skin.sendDiscoveryClickEvent({}, true);
    Html5Skin.sendDiscoveryClickEvent({ clickedVideo: { embed_code: true } }, false);
    Html5Skin.sendDiscoveryClickEvent({ clickedVideo: { asset: true } }, false);

    Html5Skin.sendDiscoveryDisplayEventRelatedVideos(CONSTANTS.SCREEN.DISCOVERY_SCREEN);
    Html5Skin.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
    Html5Skin.togglePopover(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS);
    Html5Skin.closeOtherPopovers();
    Html5Skin.receiveVideoQualityChangeEvent(null, 312);
    Html5Skin.sendVideoQualityChangeEvent({ id: 2 });
    Html5Skin.setClosedCaptionsInfo(elementId);

    Html5Skin.state.closedCaptionOptions.availableLanguages = { languages: ['en', 'es', 'de', 'cs'] };
    Html5Skin.onChangeClosedCaptionLanguage('changeClosedCaptionLanguage', 'de'); // valid language test
    Html5Skin.onChangeClosedCaptionLanguage('changeClosedCaptionLanguage', 'sderfes'); // invalid language test
    Html5Skin.setClosedCaptionsLanguage();
    Html5Skin.state.closedCaptionOptions.availableLanguages = null;
    Html5Skin.state.closedCaptionOptions.enabled = true;
    Html5Skin.setClosedCaptionsLanguage();

    Html5Skin.closeScreen();
    Html5Skin.state.playerState = CONSTANTS.STATE.END;
    Html5Skin.closeScreen();

    Html5Skin.onClosedCaptionChange('language', 'en');
    Html5Skin.toggleClosedCaptionEnabled();
    Html5Skin.upNextDismissButtonClicked();

    Html5Skin.toggleMoreOptionsScreen({});
    Html5Skin.state.screenToShow = CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN;
    Html5Skin.toggleMoreOptionsScreen({});

    Html5Skin.closeMoreOptionsScreen();
    Html5Skin.state.playerState = CONSTANTS.STATE.PLAYING;

    Html5Skin.displayMoreOptionsScreen({});
    Html5Skin.pausedCallback();
    Html5Skin.state.playerState = null;
    Html5Skin.displayMoreOptionsScreen({});

    Html5Skin.enablePauseAnimation();

    // test scrubber
    Html5Skin.beginSeeking();
    Html5Skin.endSeeking();
    Html5Skin.updateSeekingPlayhead(2);

    // test volume
    Html5Skin.hideVolumeSliderBar();
    Html5Skin.showVolumeSliderBar();

    // test control bar
    Html5Skin.startHideControlBarTimer();
    Html5Skin.startHideVolumeSliderTimer();

    Html5Skin.showControlBar();

    Html5Skin.hideControlBar();

    // test timer
    Html5Skin.cancelTimer();
    Html5Skin.cancelTimer.call({ state: { timer: null } });

    // test aspect ratio
    Html5Skin.skin.props.skinConfig.responsive.aspectRatio = 45;
    Html5Skin.updateAspectRatio();
    Html5Skin.updateAspectRatio.call({});

    Html5Skin.setAspectRatio();
    Html5Skin.setAspectRatio.call({ state: { mainVideoAspectRatio: 0 } });

    // test find main video element
    Html5Skin.findMainVideoElement(videoElement);
    var div2 = document.createElement('div');
    div2.appendChild(videoElement);
    Html5Skin.findMainVideoElement(div2);
    var flashVideoElement = document.createElement('object');
    flashVideoElement.className = 'video';
    flashVideoElement.id = videoId;
    flashVideoElement.src =
      'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DOcJ-FxaFrRg4gtDEwOmY1OjA4MTtU7o?_=hihx01nww4iqldo893sor';
    Html5Skin.findMainVideoElement(flashVideoElement);
    var div = document.createElement('div');
    div.appendChild(flashVideoElement);
    Html5Skin.findMainVideoElement(div);
    Html5Skin.findMainVideoElement({ 0: videoElement });

    describe('Controller testing skin initialization', function() {
      it('should show Initial Screen after player created', function() {
        Html5Skin.onPlayerCreated('customerUi', elementId, {});
        expect(Html5Skin.state.screenToShow).toBe(CONSTANTS.SCREEN.INITIAL_SCREEN);
      });
    });

    describe('Controller testing Ooyala Ads', function() {
      it('test after Ooyala ad state', function() {
        expect(Html5Skin.state.afterOoyalaAd).toBe(false);
        Html5Skin.onEmbedCodeChanged('customerUi');
        expect(Html5Skin.state.afterOoyalaAd).toBe(false);
        Html5Skin.onEmbedCodeChangedAfterOoyalaAd('customerUi');
        expect(Html5Skin.state.afterOoyalaAd).toBe(true);
        Html5Skin.onEmbedCodeChanged('customerUi');
        expect(Html5Skin.state.afterOoyalaAd).toBe(false);
      });

      it('test start screen is shown on playback ready', function() {
        Html5Skin.state.afterOoyalaAd = false;
        Html5Skin.state.initialPlayHasOccurred = false;
        Html5Skin.onPlaybackReady('customerUi');
        expect(Html5Skin.state.screenToShow).toBe(CONSTANTS.SCREEN.START_SCREEN);
      });

      it('test start screen is shown on playback ready and autoplay param is set', function() {
        Html5Skin.state.afterOoyalaAd = false;
        Html5Skin.state.initialPlayHasOccurred = false;
        Html5Skin.onPlaybackReady('customerUi', null, { willAutoplay: true });
        expect(Html5Skin.state.screenToShow).toBe(CONSTANTS.SCREEN.START_LOADING_SCREEN);
      });

      it('test loading screen is shown on playback ready after an Ooyala ad', function() {
        Html5Skin.state.afterOoyalaAd = true;
        Html5Skin.onPlaybackReady('customerUi');
        expect(Html5Skin.state.screenToShow).toBe(CONSTANTS.SCREEN.LOADING_SCREEN);
        Html5Skin.state.afterOoyalaAd = false;
      });
    });

    describe('Controller testing Anamorphic videos fix', function() {
      var addClassSpy = null;
      var removeClassSpy = null;
      var attributesParam = null;
      var attributesState = JSON.parse(JSON.stringify(Html5Skin.state.attributes));

      beforeEach(function() {
        attributesParam = {
          provider: {
            ots_stretch_to_output: true
          }
        };
        addClassSpy = sinon.spy(Html5Skin.state.mainVideoInnerWrapper, 'addClass');
        removeClassSpy = sinon.spy(Html5Skin.state.mainVideoInnerWrapper, 'removeClass');
      });

      afterEach(function() {
        Html5Skin.state.mainVideoInnerWrapper.addClass.restore();
        Html5Skin.state.mainVideoInnerWrapper.removeClass.restore();
        Html5Skin.state.attributes = attributesState;
      });

      it('should apply anamorphic CSS fix when ots_stretch_to_output is true', function() {
        Html5Skin.onAttributesFetched('customerUi', attributesParam);
        expect(addClassSpy.callCount).toBe(1);
        expect(removeClassSpy.callCount).toBe(0);
      });

      it('should not apply anamorphic CSS fix when ots_stretch_to_output isn\'t true', function() {
        attributesParam.provider = {};
        Html5Skin.onAttributesFetched('customerUi', attributesParam);
        attributesParam.provider = { ots_stretch_to_output: false };
        Html5Skin.onAttributesFetched('customerUi', attributesParam);
        expect(addClassSpy.callCount).toBe(0);
        expect(removeClassSpy.callCount).toBe(0);
      });

      it('should disable anamorphic CSS fix when passing false', function() {
        Html5Skin.onAttributesFetched('customerUi', attributesParam);
        expect(addClassSpy.callCount).toBe(1);
        Html5Skin.onWillPlayAds('customerUi');
        expect(addClassSpy.callCount).toBe(1);
        expect(removeClassSpy.callCount).toBe(1);
      });
    });

    describe('Controller destruction', function() {
      it('should destroy gracefully', function() {
        // test destroy functions last
        Html5Skin.onEmbedCodeChanged('customerUi', 'RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2', {});
        Html5Skin.onAssetChanged('customerUi', {
          content: {
            streams: [{ is_live_stream: true }],
            title: 'Title',
            posterImages: [{ url: 'www.ooyala.com' }]
          }
        });
        Html5Skin.onAssetUpdated('customerUi', {
          content: {
            streams: [{ is_live_stream: true }],
            title: 'Title',
            posterImages: [{ url: 'www.ooyala.com' }]
          }
        });
        Html5Skin.state.elementId = 'oo-video';
        Html5Skin.onPlayerDestroy('customerUi');
      });
    });
  }
};

var controller = require('../js/controller');
