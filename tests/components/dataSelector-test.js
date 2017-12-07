jest
.dontMock('../../js/components/dataSelector')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var DataSelector = require('../../js/components/dataSelector');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('DataSelector', function() {
  var node, props, component, items, availableDataItems;

  function renderComponent() {
    // Note that these can be updated right before rendering
    props.availableDataItems = availableDataItems;

    var tree = ReactDOM.render(<DataSelector {...props} />, node);
    component = TestUtils.findRenderedComponentWithType(tree, DataSelector);
    items = TestUtils.scryRenderedComponentsWithType(tree, AccessibleButton);
  }

  function findItemByLabel(label) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].props.ariaLabel === label) {
        return items[i];
      }
    }
    return null;
  }

  beforeEach(function() {
    node = document.createElement('div');
    items = [];
    availableDataItems = ['a', 'b', 'c', 'd'];
    props = {
      enabled: true,
      selectedData: 'a',
      availableDataItems: availableDataItems,
      dataItemsPerPage: {
        xs: 1,
        sm: 2,
        md: 4,
        lg: 8
      },
      viewSize: 'md',
      ariaLabel: 'ariaLabel',
      onDataChange: function(dataItem) {
        props.selectedData = dataItem;
      },
      skinConfig: {
        general: {
          accentColor: 'blue'
        }
      }
    };
  });

  it('should render a DataSelector', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should preserve focus when selecting a new item using the keyboard', function() {
    var secondItemElement;
    props.selectedData = 'a';

    renderComponent();
    expect(document.activeElement).toBeFalsy();
    // Simulate click on a different element than the one currently selected
    secondItemElement = ReactDOM.findDOMNode(findItemByLabel(availableDataItems[1]));
    TestUtils.Simulate.keyDown(secondItemElement, { key: CONSTANTS.KEY_VALUES.SPACE });
    TestUtils.Simulate.click(secondItemElement);
    // Re-render in order to reflect new prop state, focus should be set afterwards
    renderComponent();
    secondItemElement = ReactDOM.findDOMNode(findItemByLabel(availableDataItems[1]));
    expect(document.activeElement).toBe(secondItemElement);
  });

});
