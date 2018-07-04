jest.dontMock('../js/skin');
jest.dontMock('../js/views/pauseScreen');
jest.dontMock('../js/constants/constants');
jest.dontMock('../js/components/controlBar');
jest.dontMock('../js/components/accessibleButton');
jest.dontMock('../js/components/controlButton');
jest.dontMock('../js/components/utils');
jest.dontMock('../js/components/higher-order/accessibleMenu');
jest.dontMock('../js/components/higher-order/preserveKeyboardFocus');
jest.dontMock('../js/mixins/responsiveManagerMixin');
jest.dontMock('screenfull');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var Skin = require('../js/skin');
var skinConfig = require('../config/skin.json');
var CONSTANTS = require('../js/constants/constants');
var sinon = require('sinon');

var _ = require('underscore');

var skinControllerMock = {
  state: {
    adVideoDuration: 0,
    errorCode: '',
    adOverlayUrl: '',
    scrubberBar: {
      isHovering: true
    },
    upNextInfo: {
      showing: false
    },
    volumeState: {
      muted: false
    },
    videoQualityOptions: {},
    multiAudioOptions: {},
    closedCaptionOptions: {},
    config: {},
    moreOptionsItems: []
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
    var skinComponent = Enzyme.mount(<Skin />).instance();
    skinComponent.handleClickOutsidePlayer();
    skinComponent.updatePlayhead(4,6,8);
    skinComponent.componentWillUnmount();
  });
});

describe('Skin screenToShow state', function() {
  var wrapper, controller, state, skin;
  beforeEach(function() {
    controller = getMockController();
    state = {
      responsiveId: 'md',
      contentTree: {}
    };
    // Render skin into DOM
    wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        closedCaptionOptions={{
          enabled: false,
          availableLanguages: {
            locale: []
          }
        }}
      />
    );
    skin = wrapper.instance();
  });

  it('tests LOADING SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.LOADING_SCREEN;
    skin.switchComponent(state);
  });

  it('tests START SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.START_SCREEN;
    skin.switchComponent(state);
  });

  it('tests PLAYING SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.PLAYING_SCREEN;
    skin.switchComponent(state);
  });

  it('tests SHARE SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.SHARE_SCREEN;
    skin.switchComponent(state);
  });

  it('tests PAUSE SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.PAUSE_SCREEN;
    skin.switchComponent(state);
  });

  it('tests END SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.END_SCREEN;
    skin.switchComponent(state);
  });

  it('tests AD SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.AD_SCREEN;
    skin.switchComponent(state);
  });

  it('tests DISCOVERY SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.DISCOVERY_SCREEN;
    state.discoveryData = {
      relatedVideos: []
    };
    skin.switchComponent(state);
  });

  it('tests MORE OPTIONS SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN;
    skin.switchComponent(state);
  });

  it('tests CLOSED CAPTION SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN;
    state.closedCaptionOptions = {
      autoFocus: false
    };
    skin.switchComponent(state);
  });

  it('tests VIDEO QUALITY SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN;
    state.videoQualityOptions = {
      autoFocus: false,
      availableBitrates: []
    };
    skin.switchComponent(state);
  });

  it('tests ERROR SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.ERROR_SCREEN;
    skin.switchComponent(state);
  });

  it('tests DEFAULT SCREEN', function() {
    skin.switchComponent(state);
  });

  it('tests w/o args', function() {
    skin.switchComponent();
  });

  describe('Vr methods tests', function() {
    it('getDirectionParams should return correct values', function() {
      skin.state.xVrMouseStart = 0;
      skin.state.yVrMouseStart = 0;
      skin.state.componentWidth = 300;
      skin.state.componentHeight = 180;
      var res = skin.getDirectionParams(20, 90);
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
      var res2 = skin.getDirectionParams('', undefined);
      expect(res2).toEqual([ 0, 0, 0 ]);
    });

    it('handleVrPlayerMouseMove should return correct values', function() {
      var mockController = {
        onTouchMove: function() {}
      };

      var event = {
        preventDefault: function() {},
        pageX: 20,
        pageY: 90
      };

      var wrapper = Enzyme.mount(<Skin controller={mockController} />);
      var skinComponent = wrapper.instance();

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
  var wrapper;

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
    wrapper = Enzyme.mount(
      <Skin
        controller={mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={{ enabled: false }} />
      , document.body
    );
    skin = wrapper.instance();
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
    var skinElement = wrapper.find('#oo-responsive');
    focusableElements = skinElement.getDOMNode().querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']:enabled');
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(document.body);
    // Our version of jest doesn't seem to support mockRestore()
    document.addEventListener = originalAddEventListener;
    document.body.innerHTML = '';
    if (document.activeElement) {
      document.activeElement.blur();
    }
  });

  it('should constrain tab navigation to control bar elements when in fullscreen mode', function() {
    mockController.state.fullscreen = true;
    // Tab on document, focuses first element
    mockEvent.target = document.body;
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[0].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
    // Tab on last element, focuses on first
    document.activeElement.blur();
    mockEvent.target = focusableElements[focusableElements.length - 1];
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[0].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
    // Shift + tab on document, focuses on last element
    document.activeElement.blur();
    mockEvent.target = document.body;
    mockEvent.shiftKey = true;
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[focusableElements.length - 1].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
    // Shift + tab on first element, focuses on last
    document.activeElement.blur();
    mockEvent.target = focusableElements[0];
    mockEvent.shiftKey = true;
    eventMap.keydown(mockEvent);
    expect(document.activeElement.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe(focusableElements[focusableElements.length - 1].getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR));
  });

  it('should NOT constrain tab navigation to control bar elements when NOT in fullscreen mode', function() {
    mockController.state.fullscreen = false;
    //document.activeElement starts as an object with jsdom. We also cannot
    //set document.activeElement to null. We'll instead check that the docment.activeElement
    //does not change from its original state
    var originalActiveElement = document.activeElement;
    // Tab on last focusable element, should NOT go back to the first
    mockEvent.target = focusableElements[focusableElements.length - 1];
    eventMap.keydown(mockEvent);
    expect(document.activeElement).toBe(originalActiveElement);
    // Shift + tab on first element, should NOT focus on last
    document.activeElement.blur();
    mockEvent.target = focusableElements[0];
    mockEvent.shiftKey = true;
    eventMap.keydown(mockEvent);
    expect(document.activeElement).toBe(originalActiveElement);
  });
});

describe('Skin', function() {
  it('tests IE10', function() {
    // set user agent to IE 10
    OO_setWindowNavigatorProperty('userAgent', 'MSIE 10');

    // render skin into DOM
    var wrapper = Enzyme.mount(<Skin />);
  });

  it('tests IE10 START SCREEN', function() {
    // set user agent to IE 10
    OO_setWindowNavigatorProperty('userAgent', 'MSIE 10');

    // render skin into DOM
    var skinComponent = Enzyme.mount(<Skin
      skinConfig={skinConfig}
    />).instance();
    skinComponent.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      responsiveId: 'md'
    });
  });
});
