import React from 'react';
import ReactDOM from 'react-dom';
import deepmerge from 'deepmerge';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

/**
 * The tooltip component
 */
class Tooltip extends React.Component {
  verticalOffset = 80; // eslint-disable-line

  pointerAlignment = {
    left: '10%',
    center: '45%',
    right: '85%',
  };

  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.getAlignment = this.getAlignment.bind(this);
  }

  componentDidMount() {
    this.parentElement = (ReactDOM.findDOMNode(this) || {}).parentElement; // eslint-disable-line
    if (this.parentElement) {
      this.parentElement.addEventListener('mouseover', this.onMouseOver);
      this.parentElement.addEventListener('mouseleave', this.onMouseLeave);
    }
  }

  componentWillUnmount() {
    if (this.parentElement) {
      this.parentElement.removeEventListener('mouseover', this.onMouseOver);
      this.parentElement.removeEventListener('mouseleave', this.onMouseLeave);
    }
  }

  /**
   * Change visiblity on mouse over
   */
  onMouseOver() {
    this.setState({ visible: true });
  }

  /**
   * Change visiblity on mouse out
   */
  onMouseLeave() {
    this.setState({ visible: false });
  }

  /**
   * return the alignment
   * @returns {string} the alignment
   */
  getAlignment() {
    const { getAlignment, parentKey } = this.props;
    if (typeof getAlignment === 'function') {
      return getAlignment(parentKey) || CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
    }
    return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
  }

  /**
   * Build the container style
   * @param {string} bottom - the bottom position
   * @param {boolean} visible - if the container is visible
   * @param {number} responsivenessMultiplier - the multiplier of a responsive design
   * @param {string} alignment - the alignment
   * @returns {Object} the CSS object
   */
  getContainerStyle(bottom, visible, responsivenessMultiplier, alignment) {
    const verticalAlignment = this.verticalOffset * responsivenessMultiplier;
    const alignmentStyle = {
      left: {
        left: 0,
        transform: `translate(0,${verticalAlignment}%)`,
        WebkitTransform: `translate(0,${verticalAlignment}%)`,
      },
      center: {
        left: '50%',
        transform: `translate(-50%,${verticalAlignment}%)`,
        WebkitTransform: `translate(-50%,${verticalAlignment}%)`,
      },
      right: {
        right: 0,
        transform: `translate(0,${verticalAlignment}%)`,
        WebkitTransform: `translate(0,${verticalAlignment}%)`,
      },
    };

    const style = {
      position: 'absolute',
      color: 'white',
      fontFamily: '"Roboto Condensed", sans-serif',
      opacity: visible ? '0.75' : '0',
      fontWeight: 'normal',
      bottom,
      transition: '1s',
      visibility: visible ? 'visible' : 'hidden',
    };

    return deepmerge(alignmentStyle[alignment], style);
  }

  /**
   * Build the CSS style of a bounding box
   * @param {number} responsivenessMultiplier - the multiplier of a responsive design
   * @returns {Object} the CSS object
   */
  getBoxStyle(responsivenessMultiplier) { // eslint-disable-line
    return {
      borderRadius: '3px',
      fontSize: '15px',
      textShadow: 'none',
      background: 'black',
      paddingTop: 8 * responsivenessMultiplier, // eslint-disable-line
      paddingRight: 20 * responsivenessMultiplier, // eslint-disable-line
      paddingBottom: 8 * responsivenessMultiplier, // eslint-disable-line
      paddingLeft: 20 * responsivenessMultiplier, // eslint-disable-line
    };
  }

  /**
   * Get the style of the pointer
   * @param {string} alignment - the alignment of a tooltip
   * @returns {Object} the CSS object
   */
  getPointerStyle(alignment) {
    return {
      position: 'absolute',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid black',
      left: this.pointerAlignment[alignment],
    };
  }

  render() {
    const {
      bottom,
      enabled,
      language,
      localizableStrings,
      responsivenessMultiplier,
      text,
    } = this.props;
    const { visible } = this.state;
    if (!enabled) {
      return null;
    }
    const alignment = this.getAlignment();

    return (
      <div className="oo-tooltip-container" style={{ position: 'relative' }}>
        <div
          className="oo-tooltip"
          style={this.getContainerStyle(
            bottom,
            visible,
            responsivenessMultiplier,
            alignment
          )}
        >
          <div style={this.getBoxStyle(responsivenessMultiplier)}>
            {Utils.getLocalizedString(
              language,
              text,
              localizableStrings
            )}
          </div>
          <div style={this.getPointerStyle(alignment)} />
        </div>
      </div>
    );
  }
}

Tooltip.propTypes = {
  enabled: PropTypes.bool,
  parentKey: PropTypes.string.isRequired,
  text: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  getAlignment: PropTypes.func,
  responsivenessMultiplier: PropTypes.number,
  bottom: PropTypes.number,
};

Tooltip.defaultProps = {
  enabled: false,
  getAlignment: () => {},
  text: '',
  language: 'en',
  localizableStrings: {},
  responsivenessMultiplier: 1,
  bottom: 0,
};

module.exports = Tooltip;
