import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

/**
 * The button that satisfies to accessibility requirements
 */
class AccessibleButton extends React.Component {
  constructor(props) {
    super(props);
    this.triggeredWithKeyboard = false;
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    if (autoFocus) {
      this.focus();
    }
  }

  /**
   * Focus on element in case of new props
   * @param {Object} prevProps – prevProps
   */
  componentDidUpdate(prevProps) {
    const { autoFocus } = this.props;
    const prevAutoFocus = prevProps ? prevProps.autoFocus : false;
    if (!prevAutoFocus && autoFocus) {
      this.focus();
    }
  }

  /**
   * Fires when a key is pressed on the button.
   * @private
   * @param {type} event The keydown event object.
   */
  onKeyDown = (event) => {
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.SPACE:
      case CONSTANTS.KEY_VALUES.ENTER:
      // Ctrl and Alt are needed as a workaround for VoiceOver, which uses the
      // CTRL + OPTION + SPACE combination to activate buttons. VoiceOver actually
      // suppresses the spacebar keyboard event when this combination is used, so we
      // can only detect either CTRL or OPTION. This can obviously fail if the user
      // presses a different key after CTRL + OPTION, but a false positive is preferred.
      case CONSTANTS.KEY_VALUES.CONTROL: // eslint-disable-line
      case CONSTANTS.KEY_VALUES.ALT:
        this.triggeredWithKeyboard = true;
        break;
      default:
        break;
    }
    const { onKeyDown } = this.props;
    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
    }
  }

  /**
   * Handles the mouseup event. Automatically removes keyboard focus
   * from the button and calls a custom mouseup handler if it was passed.
   * @private
   * @param {event} event The mouseup event object
   */
  onMouseUp = (event) => {
    Utils.blurOnMouseUp(event);
    const { onMouseUp } = this.props;
    if (typeof onMouseUp === 'function') {
      onMouseUp(event);
    }
  }

  /**
   * Define how event has been triggered
   * @param {boolean} triggeredWithKeyboard – prev parameter
   * @returns {boolean} result of definition
   */
  wasTriggeredWithKeyboard = (triggeredWithKeyboard) => {
    if (typeof triggeredWithKeyboard !== 'undefined') {
      this.triggeredWithKeyboard = !!triggeredWithKeyboard;
    }
    return this.triggeredWithKeyboard;
  }

  /**
   * Focus on current domElement
   */
  focus = () => {
    if (this.domElement && typeof this.domElement.focus === 'function') {
      this.domElement.focus();
    }
  }

  render() {
    const {
      autoFocus,
      children,
      style,
      className,
      focusId,
      ariaLabel,
      ariaChecked,
      ariaSelected,
      ariaHasPopup,
      ariaExpanded,
      role,
      disabled,
      onKeyUp,
      onMouseDown,
      onMouseOver,
      onMouseOut,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onClick,
    } = this.props;
    return (
      <button // eslint-disable-line
        ref={(event) => {
          this.domElement = event;
        }}
        type="button"
        autoFocus={autoFocus} // eslint-disable-line
        style={style}
        className={ClassNames(className, 'oo-focusable-btn')}
        tabIndex="0"
        data-focus-id={focusId}
        aria-label={ariaLabel}
        aria-checked={ariaChecked}
        aria-selected={ariaSelected}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        role={role}
        disabled={disabled}
        onKeyDown={this.onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}

AccessibleButton.propTypes = {
  autoFocus: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.shape({}),
  className: PropTypes.string,
  focusId: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
  ariaChecked: PropTypes.bool,
  ariaSelected: PropTypes.bool,
  ariaHasPopup: PropTypes.bool,
  ariaExpanded: PropTypes.bool,
  role: PropTypes.string,
  disabled: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
};

// Define focusId as a getter so that it returns a different value
// for each instance of AccessibleButton (defaultProps is static)
const hashLength = 36;
const sliceStart = 2;
const sliceEnd = 10;
AccessibleButton.defaultProps = Object.create(
  {},
  {
    focusId: {
      enumerable: true,
      get() {
        return Math.random().toString(hashLength).substr(sliceStart, sliceEnd);
      },
    },
  }
);

AccessibleButton.defaultProps.children = [];
AccessibleButton.defaultProps.autoFocus = false;
AccessibleButton.defaultProps.ariaChecked = null;
AccessibleButton.defaultProps.ariaSelected = null;
AccessibleButton.defaultProps.ariaHasPopup = null;
AccessibleButton.defaultProps.ariaExpanded = null;
AccessibleButton.defaultProps.role = null;

module.exports = AccessibleButton;
