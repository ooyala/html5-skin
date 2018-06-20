var React = require('react');
var ClassNames = require('classnames');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var AccessibleButton = createReactClass({
  getInitialState: function() {
    this.triggeredWithKeyboard = false;
    return {};
  },

  componentDidMount: function() {
    if (this.props.autoFocus) {
      this.focus();
    }
  },

  componentDidUpdate: function(prevProps) {
    var prevAutoFocus = prevProps ? prevProps.autoFocus : false;

    if (!prevAutoFocus && this.props.autoFocus) {
      this.focus();
    }
  },

  wasTriggeredWithKeyboard: function(triggeredWithKeyboard) {
    if (typeof triggeredWithKeyboard !== 'undefined') {
      this.triggeredWithKeyboard = !!triggeredWithKeyboard;
    }
    return this.triggeredWithKeyboard;
  },

  focus: function() {
    if (this.domElement && typeof this.domElement.focus === 'function') {
      this.domElement.focus();
    }
  },

  /**
   * Fires when a key is pressed on the button.
   * @private
   * @param {type} event The keydown event object.
   */
  onKeyDown: function(event) {
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.SPACE:
      case CONSTANTS.KEY_VALUES.ENTER:
      // Ctrl and Alt are needed as a workaround for VoiceOver, which uses the
      // CTRL + OPTION + SPACE combination to activate buttons. VoiceOver actually
      // suppresses the spacebar keyboard event when this combination is used, so we
      // can only detect either CTRL or OPTION. This can obviously fail if the user
      // presses a different key after CTRL + OPTION, but a false positive is preferred.
      case CONSTANTS.KEY_VALUES.CONTROL:
      case CONSTANTS.KEY_VALUES.ALT:
        this.triggeredWithKeyboard = true;
        break;
      default:
        break;
    }

    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(event);
    }
  },

  /**
   * Handles the mouseup event. Automatically removes keyboard focus
   * from the button and calls a custom mouseup handler if it was passed.
   * @private
   * @param {event} event The mouseup event object
   */
  onMouseUp: function(event) {
    Utils.blurOnMouseUp(event);

    if (typeof this.props.onMouseUp === 'function') {
      this.props.onMouseUp(event);
    }
  },

  render: function() {
    return (
      <button
        ref={function(e) {
          this.domElement = e;
        }.bind(this)}
        type="button"
        autoFocus={this.props.autoFocus}
        style={this.props.style}
        className={ClassNames(this.props.className, 'oo-focusable-btn')}
        tabIndex="0"
        data-focus-id={this.props.focusId}
        aria-label={this.props.ariaLabel}
        aria-checked={this.props.ariaChecked}
        aria-selected={this.props.ariaSelected}
        aria-haspopup={this.props.ariaHasPopup}
        aria-expanded={this.props.ariaExpanded}
        role={this.props.role}
        disabled={this.props.disabled}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.props.onKeyUp}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onFocus={this.props.onFocus}
        onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
});

AccessibleButton.propTypes = {
  autoFocus: PropTypes.bool,
  style: PropTypes.object,
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
  onClick: PropTypes.func
};

// Define focusId as a getter so that it returns a different value
// for each instance of AccessibleButton (defaultProps is static)
AccessibleButton.defaultProps = Object.create(
  {},
  {
    focusId: {
      enumerable: true,
      get: function() {
        return Math.random().toString(36).substr(2, 10);
      }
    }
  }
);

AccessibleButton.defaultProps.autoFocus = false;
AccessibleButton.defaultProps.ariaChecked = null;
AccessibleButton.defaultProps.ariaSelected = null;
AccessibleButton.defaultProps.ariaHasPopup = null;
AccessibleButton.defaultProps.ariaExpanded = null;
AccessibleButton.defaultProps.role = null;

module.exports = AccessibleButton;
