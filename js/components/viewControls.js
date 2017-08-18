var React = require('react'),
		CONSTANTS = require('../constants/constants'),
		ClassNames = require('classnames'),
		Utils = require('./utils'),
		Icon = require('./icon');

var DirectionControl = React.createClass({
	render: function () {
		var dirIcon = "fa fa-chevron-"+this.props.dir+" fa-lg";
		var styles = {width:'10px', height:'10px', position:'absolute'};
		return <span style={styles}><i className={dirIcon}>p</i></span>
	}
});

var ViewControls = React.createClass({

	handleMouseDown: function (ev) {
		debugger;
	},

	render: function () {
		console.log('ViewControls props', this.props);
		var styles = {
			width: '20%',
			height: '20%',
			position: 'absolute',
			display: 'block',
			top: '10%',
			left: '10%',
			'z-index': 2147483648,
			background: 'black',
			opacity: 0.1
		};

		return (
			<div className="viewControls" style={styles}>
				<DirectionControl dir="left" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
				<DirectionControl dir="right" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
				<DirectionControl dir="up" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
				<DirectionControl dir="down" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
			</div>
		);
	}
});

module.exports = ViewControls;