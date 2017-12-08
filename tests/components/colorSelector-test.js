jest
.dontMock('../../js/components/colorSelector')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ColorSelector = require('../../js/components/colorSelector');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('Tabs', function() {
  var props, colors, node, tree, component, buttons;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    props.colors = colors;
    tree = ReactDOM.render(<ColorSelector {...props} />, node);
    component = TestUtils.findRenderedComponentWithType(tree, ColorSelector);
    buttons = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
    component = null;
    buttons = null;
    colors = [ 'White', 'Blue', 'Magenta', 'Green', 'Yellow', 'Red' ];
    props = {
      enabled: true,
      selectedColor: null,
      colors: colors,
      ariaLabel: 'ariaLabel',
      onColorChange: function(color) {
        props.selectedColor = color;
      },
      skinConfig: {
        general: {
          accentColor: 'blue'
        }
      }
    };
  });

  it('should render a ColorSelector', function() {
    renderComponent();
    expect(component).toBeTruthy();
    expect(buttons.length).toBe(6);
  });

  it('should set menu role and ARIA label on main element', function() {
    props.ariaLabel = 'customAriaLabel';
    renderComponent();
    var mainElement = ReactDOM.findDOMNode(component);
    expect(mainElement.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU);
    expect(mainElement.getAttribute('aria-label')).toBe(props.ariaLabel);
  });

  it('should set ARIA attributes on buttons', function() {
    renderComponent();
    var colorButton = ReactDOM.findDOMNode(buttons[0]);
    expect(colorButton.getAttribute('aria-label')).toBe(props.ariaLabel + ' White');
    expect(colorButton.getAttribute('aria-checked')).toBe('false');
    expect(colorButton.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO);
  });

  it('should update aria-checked attribute when tab selection state changes', function() {
    renderComponent();
    var colorButton = ReactDOM.findDOMNode(buttons[0]);
    expect(colorButton.getAttribute('aria-checked')).toBe('false');
    TestUtils.Simulate.click(colorButton);
    renderComponent();
    expect(colorButton.getAttribute('aria-checked')).toBe('true');
  });

  // Needed in order for NVDA to read out the correct number of items
  it('should set presentation role on item container', function() {
    renderComponent();
    var container = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'oo-item')[0];
    expect(container.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.PRESENTATION);
  });

});
