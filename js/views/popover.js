let React = require('react');
let Utils = require('../components/utils');
let CONSTANTS = require('../constants/constants');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let Popover = createReactClass({
  componentDidMount: function() {
    // We listen to the event on the document instead of the element in order to
    // allow closing the popover with ESC even when it doesn't have focus.
    document.addEventListener('keydown', this.onKeyDown);

    if (this.props.autoFocus) {
      Utils.autoFocusFirstElement(this.domElement);
    }
  },

  componentWillUnmount: function() {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  /**
   * Handles the keydown event on the document when the popover is active.
   * @private
   * @param {event} event description
   */
  onKeyDown: function(event) {
    if (!this.props.closeActionEnabled || typeof this.props.closeAction !== 'function') {
      return;
    }
    switch (event.which || event.keyCode) {
      case CONSTANTS.KEYCODES.ESCAPE_KEY:
        // Ask parent to restore the focus of the toggle button that triggers this
        // popover if the ESC key was pressed while the focus was inside this element.
        // If the focus was outside the popover we shouldn't re-focus the toggle button.
        var targetIsChildElement = this.domElement ? this.domElement.contains(event.target) : false;
        this.props.closeAction({
          restoreToggleButtonFocus: targetIsChildElement,
        });
        break;
      default:
        break;
    }
  },

  render: function() {
    return (
      <div
        ref={function(e) {
          this.domElement = e;
        }.bind(this)}
        className={this.props.popoverClassName}
      >
        {this.props.children}
      </div>
    );
  },
});

Popover.propTypes = {
  popoverClassName: PropTypes.string.isRequired,
  closeActionEnabled: PropTypes.bool,
  closeAction: PropTypes.func,
};

Popover.defaultProps = {
  popoverClassName: 'oo-popover',
  closeActionEnabled: false,
  closeAction: function() {},
};

module.exports = Popover;
