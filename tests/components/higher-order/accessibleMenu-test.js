jest
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/accessibleMenu')
.dontMock('../../../js/components/utils')
.dontMock('../../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var AccessibleMenu = require('../../../js/components/higher-order/accessibleMenu');
var AccessibleButton = require('../../../js/components/accessibleButton');
var CONSTANTS = require('../../../js/constants/constants');
var createReactClass = require('create-react-class');

describe('AccessibleMenu', function() {
  var node, options, props, wrapper, component, menuItems, renderedMenuItems;

  var DummyComponent = createReactClass({
    render: function() {
      return (
        <div>{this.props.children}</div>
      );
    }
  });

  function renderComponent() {
    var ComposedComponent = AccessibleMenu(DummyComponent, options);
    wrapper = Enzyme.mount(<ComposedComponent {...props}>{menuItems}</ComposedComponent>, node);
    component = wrapper.find(ComposedComponent);
    renderedMenuItems = wrapper.find(AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    wrapper = null;
    component = null;
    options = {
      selector: null,
      useRovingTabindex: false
    };
    props = {};
    renderedMenuItems = null;
    menuItems = [
      <AccessibleButton
        key="A"
        ariaLabel="A"
        ariaChecked={false}>
        A
      </AccessibleButton>,
      <AccessibleButton
        key="B"
        ariaLabel="B"
        ariaChecked={false}>
        B
      </AccessibleButton>,
      <AccessibleButton
        key="C"
        ariaLabel="C"
        ariaChecked={false}>
        C
      </AccessibleButton>,
      <AccessibleButton
        key="D"
        ariaLabel="D"
        ariaChecked={false}>
        D
      </AccessibleButton>
    ];
  });

  it('should render a AccessibleMenu', function() {
    renderComponent();
    expect(component).toBeTruthy();
    expect(renderedMenuItems.length).toBe(4);
  });

  it('should apply roving tab index properly when there are no selected items', function() {
    options.useRovingTabindex = true;
    renderComponent();
    expect(renderedMenuItems.at(0).getDOMNode().getAttribute('tabindex')).toBe('0');
    expect(renderedMenuItems.at(1).getDOMNode().getAttribute('tabindex')).toBe('-1');
    expect(renderedMenuItems.at(2).getDOMNode().getAttribute('tabindex')).toBe('-1');
    expect(renderedMenuItems.at(3).getDOMNode().getAttribute('tabindex')).toBe('-1');
  });

  it('should apply roving tab index properly when there is a selected item', function() {
    options.useRovingTabindex = true;
    menuItems[2] = (
      <AccessibleButton
        key="C"
        ariaLabel="C"
        ariaChecked={true}>
        C
      </AccessibleButton>
    );
    renderComponent();
    expect(renderedMenuItems.at(0).getDOMNode().getAttribute('tabindex')).toBe('-1');
    expect(renderedMenuItems.at(1).getDOMNode().getAttribute('tabindex')).toBe('-1');
    expect(renderedMenuItems.at(2).getDOMNode().getAttribute('tabindex')).toBe('0');
    expect(renderedMenuItems.at(3).getDOMNode().getAttribute('tabindex')).toBe('-1');
  });

});
