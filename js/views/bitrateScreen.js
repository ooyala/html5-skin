/********************************************************************
 BITRATE SCREEN
 *********************************************************************/
/**
 * This screen displays when user selects bitrate.
 *
 * @class BitrateScreen
 * @constructor
 */
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    BitratePanel = require('../components/bitratePanel'),
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var BitrateScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function(event) {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.BITRATE_SCREEN);
  },

  render: function() {
    return (
      <div className="state-screen bitrate-screen">
        <BitratePanel {...this.props} />
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});

BitrateScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    icons: React.PropTypes.shape({
      dismiss: React.PropTypes.shape({
        fontStyleClass: React.PropTypes.string
      })
    })
  })
};

BitrateScreen.defaultProps = {
  skinConfig: {
    icons: {
      dismiss:{fontStyleClass:'icon icon-close'}
    }
  },
  controller: {
    toggleScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = BitrateScreen;