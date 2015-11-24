jest.dontMock('../../js/components/scrubberBar')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('../../config/en.json')
    .dontMock('../../config/es.json')
    .dontMock('../../config/zh.json');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var CONSTANTS = require('../../js/constants/constants');
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
        controlBarWidth={500}
        seeking={false}
        controller={mockController}
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
      renderSkin: function() {},
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        controlBarWidth={500}
        seeking={false}
        controller={mockController}
        />
    );

    var scrubberBar = TestUtils.findRenderedDOMComponentWithClass(DOM, "scrubberBarPadding");
    TestUtils.Simulate.mouseDown(scrubberBar.getDOMNode());
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
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <ScrubberBar
        controlBarVisible={true}
        controlBarWidth={500}
        seeking={false}
        controller={mockController}
        />
    );

    var scrubberBar = TestUtils.findRenderedDOMComponentWithClass(DOM, 'scrubberBarPadding');
    TestUtils.Simulate.mouseDown(scrubberBar.getDOMNode());
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
        controlBarWidth={500}
        seeking={false}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        />
    );

    DOM.scrubberBarWidth = 470;
    DOM.playheadWidth = 10;
    DOM.forceUpdate();

    var playhead = TestUtils.findRenderedDOMComponentWithClass(DOM, 'playheadPadding').getDOMNode();
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
        controlBarWidth={500}
        seeking={false}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        />
    );

    var playhead = TestUtils.findRenderedDOMComponentWithClass(DOM, 'playhead').getDOMNode();
    expect(playhead.className).toMatch('adPlayhead');
  });

});

