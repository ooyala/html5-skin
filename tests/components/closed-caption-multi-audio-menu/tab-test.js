jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');

var helpers = require('../../../js/components/closed-caption-multi-audio-menu/helpers');
var CONSTANTS = require('../../../js/constants/constants');
var AccessibleButton = require('../../../js/components/accessibleButton');

var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

describe('Tab wrapper', function() {
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

  it('should render tab wrapper', function() {
    var wrapper = Enzyme.mount(<Tab {...props} />);

    expect(wrapper).toBeTruthy();
  });

  it('should render tab wrapper with correct data', function() {
    var wrapper = Enzyme.mount(<Tab {...props} />);
    var header = wrapper.find('.oo-cc-ma-menu__header').hostNodes();
    var listItems = wrapper.find('.oo-cc-ma-menu__element').hostNodes();

    expect(header.getDOMNode().textContent).toContain(props.header);

    expect(listItems.length).toBe(3);
    expect(listItems.at(2).getDOMNode().className).toContain('oo-cc-ma-menu__element--active');
  });

  it('should call handler on click', function() {
    var wrapper = Enzyme.mount(<Tab {...props} />);
    var listItemBtns = wrapper.find('.oo-multi-audio-btn').hostNodes();

    listItemBtns.at(0).simulate('click');
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

    var wrapper = Enzyme.mount(<Tab {...propsNoHandler} />);
    var listItemBtns = wrapper.find('.oo-multi-audio-btn');

    listItemBtns.at(0).simulate('click');
    expect(clickedId).toBe(null);
  });

  it('should detect when button is triggered with keyboard', function() {
    var wrapper = Enzyme.mount(<Tab {...props} />);
    var accessibleButtonComponent = wrapper.find(AccessibleButton).at(0);

    expect(accessibleButtonComponent.instance().triggeredWithKeyboard).toBe(false);
    accessibleButtonComponent.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ENTER });
    expect(accessibleButtonComponent.instance().triggeredWithKeyboard).toBe(true);
  });

});
