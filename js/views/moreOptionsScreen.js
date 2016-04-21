/********************************************************************
  MORE OPTIONS SCREEN
*********************************************************************/
/**
* The screen used while the more options menu is showing.
*
* @class MoreOptionsScreen
* @constructor
*/
var React = require('react'),
    MoreOptionsPanel = require('../components/moreOptionsPanel'),
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var MoreOptionsScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function() {
    this.props.controller.closeScreen();
  },

  render: function() {
    return (
      <div className="oo-state-screen oo-more-options-screen">
        <MoreOptionsPanel {...this.props}/>
        <CloseButton {...this.props} closeAction={this.handleClose}/>
      </div>
    );
  }
});

MoreOptionsScreen.defaultProps = {
  skinConfig: {
    icons: {
      dismiss:{fontStyleClass:'oo-icon oo-icon-close'}
    }
  },
  controller: {
    closeScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = MoreOptionsScreen;