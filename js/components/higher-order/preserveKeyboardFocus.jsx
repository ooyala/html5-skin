import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants/constants';

/**
 * Extends a Component with the ability to store its focused element id in the
 * controller state and to restore said element's focus after the Component is re-mounted.
 * This is mostly used for restoring keyboard focus after actions that cause components
 * to be unmounted and re-mounted, such as play/pause and moving to previous or next videos.
 *
 * Requirements:
 * Composed components must declare listeners for the onFocus and onBlur events.
 * @public
 * @param {Component} ComposedComponent The component to extend
 * @returns {Component} A component extended with PreserveKeyboardFocus functionality
 */
const preserveKeyboardFocus = (ComposedComponent) => {
  /**
   * The extension itself
   */
  class PreserveKeyboardFocus extends React.Component {
    constructor(props) {
      super(props);
      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.composedComponentRef = React.createRef();
    }

    /**
     * Fired when component has mounted. Attempts to restore focused control.
     * @private
     */
    componentDidMount() {
      // eslint-disable-next-line react/no-find-dom-node
      const domElement = ReactDOM.findDOMNode(this.composedComponentRef.current);
      this.tryRestoreFocusedControl(domElement);
    }

    /**
     * Blur event handler. Clears the focused control state when keyboard focus
     * is removed.
     * @private
     * @param {event} event The blur event object
     */
    onBlur(event) {
      const { controller, onBlur } = this.props;
      controller.setFocusedControl(null);
      if (typeof onBlur === 'function') {
        onBlur(event);
      }
    }

    /**
     * Focus event handler. Stores the focus id of the newly focused element on
     * the controller's state.
     * @private
     * @param {event} event The focus event object
     */
    onFocus(event) {
      const { controller, onFocus } = this.props;
      const focusId = event.target ? event.target.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR) : undefined;
      if (focusId) {
        controller.setFocusedControl(focusId);
      }
      if (typeof onFocus === 'function') {
        onFocus(event);
      }
    }

    /**
     * Searches for the currently focused control id store in the controller state
     * and attempts to find the element with that focus id among its children. If
     * found, the element is given focus.
     * @private
     * @param {domElement} domElement The parent element that contains the element whose focus we need to restore
     */
    tryRestoreFocusedControl(domElement) {
      const { controller, playerState } = this.props;
      if (!domElement || !controller.state.focusedControl) {
        return;
      }
      const selector = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}="${controller.state.focusedControl}"]`;
      const control = domElement.querySelector(selector);

      if (control && typeof control.focus === 'function') {
        control.focus();
        // If we got to this point it means that play was triggered using the spacebar
        // (since a click would've cleared the focused element) and we need to
        // trigger control bar auto hide
        if (playerState === CONSTANTS.STATE.PLAYING) {
          controller.startHideControlBarTimer();
        }
      }
    }

    render() {
      const { children } = this.props;
      return (
        <ComposedComponent
          {...this.props}
          ref={this.composedComponentRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {children}
        </ComposedComponent>
      );
    }
  }

  PreserveKeyboardFocus.propTypes = {
    playerState: PropTypes.string,
    controller: PropTypes.shape({
      state: PropTypes.shape({
        focusedControl: PropTypes.string,
      }),
      setFocusedControl: PropTypes.func.isRequired,
      startHideControlBarTimer: PropTypes.func.isRequired,
    }),
  };

  PreserveKeyboardFocus.defaultProps = {
    playerState: CONSTANTS.STATE.PAUSE,
    controller: { state: { focusedControl: undefined } },
  };

  return PreserveKeyboardFocus;
};

module.exports = preserveKeyboardFocus;
