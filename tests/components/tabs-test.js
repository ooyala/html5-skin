jest
.dontMock('../../js/components/tabs')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var Tabs = require('../../js/components/tabs');
var Tab = Tabs.Panel;
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('Tabs', function() {
  var node, props, children, tree, component, tabButtons;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    tree = ReactDOM.render(<Tabs {...props} >{children}</Tabs>, node);
    component = TestUtils.findRenderedComponentWithType(tree, Tabs);
    tabButtons = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
    component = null;
    tabButtons = null;
    children = [
      <Tab title="a" key="a"><span>a</span></Tab>,
      <Tab title="b" key="b"><span>b</span></Tab>,
      <Tab title="c" key="c"><span>c</span></Tab>,
      <Tab title="d" key="d"><span>d</span></Tab>
    ];
    props = {
      className: 'class',
      tabActive: null,
      showScrollButtons: true,
      onMount: function() {},
      onBeforeChange: function() {},
      onAfterChange: function() {},
      skinConfig: {
        general: {
          accentColor: 'blue'
        }
      }
    };
  });

  it('should render a Tabs', function() {
    renderComponent();
    expect(component).toBeTruthy();
    expect(tabButtons.length).toBe(4);
  });

  it('should set ARIA attributes on tab elements', function() {
    renderComponent();
    var tabButton = ReactDOM.findDOMNode(tabButtons[0]);
    expect(tabButton.getAttribute('aria-label')).toBe('a');
    expect(tabButton.getAttribute('aria-selected')).toBe('false');
    expect(tabButton.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.TAB);
  });

  it('should update aria-selected attribute when tab selection state changes', function() {
    renderComponent();
    var tabButton = ReactDOM.findDOMNode(tabButtons[0]);
    expect(tabButton.getAttribute('aria-selected')).toBe('false');
    TestUtils.Simulate.click(tabButton);
    expect(tabButton.getAttribute('aria-selected')).toBe('true');
  });

  it('should set menu role and ARIA label on ul element', function() {
    renderComponent();
    var ulElement = TestUtils.findRenderedDOMComponentWithClass(tree, 'tabs-menu');
    expect(ulElement.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS);
    expect(ulElement.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.TAB_LIST);
  });

  it('should set tab panel role on tab panel', function() {
    renderComponent();
    var panelElement = TestUtils.findRenderedDOMComponentWithClass(tree, 'tab-panel');
    expect(panelElement.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.TAB_PANEL);
  });

  it('should adjust scroll forward on keyboard focus in order to reveal item that overflows to the right', function() {
    renderComponent();
    // Tabs is extended by AccessibleMenu HOC, we're interested in the main component in this case
    var childComponent = component.composedComponent;
    var menuItem = {};

    // Note that JSDom doesn't support offsetLeft, clientWidth, etc.,
    // we need to simulate the element's state instead and call the handler manually
    childComponent.tabsNavigationElement.scrollLeft = 0;
    childComponent.tabsNavigationElement.clientWidth = 300;
    menuItem.offsetLeft = 300;
    menuItem.clientWidth = 100;
    childComponent.scrollIntoViewIfNeeded(menuItem);
    expect(childComponent.tabsNavigationElement.scrollLeft).toBe(100);

    childComponent.tabsNavigationElement.scrollLeft = 0;
    childComponent.tabsNavigationElement.clientWidth = 300;
    menuItem.offsetLeft = 250;
    menuItem.clientWidth = 100;
    childComponent.scrollIntoViewIfNeeded(menuItem);
    expect(childComponent.tabsNavigationElement.scrollLeft).toBe(50);
  });

  it('should adjust scroll backward on keyboard focus in order to reveal item that has been scrolled past', function() {
    renderComponent();
    // Tabs is extended by AccessibleMenu HOC, we're interested in the main component in this case
    var childComponent = component.composedComponent;
    var menuItem = {};

    // Note that JSDom doesn't support offsetLeft, clientWidth, etc.,
    // we need to simulate the element's state instead and call the handler manually
    childComponent.tabsNavigationElement.scrollLeft = 100;
    childComponent.tabsNavigationElement.clientWidth = 300;
    menuItem.offsetLeft = 0;
    menuItem.clientWidth = 100;
    childComponent.scrollIntoViewIfNeeded(menuItem);
    expect(childComponent.tabsNavigationElement.scrollLeft).toBe(0);

    childComponent.tabsNavigationElement.scrollLeft = 150;
    childComponent.tabsNavigationElement.clientWidth = 300;
    menuItem.offsetLeft = 100;
    menuItem.clientWidth = 100;
    childComponent.scrollIntoViewIfNeeded(menuItem);
    expect(childComponent.tabsNavigationElement.scrollLeft).toBe(100);
  });

});
