jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var helpers = require('../../../js/components/closed-caption-multi-audio-menu/helpers');

var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

describe('Tab component', function() {
  var clickedId = null;

  var props = {
    header: 'Tab Header',
    list: [
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
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(component, 'oo-cc-ma-menu__element');
    
    TestUtils.Simulate.click(listItems[0])
    expect(clickedId).toBe("1");
  });

  it('should not call handler if its not present', function() {
    var propsNoHandler = {
      header: 'Tab Header',
      list: [
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
    var listItems = TestUtils.scryRenderedDOMComponentsWithClass(component, 'oo-cc-ma-menu__element');
    
    TestUtils.Simulate.click(listItems[0])
    expect(clickedId).toBe(null);
  });
});
