var React = require('react'),
    CONSTANTS = require('../../constants/constants'),
    Utils = require('../utils'),
    AccessibleButton = require('../accessibleButton'),
    OnOffSwitch = require('./onOffSwitch'),
    CloseButton = require('../closeButton');

var ClosedCaptionPopover = React.createClass({

  handleMoreCaptions: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN);
    this.handleClose();
  },

  handleClose: function() {
    this.props.togglePopoverAction();
  },

  render: function() {
    var captionBtnText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);

    return (
      <ul className="oo-popover-horizontal">
        <li role="presentation">
          <OnOffSwitch {...this.props} ariaLabel={CONSTANTS.ARIA_LABELS.TOGGLE_CLOSED_CAPTIONS} />
        </li>
        <li role="presentation">
          <AccessibleButton
            className="oo-more-captions"
            ariaLabel={CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS}
            onClick={this.handleMoreCaptions}>
            {captionBtnText}
          </AccessibleButton>
        </li>
        <li role="presentation">
          <CloseButton {...this.props} closeAction={this.handleClose} />
        </li>
      </ul>
    );
  }
});

module.exports = ClosedCaptionPopover;
