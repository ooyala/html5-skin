jest
.dontMock('../../js/components/dataSelector')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var DataSelector = require('../../js/components/dataSelector');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('DataSelector', function() {
  var node, props, component, items, availableDataItems, wrapper;

  function renderComponent() {
    // Note that these can be updated right before rendering
    props.availableDataItems = availableDataItems;
    // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
    wrapper = Enzyme.mount(<DataSelector {...props} />, node);
    component = wrapper.find(DataSelector);
    items = wrapper.find(AccessibleButton);
  }

  function updateComponent() {
    //wrapper.update() is not working properly, see:
    //https://github.com/airbnb/enzyme/issues/1245#issuecomment-335355420
    //Using alternative suggested in that comment instead
    wrapper.setProps(props);
    component = wrapper.find(DataSelector);
    items = wrapper.find(AccessibleButton);
  }

  function findItemByLabel(label) {
    for (var i = 0; i < items.length; i++) {
      if (items.at(i).props().ariaLabel === label) {
        return items.at(i);
      }
    }
    return null;
  }

  beforeEach(function() {
    node = document.createElement('div');
    items = [];
    availableDataItems = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    component = null;
    props = {
      enabled: true,
      selectedData: 'a',
      availableDataItems: availableDataItems,
      dataItemsPerPage: { xs: 1, sm: 2, md: 4, lg: 8 },
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

  afterEach(function() {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  });

  it('should render a DataSelector', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should preserve focus when selecting a new item using the keyboard', function() {
    var secondItemElement;
    props.selectedData = 'a';

    renderComponent();
    //TODO: There is no easy way to check the initial activeElement
    // Simulate click on a different element than the one currently selected
    secondItemElement = findItemByLabel(availableDataItems[1]);
    secondItemElement.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.SPACE });
    secondItemElement.simulate('click');
    //TestUtils.Simulate.keyDown(secondItemElement, { key: CONSTANTS.KEY_VALUES.SPACE });
    //TestUtils.Simulate.click(secondItemElement);
    // Re-render in order to reflect new prop state, focus should be set afterwards
    updateComponent();
    ////secondItemElement = findItemByLabel(availableDataItems[1]);
    ////console.log(ReactDOM.findDOMNode(secondItemElement.instance()));
    expect(document.activeElement).toBe(ReactDOM.findDOMNode(secondItemElement.instance()));
  });

  it('should auto focus on the first element when moving to next page with keyboard', function() {
    props.selectedData = 'a';
    props.viewSize = 'md';
    props.dataItemsPerPage.md = 4;

    //TODO: There is no easy way to check the initial activeElement
    renderComponent();
    var nextButton = findItemByLabel(CONSTANTS.ARIA_LABELS.MORE_OPTIONS);
    nextButton.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.SPACE });
    nextButton.simulate('click');

    updateComponent();
    var firstBtnSecondPage = ReactDOM.findDOMNode(findItemByLabel('e').instance());
    expect(document.activeElement).toBe(firstBtnSecondPage);
  });

  it('should auto focus on the last element when moving to previous page with keyboard', function() {
    props.selectedData = 'a';
    props.viewSize = 'md';
    props.dataItemsPerPage.md = 4;

    //TODO: There is no easy way to check the initial activeElement
    renderComponent();
    var prevButton = findItemByLabel(CONSTANTS.ARIA_LABELS.PREVIOUS_OPTIONS);
    var nextButton = findItemByLabel(CONSTANTS.ARIA_LABELS.MORE_OPTIONS);
    nextButton.simulate('click');
    prevButton.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.SPACE });
    prevButton.simulate('click');

    updateComponent();
    var lastBtnFirstPage = ReactDOM.findDOMNode(findItemByLabel('d').instance());
    expect(document.activeElement).toBe(lastBtnFirstPage);
  });

  it('should render ARIA attributes on previous and next buttons', function() {
    renderComponent();
    var prevButton = ReactDOM.findDOMNode(findItemByLabel(CONSTANTS.ARIA_LABELS.PREVIOUS_OPTIONS).instance());
    var nextButton = ReactDOM.findDOMNode(findItemByLabel(CONSTANTS.ARIA_LABELS.MORE_OPTIONS).instance());
    expect(prevButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.PREVIOUS_OPTIONS);
    expect(nextButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.MORE_OPTIONS);
    expect(prevButton.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM);
    expect(nextButton.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM);
  });

  it('should render ARIA attributes on menu items', function() {
    renderComponent();
    var menuItem = ReactDOM.findDOMNode(findItemByLabel('a').instance());
    expect(menuItem.getAttribute('aria-label')).toBe('a');
    expect(menuItem.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO);
  });

  it('should set menu role and ARIA label on main element', function() {
    props.ariaLabel = 'customAriaLabel';
    renderComponent();
    var mainElement = ReactDOM.findDOMNode(component.instance());
    expect(mainElement.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU);
    expect(mainElement.getAttribute('aria-label')).toBe(props.ariaLabel);
  });

  it('should update aria-checked attribute when item selection state changes', function() {
    var secondMenuItem;
    props.selectedData = 'a';
    renderComponent();
    var secondMenuWrapper = findItemByLabel('b');
    secondMenuItem = ReactDOM.findDOMNode(secondMenuWrapper.instance());
    expect(secondMenuItem.getAttribute('aria-checked')).toBe('false');
    secondMenuWrapper.simulate('click');
    renderComponent();
    secondMenuItem = ReactDOM.findDOMNode(findItemByLabel('b').instance());
    expect(secondMenuItem.getAttribute('aria-checked')).toBe('true');
  });

});
