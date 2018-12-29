const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const CONSTANTS = require('../../constants/constants');

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
const preserveKeyboardFocus = function(ComposedComponent) {
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
      const domElement = ReactDOM.findDOMNode(this.composedComponentRef.current);
      this.tryRestoreFocusedControl(domElement);
    }

    /**
     * Searches for the currently focused control id store in the controller state
     * and attempts to find the element with that focus id among its children. If
     * found, the element is given focus.
     * @private
     * @param {domElement} HTMLElement The parent element that contains the element whose focus we need to restore
     */
    tryRestoreFocusedControl(domElement) {
      if (!domElement || !this.props.controller.state.focusedControl) {
        return;
      }
      const selector = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}="${this.props.controller.state.focusedControl}"]`;
      const control = domElement.querySelector(selector);

      if (control && typeof control.focus === 'function') {
        control.focus();
        // If we got to this point it means that play was triggered using the spacebar
        // (since a click would've cleared the focused element) and we need to
        // trigger control bar auto hide
        if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
          this.props.controller.startHideControlBarTimer();
        }
      }
    }

    /**
     * Focus event handler. Stores the focus id of the newly focused element on
     * the controller's state.
     * @private
     * @param {event} event The focus event object
     */
    onFocus(event) {
      let focusId;

      if (event.target) {
        focusId = event.target.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
      }
      if (focusId) {
        this.props.controller.setFocusedControl(focusId);
      }
      if (typeof this.props.onFocus === 'function') {
        this.props.onFocus(event);
      }
    }

    /**
     * Blur event handler. Clears the focused control state when keyboard focus
     * is removed.
     * @private
     * @param {event} event The blur event object
     */
    onBlur(event) {
      this.props.controller.setFocusedControl(null);

      if (typeof this.props.onBlur === 'function') {
        this.props.onBlur(event);
      }
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          ref={this.composedComponentRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {this.props.children}
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

  return PreserveKeyboardFocus;
};

module.exports = preserveKeyboardFocus;
