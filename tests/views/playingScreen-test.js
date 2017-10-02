jest.dontMock('../../js/views/playingScreen')
  .dontMock('../../js/mixins/resizeMixin');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var PlayingScreen = require('../../js/views/playingScreen');

describe('PlayingScreen', function () {
  it('creates a PlayingScreen and checks mouseMove, mouseUp without video360', function () {
    var isMoved = false
      , isPlayPause = false;
    var mockController = {
      videoVr: false,
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      togglePlayPause: function() {
        isPlayPause = true;
      },
      startHideControlBarTimer: function() {
        isMoved = true;
      }
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} closedCaptionOptions = {closedCaptionOptions}/>);

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-selectable');

    TestUtils.Simulate.mouseMove(screen[0]);
    expect(isMoved).toBe(false);

    TestUtils.Simulate.mouseUp(screen[0]);
    expect(isPlayPause).toBe(true);
  });

  it('creates a PlayingScreen and checks mouseMove, mouseDown, mouseUp with video360', function() {
    var isVrDirectionChecked = false;
    var isTouchMove = false;
    var isStartHideControlBarTimer = false;
    var mockController = {
      videoVr: true,
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        },
        viewingDirection: {yaw: 0, roll: 0, pitch: 0}
      },
      startHideControlBarTimer: function () {
        isStartHideControlBarTimer = true;
      },
      onTouchMove: function() {
        isTouchMove = true;
      },
      checkVrDirection: function() {
        isVrDirectionChecked = true;
      }
    };
    var closedCaptionOptions = {
      cueText: "cue text"
    };
    var DOM = TestUtils.renderIntoDocument(
      <PlayingScreen
        controller={mockController}
        componentWidth={90}
        componentHeight={40}
        fullscreen={false}
        closedCaptionOptions={closedCaptionOptions}
      />
    );
    DOM.setState({
      isMouseDown: true,
      XMouseStart: -10,
      YMouseStart: -20
    });

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-selectable');

    var getDirectionParams = spyOn(DOM, 'getDirectionParams').andCallThrough();
    var directionParams = getDirectionParams(0,0);

    TestUtils.Simulate.mouseMove(screen[0]);
    expect(isTouchMove).toBe(true);
    expect(getDirectionParams).toHaveBeenCalled();
    //dx = arguments[0] - this.state.XMouseStart = 0 - (-10) = 10;
    //dy = arguments[1] - this.state.YMouseStart = 0 - (-20) = 20;
    //degreesForPixelYaw = maxDegreesX / componentWidth = 90 / 90 = 1;
    //degreesForPixelPitch = maxDegreesY / componentHeight = 120 / 40 = 3;
    //yaw = mockController.viewingDirection.yaw + dx * degreesForPixelYaw = 0 + 10 * 1 = 10;
    //pitch = mockController.viewingDirection.pitch + dy * degreesForPixelPitch = 0 + 20 * 3 = 60;
    expect(directionParams).toEqual([10, 0, 60]);

    TestUtils.Simulate.mouseDown(screen[0]);
    expect(isVrDirectionChecked).toBe(true);

    TestUtils.Simulate.mouseUp(screen[0]);
    expect(isVrDirectionChecked).toBe(true);

  });

  it('creates a PlayingScreen and checks touchEnd without video360', function () {
    var clicked = false;
    var mockController = {
      videoVr: false,
      state: {
        isMobile: true,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      togglePlayPause: function() {
        clicked = true;
      },
      startHideControlBarTimer: function() {}
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} closedCaptionOptions = {closedCaptionOptions}/>);

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-selectable');
    TestUtils.Simulate.touchEnd(screen[0]);
    expect(clicked).toBe(true);
  });

  it('creates a PlayingScreen and checks mouseMove, mouseOver, mouseOut, keyUp without video360 fullscreen', function () {
    var over = false;
    var out = false;
    var moved = false;
    var clicked = false;

    var mockController = {
      videoVr: false,
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      startHideControlBarTimer: function() {
        moved = true;
      },
      togglePlayPause: function() {
        clicked = true;
      },
      showControlBar: function() {
        over = true;
      },
      hideControlBar: function() {
        out = true;
      }
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} fullscreen = {true} controlBarAutoHide={true} closedCaptionOptions = {closedCaptionOptions}/>);

    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-playing-screen');
    TestUtils.Simulate.mouseMove(screen);
    expect(moved).toBe(true);

    TestUtils.Simulate.mouseOut(screen);
    expect(out).toBe(true);

    var screen1 = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-interactive-container');
    TestUtils.Simulate.touchEnd(screen1);
    expect(clicked).toBe(false);

    TestUtils.Simulate.mouseOver(screen);
    expect(over).toBe(true);
  });

  it('creates a PlayingScreen and checks mouseOver, mouseOut, keyUp with video360 fullscreen', function () {
    var over = false;
    var out = false;
    var moved = false;
    var clicked = false;

    var mockController = {
      videoVr: true,
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      startHideControlBarTimer: function() {
        moved = true;
      },
      togglePlayPause: function() {
        clicked = true;
      },
      showControlBar: function() {
        over = true;
      },
      hideControlBar: function() {
        out = true;
      },
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(
      <PlayingScreen
        controller={mockController}
        fullscreen={true}
        controlBarAutoHide={true}
        closedCaptionOptions={closedCaptionOptions}
      />
    );

    var screen = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-playing-screen');

    TestUtils.Simulate.mouseOut(screen[0]);
    expect(out).toBe(true);

    TestUtils.Simulate.mouseOver(screen[0]);
    expect(over).toBe(true);

    var screen1 = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-interactive-container');
    TestUtils.Simulate.touchEnd(screen1);
    expect(clicked).toBe(false);
  });

  it('creates a PlayingScreen and check play&pause', function () {
    var clicked = false;
    var mockController = {
      videoVr: true,
      state: {
        isMobile: true,
        isMouseDown: false,
        isMouseMove: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      togglePlayPause: function(){
        clicked = !clicked;
      },
      startHideControlBarTimer: function() {}
    };
    var closedCaptionOptions = {
      cueText: "cue text"
    };
  
    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} closedCaptionOptions = {closedCaptionOptions}/>);
    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-selectable');

    TestUtils.Simulate.click(screen);
    TestUtils.Simulate.click(screen);
    expect(clicked).toBe(false);
  });
  
  it('should show control bar when pressing the tab key', function () {
    var autoHide = false;
    var controlBar = false;

    var mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      startHideControlBarTimer: function() {
        autoHide = true;
      },
      showControlBar: function() {
        controlBar = true;
      }
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} closedCaptionOptions = {closedCaptionOptions}/>);
    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-playing-screen');

    TestUtils.Simulate.keyDown(screen, {key: 'Tab', which: 9, keyCode: 9});
    expect(autoHide && controlBar).toBe(true);
  });

  it('should show control bar when pressing the tab, space bar or enter key', function () {
    var autoHide = false;
    var controlBar = false;

    var mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      startHideControlBarTimer: function() {
        autoHide = true;
      },
      showControlBar: function() {
        controlBar = true;
      }
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} closedCaptionOptions = {closedCaptionOptions}/>);
    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-playing-screen');

    TestUtils.Simulate.keyDown(screen, {key: 'Tab', which: 9, keyCode: 9});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    TestUtils.Simulate.keyDown(screen, {key: 'Enter', which: 13, keyCode: 13});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    TestUtils.Simulate.keyDown(screen, {key: ' ', which: 32, keyCode: 32});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    TestUtils.Simulate.keyDown(screen, {key: 'Dead', which: 16, keyCode: 16});
    expect(autoHide && controlBar).toBe(false);
  });

  it('tests playing screen componentWill*', function () {
    var mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      startHideControlBarTimer: function() {moved = true},
      showControlBar: function() {over = true},
      hideControlBar: function() {out = true},
      cancelTimer:function() {}
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var node = document.createElement('div');
    var playScreen = ReactDOM.render(
      <PlayingScreen
        controller = {mockController}
        fullscreen = {true}
        controlBarAutoHide={true}
        componentWidth={400}
        closedCaptionOptions={closedCaptionOptions} />, node
    );

    ReactDOM.render(
      <PlayingScreen
        controller = {mockController}
        fullscreen = {true}
        controlBarAutoHide={true}
        componentWidth={800}
        closedCaptionOptions={closedCaptionOptions} />, node
    );

    ReactDOM.unmountComponentAtNode(node);
  });
});