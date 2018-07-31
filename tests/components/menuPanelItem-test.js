jest
.dontMock('../../js/components/menuPanelItem')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/constants/constants')
.dontMock('../../js/components/icon')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const MenuPanelItem = require('../../js/components/menuPanelItem');
const AccessibleButton = require('../../js/components/accessibleButton');
const Icon = require('../../js/components/icon');
const CONSTANTS = require('../../js/constants/constants');

describe('MenuPanelItem', function() {
  let wrapper, component, props;

  const renderComponent = () => {
    wrapper = Enzyme.mount(
      <ul>
        <MenuPanelItem {...props}></MenuPanelItem>
      </ul>
    );
    component = wrapper.instance();
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      itemValue: 'value',
      itemLabel: 'label',
      ariaLabel: 'ariaLabel',
      buttonClassName: 'buttonClass',
      isSelected: false,
      focusId: 'focusId',
      accentColor: '0000ff',
      skinConfig: {
        icons: {}
      },
      onClick: () => {},
    };
  });

  it('should render a MenuPanelItem', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should correctly render selected state', function() {
    props.isSelected = true;
    props.accentColor = '0000ff';
    renderComponent();
    expect(wrapper.find('.oo-menu-panel-item').hasClass('oo-selected')).toBe(true);
    expect(wrapper.find('.oo-menu-btn').hostNodes().hasClass('oo-selected')).toBe(true);
    expect(wrapper.find(AccessibleButton).props().ariaChecked).toBe(true);
    expect(wrapper.find(AccessibleButton).props().style).toEqual({ color: props.accentColor });
    expect(wrapper.find(Icon).length).toBe(1);
  });

  it('should correctly render unselected state', function() {
    props.isSelected = false;
    renderComponent();
    expect(wrapper.find('.oo-menu-panel-item').hasClass('oo-selected')).toBe(false);
    expect(wrapper.find('.oo-menu-btn').hostNodes().hasClass('oo-selected')).toBe(false);
    expect(wrapper.find(AccessibleButton).props().ariaChecked).toBe(false);
    expect(wrapper.find(AccessibleButton).props().style).toEqual({ color: null });
    expect(wrapper.find(Icon).length).toBe(0);
  });

  it('should render props correctly', function() {
    props.itemLabel = 'label';
    props.ariaLabel = 'ariaLabel';
    props.focusId = 'focusId';
    props.buttonClassName = 'buttonClass';
    renderComponent();
    expect(wrapper.find('.oo-menu-btn-label').getDOMNode().textContent).toBe(props.itemLabel);
    expect(wrapper.find(AccessibleButton).props().ariaLabel).toBe(props.ariaLabel);
    expect(wrapper.find(AccessibleButton).props().focusId).toBe(props.focusId);
    expect(wrapper.find(AccessibleButton).hasClass(props.buttonClassName)).toBe(true);
  });

  it('should call onClick handler with item value when clicked', function() {
    let clickedValue;
    props.itemValue = 'w00t';
    props.onClick = (itemValue) => clickedValue = itemValue;
    renderComponent();
    wrapper.find(AccessibleButton).simulate('click');
    expect(clickedValue).toBe(props.itemValue);
  });

  it('should set correct roles on elements', function() {
    renderComponent();
    expect(wrapper.find('.oo-menu-panel-item').getDOMNode().getAttribute('role')).toBe(
      CONSTANTS.ARIA_ROLES.PRESENTATION
    );
    expect(wrapper.find(AccessibleButton).getDOMNode().getAttribute('role')).toBe(
      CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO
    );
  });

});
