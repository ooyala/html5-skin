var React = require('react');
var ReactDOM = require('react-dom');
var CONSTANTS = require('../../constants/constants');

/**
 * Extends a Component with the ability to store its focused element id in the
 * controller state and to restore said element's focus after the Compoment is re-mounted.
 * This is mostly used for restoring keyboard focus after actions that cause components
 * to be unmounted and re-mounted, such as play/pause and moving to previous or next videos.
 *
 * Requirements:
 * Composed components must declare listeners for the onFocus and onBlur events.
 * @public
 * @param {Component} ComposedComponent The component to extend
 * @return {Component} A component extended with PreserveKeyboardFocus functionality
 */
var preserveKeyboardFocus = function(ComposedComponent) {

  var PreserveKeyboardFocus = React.createClass({
    /**
     * Stores a ref to the composed component.
     * @private
     * @param {Component} composedComponent The newly set ref
     */
    storeRef: function(composedComponent) {
      this.composedComponent = composedComponent;
    },

    /**
     * Fired when component has mounted. Attempts to restore focused control.
     * @private
     */
    componentDidMount: function() {
      this.domElement = ReactDOM.findDOMNode(this.composedComponent);
      this.tryRestoreFocusedControl();
    },

    /**
     * Searches for the currently focused control id store in the controller state
     * and attempts to find the element with that focus id among its children. If
     * found, the element is given focus.
     * @private
     */
    tryRestoreFocusedControl: function() {
      if (!this.domElement || !this.props.controller.state.focusedControl) {
        return;
      }
      var selector = '[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + '="' + this.props.controller.state.focusedControl + '"]';
      var control = this.domElement.querySelector(selector);

      if (control && typeof control.focus === 'function') {
        control.focus();
        // If we got to this point it means that play was triggered using the spacebar
        // (since a click would've cleared the focused element) and we need to
        // trigger control bar auto hide
        if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
          this.props.controller.startHideControlBarTimer();
        }
      }
    },

    /**
     * Focus event handler. Stores the focus id of the newly focused element on
     * the controller's state.
     * @private
     * @param {event} event The focus event object
     */
    onFocus: function(event) {
      var focusId;

      if (event.target) {
        focusId = event.target.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
      }
      if (focusId) {
        this.props.controller.state.focusedControl = focusId;
      }
      if (typeof this.props.onFocus === 'function') {
        this.props.onFocus(event);
      }
    },

    /**
     * Blur event handler. Clears the focused control state when keyboard focus
     * is removed.
     * @private
     * @param {event} event The blur event object
     */
    onBlur: function(event) {
      this.props.controller.state.focusedControl = null;

      if (typeof this.props.onBlur === 'function') {
        this.props.onBlur(event);
      }
    },

    render: function() {
      return (
        <ComposedComponent
          {...this.props}
          ref={this.storeRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}>
          {this.props.children}
        </ComposedComponent>
      );
    }

  });

  PreserveKeyboardFocus.propTypes = {
    playerState: React.PropTypes.string.isRequired,
    controller: React.PropTypes.shape({
      state: React.PropTypes.shape({
        focusedControl: React.PropTypes.string,
      }),
      startHideControlBarTimer: React.PropTypes.func.isRequired
    }),
  };

  return PreserveKeyboardFocus;
};

module.exports = preserveKeyboardFocus;
