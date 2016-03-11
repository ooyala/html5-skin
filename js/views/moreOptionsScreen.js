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
    ReactDOM = require('react-dom'),
    MoreOptionsPanel = require('../components/moreOptionsPanel'),
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var MoreOptionsScreen = React.createClass({
  mixins: [AccessibilityMixin],

  getInitialState: function() {
    return {
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: ReactDOM.findDOMNode(this).clientWidth});
  },

  handleClose: function() {
    this.props.controller.closeScreen();
  },

  render: function() {
    return (
      <div className="state-screen MoreOptionsScreen">
        <MoreOptionsPanel {...this.props} controlBarWidth={this.state.controlBarWidth} />
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});

MoreOptionsScreen.defaultProps = {
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

module.exports = MoreOptionsScreen;