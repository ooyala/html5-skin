import React from 'react';
import PropTypes from 'prop-types';
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
    const {data, config, accentColor, duration, scrubberBarWidth} = this.props;

    let marker = Object.assign({}, config, data);
    let backgroundColor = marker.marker_color
      ? marker.marker_color
      : accentColor;
    return {
      left: getPosition(duration, scrubberBarWidth, data.start),
      width: getSize(duration, scrubberBarWidth, data.start, data.end),
      backgroundColor: backgroundColor
    };
  };

  shouldComponentUpdate = (nextProps) => {
    const {data, duration, scrubberBarWidth} = this.props;

    if (data.start !== nextProps.data.start || 
        data.end !== nextProps.data.end || 
        duration !== nextProps.duration || 
        scrubberBarWidth !== nextProps.scrubberBarWidth) {
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

export default Marker;