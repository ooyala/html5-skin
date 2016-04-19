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
      <div className="oo-state-screen oo-closed-captions-screen">
        <ClosedCaptionPanel {...this.props} closedCaptionOptions={this.props.closedCaptionOptions} languagesPerPage={{xs:1, sm:4, md:4, lg:15}} />
        <CloseButton {...this.props} closeAction={this.handleClose}/>
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
      dismiss:{fontStyleClass:'oo-icon oo-icon-close'}
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