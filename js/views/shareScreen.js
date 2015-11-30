/********************************************************************
  SHARING SCREEN
*********************************************************************/
/**
* This screen displays when user selects share.
*
* @class ShareScreen
* @constructor
*/
var React = require('react'),
    SharePanel = require('../components/sharePanel'),
    CloseButton = require('../components/closeButton');

var ShareScreen = React.createClass({
  componentDidMount: function () {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  handleClose: function() {
    this.props.controller.closeScreen();
  },

  render: function() {
    return (
      <div className="share-screen">
        <SharePanel {...this.props} />
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});
module.exports = ShareScreen;