var React = require('react'),
		CONSTANTS = require('../constants/constants'),
		ClassNames = require('classnames'),
		Utils = require('./utils'),
		Icon = require('./icon');

var DirectionControl = React.createClass({
	handleClick: function(){
		console.log('handleClick props', this.props);
	},

	setupItemStyle: function() {
		var returnStyles = {};

		returnStyles.iconCharacter = {
			color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
			opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity

		};
		return returnStyles;
	},

	render: function () {
		// var dirIcon = "fa fa-chevron-"+this.props.dir+" fa-lg";

		var dirIcon = CONSTANTS.ARIA_LABELS.PLAY;
		var styles = {width:'10px', height:'10px', position:'absolute'};
		var dynamicStyles = this.setupItemStyle();

		console.warn('this.props', this.props);
		console.warn('dynamicStyles', dynamicStyles);
		// return <span style={styles}><i className={dirIcon}>p</i></span>
		return (
			<button
							onClick={this.handleClick}
							key={this.props.dir}
							tabIndex="0">
				<Icon {...this.props} icon="play" style={dynamicStyles.iconCharacter}/>
			</button>
		)
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
				<DirectionControl {...this.props} dir="left" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
				<DirectionControl {...this.props} dir="right" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
				<DirectionControl {...this.props} dir="up" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
				<DirectionControl {...this.props} dir="down" onMouseDown={this.handleMouseDown} onTouchDown={this.handleMouseDown}/>
			</div>
		);
	}
});

module.exports = ViewControls;