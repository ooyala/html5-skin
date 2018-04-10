jest.dontMock('../../js/views/contentScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ContentScreen = require('../../js/views/contentScreen');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('ContentScreen', function() {
  var ctrl;

  beforeEach(function() {
    ctrl = {
      toggleScreen: function() {},
      toggleDiscoveryScreen: function() {},
      state: {
        accessibilityControlsEnabled: true
      }
    };
  });

  it('test content screen', function() {

    // Render content screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ContentScreen />);

    // test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    TestUtils.Simulate.click(closeBtn);
  });

  it('test content screen for Discovery Screen', function() {

    // Render content screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ContentScreen controller={ctrl} screen={CONSTANTS.SCREEN.DISCOVERY_SCREEN} />);

    // test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    TestUtils.Simulate.click(closeBtn);
  });

  it('should toggle screen when ESC key is pressed', function() {
    var toggleScreenCalled = false;
    ctrl.toggleScreen = function() {
      toggleScreenCalled = true;
    };
    var DOM = TestUtils.renderIntoDocument(<ContentScreen controller={ctrl} />);
    var contentScreen = ReactDOM.findDOMNode(DOM);
    TestUtils.Simulate.keyDown(contentScreen, { key: CONSTANTS.KEY_VALUES.ESCAPE });
    expect(toggleScreenCalled).toBe(true);
  });

  it('should auto focus on first accessible element when specified', function() {
    expect(document.activeElement).toBeFalsy();
    var tree = TestUtils.renderIntoDocument(
      <ContentScreen autoFocus={true} controller={ctrl}>
        <AccessibleButton ariaLabel="fancy"></AccessibleButton>
        <AccessibleButton ariaLabel="pants"></AccessibleButton>
      </ContentScreen>
    );
    var componentElement = ReactDOM.findDOMNode(tree);
    var focusableElements = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
    var firstFocusableElement = ReactDOM.findDOMNode(focusableElements[0]);
    expect(document.activeElement).toBe(firstFocusableElement);
  });

});
