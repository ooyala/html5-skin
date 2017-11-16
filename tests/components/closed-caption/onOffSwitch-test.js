jest.dontMock('../../../js/components/closed-caption/onOffSwitch');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var OnOffSwitch = require('../../../js/components/closed-caption/onOffSwitch');
var CONSTANTS = require('../../../js/constants/constants');

describe('OnOffSwitch', function () {
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
          console.log(">>>huh?");
          props.closedCaptionOptions.enabled = !props.closedCaptionOptions.enabled;
        }
      }
    };
  });

  it('should render an OnOffSwitch', function () {
    var DOM = TestUtils.renderIntoDocument(<OnOffSwitch {...props}/>);
  });

  it('should render ARIA attributes on switch button', function() {
    props.ariaLabel = 'ariaLabel';
    props.role = 'customRole';
    var DOM = TestUtils.renderIntoDocument(<OnOffSwitch {...props}/>);
    var switchButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-switch-container-selectable');
    expect(switchButton.getAttribute('aria-label')).toBe(props.ariaLabel);
    expect(switchButton.getAttribute('role')).toBe(props.role);
  });

  it('should update aria-checked attribute when switch is selected', function() {
    var DOM, switchButton;
    props.closedCaptionOptions.enabled = false;
    DOM = TestUtils.renderIntoDocument(<OnOffSwitch {...props}/>);
    switchButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-switch-container-selectable');
    expect(switchButton.getAttribute('aria-checked')).toBe('false');
    props.closedCaptionOptions.enabled = true;
    DOM = TestUtils.renderIntoDocument(<OnOffSwitch {...props}/>);
    switchButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-switch-container-selectable');
    expect(switchButton.getAttribute('aria-checked')).toBe('true');
  });

});
