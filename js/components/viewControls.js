var React = require('react');
var DirectionControl = require('./directionControl');
var classnames = require('classnames');

var ViewControls = React.createClass({
  handleDirection: function (rotate, direction) {
    this.props.controller.moveVrToDirection(rotate, direction);
  },
  
  render: function () {
    return (
      <div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="left"/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="right"/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="up"/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="down"/>
      </div>
    );
  }
});

ViewControls.propTypes = {
  controller: React.PropTypes.shape({
    moveVrToDirection: React.PropTypes.func
  })
};

module.exports = ViewControls;