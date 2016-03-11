/********************************************************************
  CLOSED CAPTION SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionScreen
* @constructor
*/
var React = require('react'),
    ClosedCaptionPanel = require('../components/closedCaptionPanel'),
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var ClosedCaptionScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  render: function() {
    return (
      <div className="state-screen closedCaptionsScreen">
        <ClosedCaptionPanel {...this.props} closedCaptionOptions={this.props.closedCaptionOptions} languagesPerPage={{small:1, medium:4, large:15}} />
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});

ClosedCaptionScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    icons: React.PropTypes.shape({
      dismiss: React.PropTypes.shape({
        fontStyleClass: React.PropTypes.string
      })
    })
  })
};

ClosedCaptionScreen.defaultProps = {
  skinConfig: {
    icons: {
      dismiss:{fontStyleClass:'icon icon-close'}
    }
  },
  controller: {
    toggleClosedCaptionScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = ClosedCaptionScreen;