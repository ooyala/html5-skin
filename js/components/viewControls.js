var React = require('react');
var DirectionControl = require('./directionControl');

var ViewControls = React.createClass({
	componentWillMount: function () {
		this.vr = this.props.controller.getVrParams();
	},


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
			opacity: this.props.controlBarVisible ? 0.3: 0
		};

		return this.vr && (
			<div className="view-controls" style={styles}>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="left"/>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="right"/>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="up"/>
				<DirectionControl {...this.props} handleDirection={this.handleDirection} dir="down"/>
			</div>
		);
	}
});

module.exports = ViewControls;