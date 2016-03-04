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
    AccessibilityMixin = require('../mixins/accessibilityMixin'),
    Icon = require('../components/icon');

var DiscoveryScreen = React.createClass({
  mixins: [AccessibilityMixin],

  propTypes: {
    skinConfig: React.PropTypes.shape({
      icons: React.PropTypes.shape({
        dismiss: React.PropTypes.shape({
          fontStyleClass: React.PropTypes.string
        })
      })
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
        toggleDiscoveryScreen: function(){},
        state: {
          accessibilityControlsEnabled: true
        }
      }
    };
  },

  handleClose: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  render: function() {
    var promoStyle = ClassNames({
      'promo-style': true,
      'invisible hidden': this.props.playerState !== CONSTANTS.STATE.END
    });

    return (
      <div className="discoveryScreen">
        <div className={promoStyle}></div>
        <DiscoveryPanel {...this.props} videosPerPage={{small:2, medium:6, large:8}} />
        <CloseButton closeAction={this.handleClose}
          fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass}
          fontString={this.props.skinConfig.icons.dismiss.fontString}
          fontFamilyName={this.props.skinConfig.icons.dismiss.fontFamilyName}/>
      </div>
    );
  }
});
module.exports = DiscoveryScreen;