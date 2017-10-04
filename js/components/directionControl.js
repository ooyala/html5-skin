var React = require('react');
var classnames = require('classnames');

var DirectionControl = React.createClass({
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
    var directionClass = 'oo-vr-icon--move--' + this.props.dir
      , touchedDirectionClass = this.state.isTouched && 'oo-vr-icon--move--' + this.props.dir + '--touched';
    return (
      <div
        className={classnames('oo-vr-icon--move direction-control', directionClass, touchedDirectionClass)}
        key={this.props.dir}
        onMouseDown={this.handleEvent} onTouchStart={this.handleEvent}
        onMouseUp={this.handleEvent} onTouchEnd={this.handleEvent}
        onMouseOut={this.handleEvent}
      />
    );
  }
});

DirectionControl.propTypes = {
  handleDirection: React.PropTypes.func
};

module.exports = DirectionControl;