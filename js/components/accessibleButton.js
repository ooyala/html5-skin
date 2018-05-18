var React = require('react');
var ClassNames = require('classnames');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');

var AccessibleButton = React.createClass({
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
        onKeyDown={this.onKeyDown}
        onMouseUp={Utils.blurOnMouseUp}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onFocus={this.props.onFocus}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </button>
    );
  }
});

AccessibleButton.propTypes = {
  autoFocus: React.PropTypes.bool,
  style: React.PropTypes.object,
  className: React.PropTypes.string,
  focusId: React.PropTypes.string,
  ariaLabel: React.PropTypes.string.isRequired,
  ariaChecked: React.PropTypes.bool,
  ariaSelected: React.PropTypes.bool,
  ariaHasPopup: React.PropTypes.bool,
  ariaExpanded: React.PropTypes.bool,
  role: React.PropTypes.string,
  onMouseOver: React.PropTypes.func,
  onMouseOut: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onClick: React.PropTypes.func
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
