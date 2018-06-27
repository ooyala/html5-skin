jest.dontMock('../../../js/components/closed-caption/onOffSwitch');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var OnOffSwitch = require('../../../js/components/closed-caption/onOffSwitch');
var CONSTANTS = require('../../../js/constants/constants');

describe('OnOffSwitch', function() {
  var props;

  beforeEach(function() {
    props = {
      ariaLabel: '',
      language: 'en',
      closedCaptionOptions: {
        enabled: false
      },
      skinConfig: {
        general: {
          accentColor: '#fff'
        }
      },
      localizableStrings: [],
      controller: {
        toggleClosedCaptionEnabled: function() {
          props.closedCaptionOptions.enabled = !props.closedCaptionOptions.enabled;
        }
      }
    };
  });

  it('should render an OnOffSwitch', function() {
    var wrapper = Enzyme.mount(<OnOffSwitch {...props}/>);
  });

  it('should render ARIA attributes on switch button', function() {
    props.ariaLabel = 'ariaLabel';
    props.role = 'customRole';
    var wrapper = Enzyme.mount(<OnOffSwitch {...props}/>);
    var switchButton = wrapper.find('.oo-switch-container-selectable').hostNodes().getDOMNode();
    expect(switchButton.getAttribute('aria-label')).toBe(props.ariaLabel);
    expect(switchButton.getAttribute('role')).toBe(props.role);
  });

  it('should update aria-checked attribute when switch is selected', function() {
    var wrapper, switchButton;
    props.closedCaptionOptions.enabled = false;
    wrapper = Enzyme.mount(<OnOffSwitch {...props}/>);
    switchButton = wrapper.find('.oo-switch-container-selectable').hostNodes().getDOMNode();
    expect(switchButton.getAttribute('aria-checked')).toBe('false');
    props.closedCaptionOptions.enabled = true;
    wrapper = Enzyme.mount(<OnOffSwitch {...props}/>);
    switchButton = wrapper.find('.oo-switch-container-selectable').hostNodes().getDOMNode();
    expect(switchButton.getAttribute('aria-checked')).toBe('true');
  });

});
