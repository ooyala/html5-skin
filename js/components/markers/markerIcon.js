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

class markerIcon extends Component {
  constructor(props) {
    super(props);

  }

  // componentWillMount() {}
  // componentDidMount() {}
  // componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.data.start !== nextProps.data.start) {
      return true;
    }

    if (this.props.duration !== nextProps.duration) {
      return true;
    }

    if (this.props.scrubberBarWidth !== nextProps.scrubberBarWidth) {
      return true;
    }

    return false;
  }
  // componentWillUpdate(nextProps, nextState) {}
  // componentDidUpdate(prevProps, prevState) {}
  // componentWillUnmount() {}

  getStyles() {
    let duration = this.props.duration;
    let width = this.props.scrubberBarWidth;
    let start = this.props.data.start;
    return {
      left: getPosition(duration, width, start),
      backgroundColor: "red"
    }
  }

  getContent() {
    let content;
    switch (this.props.data.type) {
      case TYPES.TEXT:
        content = (
          <p className="oo-text-truncate">{this.props.data.text || "Here's the label tooooo long"}</p>
        );
        break;

      default:
        content = (<div/>);
        break;
    }

    return content;
  }

  render() {
    let styles = this.getStyles();
    let markerClass = classNames({
      'oo-marker-bubble': true,
      [`oo-marker-${this.props.data.type || 'text'}`]: true
    })

    let content = this.getContent();

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