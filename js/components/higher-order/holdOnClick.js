var React = require('react');
var CONSTANTS = require('../../constants/constants');

/**
 * Extends a button component with the ability to periodically call the onClick
 * handler while the button is being held down. Allows this behavior with both regular
 * mouse click as well as with the Space and Enter keys.
 * @public
 * @param {Component} ComposedComponent The React component to extend.
 * The component must support adding handlers the following events: click, keydown, mousedown, mouseup
 * @return {Component} A new component that supports holding the onClick handler
 */
var holdOnClick = function(ComposedComponent) {

  var CLICK_HOLD_START_DELAY = 500;
  var CLICK_HOLD_FREQUENCY = 100;

  var HoldOnClick = React.createClass({

    /**
     * Mostly for initializing member variables.
     * @private
     * @return {object} The initial React state of the component
     */
    getInitialState: function() {
      this.startTimer = null;
      this.repeatTimer = null;
      return {};
    },

    /**
     * Cleanup when component is unmounted.
     * @private
     */
    componentWillUnmount: function() {
      this.releaseClick();
    },

    /**
     * Handler for the keydown event. Calls the onClick handler for Enter and
     * Space keys. Note that the keydown event has the "hold down to continue triggering"
     * behavior that we want by default, so there's not need to use timers when using the keyboard.
     * @private
     * @param {event} event The keydown event object
     */
    onKeyDown: function(event) {
      switch (event.key) {
        case CONSTANTS.KEY_VALUES.SPACE:
        case CONSTANTS.KEY_VALUES.ENTER:
          this.props.onClick();
          break;
      }
    },

    /**
     * Handler for the mousedown event which calls the onClick handler and starts
     * a timer that will enable calling onClick periodically unless the button is
     * released before the timer callback.
     * @private
     * @param {event} event The mousedown event object
     */
    onMouseDown: function(event) {
      this.props.onClick();
      this.queueHoldClick(true);
    },

    /**
     * Starts a timer that will begin calling the onClick handling repeatedly after
     * a certain amount of time. This delay is needed in order to prevent the user
     * from triggering multiple onClick events accidentally with just a single click.
     * @private
     */
    queueHoldClick: function() {
      clearTimeout(this.startTimer);
      this.startTimer = setTimeout(this.holdClick, CLICK_HOLD_START_DELAY);
    },

    /**
     * Recursively starts a timer that calls the onClick handler periodically.
     * @private
     */
    holdClick: function() {
      clearTimeout(this.repeatTimer);

      this.repeatTimer = setTimeout(function() {
        this.props.onClick();
        this.holdClick();
      }.bind(this), CLICK_HOLD_FREQUENCY);
    },

    /**
     * Clears timers and stops calling the onClick handler periodically.
     * @private
     */
    releaseClick: function() {
      clearTimeout(this.startTimer);
      this.startTimer = null
      clearTimeout(this.repeatTimer);
      this.repeatTimer = null;
    },

    render: function() {
      return (
        <ComposedComponent
          {...this.props}
          onClick={null}
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.releaseClick}>
          {this.props.children}
        </ComposedComponent>
      );
    }

  });

  HoldOnClick.propTypes = {
    onClick: React.PropTypes.func.isRequired
  };

  return HoldOnClick;
};

module.exports = holdOnClick;
