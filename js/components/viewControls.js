var React = require('react'),
		Icon = require('./icon');

var DirectionControl = React.createClass({
	handleEvent: function (ev) {
		var rotate = ev.type == 'mousedown' || ev.type == 'touchstart' ? true : false;
		this.props.handleDirection(rotate, this.props.dir);
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
			margin: '0px',
			padding: '0px',
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