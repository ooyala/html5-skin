var React = require('react');
var classnames = require('classnames');

var DirectionControl = React.createClass({
  getInitialState: function() {
    return {
      isTouched: false,
    };
  },

  componentWillUnmount: function() {
    this.timer && clearTimeout(this.timer);
	},

	handleEvent: function (ev) {
    var rotate = ev.type == 'mousedown' || ev.type == 'touchstart';
    this.props.handleDirection(rotate, this.props.dir);
  	this.setState({
      isTouched: true
		}, function(){
  		var _this = this;
      this.timer = setTimeout(function(){
      	_this.setState({isTouched: false});
			}, 300);
		});
	},

	render: function () {
  	var directionClass = 'oo-vr-icon--move--' + this.props.dir
			, touchedDirectionClass = this.state.isTouched && 'oo-vr-icon--move--' + this.props.dir + '--touched';
		return (
			<div
				className={classnames('oo-vr-icon--move direction-control', directionClass, touchedDirectionClass)}
				key={this.props.dir}
				tabIndex="0"
				onMouseDown={this.handleEvent} onTouchStart={this.handleEvent}
				onMouseUp={this.handleEvent} onTouchEnd={this.handleEvent}
			/>
		);
	}
});

module.exports = DirectionControl;