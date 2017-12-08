jest
.dontMock('../../../js/components/closed-caption/fontSizeTab')
.dontMock('../../../js/components/closed-caption/selectionContainer')
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/accessibleMenu')
.dontMock('../../../js/components/utils')
.dontMock('../../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var FontSizeTab = require('../../../js/components/closed-caption/fontSizeTab');
var AccessibleButton = require('../../../js/components/accessibleButton');
var CONSTANTS = require('../../../js/constants/constants');

describe('FontSizeTab', function() {
  var props, node, tree, component, element, fontItems;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    tree = ReactDOM.render(<FontSizeTab {...props} />, node);
    component = TestUtils.findRenderedComponentWithType(tree, FontSizeTab);
    element = ReactDOM.findDOMNode(component);
    fontItems = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
    component = null;
    element = null;
    fontItems = null;
    props = {
      language: 'en',
      localizableStrings: {
        en: {
          'Small': 'Small',
          'Medium': 'Medium',
          'Large': 'Large',
          'Extra Large': 'Extra Large'
        }
      },
      closedCaptionOptions: {
        enabled: true,
        fontSize: 'Small',
      },
      controller: {
        toggleClosedCaptionEnabled: function() {},
        onClosedCaptionChange: function(property, value) {
          props.closedCaptionOptions.fontSize = value;
        }
      },
      skinConfig: {
        general: {
          accentColor: 'blue'
        }
      }
    };
  });

  it('should render a SelectionContainer', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should render ARIA attributes on font items', function() {
    renderComponent();
    var firstItem = ReactDOM.findDOMNode(fontItems[0]);
    expect(firstItem.getAttribute('aria-label')).toBe(props.localizableStrings[props.language]['Small']);
    expect(firstItem.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO);
  });

  it('should update aria-checked attribute when item selection state changes', function() {
    var secondMenuItem;
    props.closedCaptionOptions.fontSize = 'Small';
    renderComponent();
    secondMenuItem = ReactDOM.findDOMNode(fontItems[1]);
    expect(secondMenuItem.getAttribute('aria-checked')).toBe('false');
    TestUtils.Simulate.click(secondMenuItem);
    renderComponent();
    secondMenuItem = ReactDOM.findDOMNode(fontItems[1]);
    expect(secondMenuItem.getAttribute('aria-checked')).toBe('true');
  });

});
