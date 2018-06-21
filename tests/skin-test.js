jest.dontMock('../js/skin');
jest.dontMock('../js/views/pauseScreen');
jest.dontMock('../js/constants/constants');
jest.dontMock('../js/components/controlBar');
jest.dontMock('../js/components/accessibleButton')
jest.dontMock('../js/components/controlButton')
jest.dontMock('../js/components/utils');
jest.dontMock('../js/components/higher-order/accessibleMenu');
jest.dontMock('../js/components/higher-order/preserveKeyboardFocus');
jest.dontMock('../js/mixins/responsiveManagerMixin');
jest.dontMock('screenfull');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Skin = require('../js/skin');
var skinConfig = require('../config/skin.json');
var CONSTANTS = require('../js/constants/constants');
var sinon = require('sinon');

var _ = require('underscore');

OO = {
  log: function() {}
};

var skinControllerMock = {
  state: {
    adVideoDuration: 0,
    errorCode: '',
    adOverlayUrl: '',
    upNextInfo: {
      showing: false
    },
    volumeState: {
      muted: false
    },
    videoQualityOptions: {},
    multiAudioOptions: {},
    closedCaptionOptions: {}
  },
  cancelTimer: function() {},
  enablePauseAnimation: function() {},
  publishOverlayRenderingEvent: function() {}
};

var getMockController = function() {
  // Deep clone nested properties and then add the functions which were
  // removed during JSON.stringify
  var mockController = JSON.parse(JSON.stringify(skinControllerMock));
  _.extend(mockController, skinControllerMock);
  return mockController;
};

describe('Skin', function() {
  it('tests methods', function() {
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
    skinComponent.handleClickOutsidePlayer();
    skinComponent.updatePlayhead(4,6,8);
    skinComponent.componentWillUnmount();
  });
});

describe('Skin screenToShow state', function() {
  beforeEach(function() {
    this.controller = getMockController();
    this.state = {
      responsiveId: 'md',
      contentTree: {}
    };
    // Render skin into DOM
    this.skin = TestUtils.renderIntoDocument(
      <Skin
        controller={this.controller}
        skinConfig={skinConfig}
        closedCaptionOptions={{ enabled: false }} />
    );
  });

  it('tests LOADING SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests START SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests PLAYING SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests SHARE SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests PAUSE SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests END SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests AD SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.AD_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests DISCOVERY SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests MORE OPTIONS SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests CLOSED CAPTION SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN;
    this.state.closedCaptionOptions = {
      autoFocus: false
    };
    this.skin.switchComponent(this.state);
  });

  it('tests VIDEO QUALITY SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN;
    this.state.videoQualityOptions ={
      autoFocus: false
    }
    this.skin.switchComponent(this.state);
  });

  it('tests ERROR SCREEN', function() {
    this.state.screenToShow = CONSTANTS.SCREEN.ERROR_SCREEN;
    this.skin.switchComponent(this.state);
  });

  it('tests DEFAULT SCREEN', function() {
    this.skin.switchComponent(this.state);
  });

  it('tests w/o args', function() {
    this.skin.switchComponent();
  });

  describe('Vr methods tests', function() {
    it('getDirectionParams should returns correct values', function() {
      this.skin.state.xVrMouseStart = 0;
      this.skin.state.yVrMouseStart = 0;
      this.skin.state.componentWidth = 300;
      this.skin.state.componentHeight = 180;
      var res = this.skin.getDirectionParams(20, 90);
      /*
      * An explanation:
      *
      * pageX = 20;
      * pageY = 90;
      * dx = 20 - 0 = 20;
      * dy = 90 - 0 = 90;
      * maxDegreesX = 90;
      * maxDegreesY = 120;
      * degreesForPixelYaw = 90 / 300 = 0.3;
      * degreesForPixelPitch = 120 / 180 = 0.666666667;
      * yaw = 0 + 20 * 0.3 = 6;
      * pitch = 0 + 90 * 0.666666667 = 60;
      */
      expect(res).toEqual([ 6, 0, 60 ]);
      var res2 = this.skin.getDirectionParams('', undefined);
      expect(res2).toEqual([ 0, 0, 0 ]);
    });
    it('handleVrPlayerMouseMove should returns correct values', function() {
      var mockController = {
        onTouchMove: function() {}
      };

      var event = {
        preventDefault: function() {},
        pageX: 20,
        pageY: 90
      };

      var skinComponent = TestUtils.renderIntoDocument(<Skin controller={mockController} />);

      skinComponent.state.componentWidth = 300;
      skinComponent.state.componentHeight = 180;

      var preventDefaultSpy = sinon.spy(event, 'preventDefault');
      var onTouchMoveSpy = sinon.spy(skinComponent.props.controller, 'onTouchMove');

      skinComponent.state.isVrMouseDown = true;
      skinComponent.props.controller.videoVr = true;
      skinComponent.handleVrPlayerMouseMove(event);

      expect(preventDefaultSpy.called).toBe(true);
      var params = [6, 0, 60]; //this value was tested in prev test
      expect(onTouchMoveSpy.args[0][0]).toEqual(params);
    });
  });
});

describe('Tab Navigation', function() {
  var skin;
  var eventMap;
  var eventCallbackMap;
  var mockEvent;
  var mockController;
  var mockSkinConfig;
  var focusableElements;
  var originalAddEventListener;

  // Mock addEventListener on document object since TestUtils.Simulate will not work in this case
  var mockEventListener = function() {
    eventMap = {};
    eventCallbackMap = {};
    originalAddEventListener = document.addEventListener;

    document.addEventListener = function(event, cb) {
      if (!eventCallbackMap[event]) {
        eventCallbackMap[event] = [];
      }
      eventCallbackMap[event].push(cb);

      eventMap[event] = function(params) {
        eventCallbackMap[event].forEach(function(callback) {
          callback(params);
        });
      };
    };
  };

  var renderSkin = function() {
    skin = ReactDOM.render(
      <Skin
        controller={mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={{ enabled: false }} />
      , document.body
    );
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PAUSE_SCREEN,
      responsiveId: 'md',
      contentTree: {}
    });
  };

  beforeEach(function() {
    mockEventListener();
    // Reset mock properties
    mockEvent = { key: CONSTANTS.KEY_VALUES.TAB, preventDefault: function() {} };
    mockController = getMockController();
    mockSkinConfig = JSON.parse(JSON.stringify(skinConfig));
    mockSkinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'volume', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 240 },
      { 'name': 'fullscreen', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
    ];
    // Render and get focusable elements
    renderSkin();
    var skinElement = document.body.querySelector('#oo-responsive');
    focusableElements = skinElement.querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']');
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(document.body);
    // Our version of jest doesn't seem to support mockRestore()
    document.addEventListener = originalAddEventListener;
    document.body.innerHTML = '';
  });

  it('should constrain tab navigation to control bar elements when in fullscreen mode', function() {
    mockController.state.fullscreen = true;
    // Tab on document, focuses first element
    document.activeElement = null;
    mockEvent.target = document.body;
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[0].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
    // Tab on last element, focuses on first
    document.activeElement = null;
    mockEvent.target = focusableElements[focusableElements.length - 1];
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[0].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
    // Shift + tab on document, focuses on last element
    document.activeElement = null;
    mockEvent.target = document.body;
    mockEvent.shiftKey = true;
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[focusableElements.length - 1].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
    // Shift + tab on first element, focuses on last
    document.activeElement = null;
    mockEvent.target = focusableElements[0];
    mockEvent.shiftKey = true;
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[focusableElements.length - 1].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
  });

  it('should NOT constrain tab navigation to control bar elements when NOT in fullscreen mode', function() {
    mockController.state.fullscreen = false;
    // Tab on last focusable element, should NOT go back to the first
    document.activeElement = null;
    mockEvent.target = focusableElements[focusableElements.length - 1];
    eventMap.keydown(mockEvent);
    expect(document.activeElement).toBeNull();
    // Shift + tab on first element, should NOT focus on last
    document.activeElement = null;
    mockEvent.target = focusableElements[0];
    mockEvent.shiftKey = true;
    eventMap.keydown(mockEvent);
    expect(document.activeElement).toBeNull();
  });
});

describe('Skin', function() {
  it('tests IE10', function() {
    // set user agent to IE 10
    window.navigator.userAgent = 'MSIE 10';

    // render skin into DOM
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
  });

  it('tests IE10 START SCREEN', function() {
    // set user agent to IE 10
    window.navigator.userAgent = 'MSIE 10';

    // render skin into DOM
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
    skinComponent.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      responsiveId: 'md'
    });
  });
});
