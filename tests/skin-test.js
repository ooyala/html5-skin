jest.dontMock('../js/skin');
jest.dontMock('../js/views/pauseScreen');
jest.dontMock('../js/views/contentScreen');
jest.dontMock('../js/constants/constants');
jest.dontMock('../js/components/controlBar');
jest.dontMock('../js/components/volumeControls');
jest.dontMock('../js/components/accessibleButton');
jest.dontMock('../js/components/controlButton');
jest.dontMock('../js/components/playbackSpeedPanel');
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
var ContentScreen = require('../js/views/contentScreen');
var PlaybackSpeedPanel = require('../js/components/playbackSpeedPanel');
var CONSTANTS = require('../js/constants/constants');
var sinon = require('sinon');

var _ = require('underscore');

const VolumePanel = require('../js/components/volumePanel');
const AudioOnlyScreen = require('../js/views/audioOnlyScreen');
const SharePanel = require('../js/components/sharePanel');

var skinControllerMock = {
  state: {
    adVideoDuration: 0,
    errorCode: {},
    adOverlayUrl: '',
    playerState: '',
    isMobile: false,
    scrubberBar: {
      isHovering: true
    },
    upNextInfo: {
      showing: false
    },
    volumeState: {
      muted: false,
      volume: 1,
      volumeSliderVisible: true
    },
    videoQualityOptions: {
      selectedBitrate: {
        id: 'auto'
      }
    },
    multiAudioOptions: {},
    playbackSpeedOptions: { currentSpeed: 1 },
    closedCaptionOptions: {},
    config: {},
    moreOptionsItems: [],
    isLiveStream: false,
    duration: 60,
    currentPlayhead: 10,
    skipControls: {
      hasPreviousVideos: false,
      hasNextVideos: false
    },
    cast: {
      showButton: false,
      connected: false,
      device: ""
    }
  },
  addBlur: function() {},
  removeBlur: function() {},
  setVolume: function() {},
  cancelTimer: function() {},
  setFocusedControl: function() {},
  enablePauseAnimation: function() {},
  setPlaybackSpeed: function() {},
  startHideControlBarTimer: function() {},
  toggleClosedCaptionEnabled: function() {},
  onClosedCaptionChange: function() {},
  publishOverlayRenderingEvent: function() {},
  rewindOrRequestPreviousVideo: () => {},
  requestNextVideo: () => {},
  togglePlayPause: () => {}
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
      playerState: '',
      responsiveId: 'md',
      contentTree: {}
    };
    // Render skin into DOM
    wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        language="en"
        localizableStrings={{}}
        closedCaptionOptions={{
          enabled: false,
          fontSize: 'Medium',
          availableLanguages: {
            locale: []
          }
        }} />
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

  it('tests VOLUME SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.VOLUME_SCREEN;
    skin.switchComponent(state);

    wrapper.update();
    expect(wrapper.find(ContentScreen).length).toBe(1);
    expect(wrapper.find(ContentScreen).find(VolumePanel).length).toBe(1);
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
      availableBitrates: [],
      selectedBitrate: {
        id: 'auto'
      }
    };
    skin.switchComponent(state);
  });

  it('tests PLAYBACK SPEED SCREEN', function() {
    state.screenToShow = CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN;
    state.playbackSpeedOptions = {
      currentSpeed: 1,
      showPopover: false,
      autoFocus: false
    };
    skin.switchComponent(state);
    wrapper.update();
    expect(wrapper.find(ContentScreen).length).toBe(1);
    expect(wrapper.find(ContentScreen).find(PlaybackSpeedPanel).length).toBe(1);
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

});

describe('Methods tests', function() {
  let wrapper;
  let controller;
  let state;
  let skin;
  beforeEach(function() {
    controller = getMockController();
    state = {
      playerState: '',
      responsiveId: 'md',
      contentTree: {}
    };
    // Render skin into DOM
    wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        language="en"
        localizableStrings={{}}
        closedCaptionOptions={{
          enabled: false,
          fontSize: 'Medium',
          availableLanguages: {
            locale: []
          }
        }} />
    );
    skin = wrapper.instance();
  });

  it('handleTouchEnd should called togglePlayPause if controlBarVisible is true', function() {
    skin.props.controller.state.controlBarVisible = false;
    let isTouched = false;
    skin.props.controller.togglePlayPause = function() {
      isTouched = !isTouched;
    };
    const event = {
      preventDefault: function() {}
    };
    skin.handleTouchEndOnPlayer(event);
    expect(isTouched).toBe(false);

    skin.props.controller.state.controlBarVisible = true;
    skin.handleTouchEndOnPlayer(event);
    expect(isTouched).toBe(true);
  });

  it('handleVrPlayerMouseDown should check and set vrVievingDirection if videoVr is true', function() {
    skin.props.controller.videoVr = false;
    let vrVievingDirectionChecked = false;
    let vVrViewingDiractionSet = false;
    skin.props.controller.checkVrDirection = () => {
      vrVievingDirectionChecked = true;
    };
    skin.props.controller.setControllerVrViewingDirection = () => {
      vVrViewingDiractionSet = true;
    };
    skin.props.controller.togglePlayPause = () => {};
    const event = {
      preventDefault: function() {}
    };
    skin.handleVrPlayerMouseDown(event);
    expect(vrVievingDirectionChecked).toBe(false);
    expect(vVrViewingDiractionSet).toBe(false);

    skin.props.controller.videoVr = true;
    skin.handleVrPlayerMouseDown(event);
    expect(vrVievingDirectionChecked).toBe(true);
    expect(vVrViewingDiractionSet).toBe(true);
  });

  it('getTotalTime should return the duration of the video', () => {
    skin.duration = 60;
    expect(skin.getTotalTime()).toBe("01:00");

    skin.duration = 3600;
    expect(skin.getTotalTime()).toBe("01:00:00");

    skin.duration = null;
    expect(skin.getTotalTime()).toBe("00:00");

    delete skin.duration;
    expect(skin.getTotalTime()).toBe("00:00");
  });

  it('getPlayheadTime should return the current playhead of the video', () => {
    skin.currentPlayhead = 120;
    expect(skin.getPlayheadTime()).toBe("02:00");

    skin.currentPlayhead = 7200;
    expect(skin.getPlayheadTime()).toBe("02:00:00");

    skin.currentPlayhead = null;
    expect(skin.getPlayheadTime()).toBe(null);

    delete skin.currentPlayhead;
    expect(skin.getPlayheadTime()).toBe(null);

    skin.state.isLiveStream = true;
    skin.currentPlayhead = 120;
    skin.duration = 60;
    expect(skin.getPlayheadTime()).toBe("01:00");
  });

  describe('Vr methods', function() {
    it('getDirectionParams should return correct values', function() {
      skin.state.xVrMouseStart = 0;
      skin.state.yVrMouseStart = 0;
      skin.state.componentWidth = 300;
      skin.state.componentHeight = 180;
      const res = skin.getDirectionParams(20, 90);
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

      const res2 = skin.getDirectionParams('', undefined);
      expect(res2).toEqual([ 0, 0, 0 ]);

      skin.state.componentHeight = 0;
      const res3 = skin.getDirectionParams(20, 90);
      expect(res3).toEqual([ 0, 0, 0 ]);

      skin.state.componentHeight = 180;
      const res4 = skin.getDirectionParams(20, 90);
      expect(res4).toEqual([ 6, 0, 60 ]);

      skin.state.componentHeight = NaN;
      const res5 = skin.getDirectionParams(20, 90);
      expect(res5).toEqual([ 0, 0, 0 ]);
    });

    it('handleVrPlayerMouseMove should return correct values', function() {
      const mockController = {
        state: {},
        onTouchMove: function() {}
      };

      const event = {
        preventDefault: function() {},
        pageX: 20,
        pageY: 90
      };

      const wrapper = Enzyme.mount(<Skin controller={mockController} />);
      const skinComponent = wrapper.instance();

      skinComponent.state.componentWidth = 300;
      skinComponent.state.componentHeight = 180;

      const preventDefaultSpy = sinon.spy(event, 'preventDefault');
      const onTouchMoveSpy = sinon.spy(skinComponent.props.controller, 'onTouchMove');

      skinComponent.state.isVrMouseDown = true;
      skinComponent.props.controller.videoVr = true;
      skinComponent.handleVrPlayerMouseMove(event);

      expect(preventDefaultSpy.called).toBe(true);
      let params = [6, 0, 60]; //this value was tested in prev test
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
        responsiveView="md"
        closedCaptionOptions={{ enabled: false }} />
      , document.body
    );
    skin = wrapper.instance();
    skin.switchComponent({
      playerState: '',
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
    const skinElement = wrapper.find('.oo-responsive');
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
  afterEach(() => {
    OO_setWindowNavigatorProperty('userAgent', '');
  });

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

describe('Audio only', () => {
  var controller;

  beforeEach(() => {
    controller = getMockController();
    controller.state.audioOnly = true;
  });

  it('sets oo-audio-only class if player is audio only', () => {
    let wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        responsiveView="md"
        closedCaptionOptions={{ enabled: false }}
      />
      , document.body
    );
    expect(wrapper.find('.oo-audio-only').length).toBe(1);

    controller.state.audioOnly = false;
    wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        responsiveView="md"
        closedCaptionOptions={{ enabled: false }} />
      , document.body
    );
    expect(wrapper.find('.oo-audio-only').length).toBe(0);
  });

  it('displays audio only screen for initial, start, playing, pause, and end screens', () => {
    controller.alex = true;
    let wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        responsiveView="md"
        closedCaptionOptions={{ enabled: false }}
      />
      , document.body
    );
    let skin = wrapper.instance();
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      contentTree: {}
    });

    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(1);

    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.INITIAL_SCREEN
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(1);

    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PLAYING_SCREEN
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(1);

    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PAUSE_SCREEN
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(1);

    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.END_SCREEN
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(1);
  });

  it('displays regular screens for other screens', () => {
    let wrapper = Enzyme.mount(
      <Skin
        controller={controller}
        skinConfig={skinConfig}
        responsiveView="md"
        closedCaptionOptions={{ enabled: false }}
      />
      , document.body
    );
    var skin = wrapper.instance();
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      contentTree: {}
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(1);

    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.SHARE_SCREEN
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(0);
    expect(wrapper.find(SharePanel).length).toBe(1);

    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.VOLUME_SCREEN,
      playbackSpeedOptions: {
        currentSpeed: 1,
        showPopover: false,
        autoFocus: false
      }
    });
    wrapper.update();
    expect(wrapper.find(AudioOnlyScreen).length).toBe(0);
    expect(wrapper.find(VolumePanel).length).toBe(1);
  });
});
