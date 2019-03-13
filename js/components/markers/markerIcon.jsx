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
    const { controller } = this.props;
    this.state = {
      hover: false,
    };
    this.isMobile = controller.state.isMobile;
  }

  // eslint-disable-next-line require-jsdoc-except/require-jsdoc
  shouldComponentUpdate(nextProps, nextState) {
    const { duration, scrubberBarWidth } = this.props;
    const { hover } = this.state;

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
      level,
    } = this.props;

    const { hover } = this.state;

    const marker = Object.assign({}, config, data);

    const hoverColor = marker.hoverColor ? marker.hoverColor : accentColor;

    const backgroundColor = marker.backgroundColor
      ? marker.backgroundColor
      : accentColor;

    const styles = {
      left: getPosition(duration, scrubberBarWidth, data.start),
      zIndex: hover ? CONSTANTS.MARKERS.ZINDEX : CONSTANTS.MARKERS.ZINDEX - level,
    };

    if (data.type === CONSTANTS.MARKERS.TYPE.TEXT) {
      styles.left -= hover ? CONSTANTS.MARKERS.OFFSET.TEXT_HOVER : CONSTANTS.MARKERS.OFFSET.TEXT;
      styles.backgroundColor = hover ? hoverColor : backgroundColor;
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
    const { data, config } = this.props;
    const { hover } = this.state;
    const marker = Object.assign({}, config, data);

    switch (marker.type) {
      case CONSTANTS.MARKERS.TYPE.TEXT: {
        if (!marker.text || marker.text.length === 0) {
          return null;
        }
        const truncatedText = marker.text.length <= CONSTANTS.MARKERS.MAXCHAR
          ? marker.text : marker.text.slice(0, CONSTANTS.MARKERS.MAXCHAR).concat(' ...');
        content = <p>{truncatedText}</p>;
        break;
      }
      case CONSTANTS.MARKERS.TYPE.ICON: {
        if (!marker.iconUrl || marker.iconUrl.length === 0) {
          return null;
        }
        const iconClass = classNames({
          'oo-hidden': hover && this.hasCoverImage(),
        });
        const coverImgClass = classNames({
          'oo-hidden': !hover && this.hasCoverImage(),
        });
        content = (
          <>
            <img className={iconClass} src={marker.iconUrl} alt={marker.text} />
            { this.hasCoverImage()
              && <img className={coverImgClass} src={marker.imageUrl} alt={marker.text} />}
          </>);
        break;
      }
      default:
        content = null;
        break;
    }

    return content;
  }

  onMarkerClick = () => {
    const { controller, data } = this.props;
    const { hover } = this.state;
    if (this.isMobile) {
      if (hover) {
        this.setState({ hover: false });
      } else {
        this.setState({ hover: true });
        return;
      }
    }
    controller.seek(data.start);
  }

  onMouseEnter = () => {
    if (!this.isMobile) {
      this.setState({ hover: true });
    }
  }

  onMouseLeave = () => {
    if (!this.isMobile) {
      this.setState({ hover: false });
    }
  }

  /**
   * hasCoverImage determine if the current marker has an image to show on the detail state
   *
   * @returns {boolean} truthy value of the image existence
   * @memberof MarkerIcon
   */
  hasCoverImage() {
    const { data, config } = this.props;
    const marker = Object.assign({}, config, data);
    return marker.imageUrl && marker.imageUrl !== '';
  }

  render() {
    const { data, scrubberBarWidth, duration } = this.props;
    const { hover } = this.state;

    const styles = this.getStyles();
    const markerClass = classNames({
      'oo-marker-bubble': true,
      [`oo-marker-${data.type || 'text'}`]: true,
      'oo-marker-expanded': hover && ((data.type === CONSTANTS.MARKERS.TYPE.ICON
        && this.hasCoverImage()) || data.type === CONSTANTS.MARKERS.TYPE.TEXT),
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
    iconUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    backgroundColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
  config: PropTypes.shape({
    iconUrl: PropTypes.string,
    backgroundColor: PropTypes.string,
    hoverColor: PropTypes.string,
  }),
  accentColor: PropTypes.string,
  controller: PropTypes.shape({
    seek: PropTypes.func,
    state: PropTypes.shape({
      isMobile: PropTypes.bool,
    }),
  }),
  level: PropTypes.number,
};

MarkerIcon.defaultProps = {
  duration: 0,
  scrubberBarWidth: 0,
  data: {},
  config: {},
  accentColor: '',
  controller: null,
  level: 0,
};

export default MarkerIcon;
