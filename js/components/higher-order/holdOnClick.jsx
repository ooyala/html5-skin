import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants/constants';

/**
 * Extends a button component with the ability to periodically call the onClick
 * handler while the button is being held down. Allows this behavior with both regular
 * mouse click as well as with the Space and Enter keys.
 * @public
 * @param {Component} ComposedComponent The React component to extend.
 * The component must support adding handlers the following events: click, keydown, mousedown, mouseup
 * @returns {Component} A new component that supports holding the onClick handler
 */
const holdOnClick = (ComposedComponent) => {
  const CLICK_HOLD_START_DELAY = 500;
  const CLICK_HOLD_FREQUENCY = 100;

  /**
   * The extension itself
   */
  class HoldOnClick extends React.Component {
    constructor(props) {
      super(props);
      this.startTimer = null;
      this.repeatTimer = null;

      this.onKeyDown = this.onKeyDown.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.holdClick = this.holdClick.bind(this);
      this.releaseClick = this.releaseClick.bind(this);
    }

    /**
     * Make sure to release click when button is disabled.
     * @private
     */
    componentDidUpdate() {
      const { disabled } = this.props;
      if (disabled) {
        this.releaseClick();
      }
    }

    /**
     * Cleanup when component is unmounted.
     * @private
     */
    componentWillUnmount() {
      this.releaseClick();
    }

    /**
     * Handler for the keydown event. Calls the onClick handler for Enter and
     * Space keys. Note that the keydown event has the "hold down to continue triggering"
     * behavior that we want by default, so there's not need to use timers when using the keyboard.
     * @private
     * @param {event} event The keydown event object
     */
    onKeyDown(event) {
      const { onClick } = this.props;
      if (event.key === CONSTANTS.KEY_VALUES.SPACE
        || event.key === CONSTANTS.KEY_VALUES.ENTER) {
        onClick();
      }
    }

    /**
     * Handler for the mousedown event which calls the onClick handler and starts
     * a timer that will enable calling onClick periodically unless the button is
     * released before the timer callback.
     */
    onMouseDown() {
      const { onClick } = this.props;
      onClick();
      this.queueHoldClick();
    }

    /**
     * Starts a timer that will begin calling the onClick handling repeatedly after
     * a certain amount of time. This delay is needed in order to prevent the user
     * from triggering multiple onClick events accidentally with just a single click.
     * @private
     */
    queueHoldClick() {
      clearTimeout(this.startTimer);
      this.startTimer = setTimeout(this.holdClick, CLICK_HOLD_START_DELAY);
    }

    /**
     * Recursively starts a timer that calls the onClick handler periodically.
     * @private
     */
    holdClick() {
      const { onClick } = this.props;
      clearTimeout(this.repeatTimer);

      this.repeatTimer = setTimeout(() => {
        onClick();
        this.holdClick();
      }, CLICK_HOLD_FREQUENCY);
    }

    /**
     * Clears timers and stops calling the onClick handler periodically.
     * @private
     */
    releaseClick() {
      clearTimeout(this.startTimer);
      this.startTimer = null;
      clearTimeout(this.repeatTimer);
      this.repeatTimer = null;
    }

    render() {
      const { children } = this.props;
      return (
        <ComposedComponent
          {...this.props}
          onClick={null}
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.releaseClick}
          onMouseLeave={this.releaseClick}
        >
          {children}
        </ComposedComponent>
      );
    }
  }

  HoldOnClick.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  return HoldOnClick;
};

module.exports = holdOnClick;
