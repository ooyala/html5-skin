var React = require('react');
var classnames = require('classnames');

var DirectionControlVr = React.createClass({
  getInitialState: function() {
    return {
      isTouched: false
    };
  },

  handleEvent: function(ev) {
    var isRotated = ev.type === 'mousedown' || ev.type === 'touchstart';

    // The call always happens, except for the mouse movement without pressing the mouse button
    if (this.state.isTouched || ev.type !== 'mouseout') {
      this.props.handleVrViewControlsClick(ev, isRotated, this.props.dir);
    }

    this.setState({
      isTouched: isRotated
    });
  },

  render: function() {
    var baseDirectionClass = 'oo-vr-icon--move';
    var directionClass = baseDirectionClass + '--' + this.props.dir;
    var touchedDirectionClass = '';
    if (this.state.isTouched) {
      touchedDirectionClass = directionClass + '--touched';
    }
    return (
      <div
        className={classnames(
          'oo-direction-control',
          baseDirectionClass,
          directionClass,
          touchedDirectionClass
        )}
        key={this.props.dir}
        onMouseDown={this.handleEvent}
        onTouchStart={this.handleEvent}
        onMouseUp={this.handleEvent}
        onTouchEnd={this.handleEvent}
        onMouseOut={this.handleEvent}
      />
    );
  }
});

DirectionControlVr.propTypes = {
  handleVrViewControlsClick: React.PropTypes.func
};

module.exports = DirectionControlVr;
