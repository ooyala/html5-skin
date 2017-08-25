var React = require('react');
var DirectionControl = require('./directionControl');

var ViewControls = React.createClass({

	handleDirection: function (rotate, direction) {
		this.props.controller.moveToDirection(rotate, direction);
	},

	render: function () {
		var styles = {
			position: 'absolute',
			display: 'block',
			top: '10%',
			left: '10%',
			background: 'black',
			opacity: 0.3
		};

		return (
			<div style={styles}>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="left"/>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="right"/>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="up"/>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="down"/>
			</div>
		);
	}
});

module.exports = ViewControls;