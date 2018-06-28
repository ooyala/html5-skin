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
var Enzyme = require('enzyme');
var TextEnhancementsTab = require('../../../js/components/closed-caption/textEnhancementsTab');
var AccessibleButton = require('../../../js/components/accessibleButton');
var CONSTANTS = require('../../../js/constants/constants');

describe('TextEnhancementsTab', function() {
  var props, node, wrapper, component, element, textEnhancementItems;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    wrapper = Enzyme.mount(<TextEnhancementsTab {...props} />, node);
    component = wrapper.find(TextEnhancementsTab);
    element = component.getDOMNode();
    textEnhancementItems = wrapper.find(AccessibleButton);
  }

  beforeEach(function() {
    node = document.createElement('div');
    wrapper = null;
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
        textEnhancement: 'Uniform'
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
    var firstItem = textEnhancementItems.at(0).getDOMNode();
    expect(firstItem.getAttribute('aria-label')).toBe(props.localizableStrings[props.language]['Uniform']);
    expect(firstItem.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO);
  });

  it('should update aria-checked attribute when item selection state changes', function() {
    var secondMenuItem;
    props.closedCaptionOptions.textEnhancement = 'Uniform';
    renderComponent();
    secondMenuItem = textEnhancementItems.at(1);
    expect(secondMenuItem.getDOMNode().getAttribute('aria-checked')).toBe('false');
    secondMenuItem.simulate('click');
    renderComponent();
    secondMenuItem = textEnhancementItems.at(1);
    expect(secondMenuItem.getDOMNode().getAttribute('aria-checked')).toBe('true');
  });

});
