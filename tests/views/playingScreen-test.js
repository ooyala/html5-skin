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

describe('PlayingScreen', function() {
  var mockController, closedCaptionOptions;
  var handleVrPlayerMouseUp = function() {};

  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        controlBarVisible: true,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: false,
          mutingForAutoplay: false
        },
        config: {
          isVrAnimationEnabled: {
            vrNotification: true,
            vrIcon: true
          }
        }
      }
    };
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
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseMove={handleVrPlayerMouseMove}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp.bind(this)}
      />
    );

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-selectable');

    screen[0].simulate('mouseMove');
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
        componentWidth={90}
        componentHeight={45}
        fullscreen={false}
        handleVrPlayerMouseDown={handleVrPlayerMouseDown}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        closedCaptionOptions={closedCaptionOptions}
      />
    );
    DOM.setState({
      isVrMouseDown: true,
      xVrMouseStart: -10,
      yVrMouseStart: -20
    });

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-selectable');

    screen[0].simulate('mouseDown');
    expect(isVrDirectionChecked).toBe(true);

    screen[0].simulate('mouseUp');
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
            controller = {mockController}
            closedCaptionOptions = {closedCaptionOptions}
            handleVrPlayerMouseUp = {handleVrPlayerMouseUp}
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
        fullscreen = {true}
        controlBarAutoHide={true}
        closedCaptionOptions = {closedCaptionOptions}
        handleVrPlayerMouseUp = {handleVrPlayerMouseUp}
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
        fullscreen={true}
        componentWidth={90}
        componentHeight={40}
        controlBarAutoHide={true}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
      />
    );

    DOM.setState({
      isVrMouseDown: true,
      xVrMouseStart: -10,
      yVrMouseStart: -20
    });

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-playing-screen');

    screen[0].simulate('mouseMove');
    expect(moved).toBe(true);

    screen[0].simulate('mouseOut');
    expect(out).toBe(true);

    screen[0].simulate('mouseOver');
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
        closedCaptionOptions = {closedCaptionOptions}
        handleVrPlayerClick={handleVrPlayerClick}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
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
          closedCaptionOptions = {closedCaptionOptions}
          handleVrPlayerMouseUp={handleVrPlayerMouseUp}
      />);
    var screen = wrapper.find('.oo-playing-screen');

    screen, {key: 'Tab', which: 9, keyCode: 9}.simulate('keyDown');
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
        closedCaptionOptions = {closedCaptionOptions}
        handleVrPlayerMouseUp = {handleVrPlayerMouseUp}
      />);
    var screen = wrapper.find('.oo-playing-screen');

    screen, {key: 'Tab', which: 9, keyCode: 9}.simulate('keyDown');
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    screen, {key: 'Enter', which: 13, keyCode: 13}.simulate('keyDown');
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    screen, {key: ' ', which: 32, keyCode: 32}.simulate('keyDown');
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    screen, {key: 'Dead', which: 16, keyCode: 16}.simulate('keyDown');
    expect(autoHide && controlBar).toBe(false);
  });

  it('tests playing screen componentWill*', function() {
    mockController.startHideControlBarTimer = function() { moved = true; };
    mockController.showControlBar = function() { over = true; };
    mockController.hideControlBar = function() { out = true; };
    mockController.cancelTimer = function() {};

    var node = document.createElement('div');
    var playScreen = ReactDOM.render(
      <PlayingScreen
        controller = {mockController}
        fullscreen = {true}
        controlBarAutoHide={true}
        componentWidth={400}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        closedCaptionOptions={closedCaptionOptions} />, node
    );

    ReactDOM.render(
      <PlayingScreen
        controller = {mockController}
        fullscreen = {true}
        controlBarAutoHide={true}
        componentWidth={800}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
        closedCaptionOptions={closedCaptionOptions} />, node
    );

    ReactDOM.unmountComponentAtNode(node);
  });

  it('should display unmute icon when handling muted autoplay', function() {
    mockController.state.volumeState.muted = true;
    mockController.state.volumeState.mutingForAutoplay = true;

    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
      />);
    var unmuteIcon = TestUtils.findRenderedComponentWithType(DOM, UnmuteIcon);
    expect(unmuteIcon).toBeTruthy();
  });

  it('should not display unmute icon when not muted', function() {
    mockController.state.volumeState.muted = false;
    mockController.state.volumeState.mutingForAutoplay = true;

    var wrapper = Enzyme.mount(
      <PlayingScreen
        controller = {mockController}
        closedCaptionOptions={closedCaptionOptions}
        handleVrPlayerMouseUp={handleVrPlayerMouseUp}
      />);
    var unmuteIcons = TestUtils.scryRenderedComponentsWithType(DOM, UnmuteIcon);
    expect(unmuteIcons.length).toBe(0);
  });

  it('should initialize with control bar state from controller', function() {
    var DOM, playingScreen;

    mockController.state.controlBarVisible = true;
    wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        closedCaptionOptions={{}}
        handleVrPlayerMouseUp={function() {}} />
    );
    playingScreen = TestUtils.findRenderedComponentWithType(DOM, PlayingScreen);
    expect(playingScreen.state.controlBarVisible).toBe(true);

    mockController.state.controlBarVisible = false;
    wrapper = Enzyme.mount(
      <PlayingScreen
        controller={mockController}
        closedCaptionOptions={{}}
        handleVrPlayerMouseUp={function() {}} />
    );
    playingScreen = TestUtils.findRenderedComponentWithType(DOM, PlayingScreen);
    expect(playingScreen.state.controlBarVisible).toBe(false);
  });

});
