jest.dontMock('../../js/views/contentScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ContentScreen = require('../../js/views/contentScreen');
var CONSTANTS = require('../../js/constants/constants');

describe('ContentScreen', function () {
  it('test content screen', function () {

    // Render content screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ContentScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    TestUtils.Simulate.click(closeBtn);
  });

  it('test content screen for Discovery Screen', function () {

    // Render content screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ContentScreen controller={{toggleDiscoveryScreen: function(){}, state: {}}} screen={CONSTANTS.SCREEN.DISCOVERY_SCREEN} />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    TestUtils.Simulate.click(closeBtn);
  });

  it('should toggle screen when ESC key is pressed', function() {
    var toggleScreenCalled = false;
    var ctrl = {
      toggleScreen: function() {
        toggleScreenCalled = true;
      },
      state: {
        accessibilityControlsEnabled: true
      }
    };
    var DOM = TestUtils.renderIntoDocument(<ContentScreen controller={ctrl} />);
    var contentScreen = ReactDOM.findDOMNode(DOM);
    TestUtils.Simulate.keyDown(contentScreen, { key: CONSTANTS.KEY_VALUES.ESCAPE });
    expect(toggleScreenCalled).toBe(true);
  });

});
