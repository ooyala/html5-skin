/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getPosition } from './helpers';
import CONSTANTS from '../../constants/constants';

/**
 * This represents a marker icon that will be displayed on top of the
 * scubber bar
 * @override
 * @class markerIcon
 * @extends {Component}
 */
class MarkerIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  // eslint-disable-next-line require-jsdoc-except/require-jsdoc
  shouldComponentUpdate(nextProps, nextState) {
    const { data, duration, scrubberBarWidth } = this.props;
    const { hover } = this.state;

    if (data.start !== nextProps.data.start) {
      return true;
    }

    if (duration !== nextProps.duration) {
      return true;
    }

    if (scrubberBarWidth !== nextProps.scrubberBarWidth) {
      return true;
    }

    if (hover !== nextState.hover) {
      return true;
    }

    return false;
  }

  /**
   * getStyles return an object with the final styles for the marker
   *
   * @returns
   * @memberof Marker
   * @returns {object} The object with the styles properties
   */
  getStyles() {
    const {
      duration,
      scrubberBarWidth,
      data,
      config,
      accentColor,
    } = this.props;

    const { hover } = this.state;

    const hoverColor = data.hover_color ? data.hover_color : accentColor;

    const backgroundColor = data.background_color
      ? data.background_color
      : accentColor;

    const marker = Object.assign({}, config, data);
    const styles = {
      left: getPosition(duration, scrubberBarWidth, data.start),
      zIndex: hover ? CONSTANTS.MARKERS.ZINDEX : CONSTANTS.MARKERS.ZINDEX - marker.index,
      backgroundColor: hover ? hoverColor : backgroundColor,
    };

    if (data.type === CONSTANTS.MARKERS.TYPE.TEXT) {
      styles.left -= hover ? CONSTANTS.MARKERS.OFFSET.TEXT_HOVER : CONSTANTS.MARKERS.OFFSET.TEXT;
    }

    if (data.type === CONSTANTS.MARKERS.TYPE.ICON) {
      styles.left -= hover && this.hasCoverImage()
        ? CONSTANTS.MARKERS.OFFSET.ICON_HOVER : CONSTANTS.MARKERS.OFFSET.ICON;
    }
    return styles;
  }

  /**
   * getContent return the stateless component to be rendered inside the markerIcon container
   *
   * @returns {object} statless component that represent the content by Type
   * @memberof MarkerIcon
   */
  getContent() {
    let content;
    const { data } = this.props;
    const { hover } = this.state;

    switch (data.type) {
      case CONSTANTS.MARKERS.TYPE.TEXT: {
        const truncatedText = data.text.length <= CONSTANTS.MARKERS.MAXCHAR
          ? data.text : data.text.slice(0, CONSTANTS.MARKERS.MAXCHAR).concat(' ...');
        if (!data.text || data.text.length === 0) {
          return null;
        }
        content = <p>{truncatedText}</p>;
        break;
      }
      case CONSTANTS.MARKERS.TYPE.ICON: {
        const iconClass = classNames({
          'oo-hidden': hover && this.hasCoverImage(),
        });
        const coverImgClass = classNames({
          'oo-hidden': !hover && this.hasCoverImage(),
        });
        content = (
          <>
            <img className={iconClass} src={data.icon_url} alt={data.text} />
            { this.hasCoverImage() && <img className={coverImgClass} src={data.image_url} alt={data.text} />}
          </>);
        break;
      }
      default:
        content = (<div />);
        break;
    }

    return content;
  }

  onMarkerClick = () => {
    const { controller, data } = this.props;
    controller.seek(data.start);
  }

  onMouseEnter = () => {
    this.setState({ hover: true });
  }

  onMouseLeave = () => {
    this.setState({ hover: false });
  }

  /**
   * hasCoverImage determine if the current marker has an image to show on the detail state
   *
   * @returns {boolean} truthy value of the image existence
   * @memberof MarkerIcon
   */
  hasCoverImage() {
    const { data } = this.props;
    return data.image_url && data.image_url !== '';
  }

  render() {
    const { data, scrubberBarWidth, duration } = this.props;
    const { hover } = this.state;

    const styles = this.getStyles();
    const markerClass = classNames({
      'oo-marker-bubble': true,
      [`oo-marker-${data.type || 'text'}`]: true,
      'oo-marker-expanded': hover && data.type === CONSTANTS.MARKERS.TYPE.ICON && this.hasCoverImage(),
    });

    const content = this.getContent();
    if (!duration || !scrubberBarWidth || !content) {
      return null;
    }

    return (
      <div
        style={styles}
        className={markerClass}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onMarkerClick}
      >
        {content}
      </div>
    );
  }
}

MarkerIcon.propTypes = {
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
  controller: PropTypes.shape,
};

MarkerIcon.defaultProps = {
  duration: 0,
  scrubberBarWidth: 0,
  data: {},
  config: {},
  accentColor: '',
  controller: {},
};

export default MarkerIcon;
