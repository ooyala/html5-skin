var React = require('react');
var DirectionControlVr = require('./directionControlVr');
var classnames = require('classnames');

var ViewControlsVr = React.createClass({
  handleDirection: function (rotate, direction) {
    this.props.controller.moveVrToDirection(rotate, direction);
  },
  
  render: function () {
    return (
      <div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
        <DirectionControlVr {...this.props} handleDirection = {this.handleDirection} dir = "left" />
        <DirectionControlVr {...this.props} handleDirection = {this.handleDirection} dir = "right" />
        <DirectionControlVr {...this.props} handleDirection = {this.handleDirection} dir = "up" />
        <DirectionControlVr {...this.props} handleDirection = {this.handleDirection} dir = "down" />
      </div>
    );
  }
});

ViewControlsVr.propTypes = {
  controller: React.PropTypes.shape({
    moveVrToDirection: React.PropTypes.func
  })
};

module.exports = ViewControlsVr;