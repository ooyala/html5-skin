const React = require('react');
const ReactDOM = require('react-dom');
const deepmerge = require('deepmerge');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');

const verticalOffset = 80;
function getContainerStyle(bottom, visible, responsivenessMultiplier, alignment) {
  const verticalAlignment = verticalOffset * responsivenessMultiplier;
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

function getBoxStyle(responsivenessMultiplier) {
  return {
    borderRadius: '3px',
    fontSize: '15px',
    textShadow: 'none',
    background: 'black',
    paddingTop: 8 * responsivenessMultiplier,
    paddingRight: 20 * responsivenessMultiplier,
    paddingBottom: 8 * responsivenessMultiplier,
    paddingLeft: 20 * responsivenessMultiplier,
  };
}

const pointerAlignment = {
  left: '10%',
  center: '45%',
  right: '85%',
};
function getPointerStyle(alignment) {
  return {
    position: 'absolute',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid black',
    left: pointerAlignment[alignment],
  };
}

const Tooltip = createReactClass({
  componentDidMount() {
    this.parentElement = (ReactDOM.findDOMNode(this) || {}).parentElement;
    if (this.parentElement) {
      this.parentElement.addEventListener('mouseover', this.onMouseOver);
      this.parentElement.addEventListener('mouseleave', this.onMouseLeave);
    }
  },

  componentWillUnmount() {
    if (this.parentElement) {
      this.parentElement.removeEventListener('mouseover', this.onMouseOver);
      this.parentElement.removeEventListener('mouseleave', this.onMouseLeave);
    }
  },

  getAlignment() {
    if (typeof this.props.getAlignment === 'function') {
      return this.props.getAlignment(this.props.parentKey) || CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
    }
    return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
  },

  render() {
    if (this.props.enabled) {
      const alignment = this.getAlignment();

      return (
        <div className="oo-tooltip-container" style={{ position: 'relative' }}>
          <div
            className="oo-tooltip"
            style={getContainerStyle(
              this.props.bottom,
              this.state.visible,
              this.props.responsivenessMultiplier,
              alignment
            )}
          >
            <div style={getBoxStyle(this.props.responsivenessMultiplier)}>
              {Utils.getLocalizedString(
                this.props.language,
                this.props.text,
                this.props.localizableStrings
              )}
            </div>
            <div style={getPointerStyle(alignment)} />
          </div>
        </div>
      );
    }
    return null;
  },

  getInitialState() {
    return { visible: false };
  },

  onMouseOver() {
    this.setState({ visible: true });
  },

  onMouseLeave() {
    this.setState({ visible: false });
  },
});

Tooltip.propTypes = {
  enabled: PropTypes.bool.isRequired,
  parentKey: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
  getAlignment: PropTypes.func,
  responsivenessMultiplier: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
};

Tooltip.defaultProps = {
  enabled: false,
  text: '',
  language: 'en',
  responsivenessMultiplier: 1,
  bottom: 0,
};

module.exports = Tooltip;
