var React = require('react');
var DirectionControl = require('./directionControl');
var Icon = require('../components/icon');
var classnames = require('classnames');

var ViewControls = React.createClass({
  handleDirection: function (rotate, direction) {
    this.props.controller.moveToDirection(rotate, direction);
  },
  
  render: function () {
    var actionIconStyle = {
      position: 'absolute',
      display: 'block',
      width: '100%',
      opacity: 1,
      'font-size': '40px',
      'line-height': '40px'
    };
    
    return (
      <div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
        <Icon {...this.props} icon="arrowsBlack" style={actionIconStyle}/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="left"/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="right"/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="up"/>
        <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="down"/>
      </div>
    );
  }
});

module.exports = ViewControls;