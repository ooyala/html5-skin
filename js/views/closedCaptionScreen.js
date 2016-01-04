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
    ResizeMixin = require('../mixins/resizeMixin'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var ClosedCaptionScreen = React.createClass({
  mixins: [ResizeMixin, AccessibilityMixin],

  getInitialState: function() {
    return {
      clientWidth: null,
      clientHeight: null
    };
  },

  handleResize: function() {
    this.setState({
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
  },

  componentDidMount: function() {
    this.setState({
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
  },

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
module.exports = ClosedCaptionScreen;