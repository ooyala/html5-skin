jest.dontMock('../../js/views/adScreen');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var AdScreen = require('../../js/views/adScreen');

describe('AdScreen', function () {
  it('creates an ad screen', function () {

    // Render start screen into DOM
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      pauseScreen: {
        showPauseIcon: true,
        pauseIconPosition: "center",
        PauseIconStyle: {
          color: "white",
          opacity: 1
        }
      },
      icons: {
        pause: {"fontStyleClass": "icon icon-pause"}
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

  });

  it('handles mouseover and mouseout', function () {

    // Render start screen into DOM
    var controlBarVisible = true;
    var mockController = {
      state: {
        isMobile: false
      },
      hideControlBar: function() {
        controlBarVisible = false;
      },
      showControlBar: function() {
        controlBarVisible = true;
      }
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      pauseScreen: {
        showPauseIcon: true,
        pauseIconPosition: "center",
        PauseIconStyle: {
          color: "white",
          opacity: 1
        }
      },
      icons: {
        pause: {"fontStyleClass": "icon icon-pause"}
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        controlBarAutoHide={true}
      />);

    expect(DOM.state.controlBarVisible).toBe(true);
    TestUtils.Simulate.mouseOut(ReactDOM.findDOMNode(DOM));
    expect(DOM.state.controlBarVisible).toBe(false);
    expect(controlBarVisible).toBe(false);

    TestUtils.Simulate.mouseOver(ReactDOM.findDOMNode(DOM));
    expect(DOM.state.controlBarVisible).toBe(true);
    expect(controlBarVisible).toBe(true);
  });

  it('handles mousemove', function () {

    // Render start screen into DOM
    var controlBarVisible = true;
    var mockController = {
      state: {
        isMobile: false,
        controlBarVisible: false
      },
      hideControlBar: function() {
        controlBarVisible = false;
      },
      showControlBar: function() {
        controlBarVisible = true;
      },
      startHideControlBarTimer: function() {}
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      pauseScreen: {
        showPauseIcon: true,
        pauseIconPosition: "center",
        PauseIconStyle: {
          color: "white",
          opacity: 1
        }
      },
      icons: {
        pause: {"fontStyleClass": "icon icon-pause"}
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdScreen
        playerState={"playing"}
        controller={mockController}
        skinConfig={mockSkinConfig}
        controlBarAutoHide={true}
        fullscreen={true}
      />);

    expect(DOM.state.controlBarVisible).toBe(false);
    TestUtils.Simulate.mouseMove(ReactDOM.findDOMNode(DOM));
    expect(DOM.state.controlBarVisible).toBe(true);

  });

  it('test player clicks', function () {

    // Render start screen into DOM
    var adsClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        accessibilityControlsEnabled: false
      },
      onAdsClicked: function() {
        adsClicked = true;
      }
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      pauseScreen: {
        showPauseIcon: true,
        pauseIconPosition: "center",
        PauseIconStyle: {
          color: "white",
          opacity: 1
        }
      },
      icons: {
        pause: {"fontStyleClass": "icon icon-pause"}
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

    TestUtils.Simulate.mouseUp(DOM.refs.adScreen);
    expect(mockController.state.accessibilityControlsEnabled).toBe(true);

    TestUtils.Simulate.click(DOM.refs.adPanel);
    expect(adsClicked).toBe(true);
  });

});