jest
.dontMock('../js/components/utils')
.dontMock('../js/components/accessibilityControls')
.dontMock('../js/constants/constants')
.dontMock('../config/skin.json')
.dontMock('classnames');

var CONSTANTS = require('../js/constants/constants');
var sinon = require('sinon');

var Html5Skin, defaultSkinState;

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
  plugin: function(module, callback) {
    var _ = require('underscore');
    var $ = require('jquery');
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

  beforeEach(function() {
    controller = new Html5Skin(OO.mb, 'id');
    controller.state.mainVideoElement = {
      classList: {
        add: function() {},
        remove: function() {}
      },
      getElementsByTagName: function() { return [controller.state.mainVideoElement] },
      webkitSupportsFullscreen: true,
      webkitEnterFullscreen: function() {},
      webkitExitFullscreen: function() {},
      addEventListener: function() {}
    };
  });

  describe('Buffering state', function() {

    it('should update buffering state', function() {
      controller.setBufferingState(false);
      expect(controller.state.buffering).toBe(false);
      controller.setBufferingState(true);
      expect(controller.state.buffering).toBe(true);
    });

    it('should not render skin if new buffering state is the same as the current one', function() {
      var spy = sinon.spy(controller, 'renderSkin');
      controller.state.buffering = false;
      controller.setBufferingState(false);
      controller.state.buffering = true;
      controller.setBufferingState(true);
      expect(spy.callCount).toBe(0);
      spy.restore();
    });

    it('should stop buffering timer before starting a new one', function() {
      var spy = sinon.spy(controller, 'stopBufferingTimer');
      controller.startBufferingTimer();
      expect(spy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.stopBufferingTimer();
      spy.restore();
    });

    it('should stop buffering timer when setting buffering state to false', function() {
      var spy = sinon.spy(controller, 'stopBufferingTimer');
      controller.startBufferingTimer();
      expect(spy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.setBufferingState(false);
      expect(spy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
      spy.restore();
    });

    it('should cancel buffering timer when ON_BUFFERED event is fired', function() {
      var spy = sinon.spy(controller, 'stopBufferingTimer');
      controller.startBufferingTimer();
      expect(spy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onBuffered();
      expect(spy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
      expect(controller.state.buffering).toBe(false);
      spy.restore();
    });

    it('should delay buffering state and start buffering timer when ON_BUFFERING event is fired', function() {
      var spy = sinon.spy(controller, 'startBufferingTimer');
      controller.state.isInitialPlay = false;
      controller.state.screenToShow = CONSTANTS.PLAYING_SCREEN;
      controller.onBuffering();
      expect(controller.state.buffering).toBe(false);
      expect(spy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.stopBufferingTimer();
      spy.restore();
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
      var spy = sinon.spy(controller, 'stopBufferingTimer');
      controller.accessibilityControls = { cleanUp: function() {} };
      controller.startBufferingTimer();
      expect(spy.callCount).toBe(1);
      expect(controller.state.bufferingTimer).toBeTruthy();
      controller.onPlayerDestroy({});
      expect(spy.callCount).toBe(2);
      expect(controller.state.bufferingTimer).toBeFalsy();
      spy.restore();
    });

  });

});
