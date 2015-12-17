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
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('../components/utils');

var ClosedCaptionScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      clientWidth: null,
      clientHeight: null
    };
  },

  handleResize: function(e) {
    this.setState({clientWidth: this.getDOMNode().clientWidth, clientHeight: this.getDOMNode().clientHeight});
  },

  componentDidMount: function () {
    this.setState({
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
    window.addEventListener('resize', this.handleResize);
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  highlight: function(evt) {
    Utils.highlight(evt.target);
  },

  removeHighlight: function(evt) {
    var opacity = "0.6";
    Utils.removeHighlight(evt.target, opacity);
  },

  handleClose: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  render: function() {
    return (
      <div className="state-screen closedCaptionsScreen">
        <ClosedCaptionPanel {...this.props} closedCaptionOptions = {this.props.closedCaptionOptions} clientWidth = {this.state.clientWidth} clientHeight = {this.state.clientHeight}/>
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});
module.exports = ClosedCaptionScreen;