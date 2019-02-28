import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getPosition, getSize} from './helpers';
import classNames from 'classnames';

const TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  ICON: 'icon',
  TEXT_IMAGE: 'textImage',
  TEXT_ICON: 'textIcon'
}

const OFFSET = {
  TEXT: 35,
  ICON: 16,
  TEXT_HOVER: 70,
  ICON_HOVER: 70
}

const ZINDEX = 12000;

class markerIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      text: props.data.text
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {data, duration, scrubberBarWidth} = this.props;

    if (data.start !== nextProps.data.start) {
      return true;
    }

    if (duration !== nextProps.duration) {
      return true;
    }

    if (scrubberBarWidth !== nextProps.scrubberBarWidth) {
      return true;
    }

    if (this.state.hover !== nextState.hover) {
      return true;
    }

    return false;
  }

  getStyles() {
    let styles;
    let marker;
    const {duration, scrubberBarWidth, data, config, accentColor} = this.props;

    const hoverColor = data.hover_color ? data.hover_color : accentColor;

    const backgroundColor = data.background_color
      ? data.background_color
      : accentColor;

    const opacity = data.opacity
      ? data.opacity
      : 0.5;

    marker = Object.assign({}, config, data);
    styles = {
      left: getPosition(duration, scrubberBarWidth, data.start),
      zIndex: this.state.hover
        ? ZINDEX
        : ZINDEX - marker.index,
      backgroundColor: this.state.hover
        ? hoverColor
        : backgroundColor
    };

    if (data.type === TYPES.TEXT) {
      styles.left -= this.state.hover ? OFFSET.TEXT_HOVER : OFFSET.TEXT;
    }

    if (data.type === TYPES.ICON) {
      styles.left -= this.state.hover && this.hasCoverImage() ? OFFSET.ICON_HOVER : OFFSET.ICON;
    }
    return styles;
  }

  hasCoverImage () {
    const {data} = this.props;
    return data.image_url && data.image_url !== '';
  }

  getContent() {
    let content;
    const {data} = this.props;

    switch (data.type) {
      case TYPES.TEXT:
        content = (
          <p>{data.text}</p>
        );
        break;
      case TYPES.ICON:
        let iconClass = classNames({
          'oo-hidden': this.state.hover && this.hasCoverImage()
        });
        let coverImgClass = classNames({
          'oo-hidden': !this.state.hover && this.hasCoverImage()
        });
        content = (
          <>
            <img className={iconClass} src={data.icon_url} alt={data.text}/>
            { this.hasCoverImage() &&
            <img className={coverImgClass} src={data.image_url} alt={data.text}/>}
          </>);
        break;

      default:
        content = (<div/>);
        break;
    }

    return content;
  }

  onMarkerClick = () => {
    const {controller, data} = this.props;
    controller.seek(data.start);
  }

  onMouseEnter = (event) => {
    this.setState({hover: true});
  }

  onMouseLeave = (event) => {
    this.setState({hover: false});
  }

  render() {
    const {data, scrubberBarWidth, duration} = this.props;

    let styles = this.getStyles();
    let markerClass = classNames({
      "oo-marker-bubble": true,
      [`oo-marker-${data.type || "text"}`]: true,
      'oo-marker-expanded': this.state.hover && data.type === TYPES.ICON && this.hasCoverImage()
    });

    let content = this.getContent();
    if (!duration || !scrubberBarWidth) {
      return null;
    }

    return (
      <div
        style={styles}
        className={markerClass}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onMarkerClick}>
        {content}
      </div>
    );
  }
}

markerIcon.propTypes = {
  duration: PropTypes.number,
  scrubberBarWidth: PropTypes.number
};

markerIcon.defaultProps = {
  duration: 0,
  scrubberBarWidth: 0
}

export default markerIcon;