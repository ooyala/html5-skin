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
  ICON: 16
}

class markerIcon extends Component {
  constructor(props) {
    super(props);

  }

  // componentWillMount() {}
  // componentDidMount() {}
  // componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    const {
      data,
      duration,
      scrubberBarWidth
    } = this.props;

    if (data.start !== nextProps.data.start) {
      return true;
    }

    if (duration !== nextProps.duration) {
      return true;
    }

    if (scrubberBarWidth !== nextProps.scrubberBarWidth) {
      return true;
    }

    return false;
  }
  // componentWillUpdate(nextProps, nextState) {}
  // componentDidUpdate(prevProps, prevState) {}
  // componentWillUnmount() {}

  getStyles() {
    let styles;
    let marker;
    const {
      duration,
      scrubberBarWidth,
      data,
      config,
      accentColor
    } = this.props;

    marker = Object.assign({}, config, data);
    styles = {
      left: getPosition(duration, scrubberBarWidth, data.start)
    };

    if (data.type === TYPES.TEXT) {
      styles.left -= OFFSET.TEXT;
      styles.backgroundColor = marker.marker_color ? marker.marker_color : accentColor;
      styles.borderTopColor = marker.marker_color ? marker.marker_color : accentColor;
    }

    if (data.type === TYPES.ICON) {
      styles.left -= OFFSET.ICON;
    }
    return styles;
  }

  getContent() {
    let content;
    const {
      data
    } = this.props;

    switch (data.type) {
      case TYPES.TEXT:
        content = (
          <p className="oo-text-truncate">{data.text || "Here's the label tooooo long"}</p>
        );
        break;
      case TYPES.ICON:
        content = (
          <img src={data.url} alt={data.text}/>
        );
        break;

      default:
        content = (<div/>);
        break;
    }

    return content;
  }

  render() {
    const {
      data,
      scrubberBarWidth,
      duration
    } = this.props;

    let styles = this.getStyles();
    let markerClass = classNames({
      'oo-marker-bubble': true,
      [`oo-marker-${data.type || 'text'}`]: true
    })

    let content = this.getContent();
    if (!duration  || !scrubberBarWidth) {
      return null;
    }

    

    return (
      <div style={styles} className={markerClass}>
        {content}
      </div>
    )
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