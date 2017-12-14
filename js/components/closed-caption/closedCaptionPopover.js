var React = require('react'),
    CONSTANTS = require('../../constants/constants'),
    Utils = require('../utils'),
    AccessibleMenu = require('../higher-order/accessibleMenu'),
    AccessibleButton = require('../accessibleButton'),
    OnOffSwitch = require('./onOffSwitch'),
    CloseButton = require('../closeButton'),
    Icon = require('../icon');

var ClosedCaptionPopover = React.createClass({

  handleMoreCaptions: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN);
    this.handleClose();
  },

  handleClose: function() {
    this.props.togglePopoverAction({
      restoreToggleButtonFocus: true
    });
  },

  render: function() {
    var captionBtnText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    // OLD CODE
    // <li>
    //   <a className="oo-more-captions" onClick={this.handleMoreCaptions}>{captionBtnText} <Icon {...this.props} icon="arrowRight" className={this.props.className}/></a>
    // </li>
    return (
      <ul className="oo-popover-horizontal" role="menu">
        <li role="presentation">
          <OnOffSwitch {...this.props} ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS} />
        </li>
        <li role="presentation">
          <AccessibleButton
            className="oo-more-captions"
            ariaLabel={CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
            onClick={this.handleMoreCaptions}>
            {captionBtnText}
          </AccessibleButton>
        </li>
        <li role="presentation">
          <CloseButton
            {...this.props}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
            closeAction={this.handleClose} />
        </li>
      </ul>
    );
  }
});

// Extend with AccessibleMenu features
ClosedCaptionPopover = AccessibleMenu(ClosedCaptionPopover);

module.exports = ClosedCaptionPopover;
