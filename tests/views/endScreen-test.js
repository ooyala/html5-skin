jest.dontMock('../../js/views/endScreen')
    .dontMock('../../js/components/icon')
    .dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var EndScreen = require('../../js/views/endScreen');
var ClassNames = require('classnames');
var ResizeMixin = require('../../js/mixins/resizeMixin');

describe('EndScreen', function () {
  it('creates an EndScreen with replay button', function () {

    var clicked = false;
    var mockController = {
      state: {
        accessibilityControlsEnabled: false
      },
      togglePlayPause: function(){clicked = true}
    };
    var mockSkinConfig = {
      endScreen: {
        replayIconStyle: {
          color: "white",
          opacity: "1"
        },
        showReplayButton: true
      },
      icons: {
        replay: {
          fontStyleClass: "replay"
        }
      }
    };

    // Render end screen into DOM
    var DOM = TestUtils.renderIntoDocument(<EndScreen skinConfig={mockSkinConfig} controller = {mockController}/>);

    var replayButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-action-icon');
    TestUtils.Simulate.click(replayButton);
    expect(clicked).toBe(true);
  });

  //replay without button, click on screen
  it('creates an EndScreen without replay button', function () {
    var clicked = false;
    var mockController = {
      state: {
        accessibilityControlsEnabled: false
      },
      togglePlayPause: function(){clicked = true}
    };
    var mockSkinConfig = {
      endScreen: {
        replayIconStyle: {
          color: "white",
          opacity: "1"
        },
        showReplayButton: false
      },
      icons: {
        replay: {
          fontStyleClass: "replay"
        }
      }
    };

    // Render end screen into DOM
    var DOM = TestUtils.renderIntoDocument(<EndScreen skinConfig={mockSkinConfig} controller = {mockController}/>);

    //replay button hidden
    var replayButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-action-icon');
    expect(replayButton.className).toMatch("hidden");

    //test replay clicking on screen
    var replayScreen = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-selectable');
    TestUtils.Simulate.click(replayScreen);

    expect(clicked).toBe(true);
  });
});