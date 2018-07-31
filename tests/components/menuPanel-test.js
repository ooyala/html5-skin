jest
.dontMock('react-scrollbar/dist/no-css')
.dontMock('../../js/components/customScrollArea')
.dontMock('../../js/components/menuPanel')
.dontMock('../../js/components/menuPanelItem')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const MenuPanel = require('../../js/components/menuPanel');
const MenuPanelItem = require('../../js/components/menuPanelItem');
const AccessibleButton = require('../../js/components/accessibleButton');
const CONSTANTS = require('../../js/constants/constants');

describe('MenuPanel', function() {
  let wrapper, component, props;

  const renderComponent = () => {
    wrapper = Enzyme.mount(
      <MenuPanel {...props}></MenuPanel>
    );
    component = wrapper.instance();
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      className: 'className',
      contentClassName: 'contentClassName',
      buttonClassName: 'buttonClassName',
      title: null,
      selectedValue: 'a',
      isPopover: false,
      onMenuItemClick: () => {},
      onClose: () => {},
      menuItems: [
        { value: 'a', label: 'a', ariaLabel: 'a' },
        { value: 'b', label: 'b', ariaLabel: 'b' },
        { value: 'c', label: 'c', ariaLabel: 'c' },
        { value: 'd', label: 'd', ariaLabel: 'd' },
      ],
      skinConfig: {
        general: {
          accentColor: '0000ff'
        }
      }
    };
  });

  it('should render a MenuPanel', function() {
    renderComponent();
    expect(component).toBeTruthy();
    expect(wrapper.find(MenuPanelItem).length).toBe(props.menuItems.length);
  });

  it('should add custom class names to respective elements', function() {
    props.className = 'customClassName';
    props.contentClassName = 'customContentClassName';
    props.buttonClassName = 'customButtonClassName';
    renderComponent();
    expect(wrapper.find('.oo-menu-panel').hasClass(props.className)).toBe(true);
    expect(wrapper.find('.oo-menu-panel-content').hostNodes().hasClass(props.contentClassName)).toBe(true);
    expect(wrapper.find('.oo-menu-btn').hostNodes().at(0).hasClass(props.buttonClassName)).toBe(true);
  });

  it('should render title when provided', function() {
    props.title = '';
    renderComponent();
    expect(wrapper.find('.oo-menu-panel-title').length).toBe(0);
    props.title = 'w00t';
    renderComponent();
    expect(wrapper.find('.oo-menu-panel-title').hostNodes().length).toBe(1);
    expect(wrapper.find('.oo-menu-panel-title').getDOMNode().textContent).toBe(props.title);
  });

  it('should set the isSelected prop to true on the selected item', function() {
    props.selectedValue = 'c';
    props.menuItems = [
      { value: 'a', label: 'a', ariaLabel: 'a' },
      { value: 'b', label: 'b', ariaLabel: 'b' },
      { value: 'c', label: 'c', ariaLabel: 'c' },
      { value: 'd', label: 'd', ariaLabel: 'd' },
    ];
    renderComponent();
    const menuItems = wrapper.find(MenuPanelItem);

    const selectedItem = menuItems.findWhere(item =>
      item.length && item.props().itemValue === props.selectedValue
    );
    const nonSelectedItems = menuItems.filterWhere(item =>
      item.length && item.props().itemValue !== props.selectedValue
    );

    expect(selectedItem.props().isSelected).toBe(true);
    expect(nonSelectedItems.length).toBe(3);
    nonSelectedItems.forEach(item =>
      expect(item.props().isSelected).toBe(false)
    );
  });

  it('should call onMenuItemClick with value of clicked menu item', function() {
    let clickedValue;
    props.onMenuItemClick = (itemValue) => clickedValue = itemValue;
    renderComponent();

    for (let [index, value] of props.menuItems.entries()) {
      const currentButton = wrapper.find(AccessibleButton).at(index);
      currentButton.simulate('click');
      expect(clickedValue).toBe(props.menuItems[index].value);
    }
  });

  it('should call onClose handler on onMenuItemClick if provided', function() {
    let onCloseParams;
    props.onClose = (params) => onCloseParams = params;
    renderComponent();
    const firstButton = wrapper.find(AccessibleButton).at(0);
    firstButton.simulate('click');
    expect(onCloseParams).toEqual({ restoreToggleButtonFocus: true });
  });

  it('should render menu items and pass correct props', function() {
    props.selectedValue = 'a';
    props.menuItems = [
      { value: 'a', label: 'a', ariaLabel: 'a' },
      { value: 'b', label: 'b', ariaLabel: 'b' },
      { value: 'c', label: 'c', ariaLabel: 'c' },
      { value: 'd', label: 'd', ariaLabel: 'd' },
    ];
    renderComponent();
    const menuPanelItems = wrapper.find(MenuPanelItem);

    for (let [index, menuItem] of props.menuItems.entries()) {
      expect(menuPanelItems.at(index).props()).toMatchObject({
        itemValue: menuItem.value,
        itemLabel: menuItem.label,
        ariaLabel: menuItem.ariaLabel,
        buttonClassName: props.buttonClassName,
        isSelected: props.selectedValue === menuItem.value,
        focusId: CONSTANTS.FOCUS_IDS.MENU_ITEM + menuItem.value,
        accentColor: props.skinConfig.general.accentColor,
        skinConfig: props.skinConfig
      });
    }
  });

  it('should set correct class for popover mode', function() {
    props.isPopover = true;
    renderComponent();
    expect(wrapper.find('.oo-menu-panel').hasClass('oo-menu-popover')).toBe(true);
    expect(wrapper.find('.oo-menu-panel').hasClass('oo-content-panel')).toBe(false);
  });

  it('should set correct class for screen mode', function() {
    props.isPopover = false;
    renderComponent();
    expect(wrapper.find('.oo-menu-panel').hasClass('oo-menu-popover')).toBe(false);
    expect(wrapper.find('.oo-menu-panel').hasClass('oo-content-panel')).toBe(true);
  });

  it('should set menu role on list element', function() {
    renderComponent();
    expect(wrapper.find('.oo-menu-panel-list').getDOMNode().getAttribute('role')).toBe('menu');
  });

});
