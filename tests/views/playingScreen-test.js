jest
.dontMock('classnames')
.dontMock('../../js/views/playingScreen')
.dontMock('../../js/mixins/resizeMixin')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/higher-order/preserveKeyboardFocus');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var PlayingScreen = require('../../js/views/playingScreen');
var UnmuteIcon = require('../../js/components/unmuteIcon');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');
var CONSTANTS = require('../../js/constants/constants');

describe('PlayingScreen', function() {
  var mockController, mockSkinConfig, closedCaptionOptions;
  var handleVrPlayerMouseUp = function() {};

  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        controlBarVisible: true,
        scrubberBar: {
          isHovering: true
        },
        upNextInfo: {
          showing: false
        },
        volumeState: {
          volume: 1,
          muted: false,
          mutingForAutoplay: false,
          volumeStateVisible: true, 
          volumeSliderVisible: true
        },
        config: {
          isVrAnimationEnabled: {
            vrNotification: true,
            vrIcon: true
          }
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      cancelTimer: function() {},
      hideVolumeSliderBar: function() {},
      toggleMute: function() {},
      startHideControlBarTimer: function() {},
      setVolume: function() {}
    };
    mockSkinConfig = Utils.clone(skinConfig);
    closedCaptionOptions = {
      cueText: 'cue text'
    };
  });

  it('creates a PlayingScreen and checks mouseMove, mouseUp without video360', function() {
    var isMoved = false
      , isTouched = false;

    mockController.state.videoVr = false;
    mockController.startHideControlBarTimer = function() {
      isMoved = true;
    };
    mockController.onTouched = function() {
      isTouched = true;
    };

    var handleVrPlayerMouseMove = function() {};
    var handleVrPlayerMouseUp = function() {
      mockController.onTouched();
    };

    // Render pause screen into DOM
    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseMove={handleVrPlayerMouseMove}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp.bind(this)}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var screen = wrapper.find('.oo-state-screen-selectable');

    screen.at(0).simulate('mouseMove');
    expect(isMoved).toBe(false);
  });

  it('creates a PlayingScreen and checks mouseDown, mouseUp with video360', function() {
    var isVrDirectionChecked = false;
    var isStartHideControlBarTimer = false;

    mockController.state.videoVr = true;
    mockController.state.viewingDirection = {yaw: 0, roll: 0, pitch: 0},
    mockController.startHideControlBarTimer = function() {
      isStartHideControlBarTimer = true;
    };
    mockController.checkVrDirection = function() {
      isVrDirectionChecked = true;
    };
    mockController.togglePlayPause = function() {};

    var handleVrPlayerMouseDown = function() {
      mockController.checkVrDirection();
    };
    var handleVrPlayerMouseUp = function() {
      mockController.checkVrDirection();
    };

    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        componentWidth={90}
        componentHeight={45}
        fullscreen={false}
        handleVrPlayerMouseDown={handleVrPlayerMouseDown}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        closedCaptionOptions={closedCaptionOptions}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    wrapper.instance().setState({
      isVrMouseDown: true,
      xVrMouseStart: -10,
      yVrMouseStart: -20
    });

    var screen = wrapper.find('.oo-state-screen-selectable');

    screen.at(0).simulate('mouseDown');
    expect(isVrDirectionChecked).toBe(true);

    screen.at(0).simulate('mouseUp');
    expect(isVrDirectionChecked).toBe(true);

  });

  it('creates a PlayingScreen and checks touchEnd', function() {
    var isInHandleTouchEnd = false;
    var clicked = false;

    mockController.state.videoVr = false;
    mockController.state.isMobile = true;
    mockController.togglePlayPause = function() {
      clicked = true;
    };
    mockController.startHideControlBarTimer = function() {};

    var handleVrPlayerMouseUp = function() {
      isInHandleTouchEnd = true;
    };

    // Render pause screen into DOM
    var wrapper = Enzyme.mount(
        <PlayingScreen
            controller={mockController}
            skinConfig={mockSkinConfig}
            closedCaptionOptions={closedCaptionOptions}
            handleVrPlayerMouseUp={handleVrPlayerMouseUp}
            playerState={CONSTANTS.STATE.PLAYING}
        />);

    var screen = wrapper.find('.oo-state-screen-selectable');
    screen.simulate('touchEnd');
    expect(isInHandleTouchEnd).toBe(true);
    expect(clicked).toBe(true);
  });

  it('creates a PlayingScreen and checks mouseMove, mouseOver, mouseOut, keyUp without video360 fullscreen', function() {
    var over = false;
    var out = false;
    var moved = false;
    var clicked = false;

    mockController.state.videoVr = false;
    mockController.startHideControlBarTimer = function() {
      moved = true;
    };
    mockController.togglePlayPause = function() {
      clicked = true;
    };
    mockController.showControlBar = function() {
      over = true;
    };
    mockController.hideControlBar = function() {
      out = true;
    };

    // Render pause screen into DOM
    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        fullscreen = {true}
        controlBarAutoHide={true}
        closedCaptionOptions = {closedCaptionOptions}
        handleVrPlayerMouseUp = {handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
      />);

    var screen = wrapper.find('.oo-playing-screen');
    screen.simulate('mouseMove');
    expect(moved).toBe(true);

    screen.simulate('mouseOut');
    expect(out).toBe(true);

    var screen1 = wrapper.find('.oo-interactive-container');
    screen1.simulate('touchEnd');
    expect(clicked).toBe(false);

    screen.simulate('mouseOver');
    expect(over).toBe(true);
  });

  it('creates a PlayingScreen and checks mouseMove, mouseOver, mouseOut, keyUp with video360 fullscreen', function() {
    var over = false;
    var out = false;
    var moved = false;
    var clicked = false;

    mockController.state.videoVr = true;
    mockController.state.viewingDirection = {yaw: 0, roll: 0, pitch: 0};

    mockController.startHideControlBarTimer = function() {
      moved = true;
    };
    mockController.togglePlayPause = function() {
      clicked = true;
    };
    mockController.showControlBar = function() {
      over = true;
    };
    mockController.hideControlBar = function() {
      out = true;
    };

    // Render pause screen into DOM
    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        fullscreen={true}
        componentWidth={90}
        componentHeight={40}
        controlBarAutoHide={true}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    wrapper.instance().setState({
      isVrMouseDown: true,
      xVrMouseStart: -10,
      yVrMouseStart: -20
    });

    var screen = wrapper.find('.oo-playing-screen');

    screen.at(0).simulate('mouseMove');
    expect(moved).toBe(true);

    screen.at(0).simulate('mouseOut');
    expect(out).toBe(true);

    screen.at(0).simulate('mouseOver');
    expect(over).toBe(true);

    var screen1 = wrapper.find('.oo-interactive-container');

    screen1.simulate('touchEnd');
    expect(clicked).toBe(false);
  });

  it('creates a PlayingScreen and check play&pause', function() {
    var clicked = false;
    var isMouseMove = true;

    mockController.state.videoVr = true;
    mockController.state.isMobile = true;
    mockController.state.isVrMouseDown = false;
    mockController.state.isMouseMove = false;
    mockController.togglePlayPause = function() {
      clicked = !clicked;
    };
    mockController.startHideControlBarTimer = function() {};

    var handleVrPlayerClick = function() {
      isMouseMove = false;
    };

    // Render pause screen into DOM
    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions = {closedCaptionOptions}
        handleVrPlayerClick={handleVrPlayerClick}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    var screen = wrapper.find('.oo-state-screen-selectable');

    screen.simulate('click');
    expect(clicked).toBe(true);
    expect(isMouseMove).toBe(false);
  });

  it('should show control bar when pressing the tab key', function() {
    var autoHide = false;
    var controlBar = false;

    mockController.startHideControlBarTimer = function() {
      autoHide = true;
    };
    mockController.showControlBar = function() {
      controlBar = true;
    };

    var wrapper = Enzyme.mount(
      <PlayingScreen
          controller = {mockController}
          skinConfig={mockSkinConfig}
          closedCaptionOptions = {closedCaptionOptions}
          handleVrPlayerMouseUp={handleVrPlayerMouseUp}
          playerState={CONSTANTS.STATE.PLAYING}
      />);
    var screen = wrapper.find('.oo-playing-screen');

    screen.simulate('keyDown', {key: 'Tab', which: 9, keyCode: 9});
    expect(autoHide && controlBar).toBe(true);
  });

  it('should show control bar when pressing the tab, space bar or enter key', function() {
    var autoHide = false;
    var controlBar = false;

    mockController.startHideControlBarTimer = function() {
      autoHide = true;
    };
    mockController.showControlBar = function() {
      controlBar = true;
    };

    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions = {closedCaptionOptions}
        handleVrPlayerMouseUp = {handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
      />);
    var screen = wrapper.find('.oo-playing-screen');

    screen.simulate('keyDown', {key: 'Tab', which: 9, keyCode: 9});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    screen.simulate('keyDown', {key: 'Enter', which: 13, keyCode: 13});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    screen.simulate('keyDown', {key: ' ', which: 32, keyCode: 32});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    screen.simulate('keyDown', {key: 'Dead', which: 16, keyCode: 16});
    expect(autoHide && controlBar).toBe(false);
  });

  it('tests playing screen componentWill*', function() {
    mockController.startHideControlBarTimer = function() {};
    mockController.showControlBar = function() {};
    mockController.hideControlBar = function() {};
    mockController.cancelTimer = function() {};

    var node = document.createElement('div');
    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        fullscreen = {true}
        controlBarAutoHide={true}
        componentWidth={400}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
        closedCaptionOptions={closedCaptionOptions} />, node
    );

    Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        fullscreen = {true}
        controlBarAutoHide={true}
        componentWidth={800}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
        closedCaptionOptions={closedCaptionOptions} />, node
    );

    wrapper.unmount();
  });

  it('should display unmute icon when handling muted autoplay', function() {
    mockController.state.volumeState.muted = true;
    mockController.state.volumeState.mutingForAutoplay = true;

    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
      />);
    var unmuteIcon = wrapper.find(UnmuteIcon);
    expect(unmuteIcon).toBeTruthy();
  });

  it('should not display unmute icon when not muted', function() {
    mockController.state.volumeState.muted = false;
    mockController.state.volumeState.mutingForAutoplay = true;

    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        playerState={CONSTANTS.STATE.PLAYING}
      />);
    var unmuteIcons = wrapper.find(UnmuteIcon);
    expect(unmuteIcons.length).toBe(0);
  });

  it('should initialize with control bar state from controller', function() {
    var wrapper;

    mockController.state.controlBarVisible = true;
    wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={{}}
        handleVrPlayerMouseUp={function() {}}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(wrapper.state('controlBarVisible')).toBe(true);

    mockController.state.controlBarVisible = false;
    wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        closedCaptionOptions={{}}
        handleVrPlayerMouseUp={function() {}}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(wrapper.state('controlBarVisible')).toBe(false);
  });

});
