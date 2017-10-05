var React = require('react');
var classnames = require('classnames');

var DirectionControlVr = React.createClass({
  getInitialState: function() {
    return {
      isTouched: false,
    };
  },

  handleEvent: function (ev) {
    var rotate = ev.type == 'mousedown' || ev.type == 'touchstart';
    this.props.handleDirection(rotate, this.props.dir);
    
    this.setState({
      isTouched: rotate
    });
  },

  render: function () {
    var baseDirectionClass = 'oo-vr-icon--move';
    var directionClass = baseDirectionClass + '--' + this.props.dir;
    var touchedDirectionClass = "";
    if (this.state.isTouched) {
      touchedDirectionClass = directionClass + '--touched';
    }
    return (
      <div
        className = {classnames('oo-direction-control', baseDirectionClass, directionClass, touchedDirectionClass)}
        key = {this.props.dir}
        onMouseDown = {this.handleEvent}
        onTouchStart = {this.handleEvent}
        onMouseUp = {this.handleEvent}
        onTouchEnd = {this.handleEvent}
        onMouseOut = {this.handleEvent}
      />
    );
  }
});

DirectionControlVr.propTypes = {
  handleDirection: React.PropTypes.func
};

module.exports = DirectionControlVr;