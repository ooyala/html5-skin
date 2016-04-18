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
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var ShareScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function() {
    this.props.controller.closeScreen();
  },

  render: function() {
    return (
      <div className="oo-share-screen">
        <SharePanel {...this.props} />
        <CloseButton {...this.props} closeAction={this.handleClose}/>
      </div>
    );
  }
});

ShareScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    icons: React.PropTypes.objectOf(React.PropTypes.object)
  })
};

ShareScreen.defaultProps = {
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

module.exports = ShareScreen;