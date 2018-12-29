import React from 'react';
import PropTypes from 'prop-types';
import Utils from '../components/utils';
import CONSTANTS from '../constants/constants';
/* eslint-disable react/destructuring-assignment */
/* global document */

/**
 * Popover element
 */
class Popover extends React.Component {
  componentDidMount() {
    // We listen to the event on the document instead of the element in order to
    // allow closing the popover with ESC even when it doesn't have focus.
    document.addEventListener('keydown', this.onKeyDown);

    if (this.props.autoFocus) {
      Utils.autoFocusFirstElement(this.domElement);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  /**
   * Handles the keydown event on the document when the popover is active.
   * @private
   * @param {event} event description
   */
  onKeyDown(event) {
    if (!this.props.closeActionEnabled || typeof this.props.closeAction !== 'function') {
      return;
    }
    if (event.which === CONSTANTS.KEYCODES.ESCAPE_KEY || event.keyCode === CONSTANTS.KEYCODES.ESCAPE_KEY) {
      // Ask parent to restore the focus of the toggle button that triggers this
      // popover if the ESC key was pressed while the focus was inside this element.
      // If the focus was outside the popover we shouldn't re-focus the toggle button.
      const targetIsChildElement = this.domElement ? this.domElement.contains(event.target) : false; // eslint-disable-line
      this.props.closeAction({
        restoreToggleButtonFocus: targetIsChildElement,
      });
    }
  }

  render() {
    return (
      <div
        ref={(error) => { this.domElement = error; }}
        className={this.props.popoverClassName}
      >
        {this.props.children}
      </div>
    );
  }
}

Popover.propTypes = {
  autoFocus: PropTypes.bool,
  popoverClassName: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  closeActionEnabled: PropTypes.bool,
  closeAction: PropTypes.func,
};

Popover.defaultProps = {
  autoFocus: false,
  popoverClassName: 'oo-popover',
  closeActionEnabled: false,
  closeAction() {},
};

module.exports = Popover;
