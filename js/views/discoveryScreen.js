/********************************************************************
  DISCOVERY SCREEN
*********************************************************************/
/**
* This screen displays when user selects discover.
*
* @class DiscoveryScreen
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    DiscoveryPanel = require('../components/discoveryPanel'),
    CloseButton = require('../components/closeButton'),
    ClassNames = require('classnames'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var DiscoveryScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  render: function() {
    var promoStyle = ClassNames({
      'oo-promo-style': true,
      'oo-invisible hidden': this.props.playerState !== CONSTANTS.STATE.END
    });

    return (
      <div className="oo-discovery-screen">
        <div className={promoStyle}></div>
        <DiscoveryPanel {...this.props} videosPerPage={{xs:2, sm:4, md:6, lg:8}} />
        <CloseButton {...this.props} closeAction={this.handleClose}/>
      </div>
    );
  }
});

DiscoveryScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    icons: React.PropTypes.shape({
      dismiss: React.PropTypes.shape({
        fontStyleClass: React.PropTypes.string
      })
    })
  })
};

DiscoveryScreen.defaultProps = {
  skinConfig: {
    icons: {
      dismiss:{fontStyleClass:'oo-icon oo-icon-close'}
    }
  },
  controller: {
    toggleDiscoveryScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = DiscoveryScreen;