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
        <CloseButton {...this.props}
          closeAction={this.handleClose}/>
      </div>
    );
  }
});
module.exports = MoreOptionsScreen;