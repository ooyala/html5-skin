jest.dontMock('../../js/components/scrubberBar')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('../../config/en.json')
    .dontMock('../../config/es.json')
    .dontMock('../../config/zh.json');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var CONSTANTS = require('../../js/constants/constants');
var skinConfig = require('../../config/skin.json');
var ReactDOM = require('react-dom');
var ScrubberBar = require('../../js/components/scrubberBar');

// start unit test
describe('ScrubberBar', function () {
  it('creates a scrubber bar', function () {

    var mockController = {
      state: {
        isMobile: false
      }
    };

    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig}
        />
    );
  });

  it('handles a mousedown', function() {
    var scrubberBarClicked = false;
    var mockController = {
      state: {
        isMobile: false
      },
      updateSeekingPlayhead: function() {
        scrubberBarClicked = true;
      },
      startHideControlBarTimer: function() {},
      beginSeeking: function() {},
      renderSkin: function() {}
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig}
        />
    );

    var scrubberBar = TestUtils.findRenderedDOMComponentWithClass(DOM, "oo-scrubber-bar-padding");
    TestUtils.Simulate.mouseDown(scrubberBar);
    expect(scrubberBarClicked).toBe(true);
  });

  it('handles a mouseup', function() {
    var scrubberBarClicked = false;
    var seekTriggered = false;
    var mockController = {
      state: {
        isMobile: false
      },
      updateSeekingPlayhead: function() {
        scrubberBarClicked = true;
      },
      startHideControlBarTimer: function() {},
      beginSeeking: function() {},
      renderSkin: function() {},
      seek: function() {
        seekTriggered = true;
      },
      endSeeking: function() {}
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig}
        />
    );

    var scrubberBar = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-scrubber-bar-padding');
    TestUtils.Simulate.mouseDown(scrubberBar);
    DOM.handlePlayheadMouseUp({
      preventDefault: function() {},
      stopPropagation: function() {}
    });
    expect(scrubberBarClicked).toBe(true);
    expect(seekTriggered).toBe(true);
  });

  it('represents current time with playhead position', function() {
    var scrubberBarClicked = false;
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig}
        />
    );

    DOM.state.scrubberBarWidth = 470;
    DOM.state.playheadWidth = 10;
    DOM.forceUpdate();

    var playhead = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-playhead-padding');
    var leftPos = parseInt(playhead.style.left);
    expect(leftPos).toBeGreaterThan(200);
    expect(leftPos).toBeLessThan(300);
  });

  it('enters ad mode', function() {
    var scrubberBarClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        screenToShow: CONSTANTS.SCREEN.AD_SCREEN
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig} />
    );

    var playhead = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-playhead');
    expect(playhead.className).toMatch('oo-ad-playhead');
  });

  it('display thumbnail on hover', function() {
    var mockController = {
      state: {
        isMobile: false,
        thumbnails: true
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={true}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig}/>
    );

    var evt = {nativeEvent: {offsetX: 10}};
    TestUtils.Simulate.mouseOver(ReactDOM.findDOMNode(DOM.refs.scrubberBarContainer), evt);
    var thumbnail = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-scrubber-thumbnail-container');
    expect(thumbnail.length).toBe(1);
  });

  it('display thumbnail on scrubber bar mouse down', function() {
    var mockController = {
      state: {
        isMobile: false,
        thumbnails: true
      },
      updateSeekingPlayhead: function () {},
      startHideControlBarTimer: function () {},
      beginSeeking: function () {},
      renderSkin: function () {}
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        seeking={true}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig}/>
    );

    var evt = {nativeEvent: {offsetX: 10}};
    TestUtils.Simulate.mouseDown(ReactDOM.findDOMNode(DOM.refs.scrubberBarPadding), evt);
    var thumbnail = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-scrubber-thumbnail-container');
    expect(thumbnail.length).toBe(1);
  });

});