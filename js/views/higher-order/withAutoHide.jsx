import React from 'react';
import CONSTANTS from '../../constants/constants';
/* eslint-disable react/destructuring-assignment */
/* global document */

/**
 * Wraps a component within a div that handles auto-hide functionality based on mouse, touch, or keyboard usage.
 * @param {Object} ComposedComponent The component to wrap and add auto-hide functionality to
 * @returns {class} The enhanced component with auto-hide functionality
 */
function withAutoHide(ComposedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.hideControlBar = this.hideControlBar.bind(this);
      this.showControlBar = this.showControlBar.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.startHideControlBarTimer = this.startHideControlBarTimer.bind(this);
      this.cancelHideControlBarTimer = this.cancelHideControlBarTimer.bind(this);
      this.handleMouseOut = this.handleMouseOut.bind(this);
      this.handlePlayerMouseMove = this.handlePlayerMouseMove.bind(this);
      this.handleTouchEnd = this.handleTouchEnd.bind(this);

      this.autoHideRef = React.createRef();
    }

    componentDidMount() {
      document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
      document.addEventListener('touchmove', this.handlePlayerMouseMove, false);
      // for mobile or desktop fullscreen, hide control bar after 3 seconds
      if (this.props.controller.state.isMobile
        || this.props.fullscreen
        || this.props.controller.state.browserSupportsTouch) {
        this.startHideControlBarTimer();
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.componentWidth !== this.props.componentWidth) {
        this.handleResize();
      }
    }

    /**
     * Launch show/hide controlBar logic on fullscreen or chromecast logic
     * @param {Object} nextProps - next props object
     */
    componentWillUpdate(nextProps) {
      if (!nextProps) {
        return;
      }
      if (!this.props.fullscreen && nextProps.fullscreen) {
        this.startHideControlBarTimer();
      }
      if (this.props.fullscreen && !nextProps.fullscreen && this.props.controller.state.isMobile) {
        this.props.controller.showControlBar();
        this.startHideControlBarTimer();
      }

      if (nextProps.controller.state.cast.connected) {
        this.props.controller.showControlBar();
        this.cancelHideControlBarTimer();
      }
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.handlePlayerMouseMove);
      document.removeEventListener('touchmove', this.handlePlayerMouseMove);
      this.cancelHideControlBarTimer();
    }

    /**
     * Handles the touchEnd event on the Auto Hide Screen.
     * @param {Event} event The touchEnd event object
     */
    handleTouchEnd = (event) => {
      if (!this.props.controller.state.controlBarVisible) {
        this.showControlBar(event);
        // TODO: Address an existing issue where we don't cancel the timer upon touching control buttons
        this.startHideControlBarTimer();
      }
    }

    /**
     * Handles the mouseMove and touchMove events.
     */
    handlePlayerMouseMove = () => {
      if (!this.props.controller.state.isMobile && this.props.fullscreen) {
        this.showControlBar();
        this.startHideControlBarTimer();
      }
    }

    /**
     * Handles when the player resizes.
     */
    handleResize = () => {
      this.startHideControlBarTimer();
    }

    /**
     * Show control bar when any of the following keys are pressed:
     * Tab: Focus on next control
     * Space/Enter: Press active control
     * Arrow keys: Either seek forward/back, volume up/down or interact with focused slider
     * @param {Object} event The keyDown event object
     */
    handleKeyDown = (event) => {
      const keysForAction = [
        CONSTANTS.KEY_VALUES.TAB,
        CONSTANTS.KEY_VALUES.SPACE,
        CONSTANTS.KEY_VALUES.ENTER,
        CONSTANTS.KEY_VALUES.ARROW_UP,
        CONSTANTS.KEY_VALUES.ARROW_RIGHT,
        CONSTANTS.KEY_VALUES.ARROW_DOWN,
        CONSTANTS.KEY_VALUES.ARROW_LEFT,
      ];
      if (keysForAction.indexOf(event.key) !== -1) {
        this.showControlBar();
        this.startHideControlBarTimer();
      }
    }

    /**
     * Handles the mouseout event.
     */
    handleMouseOut = () => {
      if (!this.props.controller.state.isMobile) {
        this.hideControlBar();
      }
    }

    /**
     * Handles the mouseover event.
     * @private
     * @param {Event} event The mouseover event object
     */
    handleMouseOver = () => {
      this.showControlBar();
    }

    /**
     * Shows the control bar if not mobile or if mobile and was triggered
     * by a touchend event.
     * @public
     * @param {Object} event The event object from the event that triggered this
     */
    showControlBar = (event) => {
      if (!this.props.controller.state.isMobile || (event && event.type === 'touchend')) {
        this.props.controller.showControlBar();
        this.autoHideRef.current.style.cursor = 'auto';
      }
    }

    /**
     * Hides the control bar if the auto hide configuration is enabled.
     * @public
     */
    hideControlBar = () => {
      if (this.props.skinConfig.controlBar.autoHide === true) {
        this.props.controller.hideControlBar();
        this.autoHideRef.current.style.cursor = 'none';
      }
    }

    /**
     * Starts the timer to hide the control bar.
     * @public
     */
    startHideControlBarTimer = () => {
      this.props.controller.startHideControlBarTimer();
    }

    /**
     * Cancels the timer that hides the control bar.
     * @public
     */
    cancelHideControlBarTimer = () => {
      this.props.controller.cancelTimer();
    }

    render() {
      return (
        <div // eslint-disable-line
          ref={this.autoHideRef}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onKeyDown={this.handleKeyDown}
          onTouchEnd={this.handleTouchEnd}
        >
          <ComposedComponent
            {...this.props}
            hideControlBar={this.hideControlBar}
            showControlBar={this.showControlBar}
            startHideControlBarTimer={this.startHideControlBarTimer}
            cancelHideControlBarTimer={this.cancelHideControlBarTimer}
          />
        </div>
      );
    }
  };
}

module.exports = withAutoHide;
