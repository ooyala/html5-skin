var React = require('react');
var ReactDOM = require('react-dom');
var CONSTANTS = require('../../constants/constants');

var AccessibleMenu = function(ComposedComponent, options) {
  var _options = options || {};

  return React.createClass({

    componentDidMount: function() {
      this.menuDomElement = ReactDOM.findDOMNode(this.composedComponent);
      this.applyOptions();

      if (this.menuDomElement) {
        this.menuDomElement.addEventListener('keydown', this.onKeyDown);
      }
    },

    componentWillUnmount: function() {
      if (this.selectionObserver && typeof this.selectionObserver.disconnect === 'function') {
        this.selectionObserver.disconnect();
      }
      if (this.menuDomElement) {
        this.menuDomElement.removeEventListener('keydown', this.onKeyDown);
      }
    },

    /**
     * Configures the component with the options object that was passed during initialization.
     * Should be called only once after componentDidMount.
     * @private
     */
    applyOptions: function() {
      // If specified, use a child element instead of component's main element
      if (_options.selector && this.menuDomElement) {
        this.menuDomElement = this.menuDomElement.querySelector(_options.selector);
      }
      // Use roving tabindex for tab navigation if specified.
      // See: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
      if (_options.useRovingTabindex) {
        this.applyRovingTabIndex();
        // Set up an observer to re-apply roving tab index when selected menu item changes
        this.selectionObserver = this.setUpSelectionObserver(this.menuDomElement);
      }
    },

    /**
     * Instantiates a MutationObserver that will call this.applyRovingTabIndex whenever it
     * detects changes to the selection status of the target element's children. For the
     * purpose of this component's implementation it is assumed that any selectable items
     * in this menu will update their aria-checked or aria-selected attributes when selected/deselected.
     * TODO:
     * Find a React-only alternative.
     * @private
     * @param {Node} target The html element whose children we want to observe.
     * @return {MutationObserver} The new mutation observer instance that was set up or undefined if setup failed.
     */
    setUpSelectionObserver: function(target) {
      if (!target || !window.MutationObserver) {
        return;
      }
      var observer = new MutationObserver(this.applyRovingTabIndex);
      var observerConfig = {
        subtree: true,
        attributes: true,
        attributeFilter: [
          'aria-checked',
          'aria-selected'
        ]
      };
      observer.observe(target, observerConfig);
      return observer;
    },

    /**
     * Keydown event handler. Implements arrow key navigation for menu items.
     * @private
     * @param {event} event The keyboard event object.
     */
    onKeyDown: function(event) {
      if (
        !event.target ||
        !event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR) ||
        event.target.getAttribute('role') === CONSTANTS.ARIA_ROLES.SLIDER
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
    },

    /**
     * Gets a NodeList that contains all the children of this.menuDomElement that can be
     * considered to be menu items. Menu items are assumed to be any non-hidden elements with the
     * data-focus-id attribute which is set by the AccessibleButton and Slider components.
     * @private
     * @return {NodeList} An ordered list of elements that comprise a menu.
     */
    getMenuItemList: function() {
      var menuItemList = [];

      if (this.menuDomElement) {
        menuItemList = this.menuDomElement.querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']:not(.oo-hidden)');
      }
      return menuItemList;
    },

    /**
     * Finds the previous or next sibling of the given menu item and gives it focus.
     * @private
     * @param {Element} menuItem The menuItem element whose sibling we want to focus on.
     * @param {Boolean} useNextSibling Chooses the next sibling when true and the previous when false.
     */
    focusOnMenuItemSibling: function(menuItem, useNextSibling) {
      var menuItemList = this.getMenuItemList();
      if (!menuItemList.length) {
        return;
      }
      // Since these elements aren't actually next to each other in the DOM, their position
      // relative to one another is implied from their tab order, which should be the same as
      // the one returned by querySelectorAll as long as tabindex is set to 0 (which should be the case).
      var siblingIndex = this.getMenuItemSiblingIndex(menuItemList, menuItem, useNextSibling);
      var menuItem = menuItemList[siblingIndex];

      if (menuItem && typeof menuItem.focus === 'function') {
        menuItem.focus();
      }
    },

    /**
     * Gets the index of the previous or next menu item on the list relative to
     * the given menu item. The returned index will loop around so that the previous sibling of
     * the first element is the last element, and the next sibling of the last element is
     * the first element.
     * @private
     * @param {NodeList} menuItemList An ordered list of elements that comprise a menu.
     * @param {Element} menuItem The menu item whose sibling we want to find.
     * @param {Boolean} useNextSibling Chooses the sibling next to menuItem when true and the previous one when false.
     * @return {Number} The index where the sibling menu items is located in the list, -1 if menuItem is absent from the list.
     */
    getMenuItemSiblingIndex: function (menuItemList, menuItem, useNextSibling) {
      if (!menuItemList || !menuItemList.length) {
        return -1;
      }
      var menuItemIndex = Array.prototype.indexOf.call(menuItemList, menuItem);
      var siblingIndex = useNextSibling ? menuItemIndex + 1 : menuItemIndex - 1;
      // Note that the code below will have the intended result even if
      // menuItemIndex is -1
      if (siblingIndex < 0) {
        siblingIndex = menuItemList.length - 1;
      }
      if (siblingIndex >= menuItemList.length) {
        siblingIndex = 0;
      }
      return siblingIndex;
    },

    /**
     * Applies a roving tab index to the menu's menu items, which essentially only allows
     * the currently selected item (or the first item, if no selected items exist) to be tabbable.
     * Keyboard navigation whithin menu items is only possible via arrow keys when using this mode.
     * Reference: https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex
     * @private
     */
    applyRovingTabIndex: function() {
      var menuItem;
      var hasSelectedItems = false;
      var menuItemList = this.getMenuItemList();

      for (var i = 0; i < menuItemList.length; i++) {
        menuItem = menuItemList[i];
        if (
          menuItem.getAttribute('aria-checked') === 'true' ||
          menuItem.getAttribute('aria-selected') === 'true'
        ) {
          menuItem.setAttribute('tabindex', 0);
          hasSelectedItems = true;
        } else {
          menuItem.setAttribute('tabindex', -1);
        }
      }
      // Make first element tabbable if no selected item was found
      if (menuItemList.length && !hasSelectedItems) {
        menuItemList[0].setAttribute('tabindex', 0);
      }
    },

    render: function() {
      return (
        <ComposedComponent
          ref={function(c) { this.composedComponent = c }.bind(this)}
          {...this.props} />
      );
    }

  });
};

module.exports = AccessibleMenu;
