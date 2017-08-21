var React = require('react'),
		Icon = require('./icon');

var DirectionControl = React.createClass({
	handleEvent: function (ev) {
		var move = ev.type == 'mousedown' || ev.type == 'touchstart' ? 'start' : 'end';
		this.props.handleDirection(move, this.props.dir);
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

		var styles = {
			transform: (function (self) {
				var angle;
				switch (self.props.dir){
					case 'right':
						angle = 0;
						break;
					case 'up':
						angle = -90;
						break;
					case 'down':
						angle = 90;
						break;
					case 'left':
						angle = 180;
						break;
				}

				return 'rotate('+angle+'deg)';
			})(this)
		};

		var dynamicStyles = this.setupItemStyle();
		dynamicStyles.iconCharacter.color = '#000';

		return (
			<button
							style={styles}
							key={this.props.dir}
							tabIndex="0"
							onMouseDown={this.handleEvent} onTouchStart={this.handleEvent}
							onMouseUp={this.handleEvent} onTouchEnd={this.handleEvent}
			>
				<Icon {...this.props} icon="play" style={dynamicStyles.iconCharacter}/>
			</button>
		)
	}
});

var ViewControls = React.createClass({

	handleDirection: function (move, direction) {
		console.log('move', move, '; direction', direction);
		this.props.controller.moveToDirection(arguments);
	},

	render: function () {
		var styles = {
			width: '20%',
			height: '20%',
			position: 'absolute',
			display: 'block',
			top: '10%',
			left: '10%',
			background: 'black',
			opacity: 0.1
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