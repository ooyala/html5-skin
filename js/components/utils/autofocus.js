/**
 * Set, get autofocus btn, configure autofocus
 * @param {Object} controller - controller props
 * @constructor
 */
function Autofocus(state, toggleButtons) {
  /**
   * @description It gets value of toggleButtons from controller.js by popoverName
   * @param {string} popoverName - the name of the popover
   * @private
   * @returns {Object} - if toggleButtons (object) has key = popoverName it returns the value,
   * otherwise it returns {}
   */
  this.getToggleButtons = (popoverName) => {
    if (
      !toggleButtons
      || typeof toggleButtons[popoverName] === 'undefined'
    ) {
      return {};
    }
    return toggleButtons[popoverName];
  };

  /**
   * @description It sets this.props.controller.toggleButtons value (menu) for key = popoverName
   * @param {string} popoverName - the name of the popover
   * @param {ReactElement} menu - an accessible button
   */
  this.setToggleButtons = (popoverName, menu) => {
    if (toggleButtons) {
      toggleButtons[popoverName] = menu; // eslint-disable-line no-param-reassign
    }
  };

  /**
   * Configure the autofocus for menu
   * @param {Array} menu - an array of menu items
   */
  this.configureMenuAutofocus = (menu) => {
    const menuOptions = state[menu] || {};
    const menuToggleButton = this.getToggleButtons(menu);

    if (menuOptions.showPopover) {
      // Reset autoFocus property when closing the menu
      menuOptions.autoFocus = false;
    } else if (menuToggleButton && typeof menuToggleButton.wasTriggeredWithKeyboard === 'function') {
      // If the menu was activated via keyboard we should
      // autofocus on the first element
      menuOptions.autoFocus = menuToggleButton.wasTriggeredWithKeyboard();
    }
  };
}

module.exports = Autofocus;
