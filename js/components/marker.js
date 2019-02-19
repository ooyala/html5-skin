const React = require('react');
const PropTypes = require('prop-types');

/**
 * This component represents an element that handles the rendering 
 * of an individual marker.
 */
class Marker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      start: this.props.start,
      end: this.props.end,
      scrubberBarWidth: this.props.scrubberBarWidth,
      duration: this.props.duration,
      style: this.props.style
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.state) {
      this.setState({
        start: nextProps.start,
        end: nextProps.end,
        scrubberBarWidth: nextProps.scrubberBarWidth,
        duration: nextProps.duration,
        style: this.props.style
      });
    }
  }

  render() {
    return (
      <div style={this.state.style} className="oo-marker"></div>
    );
  }
}

Marker.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  scrubberBarWidth: PropTypes.number,
  duration: PropTypes.number,
  style: PropTypes.object
};

Marker.defaultProps = {
  start: 0,
  end: 0,
  scrubberBarWidth: 0,
  duration: 0,
  style: []
};

module.exports = Marker;