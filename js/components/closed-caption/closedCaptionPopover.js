let React = require('react');

let CONSTANTS = require('../../constants/constants');

let Utils = require('../utils');

let AccessibleMenu = require('../higher-order/accessibleMenu');

let AccessibleButton = require('../accessibleButton');

let OnOffSwitch = require('./onOffSwitch');

let CloseButton = require('../closeButton');
let createReactClass = require('create-react-class');

let ClosedCaptionPopover = createReactClass({
  handleMoreCaptions: function() {
    if (this.moreOptionsBtn) {
      // When the Closed Captions screen is closed it will go straight to the control bar without
      // showing this popover. Make sure CC button gets focus when that happens if it was originally
      // triggered with the keyboard.
      if (this.moreOptionsBtn.wasTriggeredWithKeyboard()) {
        this.props.controller.state.focusedControl = CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION;
      }
      this.props.controller.state.closedCaptionOptions.autoFocus = this.moreOptionsBtn.wasTriggeredWithKeyboard();
      this.moreOptionsBtn.wasTriggeredWithKeyboard(false);
    }
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
    this.handleClose();
  },

  handleClose: function() {
    this.props.togglePopoverAction({
      restoreToggleButtonFocus: true,
    });
  },

  render: function() {
    let captionBtnText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.CC_OPTIONS,
      this.props.localizableStrings
    );

    return (
      <ul className="oo-popover-horizontal" role="menu">
        <li role="presentation">
          <OnOffSwitch
            {...this.props}
            ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM_CHECKBOX}
          />
        </li>
        <li role="presentation">
          <AccessibleButton
            ref={function(e) {
              this.moreOptionsBtn = e;
            }.bind(this)}
            className="oo-more-captions"
            ariaLabel={CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
            onClick={this.handleMoreCaptions}
          >
            {captionBtnText}
          </AccessibleButton>
        </li>
        <li role="presentation">
          <CloseButton {...this.props} role={CONSTANTS.ARIA_ROLES.MENU_ITEM} closeAction={this.handleClose} />
        </li>
      </ul>
    );
  },
});

// Extend with AccessibleMenu features
ClosedCaptionPopover = AccessibleMenu(ClosedCaptionPopover);

module.exports = ClosedCaptionPopover;
