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

  propTypes: {
    skinConfig: React.PropTypes.shape({
      icons: React.PropTypes.objectOf(React.PropTypes.object)
    })
  },

  getDefaultProps: function () {
    return {
      skinConfig: {
        icons: {
          dismiss:{fontStyleClass:'icon icon-close'}
        }
      },
      controller: {
        closeScreen: function(){},
        state: {
          accessibilityControlsEnabled: true
        }
      }
    };
  },

  handleClose: function() {
    this.props.controller.closeScreen();
  },

  render: function() {
    return (
      <div className="share-screen">
        <SharePanel {...this.props} />
        <CloseButton {...this.props} closeAction={this.handleClose}/>
      </div>
    );
  }
});
module.exports = ShareScreen;