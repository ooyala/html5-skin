var React = require('react');
var ReactDOM = require('react-dom');
var CONSTANTS = require('../../constants/constants');

var AccessibleMenu = function(ComposedComponent, options) {
  var _options = options || {};

  return React.createClass({

    componentDidMount: function() {
      this.onKeyDown = this.onKeyDown.bind(this);
      this.menuDomElement = ReactDOM.findDOMNode(this.composedComponent);

      // If specified, use a child element instead of component's main element
      if (_options.selector && this.menuDomElement) {
        this.menuDomElement = this.menuDomElement.querySelector(_options.selector);
      }

      if (this.menuDomElement) {
        this.menuDomElement.addEventListener('keydown', this.onKeyDown);
      }
    },

    componentWillUnmount: function() {
      if (this.menuDomElement) {
        this.menuDomElement.removeEventListener('keydown', this.onKeyDown);
      }
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

      switch (event.key) {
        case CONSTANTS.KEY_VALUES.ARROW_UP:
        case CONSTANTS.KEY_VALUES.ARROW_LEFT:
          event.preventDefault();
          this.focusOnMenuItemSibling(event.target, false);
          break;
        case CONSTANTS.KEY_VALUES.ARROW_DOWN:
        case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
          event.preventDefault();
          this.focusOnMenuItemSibling(event.target, true);
          break;
        default:
          break;
      }
    },

    /**
     * Finds the previous or next sibling of the given menu item and gives it focus.
     * @private
     * @param {Element} menuItem The menuItem element whose sibling we want to focus on.
     * @param {Boolean} useNextSibling Chooses the next sibling when true and the previous when false.
     */
    focusOnMenuItemSibling: function(menuItem, useNextSibling) {
      var menuItemsList = [];
      if (this.menuDomElement) {
        menuItemsList = this.menuDomElement.querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']:not(.oo-hidden)');
      }
      if (!menuItemsList.length) {
        return;
      }
      // Since these elements aren't actually next to each other in the DOM, their position
      // relative to one another is implied from their tab order, which should be the same as
      // the one returned by querySelectorAll as long as tabindex is set to 0 (which should be the case).
      var siblingIndex = this.getMenuItemSiblingIndex(menuItemsList, menuItem, useNextSibling);
      var menuItem = menuItemsList[siblingIndex];

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
