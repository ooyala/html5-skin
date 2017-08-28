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
				className="direction-control"
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

module.exports = DirectionControl;