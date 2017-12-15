jest
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/accessibleMenu')
.dontMock('../../../js/components/utils')
.dontMock('../../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var AccessibleMenu = require('../../../js/components/higher-order/accessibleMenu');
var AccessibleButton = require('../../../js/components/accessibleButton');
var CONSTANTS = require('../../../js/constants/constants');

describe('AccessibleMenu', function() {
  var node, options, props, tree, component, menuItems, renderedMenuItems;

  var DummyComponent = React.createClass({
    render: function() {
      return (
        <div>{this.props.children}</div>
      );
    }
  });

  function renderComponent() {
    var ComposedComponent = AccessibleMenu(DummyComponent, options);
    tree = ReactDOM.render(<ComposedComponent {...props}>{menuItems}</ComposedComponent>, node);
    component = TestUtils.findRenderedComponentWithType(tree, ComposedComponent);
    renderedMenuItems = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
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
    expect(ReactDOM.findDOMNode(renderedMenuItems[0]).getAttribute('tabindex')).toBe('0');
    expect(ReactDOM.findDOMNode(renderedMenuItems[1]).getAttribute('tabindex')).toBe('-1');
    expect(ReactDOM.findDOMNode(renderedMenuItems[2]).getAttribute('tabindex')).toBe('-1');
    expect(ReactDOM.findDOMNode(renderedMenuItems[3]).getAttribute('tabindex')).toBe('-1');
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
    expect(ReactDOM.findDOMNode(renderedMenuItems[0]).getAttribute('tabindex')).toBe('-1');
    expect(ReactDOM.findDOMNode(renderedMenuItems[1]).getAttribute('tabindex')).toBe('-1');
    expect(ReactDOM.findDOMNode(renderedMenuItems[2]).getAttribute('tabindex')).toBe('0');
    expect(ReactDOM.findDOMNode(renderedMenuItems[3]).getAttribute('tabindex')).toBe('-1');
  });

});
