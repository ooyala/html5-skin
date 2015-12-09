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
    ClassNames = require('classnames');

var DiscoveryScreen = React.createClass({
  propTypes: {
    skinConfig: React.PropTypes.shape({
      icons: React.PropTypes.shape({
        dismiss: React.PropTypes.shape({
          fontStyleClass: React.PropTypes.string
        })
      })
    })
  },

  componentDidMount: function () {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  handleClose: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleMouseDown: function(event) {
    //to prevent cursor changing to text cursor if click and drag
    event.preventDefault();
  },

  render: function() {
    console.log("xenia1 render Discovery Screen");
    var promoStyle = ClassNames({
      'promo-style': true,
      'invisible hidden': this.props.playerState !== CONSTANTS.STATE.END
    });

    return (
      <div className="discoveryScreen" onMouseDown={this.handleMouseDown}>
        <div className={promoStyle}></div>
        <DiscoveryPanel {...this.props} />
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});
module.exports = DiscoveryScreen;