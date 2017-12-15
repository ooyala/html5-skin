jest
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('AccessibleButton', function() {
  var props, component;

  function renderComponent() {
    var tree = TestUtils.renderIntoDocument(<AccessibleButton {...props} />);
    component = TestUtils.findRenderedComponentWithType(tree, AccessibleButton);
  }

  beforeEach(function() {
    component = null;
    props = {
      ariaLabel: 'ariaLabel'
    };
  });

  it('should render an AccessibleButton', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should set random focusId when none is passed', function() {
    props.focusId = 'customFocusId';
    renderComponent();
    expect(component.props.focusId).toBe('customFocusId');
    delete props.focusId;
    renderComponent();
    expect(component.props.focusId.length).toBe(10);
  });

  it('should detect when button is triggered with keyboard', function() {
    renderComponent();
    expect(component.wasTriggeredWithKeyboard()).toBe(false);
    TestUtils.Simulate.keyDown(ReactDOM.findDOMNode(component), { key: CONSTANTS.KEY_VALUES.SPACE });
    expect(component.wasTriggeredWithKeyboard()).toBe(true);
  });

  it('should auto focus on render if specified in props', function() {
    props.autoFocus = false;
    renderComponent();
    expect(document.activeElement).toBeFalsy();
    props.autoFocus = true;
    renderComponent();
    expect(document.activeElement).toBe(ReactDOM.findDOMNode(component));
  });

  it('should render ARIA attributes', function() {
    props.ariaLabel = 'label';
    props.ariaChecked = true;
    props.role = 'role';
    renderComponent();
    var element = ReactDOM.findDOMNode(component);
    expect(element.getAttribute('aria-label')).toBe(props.ariaLabel);
    expect(element.getAttribute('aria-checked')).toBe(props.ariaChecked.toString());
    expect(element.getAttribute('role')).toBe(props.role);
  });

  it('should NOT render undefined ARIA attributes', function() {
    renderComponent();
    var element = ReactDOM.findDOMNode(component);
    expect(element.hasAttribute('aria-checked')).toBe(false);
    expect(element.hasAttribute('aria-selected')).toBe(false);
    expect(element.hasAttribute('aria-haspopup')).toBe(false);
    expect(element.hasAttribute('aria-expanded')).toBe(false);
  });

  it('should render default button attributes', function() {
    renderComponent();
    var element = ReactDOM.findDOMNode(component);
    expect(element.getAttribute('type')).toBe('button');
    expect(element.getAttribute('tabindex')).toBe('0');
  });

});
