const React = require('react');
const PropTypes = require('prop-types');
import {getPosition, getSize} from './helpers';

/**
 * This component represents an element that handles the rendering 
 * of an individual marker.
 */
class Marker extends React.Component {

  constructor(props) {
    super(props);
  }

  getStyles() {
    var marker = Object.assign({}, this.props.config, this.props.data);
    var backgroundColor = marker.marker_color ? marker.marker_color : this.props.accentColor;
    return {
      left: getPosition(
        this.props.duration,
        this.props.scrubberBarWidth,
        this.props.data.start
      ),
      width: getSize(
        this.props.duration,
        this.props.scrubberBarWidth,
        this.props.data.start, this.props.data.end
      ),
      backgroundColor: backgroundColor
    };
  };
  
  shouldComponentUpdate(nextProps) {
    if (this.props.data.start !== nextProps.data.start || this.props.data.end !== nextProps.data.end || 
      this.props.duration !== nextProps.duration || this.props.scrubberBarWidth !== nextProps.scrubberBarWidth) {
        return true;
    }
    return false;
  }

  render() {
    return (
      <div style={this.getStyles()} className="oo-marker"></div>
    );
  }
}

Marker.propTypes = {
  duration: PropTypes.number,
  scrubberBarWidth: PropTypes.number,
  data: PropTypes.object,
  config: PropTypes.object,
  accentColor: PropTypes.string
};

Marker.defaultProps = {
  duration: 0,
  scrubberBarWidth: 0,
  data: {},
  config: {},
  accentColor: ''
};

module.exports = Marker;