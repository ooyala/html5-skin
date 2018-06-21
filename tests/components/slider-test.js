jest
.dontMock('../../js/components/slider')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var sinon = require('sinon');
var Utils = require('../../js/components/utils');
var Slider = require('../../js/components/slider');
var CONSTANTS = require('../../js/constants/constants');

describe('Slider', function() {
  var props, node, tree, component, element;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    tree = ReactDOM.render(<Slider {...props} />, node);
    component = TestUtils.findRenderedComponentWithType(tree, Slider);
    element = ReactDOM.findDOMNode(component);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
    component = null;
    element = null;
    props = {
      value: 0,
      minValue: 0,
      maxValue: 1.0,
      step: 0.1,
      onChange: function(value) {
        props.value = value;
      },
      ariaLabel: 'ariaLabel',
      usePercentageForAria: true,
      settingName: 'setting',
      className: 'class',
      itemRef: 'ref'
    };
  });

  it('should render a Slider', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should render ARIA attributes using actual values when usePercentageForAria = false', function() {
    props.value = 0.5;
    props.usePercentageForAria = false;
    renderComponent();
    expect(element.getAttribute('aria-label')).toBe(props.ariaLabel);
    expect(element.getAttribute('aria-valuemin')).toBe('0');
    expect(element.getAttribute('aria-valuemax')).toBe('1');
    expect(element.getAttribute('aria-valuenow')).toBe('0.5');
    expect(element.getAttribute('aria-valuetext')).toBe('0.5 ' + props.settingName);
    expect(element.getAttribute('tabindex')).toBe('0');
    expect(element.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.SLIDER);
  });

  it('should render ARIA attributes using percentage mode when usePercentageForAria = true', function() {
    props.value = 0.5;
    props.usePercentageForAria = true;
    renderComponent();
    expect(element.getAttribute('aria-label')).toBe(props.ariaLabel);
    expect(element.getAttribute('aria-valuemin')).toBe('0');
    expect(element.getAttribute('aria-valuemax')).toBe('100');
    expect(element.getAttribute('aria-valuenow')).toBe('50');
    expect(element.getAttribute('aria-valuetext')).toBe('50% ' + props.settingName);
  });

  it('should set a default focus id if none is provided', function() {
    renderComponent();
    expect(element.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR).length).toBe(10);
  });

  it('should update ARIA values when value changes', function() {
    var changeEvent = {
      type: 'change',
      target: {
        value: 0
      }
    };
    props.value = 0.5;
    props.usePercentageForAria = true;
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('50');
    expect(element.getAttribute('aria-valuetext')).toBe('50% ' + props.settingName);
    changeEvent.target.value = 0.25;
    TestUtils.Simulate.change(element, changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('25');
    expect(element.getAttribute('aria-valuetext')).toBe('25% ' + props.settingName);
    changeEvent.target.value = 0;
    TestUtils.Simulate.change(element, changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('0');
    expect(element.getAttribute('aria-valuetext')).toBe('0% ' + props.settingName);
    changeEvent.target.value = 1;
    TestUtils.Simulate.change(element, changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('100');
    expect(element.getAttribute('aria-valuetext')).toBe('100% ' + props.settingName);
    changeEvent.target.value = -0.5;
    TestUtils.Simulate.change(element, changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('-50');
    expect(element.getAttribute('aria-valuetext')).toBe('-50% ' + props.settingName);
    changeEvent.target.value = 1.5;
    TestUtils.Simulate.change(element, changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('150');
    expect(element.getAttribute('aria-valuetext')).toBe('150% ' + props.settingName);
  });

  it('should manually update value attribute when using keyboard controls on IE11', function() {
    var isIEStub = sinon.stub(Utils, 'isIE').returns(true);
    props.minValue = 0;
    props.maxValue = 1.0;
    props.step = 0.1;
    props.value = 0.5;
    renderComponent();
    expect(element.getAttribute('value')).toBe('0.5');
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.ARROW_UP });
    expect(element.getAttribute('value')).toBe('0.6');
    // Note that MutationObserver is not being mocked, so each new keystroke uses
    // the original value in its calculation
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.ARROW_RIGHT });
    expect(element.getAttribute('value')).toBe('0.6');
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.ARROW_DOWN });
    expect(element.getAttribute('value')).toBe('0.4');
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.ARROW_LEFT });
    expect(element.getAttribute('value')).toBe('0.4');
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.HOME });
    expect(element.getAttribute('value')).toBe('0');
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.END });
    expect(element.getAttribute('value')).toBe('1');
    isIEStub.restore();
  });

  it('should NOT manually update value attribute when using keyboard controls on non-IE11 browsers', function() {
    props.minValue = 0;
    props.maxValue = 1.0;
    props.step = 0.1;
    props.value = 0.5;
    renderComponent();
    expect(element.getAttribute('value')).toBe('0.5');
    TestUtils.Simulate.keyDown(element, { key: CONSTANTS.KEY_VALUES.ARROW_UP });
    expect(element.getAttribute('value')).toBe('0.5');
  });

  it('should blur focus on mousemove', function() {
    var spy = sinon.spy(Utils, 'blurOnMouseUp');
    renderComponent();
    TestUtils.Simulate.mouseDown(element, { currentTarget: element });
    TestUtils.Simulate.mouseMove(element, { currentTarget: element });
    expect(spy.callCount).toBe(1);
    spy.restore();
  });

});
