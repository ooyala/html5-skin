import React from 'react';
import PropTypes from 'prop-types';
import { getPosition, getSize } from './helpers';

/**
 *  This component represent a Marker on the scrubber bar
 * @override
 * @class marker
 * @extends {Component}
 */
class Marker extends React.Component {
  /**
   * getStyles return an object with the final styles for the marker
   *
   * @returns
   * @memberof Marker
   * @returns {object} The object with the styles properties
   */
  getStyles() {
    const {
      data,
      config,
      accentColor,
      duration,
      scrubberBarWidth,
    } = this.props;

    const marker = Object.assign({}, config, data);
    const backgroundColor = marker.marker_color
      ? marker.marker_color
      : accentColor;
    return {
      left: getPosition(duration, scrubberBarWidth, data.start),
      width: getSize(duration, scrubberBarWidth, data.start, data.end),
      backgroundColor,
    };
  }

  shouldComponentUpdate = (nextProps) => {
    const { data, duration, scrubberBarWidth } = this.props;

    if (data.start !== nextProps.data.start
      || data.end !== nextProps.data.end
      || duration !== nextProps.duration
      || scrubberBarWidth !== nextProps.scrubberBarWidth) {
      return true;
    }
    return false;
  }

  render() {
    const { data } = this.props;
    if (!data.text || !data.type || !data.start) {
      return null;
    }
    return (
      <div style={this.getStyles()} className="oo-marker" />
    );
  }
}

Marker.propTypes = {
  duration: PropTypes.number,
  scrubberBarWidth: PropTypes.number,
  data: PropTypes.shape({
    type: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    text: PropTypes.string,
    icon_url: PropTypes.string,
    image_url: PropTypes.string,
    background_color: PropTypes.string,
    hover_color: PropTypes.string,
  }),
  config: PropTypes.shape({
    icon_url: PropTypes.string,
    background_color: PropTypes.string,
    hover_color: PropTypes.string,
  }),
  accentColor: PropTypes.string,
};

Marker.defaultProps = {
  duration: 0,
  scrubberBarWidth: 0,
  data: {},
  config: {},
  accentColor: '',
};

export default Marker;
