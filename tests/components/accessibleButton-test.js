jest
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('AccessibleButton', function() {
  var wrapper, component;

  function renderComponent(props) {
    props = props || {};
    wrapper = Enzyme.mount(<AccessibleButton ariaLabel='ariaLabel' {...props} />);
    component = wrapper.instance();
  }

  beforeEach(function() {
    wrapper = null;
    component = null;
  });

  it('should render an AccessibleButton', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should set random focusId when none is passed', function() {
    renderComponent({
      focusId: 'customFocusId'
    });
    var props = wrapper.props();
    expect(props.focusId).toBe('customFocusId');

    renderComponent();
    props = wrapper.props();
    expect(props.focusId.length).toBe(10);
  });

  it('should detect when button is triggered with keyboard', function() {
    renderComponent();
    expect(component.wasTriggeredWithKeyboard()).toBe(false);
    var button = wrapper.find(AccessibleButton);
    button.simulate('keyDown', {key: CONSTANTS.KEY_VALUES.SPACE});
    expect(component.wasTriggeredWithKeyboard()).toBe(true);
  });

  it('should auto focus on render if specified in props', function() {
    renderComponent({
      autoFocus: false
    });
    expect(document.activeElement).not.toBe(ReactDOM.findDOMNode(component));

    renderComponent({
      autoFocus: true
    });
    expect(document.activeElement).toBe(ReactDOM.findDOMNode(component));
  });

  it('should render ARIA attributes', function() {
    var label = 'label';
    var ariaChecked = true;
    var role = 'role';
    renderComponent({
      ariaLabel: label,
      ariaChecked: ariaChecked,
      role: role
    });
    var element = ReactDOM.findDOMNode(component);
    expect(element.getAttribute('aria-label')).toBe(label);
    expect(element.getAttribute('aria-checked')).toBe(ariaChecked.toString());
    expect(element.getAttribute('role')).toBe(role);
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
