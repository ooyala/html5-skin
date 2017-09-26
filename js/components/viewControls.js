var React = require('react');
var DirectionControl = require('./directionControl');
var classnames = require('classnames');

var ViewControls = React.createClass({
  handleVRViewControlsClick: function(e, isRotated, direction) {
    if (e.type == 'touchend' || !this.props.controller.state.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
    }
    this.props.controller.moveToDirection(isRotated, direction);
  },


  render: function () {
    return (
      <div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="left"/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="right"/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="up"/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="down"/>
      </div>
    );
  }
});

module.exports = ViewControls;