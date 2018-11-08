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
  var props, node, wrapper, component, element;

  function renderComponent() {
    wrapper = Enzyme.mount(<Slider {...props} />, node);
    component = wrapper.find(Slider);
    element = component.getDOMNode();
  }

  beforeEach(function() {
    node = document.createElement('div');
    wrapper = null;
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
    component.simulate('change', changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('25');
    expect(element.getAttribute('aria-valuetext')).toBe('25% ' + props.settingName);
    changeEvent.target.value = 0;
    component.simulate('change', changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('0');
    expect(element.getAttribute('aria-valuetext')).toBe('0% ' + props.settingName);
    changeEvent.target.value = 1;
    component.simulate('change', changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('100');
    expect(element.getAttribute('aria-valuetext')).toBe('100% ' + props.settingName);
    changeEvent.target.value = -0.5;
    component.simulate('change', changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('-50');
    expect(element.getAttribute('aria-valuetext')).toBe('-50% ' + props.settingName);
    changeEvent.target.value = 1.5;
    component.simulate('change', changeEvent);
    renderComponent();
    expect(element.getAttribute('aria-valuenow')).toBe('150');
    expect(element.getAttribute('aria-valuetext')).toBe('150% ' + props.settingName);
  });

  //TODO: The value attribute is changing within the component file but not in this unit test for
  //some really strange reason. Will get back to this
  //it('should manually update value attribute when using keyboard controls on IE11', function() {
  //  var isIEStub = sinon.stub(Utils, 'isIE').returns(true);
  //  props.minValue = 0;
  //  props.maxValue = 1.0;
  //  props.step = 0.1;
  //  props.value = 0.5;
  //  renderComponent();
  //  expect(element.getAttribute('value')).toBe('0.5');
  //  component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_UP });
  //  expect(element.getAttribute('value')).toBe('0.6');
  //  //Note that MutationObserver is not being mocked, so each new keystroke uses
  //  //the original value in its calculation
  //  component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_RIGHT });
  //  expect(element.getAttribute('value')).toBe('0.6');
  //  component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_DOWN });
  //  expect(element.getAttribute('value')).toBe('0.4');
  //  component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_LEFT });
  //  expect(element.getAttribute('value')).toBe('0.4');
  //  component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.HOME });
  //  expect(element.getAttribute('value')).toBe('0');
  //  component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.END });
  //  expect(element.getAttribute('value')).toBe('1');
  //  isIEStub.restore();
  //});

  it('should NOT manually update value attribute when using keyboard controls on non-IE11 browsers', function() {
    props.minValue = 0;
    props.maxValue = 1.0;
    props.step = 0.1;
    props.value = 0.5;
    renderComponent();
    expect(element.getAttribute('value')).toBe('0.5');
    component.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_UP });
    expect(element.getAttribute('value')).toBe('0.5');
  });

  it('should set oo-dragging class on mouse down and remove it on mouse up', function() {
    renderComponent();
    expect(element.classList.contains('oo-dragging')).toBe(false);
    component.simulate('mouseDown', { currentTarget: element });
    expect(element.classList.contains('oo-dragging')).toBe(true);
    component.simulate('mouseMove', { currentTarget: element });
    expect(element.classList.contains('oo-dragging')).toBe(true);
    component.simulate('mouseUp', { currentTarget: element });
    expect(element.classList.contains('oo-dragging')).toBe(false);
  });

});
