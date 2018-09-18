jest
  .dontMock('../js/skin')
  .dontMock('../js/components/utils')
  .dontMock('../js/components/accessibilityControls')
  .dontMock('../js/components/higher-order/accessibleMenu')
  .dontMock('../js/constants/constants')
  .dontMock('../config/skin.json')
  .dontMock('classnames');

var $ = require('jquery');
var _ = require('underscore');
var sinon = require('sinon');
var skinJson = require('../config/skin.json');
var CONSTANTS = require('../js/constants/constants');

var Html5Skin;

var elementId = 'adrfgyi';
var videoId = 'ag5dfdto oon2cncj714i';
var videoElement = document.createElement('video');
videoElement.className = 'video';
videoElement.id = videoId;
videoElement.preload = 'none';
videoElement.src =
  'http://cf.c.ooyala.com/RmZW4zcDo6KqkTIhn1LnowEZyUYn5Tb2/DOcJ-FxaFrRg4gtDEwOmY1OjA4MTtU7o?_=hihx01nww4iqldo893sor';

// Mock OO environment needed for skin plugin initialization
OO = {
  playerParams: {
    core_version: 4
  },
  publicApi: {},
  EVENTS: {
    PLAY: 'play',
    SET_CLOSED_CAPTIONS_LANGUAGE: 'setClosedCaptionsLanguage',
    INITIAL_PLAY: 'initialPlay',
    CHANGE_MUTE_STATE: 'changeMuteState',
    DISCOVERY_API: {
      SEND_CLICK_EVENT: 'sendClickEvent'
    },
    SET_CURRENT_AUDIO: 'setCurrentAudio',
    SET_PLAYBACK_SPEED: 'setPlaybackSpeed',
    SKIN_UI_LANGUAGE: 'skinUiLanguage'
  },
  CONSTANTS: {
    CLOSED_CAPTIONS: {
      HIDDEN: 'hidden',
      SHOWING: 'showing',
    },
    SELECTED_AUDIO: 'selectedAudio'
  },
  VIDEO: {
    ADS: 'ads',
    MAIN: 'main'
  },
  init: function() {},
  handleVrMobileOrientation: function() {},
  log: function() {},
  setItem: function() {},
  getItem: function() {},
  plugin: function(module, callback) {
    var plugin = callback(OO, _, $);
    plugin.call(OO, OO.mb, 0);
    // Save Html5Skin class in local var
    Html5Skin = plugin;
  },
  mb: {
    subscribe: function() {},
    unsubscribe: function() {},
    publish: function() {},
    addDependent: function() {}
  }
};
// Requiring this will automatically initialize the plugin and set the Html5Skin var
require('../js/controller');

describe('Controller', function() {
  var controller;
  var mockDomElement = {
    classList: {
      add: function() {},
      remove: function() {}
    },
    getElementsByTagName: function() {
      return [mockDomElement];
    },
    webkitSupportsFullscreen: true,
    webkitEnterFullscreen: function() {},
    webkitExitFullscreen: function() {},
    addEventListener: function() {}
  };

  beforeEach(function() {
    // setup document body for valid DOM elements
    document.body.innerHTML =
      '<div id=' + elementId + '>' + '  <div class="oo-player-skin">' + videoElement + '</div>' + '</div>';
    controller = new Html5Skin(OO.mb, 'id');
    controller.state.mainVideoContainer = $(elementId);
    controller.state.mainVideoElement = mockDomElement;
    controller.state.mainVideoInnerWrapper = $('<div/>');
    controller.state.mainVideoElementContainer = mockDomElement;
    controller.state.hideMultiAudioIcon = false;
    controller.state.elementId = elementId;
    controller.skin = {
      state: {},
      updatePlayhead: function(currentPlayhead, duration, buffered, currentAdPlayhead) {
        this.state.currentPlayhead = currentPlayhead;
        this.state.duration = duration;
        this.state.buffered = buffered;
        this.state.currentAdPlayhead = currentAdPlayhead;
      },
      props: {
        skinConfig: JSON.parse(JSON.stringify(skinJson))
      }
    };
  });

  describe('Closed Captions', function() {
    beforeEach(function() {
      controller.createPluginElements();
      controller.state.closedCaptionOptions = {
        enabled: true,
        language: 'en',
        availableLanguages: {
          videoId: 'main',
          languages: ['en', 'fr'],
          locale: {
            en: 'English',
            fr: 'français'
          }
        }
      };
    });

    it('should disable closed captions when language is set to "none"', function() {
      expect(controller.state.closedCaptionOptions.enabled).toBe(true);
      controller.onChangeClosedCaptionLanguage('event', 'none');
      expect(controller.state.closedCaptionOptions.enabled).toBe(false);
    });

    it('should preserve current language when disabling closed captions', function() {
      controller.state.closedCaptionOptions.language = 'en';
      controller.onChangeClosedCaptionLanguage('event', 'none');
      expect(controller.state.closedCaptionOptions.language).toBe('en');
      controller.toggleClosedCaptionEnabled();
      expect(controller.state.closedCaptionOptions.enabled).toBe(true);
      expect(controller.state.closedCaptionOptions.language).toBe('en');
    });

    it('should save closedCaptionScreen when closedCaption screen is open', function() {
      controller.onPlaying('event', OO.VIDEO.MAIN);
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PLAYING_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PLAYING);
      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.pausedCallback = function() {
        controller.state.screenToShow = CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN;
      };
      controller.onPaused('event', OO.VIDEO.MAIN);
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
      controller.onPlayheadTimeChanged('event', 5, 60, 30, null, OO.VIDEO.MAIN);
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
      controller.onClosedCaptionChange('language', 'en');
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
    });

    it('should set closed captions with "isGoingFullScreen" flag before going fullscreen on iOS', function() {
      const spyPublish = jest.spyOn(OO.mb, 'publish');
      controller.state.closedCaptionOptions.enabled = true;
      controller.toggleIOSNativeFullscreen();
      expect(spyPublish.mock.calls.length).toBe(1);
      expect(spyPublish.mock.calls[0]).toEqual([
        OO.EVENTS.SET_CLOSED_CAPTIONS_LANGUAGE,
        controller.state.closedCaptionOptions.language,
        {
          mode: 'hidden',
          isFullScreen: controller.state.fullscreen,
          isGoingFullScreen: true
        }
      ]);
      spyPublish.mockRestore();
    });

    it('should enable captions on CHANGE_CLOSED_CAPTION_LANGUAGE event when forceEnabled is true', function() {
      controller.state.closedCaptionOptions.enabled = false;
      controller.state.persistentSettings.closedCaptionOptions.enabled = false;
      controller.onChangeClosedCaptionLanguage('', 'en', { forceEnabled: true });
      expect(controller.state.closedCaptionOptions.enabled).toBe(true);
      expect(controller.state.persistentSettings.closedCaptionOptions.enabled).toBe(true);
    });
  });

  describe('Buffering state', function() {
    var startBufferingTimerSpy, stopBufferingTimerSpy;

    beforeEach(function() {
      controller.createPluginElements();
      startBufferingTimerSpy = sinon.spy(controller, 'startBufferingTimer');
      stopBufferingTimerSpy = sinon.spy(controller, 'stopBufferingTimer');
    });

    afterEach(function() {
      startBufferingTimerSpy.restore();
      stopBufferingTimerSpy.restore();
    });

    it('should update buffering state', function() {
      controller.setBufferingState(false);
      expect(controller.state.buffering).toBe(false);
      controller.setBufferingState(true);
      expect(controller.state.buffering).toBe(true);
    });

    it('should render skin if new buffering state differs from the current one', function() {
      var spy = sinon.spy(controller, 'renderSkin');
      controller.state.buffering = false;
      controller.setBufferingState(true);
      controller.state.buffering = true;
      controller.setBufferingState(false);
      expect(spy.callCount).toBe(2);
      spy.restore();
    });

    it('should NOT render skin if new buffering state is the same as the current one', function() {
      var spy = sinon.spy(controller, 'renderSkin');
      controller.state.buffering = false;
      controller.setBufferingState(false);
      controller.state.buffering = true;
      controller.setBufferingState(true);
      expect(spy.callCount).toBe(0);
      spy.restore();
    });

    it('should stop buffering timer before starting a new one', function() {
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.stopBufferingTimer();
    });

    it('should stop buffering timer when setting buffering state to false', function() {
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.setBufferingState(false);
      expect(stopBufferingTimerSpy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
    });

    it('should cancel buffering timer when ON_BUFFERED event is fired', function() {
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onBuffered();
      expect(stopBufferingTimerSpy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
      expect(controller.state.buffering).toBe(false);
    });

    it('should delay buffering state and start buffering timer when ON_BUFFERING event is fired', function() {
      controller.state.isInitialPlay = false;
      controller.state.screenToShow = CONSTANTS.PLAYING_SCREEN;
      controller.onBuffering();
      expect(controller.state.buffering).toBe(false);
      expect(startBufferingTimerSpy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.stopBufferingTimer();
    });

    it('should set buffering state to true after buffering timer time has elapsed', function() {
      jest.useFakeTimers();
      controller.startBufferingTimer();
      expect(controller.state.buffering).toBe(false);
      jest.runAllTimers();
      expect(controller.state.buffering).toBe(true);
      jest.clearAllTimers();
    });

    it('should reset buffering state if it hasn\'t been cleared by the time PLAYHEAD_TIME_CHANGED is fired', function() {
      controller.setBufferingState(true);
      expect(controller.state.buffering).toBe(true);
      controller.onPlayheadTimeChanged('', OO.VIDEO.MAIN);
      expect(controller.state.buffering).toBe(false);
    });

    it('should stop buffering timer when plugin is destroyed', function() {
      controller.accessibilityControls = { cleanUp: function() {} };
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onPlayerDestroy({});
      expect(stopBufferingTimerSpy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
    });

    it('should clear buffering timer on ADS_PLAYED, VC_VIDEO_ELEMENT_IN_FOCUS, PLAYED and ERROR events', function() {
      // ADS_PLAYED
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onAdsPlayed();
      expect(stopBufferingTimerSpy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
      // VC_VIDEO_ELEMENT_IN_FOCUS
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(3);
      expect(controller.state.bufferingTimer).toBeTruthy();
      this.focusedElement = OO.VIDEO.ADS;
      controller.state.currentVideoId = OO.VIDEO.REPLAY;
      controller.onVideoElementFocus('', OO.VIDEO.MAIN);
      expect(stopBufferingTimerSpy.callCount).toBe(4);
      expect(controller.state.bufferingTimer).toBeFalsy();
      expect(controller.state.currentVideoId).toBe(OO.VIDEO.MAIN);
      // PLAYED
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(5);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onPlayed();
      expect(stopBufferingTimerSpy.callCount).toBe(6);
      expect(controller.state.bufferingTimer).toBeFalsy();
      // ERROR
      controller.startBufferingTimer();
      expect(stopBufferingTimerSpy.callCount).toBe(7);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onErrorEvent();
      expect(stopBufferingTimerSpy.callCount).toBe(8);
      expect(controller.state.bufferingTimer).toBeFalsy();
    });
  });

  describe('Video start state', function() {
    var spy;

    beforeEach(function() {
      controller.createPluginElements();
      controller.state.playerState = CONSTANTS.STATE.START;
      spy = sinon.spy(controller.mb, 'publish');
      controller.state.isInitialPlay = false;
    });

    afterEach(function() {
      spy.restore();
    });

    it('should set initial play to true on initial play', function() {
      expect(spy.callCount).toBe(0);
      controller.togglePlayPause();
      expect(spy.callCount).toBe(1);
      expect(spy.args[0][0]).toBe(OO.EVENTS.INITIAL_PLAY);
      expect(spy.args[0][2]).toBe(false);
    });

    it('should not fire initial play again if initial play has already happened', function() {
      controller.onInitialPlay();
      expect(controller.state.isInitialPlay).toBe(true);
      expect(spy.callCount).toBe(0);
      controller.togglePlayPause();
      expect(spy.callCount).toBe(0);
    });
  });

  describe('New video transitions', function() {
    beforeEach(function() {
      controller.createPluginElements();
    });

    it('should set initialPlayHasOccurred to true if initial play has been requested', function() {
      expect(controller.state.initialPlayHasOccurred).toBe(false);
      controller.onInitialPlay();
      expect(controller.state.initialPlayHasOccurred).toBe(true);
    });

    it('should trigger loading screen when embed code is set after video has started', function() {
      controller.state.screenToShow = CONSTANTS.SCREEN.INITIAL_SCREEN;
      controller.state.initialPlayHasOccurred = true;
      controller.onSetEmbedCode('newEmbedCode');
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.LOADING_SCREEN);
    });

    it('should reset isPlayingAd state when embed code is set after video has started', function() {
      controller.state.screenToShow = CONSTANTS.SCREEN.INITIAL_SCREEN;
      controller.state.initialPlayHasOccurred = true;
      controller.state.isPlayingAd = true;
      controller.onSetEmbedCode('newEmbedCode');
      expect(controller.state.isPlayingAd).toBe(false);
    });

    it('should show start screen on playback ready when core reports it will NOT autoplay', function() {
      expect(controller.state.screenToShow).not.toBe(CONSTANTS.SCREEN.START_SCREEN);
      controller.onPlaybackReady('event', null, { willAutoplay: false });
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.START_SCREEN);
    });

    it('should show start loading screen on playback ready when core reports it will autoplay and playback hasn\'t happened before', function() {
      controller.state.initialPlayHasOccurred = false;
      expect(controller.state.screenToShow).not.toBe(CONSTANTS.SCREEN.START_LOADING_SCREEN);
      controller.onPlaybackReady('event', null, { willAutoplay: true });
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.START_LOADING_SCREEN);
    });

    it('should show regular loading screen on playback ready when core reports it will autoplay and initial video has already played', function() {
      controller.state.initialPlayHasOccurred = true;
      expect(controller.state.screenToShow).not.toBe(CONSTANTS.SCREEN.LOADING_SCREEN);
      controller.onPlaybackReady('event', null, { willAutoplay: true });
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.LOADING_SCREEN);
    });

    it('should reset playhead on embed code changed', function() {
      controller.onSetEmbedCode('oldEmbedCode');
      controller.onPlaybackReady();
      controller.onPlaying();
      controller.onPlayheadTimeChanged('event', 5, 60, 30, null, OO.VIDEO.MAIN);
      expect(controller.skin.state.currentPlayhead).toBe(5);
      controller.onSetEmbedCode('newEmbedCode');
      controller.onEmbedCodeChanged('newEmbedCode');
      expect(controller.skin.state.currentPlayhead).toBe(0);
    });

    it('should reset playhead on asset changed', function() {
      var asset = {
        content: {
          title: 'Title',
          duration: 120,
          description: 'Description',
          captions: {},
          posterImages: [{ url: 'url' }],
          streams: [{ delivery_type: 'hls', url: 'url' }]
        }
      };
      controller.onAssetChanged('event', asset);
      controller.onPlaybackReady();
      controller.onPlaying();
      controller.onPlayheadTimeChanged('event', 5, 60, 30, null, OO.VIDEO.MAIN);
      expect(controller.skin.state.currentPlayhead).toBe(5);
      expect(controller.skin.state.duration).toBe(60);
      controller.onAssetChanged('event', asset);
      expect(controller.skin.state.currentPlayhead).toBe(0);
      expect(controller.skin.state.duration).toBe(asset.content.duration);
    });

    it('should update skin duration on content tree fetched', function() {
      expect(controller.skin.state.duration).not.toBe(120);
      controller.onContentTreeFetched('event', { duration: 120000 });
      expect(controller.skin.state.duration).toBe(120);
    });

    it('should set aspect ratio when main content is playing', function() {
      var spy = sinon.spy(controller, 'setAspectRatio');
      controller.state.currentVideoId = OO.VIDEO.MAIN;
      controller.onAssetDimensionsReceived('event', {
        videoId: OO.VIDEO.MAIN,
        width: 640,
        height: 480
      });
      expect(spy.callCount).toBe(1);
      spy.restore();
    });

    it('should not set aspect ratio when main content is not playing', function() {
      var spy = sinon.spy(controller, 'setAspectRatio');
      controller.state.currentVideoId = OO.VIDEO.ADS;
      controller.onAssetDimensionsReceived('event', {
        videoId: OO.VIDEO.MAIN,
        width: 640,
        height: 480
      });
      expect(spy.callCount).toBe(0);
      spy.restore();
    });

    it('should set controlBarVisible to true when video is paused', function() {
      controller.state.controlBarVisible = false;
      controller.state.playerState = CONSTANTS.STATE.PLAYING;
      controller.togglePlayPause();
      expect(controller.state.controlBarVisible).toBe(true);
    });

    it('should hide control bar when playing ads', function() {
      controller.state.controlBarVisible = true;
      controller.state.playerState = CONSTANTS.STATE.PLAYING;
      controller.onWillPlayAds();
      expect(controller.state.controlBarVisible).toBe(false);
    });

    it('should blur when addBlur API is called', function() {
      var spy = sinon.spy(controller.state.mainVideoElement.classList, 'add');
      controller.videoVr = false;
      controller.addBlur();
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith('oo-blur')).toBe(true);
      spy.restore();
    });

    it('should not blur when videoVr is paused', function() {
      var spy = sinon.spy(controller.state.mainVideoElement.classList, 'add');
      var playerParam = {
        playerControlsOverAds: false
      };
      controller.videoVr = true;
      controller.state.playerParam = playerParam;

      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      controller.onPaused('event', OO.VIDEO.MAIN);

      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PAUSE_SCREEN);
      expect(spy.callCount).toBe(0);
      spy.restore();
    });

    it('should blur when discovery screen is shown on pause', function() {
      var spy = sinon.spy(controller.state.mainVideoElement.classList, 'add');
      var playerParam = {
        playerControlsOverAds: false
      };
      controller.videoVr = false;
      controller.state.playerParam = playerParam;
      controller.state.discoveryData = {};
      controller.skin.props.skinConfig.pauseScreen.screenToShowOnPause = 'discovery';
      controller.state.duration = 10000;
      controller.state.mainVideoPlayhead = 0;

      controller.enablePauseAnimation();
      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      controller.onPaused('event', OO.VIDEO.MAIN);

      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.DISCOVERY_SCREEN);
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith('oo-blur')).toBe(true);
      spy.restore();
    });
  });

  describe('Volume state', function() {
    beforeEach(function() {
      controller.createPluginElements();
    });

    it('should mute on mute state changed', function() {
      expect(controller.state.volumeState.muted).toBe(false);
      controller.onMuteStateChanged('event', false);
      expect(controller.state.volumeState.muted).toBe(false);
      controller.onMuteStateChanged('event', true);
      expect(controller.state.volumeState.muted).toBe(true);
      controller.onMuteStateChanged('event', false);
      expect(controller.state.volumeState.muted).toBe(false);
    });

    it('should be able to toggle mute', function() {
      var spy = sinon.spy(OO.mb, 'publish');
      controller.onVcPlay('event', 'videoId');
      controller.toggleMute(false, false);
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith(OO.EVENTS.CHANGE_MUTE_STATE, false, null, false)).toBe(true);

      spy.resetHistory();
      controller.toggleMute(true, false);
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith(OO.EVENTS.CHANGE_MUTE_STATE, true, null, false)).toBe(true);

      spy.restore();
    });

    it('should toggle mute on mute click', function() {
      var spy = sinon.spy(OO.mb, 'publish');

      controller.state.volumeState.muted = false;
      expect(controller.state.volumeState.muted).toBe(false);
      controller.onVcPlay('event', 'videoId');
      controller.handleMuteClick();
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith(OO.EVENTS.CHANGE_MUTE_STATE, true, null, true)).toBe(true);

      spy.resetHistory();

      controller.state.volumeState.muted = true;
      expect(controller.state.volumeState.muted).toBe(true);
      controller.handleMuteClick();
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith(OO.EVENTS.CHANGE_MUTE_STATE, false, null, true)).toBe(true);

      spy.restore();
    });

    it('should remain unmuted when volume changed to 0 when unmuted', function() {
      controller.state.volumeState.volume = 100;
      controller.state.volumeState.muted = false;
      expect(controller.state.volumeState.muted).toBe(false);
      expect(controller.state.volumeState.volume).toBe(100);
      controller.onVolumeChanged('event', 0);
      expect(controller.state.volumeState.muted).toBe(false);
      expect(controller.state.volumeState.volume).toBe(0);
    });

    it('should remain muted when volume changed from 0 when muted', function() {
      controller.state.volumeState.volume = 0;
      controller.state.volumeState.muted = true;
      expect(controller.state.volumeState.muted).toBe(true);
      expect(controller.state.volumeState.volume).toBe(0);
      controller.onVolumeChanged('event', 100);
      expect(controller.state.volumeState.muted).toBe(true);
      expect(controller.state.volumeState.volume).toBe(100);
    });

    it('should not accept volume changes if prompted by a video different from a currently playing video', function() {
      controller.state.volumeState.volume = 0;
      controller.onVcPlay('event', OO.VIDEO.ADS);
      expect(controller.state.volumeState.volume).toBe(0);
      controller.onVolumeChanged('event', 100, OO.VIDEO.MAIN);
      expect(controller.state.volumeState.volume).toBe(0);
    });

    it('should not accept mute state changes if prompted by a video different from a currently playing video', function() {
      controller.state.volumeState.muted = true;
      controller.onVcPlay('event', OO.VIDEO.ADS);
      expect(controller.state.volumeState.muted).toBe(true);
      controller.onMuteStateChanged('event', false, OO.VIDEO.MAIN);
      expect(controller.state.volumeState.muted).toBe(true);
    });

    it('should correctly handle currentVideoId', function() {
      expect(controller.state.currentVideoId).toBe(null);
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      expect(controller.state.currentVideoId).toBe(OO.VIDEO.MAIN);
      controller.onErrorEvent();
      expect(controller.state.currentVideoId).toBe(null);

      controller.onVcPlay('event', OO.VIDEO.MAIN);
      expect(controller.state.currentVideoId).toBe(OO.VIDEO.MAIN);
      controller.onEmbedCodeChanged();
      expect(controller.state.currentVideoId).toBe(null);
    });
  });

  describe('Show player controls over ads', function() {
    it('playerControlsOverAds = true  and no skin setting for adscreen overwrites css and showControlBar', function() {
      var playerParam = {
        playerControlsOverAds: true
      };
      controller.state.playerParam = playerParam;
      controller.createPluginElements();
      // make sure showControlBar is overwritten
      expect(controller.state.config.adScreen.showControlBar).toBe(true);
      // make sure css for the plugin elements is overwritten
      expect(controller.state.pluginsElement.css('bottom')).toBe('0px');
      expect(controller.state.pluginsClickElement.css('bottom')).toBe('0px');
    });

    it('playerControlsOverAds = false doesn\'t overwrite the plugin element css', function() {
      var playerParam = {
        playerControlsOverAds: false
      };
      controller.state.playerParam = playerParam;
      controller.createPluginElements();
      expect(controller.state.pluginsElement.css('bottom')).toBe('');
      expect(controller.state.pluginsClickElement.css('bottom')).toBe('');
    });

    it('playerControlsOverAds = true  and skin set showControlBar to false should overwrite css and showControlBar', function() {
      var playerParam = {
        playerControlsOverAds: true,
        skin: {
          inline: {
            adScreen: {
              showControlBar: false
            }
          }
        }
      };
      controller.state.playerParam = playerParam;
      controller.state.config = {};
      controller.state.config.adScreen = {};
      controller.state.config.adScreen.showControlBar = false;
      controller.createPluginElements();
      expect(controller.state.config.adScreen.showControlBar).toBe(true);
      expect(controller.state.pluginsElement.css('bottom')).toBe('0px');
      expect(controller.state.pluginsClickElement.css('bottom')).toBe('0px');
    });

    it('playerControlsOverAds = true  and skin set showControlBar to true should overwrite css and showControlBar should be still true', function() {
      var playerParam = {
        playerControlsOverAds: true,
        skin: {
          inline: {
            adScreen: {
              showControlBar: true
            }
          }
        }
      };
      controller.state.playerParam = playerParam;
      controller.state.config = {};
      controller.state.config.adScreen = {};
      controller.state.config.adScreen.showControlBar = true;
      controller.createPluginElements();
      expect(controller.state.config.adScreen.showControlBar).toBe(true);
      expect(controller.state.pluginsElement.css('bottom')).toBe('0px');
      expect(controller.state.pluginsClickElement.css('bottom')).toBe('0px');
    });

    it('showControlBar is true when ad is paused', function() {
      var playerParam = {
        playerControlsOverAds: false
      };
      controller.state.playerParam = playerParam;
      controller.createPluginElements();
      // make sure showControlBar is overwritten
      expect(controller.state.config.adScreen.showControlBar).toBeFalsy();
      controller.focusedElement = OO.VIDEO.ADS;
      controller.onPaused('event', OO.VIDEO.ADS);
      expect(controller.state.config.adScreen.showControlBar).toBe(true);
    });

    it('testing onShowAdControls and forceControlBarVisible', function() {
      var event = {};
      controller.createPluginElements();
      controller.state.config.adScreen.showControlBar = true;

      controller.onShowAdControls(event, true);
      expect(controller.state.forceControlBarVisible).toBe(false);
      controller.onShowAdControls(event, true, true);
      expect(controller.state.forceControlBarVisible).toBe(false);
      controller.onShowAdControls(event, true, false);
      expect(controller.state.forceControlBarVisible).toBe(true);

      controller.onShowAdControls(event, false);
      expect(controller.state.forceControlBarVisible).toBe(false);
      controller.onShowAdControls(event, false, true);
      expect(controller.state.forceControlBarVisible).toBe(false);
      controller.onShowAdControls(event, false, false);
      expect(controller.state.forceControlBarVisible).toBe(false);
    });

    it('ad countdown works for SSAI Live asset', function() {
      var adItem = {
          duration: 15,
          isLive: true,
          name: "test",
          ssai: true
      };
      var clock = sinon.useFakeTimers(Date.now());
      controller.createPluginElements();
      controller.onPlaying('event', OO.VIDEO.MAIN);
      controller.onWillPlayAds();
      controller.onWillPlaySingleAd('event', adItem);
      controller.onPlayheadTimeChanged('event', 0.00, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(15);
      clock.tick(5000);
      controller.onPlayheadTimeChanged('event', 0.05, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(10);
      clock.tick(4000);
      controller.onPlayheadTimeChanged('event', 0.09, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(6);
      clock.tick(3000);
      controller.onPlayheadTimeChanged('event', 0.12, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(3);
      clock.tick(3000);
      controller.onPlayheadTimeChanged('event', 0.15, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(0);
      clock.restore();
      controller.onAdsPlayed();
    });

    it('pause ad works for SSAI Live asset', function() {
      var adItem = {
          duration: 20,
          isLive: true,
          name: "test",
          ssai: true
      };
      var clock = sinon.useFakeTimers(Date.now());
      controller.createPluginElements();
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      controller.onPlaying('event', OO.VIDEO.MAIN);
      controller.onWillPlayAds('event');
      controller.onWillPlaySingleAd('event', adItem);
      clock.tick(5000);
      controller.onPlayheadTimeChanged('event', 0.05, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(15);
      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onPaused('event', OO.VIDEO.MAIN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PAUSE);
      clock.tick(2000);
      expect(controller.state.adRemainingTime).toBe(15);
      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      controller.onPlaying('event', OO.VIDEO.MAIN);
      clock.tick(5000);
      controller.onPlayheadTimeChanged('event', 0.10, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(10);
      clock.restore();
      controller.onAdsPlayed();
    });

    it('pause ad works for SSAI VOD asset', function() {
      var adItem = {
          duration: 15,
          name: "test",
          isLive: true,
          ssai: true
      };
      var clock = sinon.useFakeTimers(Date.now());
      controller.createPluginElements();
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      controller.onPlaying('event', OO.VIDEO.MAIN);
      controller.onWillPlayAds('event');
      controller.onWillPlaySingleAd('event', adItem);
      clock.tick(5000);
      controller.onPlayheadTimeChanged('event', 0.05, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(10);
      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onPaused('event', OO.VIDEO.MAIN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PAUSE);
      clock.tick(3000);
      expect(controller.state.adRemainingTime).toBe(10);
      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onVcPlay('event', OO.VIDEO.MAIN);
      controller.onPlaying('event', OO.VIDEO.MAIN);
      clock.tick(1000);
      controller.onPlayheadTimeChanged('event', 0.06, adItem.duration, 0, adItem.duration, "main");
      expect(controller.state.adRemainingTime).toBe(9);
      clock.restore();
      controller.onAdsPlayed();
    });
  });

  describe('Video Qualities', function() {
    var qualities;

    beforeEach(function() {
      controller.createPluginElements();
      qualities = {
        bitrates: [
          { id: '1', width: 640, height: 360, bitrate: 150000 },
          { id: '2', width: 320, height: 180, bitrate: 2500000 },
          { id: 'auto', width: 0, height: 0, bitrate: 0 }
        ]
      };
    });

    it('should sort qualities by bitrate when quality selection format = bitrate', function() {
      controller.skin.props.skinConfig.controlBar.qualitySelection.format =
        CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE;
      controller.onBitrateInfoAvailable('event', qualities);
      expect(controller.state.videoQualityOptions.availableBitrates).toEqual([
        { id: '2', width: 320, height: 180, bitrate: 2500000 },
        { id: '1', width: 640, height: 360, bitrate: 150000 },
        { id: 'auto', width: 0, height: 0, bitrate: 0 }
      ]);
    });

    it('should NOT sort qualities by bitrate when quality selection format != bitrate', function() {
      controller.skin.props.skinConfig.controlBar.qualitySelection.format =
        CONSTANTS.QUALITY_SELECTION.FORMAT.RESOLUTION;
      controller.onBitrateInfoAvailable('event', qualities);
      expect(controller.state.videoQualityOptions.availableBitrates).toBe(qualities.bitrates);
    });
  });

  describe('Toggle fullscreen', function() {
    beforeEach(function() {
      controller.createPluginElements();
    });

    it('should publish event OO.EVENTS.TOGGLE_FULLSCREEN_VR on ios deivce with vr content', function() {
      var spy = sinon.spy(controller.mb, 'publish');
      controller.videoVr = true;
      OO.isIos = true;

      controller.toggleFullscreen();
      expect(spy.callCount).toBe(1);
      expect(spy.calledWith(OO.EVENTS.TOGGLE_FULLSCREEN_VR)).toBe(true);
      spy.restore();
    });
  });

  describe('Toggle popovers', function() {
    beforeEach(function() {
      controller.createPluginElements();
    });

    it('should close current popover', function() {
      controller.state[CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY].showPopover = false;
      controller.state[CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS].showPopover = false;
      controller.state[CONSTANTS.MENU_OPTIONS.MULTI_AUDIO].showPopover = true;

      controller.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
      expect(controller.state[CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY].showPopover).toBe(true);
      controller.closePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
      expect(controller.state[CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY].showPopover).toBe(false);
      controller.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
      controller.closeOtherPopovers(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
      expect(controller.state[CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY].showPopover).toBe(true);
      expect(controller.state[CONSTANTS.MENU_OPTIONS.MULTI_AUDIO].showPopover).toBe(false);
      expect(controller.state[CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS].showPopover).toBe(false);
    });
  });

  describe('Multiaudio', function() {
    var spy;
    beforeEach(function() {
      controller.createPluginElements();
      spy = sinon.spy(controller.mb, 'publish');
      controller.state.hideMultiAudioIcon = false;
    });

    afterEach(function() {
      spy.restore();
    });

    it('Should save playerState when multiAudio screen is active', function() {
      controller.onPlaying('event', OO.VIDEO.MAIN);
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PLAYING_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PLAYING);
      controller.toggleMultiAudioScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PLAYING);
      controller.toggleMultiAudioScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PLAYING_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PLAYING);

      controller.onVideoElementFocus('event', OO.VIDEO.MAIN);
      controller.onPaused('event', OO.VIDEO.MAIN);
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PAUSE_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PAUSE);
      controller.toggleMultiAudioScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PAUSE);
      controller.toggleMultiAudioScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PAUSE_SCREEN);
      expect(controller.state.playerState).toBe(CONSTANTS.STATE.PAUSE);
    });

    it('should set correct multiAudio state', function() {
      var multiAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true },
          { id: '1', kind: 'main', label: 'ger', lang: 'ger', enabled: false }
        ]
      };

      controller.state.multiAudio = null;
      expect(controller.state.multiAudio).toBe(null);
      controller.onMultiAudioFetched('eventName', multiAudio);
      expect(controller.state.multiAudio).toEqual(multiAudio);

      multiAudio = {
        tracks: []
      };
      controller.onMultiAudioFetched('eventName', multiAudio);
      expect(controller.state.multiAudio).toBe(null);
    });

    it('should not set multiAudio state if there are less than 2 tracks', function() {
      var multiAudio = {
        tracks: []
      };

      controller.state.multiAudio = null;
      expect(controller.state.multiAudio).toBe(null);
      controller.onMultiAudioFetched('eventName', multiAudio);
      expect(controller.state.multiAudio).toBe(null);

      multiAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true }
        ]
      };

      controller.state.multiAudio = null;
      expect(controller.state.multiAudio).toBe(null);
      controller.onMultiAudioFetched('eventName', multiAudio);
      expect(controller.state.multiAudio).toBe(null);

      multiAudio = {};

      controller.state.multiAudio = null;
      expect(controller.state.multiAudio).toBe(null);
      controller.onMultiAudioFetched('eventName', multiAudio);
      expect(controller.state.multiAudio).toBe(null);
    });

    it('MultiAudio State should be null after embed code was changed', function() {
      let obj = {};
      let obj2 = {tracks: [], languageList: [1,2,3]};
      controller.onMultiAudioFetched('event', obj);
      expect(controller.state.multiAudio).toBe(null);
      expect(controller.languageList).toEqual([]);

      controller.onMultiAudioFetched('event', obj2);
      expect(controller.state.multiAudio).toBe(null);
      expect(controller.languageList).toEqual(obj2.languageList);

      controller.onEmbedCodeChanged('newEmbedCode');
      expect(controller.state.multiAudio).toBe(null);
      expect(controller.languageList).toEqual(obj2.languageList);
    });

    it('Calling of setCurrentAudio should throw SET_CURRENT_AUDIO event with id', function() {
      var track = { id: '1', lang: 'eng', label: 'eng' };
      controller.state.currentVideoId = OO.VIDEO.MAIN;
      controller.setCurrentAudio(track);
      expect(spy.calledWith(OO.EVENTS.SET_CURRENT_AUDIO, OO.VIDEO.MAIN, track)).toBe(true);

      controller.state.currentVideoId = OO.VIDEO.ADS;
      controller.setCurrentAudio(track);
      expect(spy.calledWith(OO.EVENTS.SET_CURRENT_AUDIO, OO.VIDEO.ADS, track)).toBe(true);
    });

    it('Calling of setCurrentAudio should save audioTrack to storage', function() {
      var localStorage = {};

      OO.setItem = function(key, item) {
        localStorage[key] = item;
      };

      OO.getItem = function(key) {
        return JSON.parse(localStorage[key]);
      };

      var track = { id: '1', lang: 'eng', label: 'eng' };
      controller.setCurrentAudio(track);

      expect(OO.getItem(OO.CONSTANTS.SELECTED_AUDIO)).toEqual(track);
    });

    it('should save stringified audioTrack to storage', function() {
      var localStorage = {};

      OO.setItem = function(key, item) {
        localStorage[key] = item;
      };

      OO.getItem = function(key) {
        return JSON.parse(localStorage[key]);
      };

      var setItemSpy = sinon.spy(OO, 'setItem');

      var track = { id: '1', lang: 'eng', label: 'eng' };
      controller.setCurrentAudio(track);

      var stringifiedTrack = JSON.stringify(track);

      expect(setItemSpy.calledWith(OO.CONSTANTS.SELECTED_AUDIO, stringifiedTrack)).toBeTruthy();
      setItemSpy.restore();
    });

    it('should check if the icon exists if hideMultiAudioIcon is false', function() {
      let obj = {tracks: [1,2,3]};
      controller.onMultiAudioFetched('event', obj);
      expect(controller.state.multiAudio).toEqual(obj);
    });

    it('should check if the icon not exists if hideMultiAudioIcon is true', function() {
      controller.state.hideMultiAudioIcon = true;
      let obj = {tracks: [1,2,3]};
      controller.onMultiAudioFetched('event', obj);
      expect(controller.state.multiAudio).toBe(null);
    });

    it('should set correct state after MULTI_AUDIO_FETCHED was called', function() {
      var multiAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true },
          { id: '1', kind: 'main', label: 'ger', lang: 'ger', enabled: false }
        ]
      };
      controller.onMultiAudioFetched('event', multiAudio);
      expect(controller.state.multiAudio.tracks).toEqual(multiAudio.tracks);
    });

    it('should set correct state after MULTI_AUDIO_CHANGED was called', function() {
      var multiAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true },
          { id: '1', kind: 'main', label: 'ger', lang: 'ger', enabled: false }
        ]
      };
      controller.onMultiAudioChanged('event', multiAudio);
      expect(controller.state.multiAudio.tracks).toEqual(multiAudio.tracks);

      multiAudio = {
        tracks: []
      };
      controller.onMultiAudioChanged('event', multiAudio);
      expect(controller.state.multiAudio).toBe(null);
    });

    it('should not change multiAudio state if MULTI_AUDIO_CHANGED was called was less than 2 tracks', function() {
      var multiAudio = {
        tracks: []
      };
      controller.state.multiAudio = null;
      controller.onMultiAudioChanged('event', multiAudio);
      expect(controller.state.multiAudio).toBe(null);

      multiAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true }
        ]
      };
      controller.onMultiAudioChanged('event', multiAudio);
      expect(controller.state.multiAudio).toBe(null);

      multiAudio = {};
      controller.onMultiAudioChanged('event', multiAudio);
      expect(controller.state.multiAudio).toBe(null);
    });

    it('should set correct state after MULTI_AUDIO_CHANGED after MULTI_AUDIO_FETCHED was already called', function() {
      var multiAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true },
          { id: '1', kind: 'main', label: 'ger', lang: 'ger', enabled: false }
        ]
      };

      controller.onMultiAudioFetched('event', multiAudio);
      expect(controller.state.multiAudio.tracks).toEqual(multiAudio.tracks);

      // change the state to have more tracks
      var newAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: true },
          { id: '1', kind: 'main', label: 'ger', lang: 'ger', enabled: false },
          { id: '2', kind: 'main', label: 'ger', lang: 'ger', enabled: false }
        ]
      };
      controller.onMultiAudioChanged('event', newAudio);

      expect(controller.state.multiAudio.tracks).toEqual(newAudio.tracks);

      // change the state to have a different active track
      var newActiveAudio = {
        tracks: [
          { id: '0', kind: 'main', label: 'eng', lang: 'eng', enabled: false },
          { id: '1', kind: 'main', label: 'ger', lang: 'ger', enabled: true },
          { id: '2', kind: 'main', label: 'ger', lang: 'ger', enabled: false }
        ]
      };
      controller.onMultiAudioChanged('event', newActiveAudio);

      expect(controller.state.multiAudio.tracks).toEqual(newActiveAudio.tracks);
    });
  });

  describe('Scrubber Bar', function() {
    var spyRender;

    beforeEach(function() {
      controller.createPluginElements();
      spyRender = sinon.spy(controller, 'renderSkin');
    });

    afterEach(function() {
      spyRender.restore();
    });

    it('should update scrubber bar hover state and render when setScrubberBarHoverState() is called', function() {
      controller.state.scrubberBar.isHovering = false;
      controller.setScrubberBarHoverState(true);
      expect(controller.state.scrubberBar.isHovering).toBe(true);
      expect(spyRender.callCount).toBe(1);
    });

    it('should NOT render when setScrubberBarHoverState() is called with same value', function() {
      controller.state.scrubberBar.isHovering = false;
      controller.setScrubberBarHoverState(false);
      expect(spyRender.callCount).toBe(0);
    });
  });

  describe('Skip Controls', function() {
    var spyPublish;

    beforeEach(function() {
      controller.createPluginElements();
      spyPublish = sinon.spy(OO.mb, 'publish');
    });

    afterEach(function() {
      spyPublish.restore()
    });

    it('should update skip controls state on POSITION_IN_PLAYLIST_DETERMINED', function() {
      controller.state.skipControls.hasPreviousVideos = false;
      controller.state.skipControls.hasNextVideos = false;
      expect(controller.state.skipControls.hasPreviousVideos).toBe(false);
      expect(controller.state.skipControls.hasNextVideos).toBe(false);
      controller.onPositionInPlaylistDetermined('eventName', {
        hasPreviousVideos: true,
        hasNextVideos: true
      });
      expect(controller.state.skipControls.hasPreviousVideos).toBe(true);
      expect(controller.state.skipControls.hasNextVideos).toBe(true);
    });

    it('should publish OO.EVENTS.REQUEST_NEXT_VIDEO when requestNextVideo() is called', function() {
      controller.requestNextVideo();
      expect(spyPublish.callCount).toBe(1);
      expect(spyPublish.calledWith(OO.EVENTS.REQUEST_NEXT_VIDEO)).toBe(true);
    });

    describe('Previous Video', function() {
      var spyUpdatePlayhead, spySeek;

      beforeEach(function() {
        spyUpdatePlayhead = sinon.spy(controller, 'updateSeekingPlayhead');
        spySeek = sinon.spy(controller, 'seek');
      });

      afterEach(function() {
        spyUpdatePlayhead.restore();
        spySeek.restore();
      });

      it('should rewind and immediately update playhead UI on first "Previous Video" click if playhead is above threshold', function() {
        controller.state.mainVideoPlayhead = CONSTANTS.UI.REQUEST_PREVIOUS_PLAYHEAD_THRESHOLD + 1;
        controller.rewindOrRequestPreviousVideo();
        expect(spyUpdatePlayhead.callCount).toBe(1);
        expect(spySeek.callCount).toBe(1);
        expect(spyUpdatePlayhead.calledWith(0)).toBe(true);
        expect(spySeek.calledWith(0)).toBe(true);
      });

      it('should request previous video on first "Previous Video" click if playhead is below threshold', function() {
        controller.state.mainVideoPlayhead = CONSTANTS.UI.REQUEST_PREVIOUS_PLAYHEAD_THRESHOLD - 1;
        controller.rewindOrRequestPreviousVideo();
        expect(spyUpdatePlayhead.callCount).toBe(0);
        expect(spySeek.callCount).toBe(0);
        expect(spyPublish.callCount).toBe(1);
        expect(spyPublish.calledWith(OO.EVENTS.REQUEST_PREVIOUS_VIDEO)).toBe(true);
      });

      it('should request previous video on "Previous Video" click if player is in seeking state', function() {
        controller.state.seeking = true;
        controller.state.mainVideoPlayhead = CONSTANTS.UI.REQUEST_PREVIOUS_PLAYHEAD_THRESHOLD + 1;
        controller.rewindOrRequestPreviousVideo();
        expect(spyUpdatePlayhead.callCount).toBe(0);
        expect(spySeek.callCount).toBe(0);
        expect(spyPublish.callCount).toBe(1);
        expect(spyPublish.calledWith(OO.EVENTS.REQUEST_PREVIOUS_VIDEO)).toBe(true);
      });

      it('should request previous video on second "Previous Video" click if time elapsed since last call is below treshold', function() {
        controller.state.mainVideoPlayhead = CONSTANTS.UI.REQUEST_PREVIOUS_PLAYHEAD_THRESHOLD + 1;
        controller.state.skipControls.requestPreviousTimestamp = performance.now();
        controller.rewindOrRequestPreviousVideo();
        expect(spyUpdatePlayhead.callCount).toBe(0);
        expect(spySeek.callCount).toBe(0);
        expect(spyPublish.callCount).toBe(1);
        expect(spyPublish.calledWith(OO.EVENTS.REQUEST_PREVIOUS_VIDEO)).toBe(true);
      });
    });

  });

  describe('Playback Speed', function() {
    var spyPublish;

    beforeEach(function() {
      spyPublish = jest.spyOn(OO.mb, 'publish');
    });

    afterEach(function() {
      spyPublish.mockRestore();
    });

    it('should publish OO.EVENTS.SET_PLAYBACK_SPEED when setPlaybackSpeed() is called', function() {
      const playbackSpeed = 2;
      controller.setPlaybackSpeed(playbackSpeed);
      expect(spyPublish.mock.calls.length).toBe(1);
      expect(spyPublish.mock.calls[0]).toEqual([OO.EVENTS.SET_PLAYBACK_SPEED, playbackSpeed]);
    });

    it('should store sanitized playback speed on PLAYBACK_SPEED_CHANGED', function() {
      controller.state.playbackSpeedOptions.currentSpeed = 1;
      controller.onPlaybackSpeedChanged('eventName', OO.VIDEO.MAIN, '1.5555');
      expect(controller.state.playbackSpeedOptions.currentSpeed).toBe(1.56);
      controller.onPlaybackSpeedChanged('eventName', OO.VIDEO.MAIN, 2.0);
      expect(controller.state.playbackSpeedOptions.currentSpeed).toBe(2);
      controller.onPlaybackSpeedChanged('eventName', OO.VIDEO.MAIN, 'zomg');
      expect(controller.state.playbackSpeedOptions.currentSpeed).toBe(1);
    });

    it('should render skin on PLAYBACK_SPEED_CHANGED', function() {
      const spy = jest.spyOn(controller, 'renderSkin');
      controller.onPlaybackSpeedChanged('eventName', OO.VIDEO.MAIN, 2);
      expect(spy.mock.calls.length).toBe(1);
      spy.mockRestore();
    });

    it('should add playback speed to options if it does not already exist', function() {
      controller.skin.props.skinConfig.playbackSpeed.options = [ 0.5, 1, 1.5];
      controller.onPlaybackSpeedChanged('eventName', OO.VIDEO.MAIN, 2);
      expect(controller.skin.props.skinConfig.playbackSpeed.options).toEqual([ 0.5, 1, 1.5, 2]);
    });

    it('should NOT add playback speed to options if it already exists', function() {
      controller.skin.props.skinConfig.playbackSpeed.options = [ 0.5, 1, 1.5];
      controller.onPlaybackSpeedChanged('eventName', OO.VIDEO.MAIN, 1.5);
      expect(controller.skin.props.skinConfig.playbackSpeed.options).toEqual([ 0.5, 1, 1.5]);
    });
  });

  describe('Ad Plugins Element', function() {
    afterEach(function() {
      controller.onAdsPlayed();
    });

    it('should set the correct class for the ad plugins element for a linear ad', function() {
      controller.state.config = {};
      controller.state.config.adScreen = {};
      controller.createPluginElements();
      expect(controller.state.pluginsElement.hasClass('oo-player-skin-plugins')).toEqual(true);
      expect(controller.state.pluginsElement.hasClass('oo-showing')).toEqual(false);
      expect(controller.state.pluginsElement.hasClass('oo-overlay-showing')).toEqual(false);

      controller.onPlaying('', OO.VIDEO.ADS);
      expect(controller.state.pluginsElement.hasClass('oo-player-skin-plugins')).toEqual(true);
      expect(controller.state.pluginsElement.hasClass('oo-showing')).toEqual(true);
      expect(controller.state.pluginsElement.hasClass('oo-overlay-showing')).toEqual(false);
    });

    it('should set the correct class for the ad plugins element for a nonlinear ad', function() {
      controller.state.config = {};
      controller.state.config.adScreen = {};
      controller.createPluginElements();
      expect(controller.state.pluginsElement.hasClass('oo-player-skin-plugins')).toEqual(true);
      expect(controller.state.pluginsElement.hasClass('oo-showing')).toEqual(false);
      expect(controller.state.pluginsElement.hasClass('oo-overlay-showing')).toEqual(false);

      controller.onPlayNonlinearAd('customerUi', {isLive:true, duration:10, url:'www.ooyala.com', ad:{height:12, width:14}});
      expect(controller.state.pluginsElement.hasClass('oo-player-skin-plugins')).toEqual(true);
      expect(controller.state.pluginsElement.hasClass('oo-showing')).toEqual(false);
      expect(controller.state.pluginsElement.hasClass('oo-overlay-showing')).toEqual(true);
    });
  });

  describe('Config settings', function() {
    var spyPublish;

    beforeEach(function() {
      controller.createPluginElements();
      spyPublish = sinon.spy(OO.mb, 'publish');
    });

    afterEach(function() {
      spyPublish.restore()
    });

    it('test that the chosen ui language is sent on the message bus', function() {
      controller.loadConfigData('customerUi', {"localization":{"defaultLanguage":"es"}}, {}, {}, {});
      expect(spyPublish.withArgs(OO.EVENTS.SKIN_UI_LANGUAGE, sinon.match("es")).calledOnce).toBe(true);
    });

    it('test that language defaults to english if no defaultLanguage is specified', function() {
      controller.loadConfigData('customerUi', {"localization":{"defaultLanguage":""}}, {}, {}, {});
      expect(spyPublish.withArgs(OO.EVENTS.SKIN_UI_LANGUAGE, sinon.match("en")).calledOnce).toBe(true);
    });
  });

  describe('Ad Clickthrough', function() {
    var spyPublish;

    beforeEach(function() {
      spyPublish = sinon.spy(OO.mb, 'publish');
    });

    afterEach(function() {
      OO.isAndroid = false;
      spyPublish.restore();
    });

    it('test that plugins click element is hidden and playback resumes after click', function() {
      controller.createPluginElements();
       var adItem = {
          duration: 15,
          name: "test"
      };
      controller.onWillPlayAds();
      controller.onWillPlaySingleAd('event', adItem);
      controller.onPause();
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(true);
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(0);
      controller.state.pluginsClickElement.trigger('click');
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(1);
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(false);
    });

    it('test that plugins click element is not hidden and playback does not resume after click on Android', function() {
      OO.isAndroid = true;
      controller.createPluginElements();
       var adItem = {
          duration: 15,
          name: "test"
      };
      controller.onWillPlayAds();
      controller.onWillPlaySingleAd('event', adItem);
      controller.onPause();
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(true);
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(0);
      controller.state.pluginsClickElement.trigger('click');
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(0);
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(true);
    });

    it('test that plugins click element is hidden and playback resumes after touchend on Android', function() {
      OO.isAndroid = true;
      controller.createPluginElements();
       var adItem = {
          duration: 15,
          name: "test"
      };
      controller.onWillPlayAds();
      controller.onWillPlaySingleAd('event', adItem);
      controller.onPause();
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(true);
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(0);
      controller.state.pluginsClickElement.trigger('touchend');
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(1);
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(false);
    });

    it('test that plugins click element is hidden and playback resumes after touchcancel on Android', function() {
      OO.isAndroid = true;
      controller.createPluginElements();
       var adItem = {
          duration: 15,
          name: "test"
      };
      controller.onWillPlayAds();
      controller.onWillPlaySingleAd('event', adItem);
      controller.onPause();
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(true);
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(0);
      controller.state.pluginsClickElement.trigger('touchcancel');
      expect(spyPublish.withArgs(OO.EVENTS.PLAY).callCount).toBe(1);
      expect(controller.state.pluginsClickElement.hasClass('oo-showing')).toEqual(false);
    });
  });

  describe('Vr functionality', function() {
    let spy;
    beforeEach(function() {
      controller.videoVr = true;
      spy = sinon.spy(controller.mb, 'publish');
    });
    afterEach(function() {
      controller.videoVr = false;
      spy.restore();
    });
    it('should check viewing directions(before Ads starts play) and set viewing directions(after Ads)', function() {
      controller.createPluginElements();

      let focusedElement = OO.VIDEO.MAIN;
      controller.focusedElement = focusedElement;
      let vrViewingDirection = {
        yaw: 90,
        roll: 60,
        pitch: 90
      };
      controller.state.vrViewingDirection = vrViewingDirection;
      controller.state.isMobile = true;

      controller.onWillPlayAds();
      controller.onAdsPlayed();

      expect(spy.calledWith(OO.EVENTS.CHECK_VR_DIRECTION, focusedElement, true)).toBe(true);
      expect(spy.calledWith(OO.EVENTS.TOUCH_MOVE, focusedElement,
        [ vrViewingDirection.yaw, vrViewingDirection.roll, vrViewingDirection.pitch ]
      )).toBe(true);
    });
  });

  describe('Chromecast functionality', function() {
    it('test that onchromecast.isAvailable sets the appropriate variable', function() {
      expect(controller.state.chromecast.isAvailable).toBe(false);
      controller.onChromecastAvailable();
      expect(controller.state.chromecast.isAvailable).toBe(true);
    });

    it('test that we update the chromecast icon state with the callbacks', function() {
      expect(controller.state.chromecast.isConnected).toBe(false);
      //the calls will be repeated to double check that we aren't just toggling the state
      controller.onChromecastStartCast();
      expect(controller.state.chromecast.isConnected).toBe(true);
      controller.onChromecastStartCast();
      expect(controller.state.chromecast.isConnected).toBe(true);

      controller.onChromecastEndCast();
      expect(controller.state.chromecast.isConnected).toBe(false);
      controller.onChromecastEndCast();
      expect(controller.state.chromecast.isConnected).toBe(false);
    });
  });

  describe('Audio only', () => {
    it('adds oo-video-player class to the video container when not audio only and removes it when audio only', () => {
      controller.loadConfigData('customerUi', {
        audio: {
          audioOnly: true
        }
      }, {}, {}, {});
      expect(controller.state.mainVideoInnerWrapper.hasClass('oo-video-player')).toBe(false);

      controller.loadConfigData('customerUi', {
        audio: {
          audioOnly: false
        }
      }, {}, {}, {});
      expect(controller.state.mainVideoInnerWrapper.hasClass('oo-video-player')).toBe(true);

      controller.loadConfigData('customerUi', {
        audio: {
          audioOnly: true
        }
      }, {}, {}, {});
      expect(controller.state.mainVideoInnerWrapper.hasClass('oo-video-player')).toBe(false);
    });

    it('does not pause the video if toggleScreen was provided a value of true for doNotPause', () => {
      let spy = sinon.spy(controller.mb, 'publish');
      controller.createPluginElements();

      controller.toggleScreen(CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN, false);
      expect(spy.calledWith(OO.EVENTS.PAUSE)).toBe(true);

      spy.resetHistory();

      controller.toggleScreen(CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN, true);
      expect(spy.calledWith(OO.EVENTS.PAUSE)).toBe(false);

      spy.restore();
    });

    it('tests closeScreen', () => {
      controller.createPluginElements();
      controller.state.playerState = CONSTANTS.STATE.PAUSE;
      controller.closeScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PAUSE_SCREEN);

      controller.state.playerState = CONSTANTS.STATE.END;
      controller.closeScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.END_SCREEN);

      controller.state.playerState = CONSTANTS.STATE.START;
      controller.closeScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.START_SCREEN);

      controller.state.playerState = CONSTANTS.STATE.PLAYING;
      controller.closeScreen();
      expect(controller.state.screenToShow).toBe(CONSTANTS.SCREEN.PLAYING_SCREEN);
    });

    it('does not hide the control bar if player is audio only', () => {
      controller.loadConfigData('customerUi', {
        audio: {
          audioOnly: true
        }
      }, {}, {}, {});

      controller.startHideControlBarTimer();
      expect(controller.state.timer).toBeFalsy();

      controller.hideControlBar();
      expect(controller.state.controlBarVisible).toBe(true);
    });

    it('does not apply aspect ratio if player is audio only', () => {
      controller.loadConfigData('customerUi', {
        audio: {
          audioOnly: true
        }
      }, {}, {}, {});

      controller.setAspectRatio();
      expect(controller.state.mainVideoInnerWrapper.css('padding-top')).toBeFalsy();
    });

    it('sets a height of 138px if height was not provided for an audio only player', () => {
      //jsdom does not calculate layouts so let's overwrite the jquery height function to see if the height changed
      var height;
      var originalHeightFunc = controller.state.mainVideoContainer.height;
      controller.state.mainVideoContainer.height = (h) => {
        height = h;
      };
      controller.loadConfigData('customerUi', {
        audio: {
          audioOnly: true
        }
      }, {}, {}, {});

      expect(height).toBe(CONSTANTS.UI.AUDIO_ONLY_DEFAULT_HEIGHT);
      controller.state.mainVideoContainer.height = originalHeightFunc;
    });
  });
});
