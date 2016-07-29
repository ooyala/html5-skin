var React = require('react'),
    CONSTANTS = require('../../constants/constants'),
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
    return (
      <ul className="oo-popover-horizontal">
        <li>
          <OnOffSwitch {...this.props} />
        </li>
        <li>
          <a className="oo-more-captions" onClick={this.handleMoreCaptions}>Language & Captions</a>
        </li>
        <li>
          <CloseButton {...this.props} closeAction={this.handleClose} />
        </li>
      </ul>
    );
  }
});

module.exports = ClosedCaptionPopover;