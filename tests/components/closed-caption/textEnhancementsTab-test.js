jest
.dontMock('../../../js/components/closed-caption/textEnhancementsTab')
.dontMock('../../../js/components/closed-caption/selectionContainer')
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/accessibleMenu')
.dontMock('../../../js/components/utils')
.dontMock('../../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var TextEnhancementsTab = require('../../../js/components/closed-caption/textEnhancementsTab');
var AccessibleButton = require('../../../js/components/accessibleButton');
var CONSTANTS = require('../../../js/constants/constants');

describe('TextEnhancementsTab', function() {
  var props, node, tree, component, element, textEnhancementItems;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    tree = ReactDOM.render(<TextEnhancementsTab {...props} />, node);
    component = TestUtils.findRenderedComponentWithType(tree, TextEnhancementsTab);
    element = ReactDOM.findDOMNode(component);
    textEnhancementItems = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
    component = null;
    element = null;
    textEnhancementItems = null;
    props = {
      language: 'en',
      localizableStrings: {
        en: {
          'Uniform': 'Uniform',
          'Depressed': 'Depressed',
          'Raised': 'Raised',
          'Shadow': 'Shadow'
        }
      },
      closedCaptionOptions: {
        enabled: true,
        textEnhancement: 'Uniform',
      },
      controller: {
        toggleClosedCaptionEnabled: function() {},
        onClosedCaptionChange: function(property, value) {
          props.closedCaptionOptions.textEnhancement = value;
        }
      },
      skinConfig: {
        general: {
          accentColor: 'blue'
        }
      }
    };
  });

  it('should render a TextEnhancementsTab', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should render ARIA attributes on text enhancement items', function() {
    renderComponent();
    var firstItem = ReactDOM.findDOMNode(textEnhancementItems[0]);
    expect(firstItem.getAttribute('aria-label')).toBe(props.localizableStrings[props.language]['Uniform']);
    expect(firstItem.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO);
  });

  it('should update aria-checked attribute when item selection state changes', function() {
    var secondMenuItem;
    props.closedCaptionOptions.textEnhancement = 'Uniform';
    renderComponent();
    secondMenuItem = ReactDOM.findDOMNode(textEnhancementItems[1]);
    expect(secondMenuItem.getAttribute('aria-checked')).toBe('false');
    TestUtils.Simulate.click(secondMenuItem);
    renderComponent();
    secondMenuItem = ReactDOM.findDOMNode(textEnhancementItems[1]);
    expect(secondMenuItem.getAttribute('aria-checked')).toBe('true');
  });

});
