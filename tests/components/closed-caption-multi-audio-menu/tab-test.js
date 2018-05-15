jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var helpers = require('../../../js/components/closed-caption-multi-audio-menu/helpers');
var CONSTANTS = require('../../../js/constants/constants');
var AccessibleButton = require('../../../js/components/accessibleButton');

var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

describe('Tab component', function() {
  var clickedId = null;

  var props = {
    header: 'Tab Header',
    itemsList: [
      {
        id: '1',
        label: 'label 1',
        enabled: false
      },
      {
        id: '2',
        label: 'label 2',
        enabled: false
      },
      {
        id: '3',
        label: 'label 3',
        enabled: true
      }
    ],
    skinConfig: {},
    handleClick: function(id) {
      clickedId = id;
    }
  };

  afterEach(function() {
    clickedId = null;
  });

  it('should render tab component', function() {
    var component = TestUtils.renderIntoDocument(<Tab {...props} />);

    expect(component).toBeTruthy();
  });

  it('should render tab component with correct data', function() {
    var component = TestUtils.renderIntoDocument(<Tab {...props} />);
    var header = TestUtils.findRenderedDOMComponentWithClass(component, 'oo-cc-ma-menu__header');
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(component, 'oo-cc-ma-menu__element');

    expect(header.textContent).toContain(props.header);

    expect(listItems.length).toBe(3);
    expect(listItems[2].className).toContain('oo-cc-ma-menu__element--active');
  });

  it('should call handler on click', function() {
    var component = TestUtils.renderIntoDocument(<Tab {...props} />);
    var listItemBtns = TestUtils.scryRenderedDOMComponentsWithClass(component, 'oo-multi-audio-btn');
    
    TestUtils.Simulate.click(listItemBtns[0]);
    expect(clickedId).toBe('1');
  });

  it('should not call handler if its not present', function() {
    var propsNoHandler = {
      header: 'Tab Header',
      itemsList: [
        {
          id: '1',
          label: 'label 1',
          enabled: false
        },
        {
          id: '2',
          label: 'label 2',
          enabled: false
        },
        {
          id: '3',
          label: 'label 3',
          enabled: true
        }
      ],
      skinConfig: {}
    };

    var component = TestUtils.renderIntoDocument(<Tab {...propsNoHandler} />);
    var listItemBtns = TestUtils.scryRenderedDOMComponentsWithClass(component, 'oo-multi-audio-btn');
    
    TestUtils.Simulate.click(listItemBtns[0]);
    expect(clickedId).toBe(null);
  });

  it('should detect when button is triggered with keyboard', function() {
    var component = TestUtils.renderIntoDocument(<Tab {...props} />);
    var accessibleButtonComponent = TestUtils.scryRenderedComponentsWithType(component, AccessibleButton)[0];

    var listItemBtn = ReactDOM.findDOMNode(accessibleButtonComponent);
    expect(accessibleButtonComponent.triggeredWithKeyboard).toBe(false);
    TestUtils.Simulate.keyDown(listItemBtn, { key: CONSTANTS.KEY_VALUES.ENTER });
    expect(accessibleButtonComponent.triggeredWithKeyboard).toBe(true);
  });

});
