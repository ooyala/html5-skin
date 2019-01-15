import React from 'react';
import ReactDOM from 'react-dom';
import CONSTANTS from '../../constants/constants';

const AccessibleMenu = (ComposedComponent, dirtyOptions) => {
  const options = dirtyOptions || {};

  /**
   * Element accessibility is a routine that could be gather in one HOC
   * Done it here
   */
  class Hoc extends React.Component {
    componentDidMount() {
      this.menuDomElement = ReactDOM.findDOMNode(this.composedComponent); // eslint-disable-line
      this.applyOptions();

      if (this.menuDomElement) {
        this.menuDomElement.addEventListener('keydown', this.onKeyDown);
      }
    }

    componentWillUnmount() {
      if (this.menuDomElement) {
        this.menuDomElement.removeEventListener('keydown', this.onKeyDown);
      }
    }

    /**
     * Keydown event handler. Implements arrow key navigation for menu items.
     * @private
     * @param {event} event The keyboard event object.
     */
    onKeyDown = (event) => {
      if (
        !event.target
        || !event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)
        || event.target.getAttribute('role') === CONSTANTS.ARIA_ROLES.SLIDER
      ) {
        return;
      }

      switch (event.which || event.keyCode) {
        case CONSTANTS.KEYCODES.UP_ARROW_KEY:
        case CONSTANTS.KEYCODES.LEFT_ARROW_KEY:
          event.preventDefault();
          this.focusOnMenuItemSibling(event.target, false);
          break;
        case CONSTANTS.KEYCODES.DOWN_ARROW_KEY:
        case CONSTANTS.KEYCODES.RIGHT_ARROW_KEY:
          event.preventDefault();
          this.focusOnMenuItemSibling(event.target, true);
          break;
        default:
          break;
      }
    }

    /**
     * Gets a NodeList that contains all the children of this.menuDomElement that can be
     * considered to be menu items. Menu items are assumed to be any non-hidden elements with the
     * data-focus-id attribute which is set by the AccessibleButton and Slider components.
     * @private
     * @returns {NodeList} An ordered list of elements that comprise a menu.
     */
    getMenuItemList = () => {
      let menuItemList = [];

      if (this.menuDomElement) {
        menuItemList = this.menuDomElement.querySelectorAll(
          `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}]:not(.oo-hidden)`
        );
      }
      return menuItemList;
    }

    /**
     * Gets the index of the previous or next menu item on the list relative to
     * the given menu item. The returned index will loop around so that the previous sibling of
     * the first element is the last element, and the next sibling of the last element is
     * the first element.
     * @private
     * @param {NodeList} menuItemList An ordered list of elements that comprise a menu.
     * @param {Element} menuItem The menu item whose sibling we want to find.
     * @param {Boolean} useNextSibling Chooses the sibling next to menuItem when true and the previous one when false.
     * @returns {Number} The index where the sibling menu items is located in the list, -1 if menuItem is absent from the list.
     */
    getMenuItemSiblingIndex = (menuItemList, menuItem, useNextSibling) => { // eslint-disable-line
      if (!menuItemList || !menuItemList.length) {
        return -1;
      }
      const menuItemIndex = Array.prototype.indexOf.call(menuItemList, menuItem);
      let siblingIndex = useNextSibling ? menuItemIndex + 1 : menuItemIndex - 1;
      // Note that the code below will have the intended result even if
      // menuItemIndex is -1
      if (siblingIndex < 0) {
        siblingIndex = menuItemList.length - 1;
      }
      if (siblingIndex >= menuItemList.length) {
        siblingIndex = 0;
      }
      return siblingIndex;
    }

    /**
     * Finds the previous or next sibling of the given menu item and gives it focus.
     * @private
     * @param {Element} menuItem The menuItem element whose sibling we want to focus on.
     * @param {Boolean} useNextSibling Chooses the next sibling when true and the previous when false.
     */
    focusOnMenuItemSibling = (menuItem, useNextSibling) => {
      const menuItemList = this.getMenuItemList();
      if (!menuItemList.length) {
        return;
      }
      // Since these elements aren't actually next to each other in the DOM, their position
      // relative to one another is implied from their tab order, which should be the same as
      // the one returned by querySelectorAll as long as tabindex is set to 0 (which should be the case).
      const siblingIndex = this.getMenuItemSiblingIndex(menuItemList, menuItem, useNextSibling);
      const item = menuItemList[siblingIndex];

      if (item && typeof menuItem.focus === 'function') {
        item.focus();
      }
    }

    /**
     * Fires when the composed component's componentDidUpdate handler is executed. We use this
     * cue to make sure that the roving tab index state is up to date.
     * @private
     */
    composedComponentDidUpdate = (...args) => {
      // Call component's original handler if existent
      if (typeof this.composedComponentDidUpdateHandler === 'function') {
        this.composedComponentDidUpdateHandler.apply(this.composedComponent, args);
      }
      this.applyRovingTabIndex();
    }

    /**
     * Configures the component with the options object that was passed during initialization.
     * Should be called only once after componentDidMount.
     * @private
     */
    applyOptions = () => {
      // If specified, use a child element instead of component's main element
      if (options.selector && this.menuDomElement) {
        this.menuDomElement = this.menuDomElement.querySelector(options.selector);
      }
      // Use roving tabindex for tab navigation if specified.
      // See: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
      if (options.useRovingTabindex) {
        this.applyRovingTabIndex();
        // When using roving tab index we need to monitor changes to the composed component
        // in order to re-apply it when selection changes
        if (this.composedComponent) {
          // Store reference to child component's current componentDidUpdate handler
          this.composedComponentDidUpdateHandler = this.composedComponent.componentDidUpdate;
          // Replace with custom decorator handler
          this.composedComponent.componentDidUpdate = this.composedComponentDidUpdate;
        }
      }
    }

    /**
     * Applies a roving tab index to the menu's menu items, which essentially only allows
     * the currently selected item (or the first item, if no selected items exist) to be tabbable.
     * Keyboard navigation whithin menu items is only possible via arrow keys when using this mode.
     * Reference: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
     * @private
     */
    applyRovingTabIndex = () => {
      let hasSelectedItems = false;
      const menuItemList = this.getMenuItemList();

      menuItemList.forEach((menuItem) => {
        if (
          menuItem.getAttribute('aria-checked') === 'true'
          || menuItem.getAttribute('aria-selected') === 'true'
        ) {
          menuItem.setAttribute('tabindex', 0);
          hasSelectedItems = true;
        } else {
          menuItem.setAttribute('tabindex', -1);
        }
      });
      // Make first element tabbable if no selected item was found
      if (menuItemList.length && !hasSelectedItems) {
        menuItemList[0].setAttribute('tabindex', 0);
      }
    }

    render() {
      return (
        <ComposedComponent
          ref={(element) => {
            this.composedComponent = element;
          }}
          {...this.props}
        />
      );
    }
  }

  return Hoc;
};

module.exports = AccessibleMenu;
