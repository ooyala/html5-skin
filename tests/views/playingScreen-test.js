jest.dontMock('../../js/views/playingScreen');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var PlayingScreen = require('../../js/views/playingScreen');

describe('PlayingScreen', function () {
  it('creates a PlayingScreen and checks mouseUp, mouseMove', function () {
    var moved = false;
    var clicked = false;
    var mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      togglePlayPause: function(){clicked = true},
      startHideControlBarTimer: function() {moved = true},
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} />);

    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'default-screen').getDOMNode();
    
    TestUtils.Simulate.mouseMove(screen);
    expect(moved).toBe(false);

    TestUtils.Simulate.mouseUp(screen);
    expect(clicked).toBe(true);
  });

  it('creates a PlayingScreen and checks touchEnd', function () {
    var clicked = false;
    var mockController = {
      state: {
        isMobile: true,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      togglePlayPause: function(){clicked = true},
      startHideControlBarTimer: function() {}
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} />);

    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'default-screen').getDOMNode();
    TestUtils.Simulate.touchEnd(screen);
    expect(clicked).toBe(true);
  });

  it('creates a PlayingScreen and checks mouseMove, mouseOver, mouseOut', function () {
    var over = false;
    var out = false;
    var moved = false;
    var clicked = false;

    var mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      startHideControlBarTimer: function() {moved = true},
      togglePlayPause: function(){clicked = true},
      showControlBar: function() {over = true},
      hideControlBar: function() {out = true}

    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PlayingScreen  controller = {mockController} fullscreen = {true} controlBarAutoHide={true}/>);

    var screen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'playingScreen').getDOMNode();
    TestUtils.Simulate.mouseMove(screen);
    expect(moved).toBe(true);

    TestUtils.Simulate.mouseOut(screen);
    expect(out).toBe(true);

    var screen1 = TestUtils.findRenderedDOMComponentWithClass(DOM, 'default-screen').getDOMNode();
    TestUtils.Simulate.touchEnd(screen1);
    expect(clicked).toBe(false);

    TestUtils.Simulate.mouseOver(screen);
    expect(over).toBe(true);
  });
});