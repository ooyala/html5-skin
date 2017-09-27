jest
.dontMock('../js/skin')
.dontMock('../js/components/utils')
.dontMock('../js/components/accessibilityControls')
.dontMock('../js/constants/constants')
.dontMock('../config/skin.json')
.dontMock('classnames');

var $ = require('jquery');
var _ = require('underscore');
var sinon = require('sinon');
var skinJson = require('../config/skin.json');
var CONSTANTS = require('../js/constants/constants');

var Html5Skin;

// Mock OO environment needed for skin plugin initialization
OO = {
  playerParams: {
    "core_version" : 4
  },
  publicApi: {},
  EVENTS: {},
  CONSTANTS: {
    CLOSED_CAPTIONS: {}
  },
  VIDEO: {
    ADS: 'ads',
    MAIN: 'main'
  },
  init: function() {},
  log: function() {},
  plugin: function(module, callback) {
    var plugin = callback(OO, _, $);
    plugin.call(OO, OO.mb, 0);
    // Save Html5Skin class in local var
    Html5Skin = exposeStaticApi;
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
    getElementsByTagName: function() { return [mockDomElement] },
    webkitSupportsFullscreen: true,
    webkitEnterFullscreen: function() {},
    webkitExitFullscreen: function() {},
    addEventListener: function() {}
  };

  beforeEach(function() {
    controller = new Html5Skin(OO.mb, 'id');
    controller.state.pluginsElement = $('<div/>');
    controller.state.pluginsClickElement = $('<div/>');
    controller.state.mainVideoElement = mockDomElement;
  });

  describe('Buffering state', function() {
    var startBufferingTimerSpy, stopBufferingTimerSpy;

    beforeEach(function() {
      startBufferingTimerSpy = sinon.spy(controller, 'startBufferingTimer');
      stopBufferingTimerSpy = sinon.spy(controller, 'stopBufferingTimer');
      controller.skin = {
        updatePlayhead: function() {},
        props: {
          skinConfig: JSON.parse(JSON.stringify(skinJson))
        }
      };
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
      controller.startBufferingTimer();
      expect(controller.state.buffering).toBe(false);
      jest.runAllTimers();
      expect(controller.state.buffering).toBe(true);
    });

    it('should reset buffering state if it hasn\'t been cleared by the time PLAYING is fired', function() {
      controller.setBufferingState(true);
      expect(controller.state.buffering).toBe(true);
      controller.onPlaying('', OO.VIDEO.MAIN);
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
      controller.onVideoElementFocus('', OO.VIDEO.MAIN);
      expect(stopBufferingTimerSpy.callCount).toBe(4);
      expect(controller.state.bufferingTimer).toBeFalsy();
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

});