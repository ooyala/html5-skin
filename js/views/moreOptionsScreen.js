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
    MoreOptionsPanel = require('../components/moreOptionsPanel'),
    InlineStyle = require('../styles/inlineStyle'),
    CloseButton = require('../components/closeButton');

var MoreOptionsScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
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
module.exports = MoreOptionsScreen;