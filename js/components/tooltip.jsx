import React from 'react';
import deepmerge from 'deepmerge';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

const VERTICAL_OFFSET = 80;
const POINTER_ALIGNMENT = {
  left: '10%',
  center: '45%',
  right: '85%',
};

/**
 * The tooltip component
 */
class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.getAlignment = this.getAlignment.bind(this);

    this.element = null;
  }

  componentDidMount() {
    if (this.element) {
      const { parentElement } = this.element;
      parentElement.addEventListener('mouseover', this.showTooltip);
      parentElement.addEventListener('mouseleave', this.hideTooltip);
      parentElement.addEventListener('focus', this.showTooltip);
      parentElement.addEventListener('blur', this.hideTooltip);
    }
  }

  componentWillUnmount() {
    if (this.element) {
      const { parentElement } = this.element;
      parentElement.removeEventListener('mouseover', this.showTooltip);
      parentElement.removeEventListener('mouseleave', this.hideTooltip);
      parentElement.removeEventListener('focus', this.showTooltip);
      parentElement.removeEventListener('blur', this.hideTooltip);
    }
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
  static getContainerStyle(bottom, visible, responsivenessMultiplier, alignment) {
    const verticalAlignment = VERTICAL_OFFSET * responsivenessMultiplier;
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
  static getBoxStyle(responsivenessMultiplier) {
    return {
      borderRadius: '3px',
      fontSize: '15px',
      textShadow: 'none',
      background: 'black',
      /* eslint-disable no-magic-numbers */
      paddingTop: 8 * responsivenessMultiplier,
      paddingRight: 20 * responsivenessMultiplier,
      paddingBottom: 8 * responsivenessMultiplier,
      paddingLeft: 20 * responsivenessMultiplier,
      /* eslint-enable no-magic-numbers */
    };
  }

  /**
   * Get the style of the pointer
   * @param {string} alignment - the alignment of a tooltip
   * @returns {Object} the CSS object
   */
  static getPointerStyle(alignment) {
    return {
      position: 'absolute',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid black',
      left: POINTER_ALIGNMENT[alignment],
    };
  }

  /**
   * Change visiblity on mouse out
   */
  hideTooltip() {
    this.setState({ visible: false });
  }

  /**
   * Change visiblity on mouse over
   */
  showTooltip() {
    this.setState({ visible: true });
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
      <div
        className="oo-tooltip-container"
        style={{ position: 'relative' }}
        ref={(node) => { this.element = node; }}
      >
        <div
          className="oo-tooltip"
          style={this.constructor.getContainerStyle(
            bottom,
            visible,
            responsivenessMultiplier,
            alignment
          )}
        >
          <div style={this.constructor.getBoxStyle(responsivenessMultiplier)}>
            {Utils.getLocalizedString(
              language,
              text,
              localizableStrings
            )}
          </div>
          <div style={this.constructor.getPointerStyle(alignment)} />
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
