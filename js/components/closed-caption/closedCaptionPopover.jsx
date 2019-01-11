import React from 'react';
import CONSTANTS from '../../constants/constants';
import Utils from '../utils';
import AccessibleMenu from '../higher-order/accessibleMenu';
import AccessibleButton from '../accessibleButton';
import OnOffSwitch from './onOffSwitch';
import CloseButton from '../closeButton';

/**
 * handle popover with closed captions
 * @param {Object} props – React props object
 * @returns {Object} React VDOM element
 */
class ClosedCaptionPopoverProto extends React.Component {
  /** reference to a moreOptions button DOM element */
  moreOptionsBtn = null;

  /**
   * Just close the popover
   */
  handleClose = () => {
    const { togglePopoverAction } = this.props;
    togglePopoverAction({
      restoreToggleButtonFocus: true,
    });
  };

  /**
   * When the Closed Captions screen is closed it will go straight to the control bar without
   * showing this popover. Make sure CC button gets focus when that happens if it was originally
   * triggered with the keyboard.
   */
  handleMoreCaptions = () => {
    const { controller } = this.props;
    if (this.moreOptionsBtn) {
      if (this.moreOptionsBtn.wasTriggeredWithKeyboard()) {
        controller.state.focusedControl = CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION;
      }
      controller.state.closedCaptionOptions.autoFocus = this.moreOptionsBtn.wasTriggeredWithKeyboard();
      this.moreOptionsBtn.wasTriggeredWithKeyboard(false);
    }
    controller.toggleScreen(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
    this.handleClose();
  };

  render() {
    const { language, localizableStrings } = this.props;
    const captionBtnText = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.CC_OPTIONS,
      localizableStrings
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
            ref={(element) => {
              this.moreOptionsBtn = element;
            }}
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
  }
}

const ClosedCaptionPopover = AccessibleMenu(ClosedCaptionPopoverProto);
module.exports = ClosedCaptionPopover;
