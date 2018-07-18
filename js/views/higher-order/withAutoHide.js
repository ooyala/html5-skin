const React = require('react');
const ReactDOM = require('react-dom');
const CONSTANTS = require('../../constants/constants');

const withAutoHide = function(ComposedComponent) {
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
    }

    componentDidMount() {
      document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
      document.addEventListener('touchmove', this.handlePlayerMouseMove, false);
      // for mobile or desktop fullscreen, hide control bar after 3 seconds
      if (this.props.controller.state.isMobile || this.props.fullscreen || this.props.controller.state.browserSupportsTouch) {
        this.startHideControlBarTimer();
      }
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.handlePlayerMouseMove);
      document.removeEventListener('touchmove', this.handlePlayerMouseMove);
      this.cancelHideControlBarTimer();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.componentWidth !== this.props.componentWidth) {
        this.handleResize(nextProps);
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps) {
        if (!this.props.fullscreen && nextProps.fullscreen) {
          this.startHideControlBarTimer();
        }
        if (this.props.fullscreen && !nextProps.fullscreen && this.props.controller.state.isMobile) {
          this.props.controller.showControlBar();
          this.startHideControlBarTimer();
        }
      }
    }

    /**
     * Handles the touchEnd event on the Auto Hide Screen.
     * @private
     * @param {Event} event The touchEnd event object
     */
    handleTouchEnd(event) {
      if (!this.props.controller.state.controlBarVisible) {
        this.showControlBar(event);
        //TODO: Address an existing issue where we don't cancel the timer upon touching control buttons
        this.startHideControlBarTimer();
      }
    }

    /**
     * Handles the mouseMove and touchMove events.
     * @private
     */
    handlePlayerMouseMove() {
      if (!this.props.controller.state.isMobile && this.props.fullscreen) {
        this.showControlBar();
        this.startHideControlBarTimer();
      }
    }

    /**
     * Handles when the player resizes.
     * @private
     */
    handleResize() {
      this.startHideControlBarTimer();
    }

    /**
     * Handles when a keyboard key is pressed.
     * @private
     * @param event The keyDown event object
     */
    handleKeyDown(event) {
      // Show control bar when any of the following keys are pressed:
      // - Tab: Focus on next control
      // - Space/Enter: Press active control
      // - Arrow keys: Either seek forward/back, volume up/down or interact with focused slider
      switch (event.key) {
        case CONSTANTS.KEY_VALUES.TAB:
        case CONSTANTS.KEY_VALUES.SPACE:
        case CONSTANTS.KEY_VALUES.ENTER:
        case CONSTANTS.KEY_VALUES.ARROW_UP:
        case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        case CONSTANTS.KEY_VALUES.ARROW_DOWN:
        case CONSTANTS.KEY_VALUES.ARROW_LEFT:
          this.showControlBar();
          this.startHideControlBarTimer();
          break;
        default:
          break;
      }
    }

    /**
     * Handles the mouseout event.
     * @private
     * @param event The mouseout event object
     */
    handleMouseOut(event) {
      if (!this.props.controller.state.isMobile) {
        this.hideControlBar();
      }
    }

    /**
     * Handles the mouseover event.
     * @private
     * @param {Event} event The mouseover event object
     */
    handleMouseOver(event) {
      this.showControlBar();
    }

    /**
     * Shows the control bar if not mobile or if mobile and was triggered
     * by a touchend event.
     * @public
     * @param event The event object from the event that triggered this
     */
    showControlBar(event) {
      if (!this.props.controller.state.isMobile || (event && event.type === 'touchend')) {
        this.props.controller.showControlBar();
        ReactDOM.findDOMNode(this.refs.AutoHideScreen).style.cursor = 'auto';
      }
    }

    /**
     * Hides the control bar if the auto hide configuration is enabled.
     * @public
     */
    hideControlBar() {
      if (this.props.controlBarAutoHide === true) {
        this.props.controller.hideControlBar();
        ReactDOM.findDOMNode(this.refs.AutoHideScreen).style.cursor = 'none';
      }
    }

    /**
     * Starts the timer to hide the control bar.
     * @public
     */
    startHideControlBarTimer() {
      this.props.controller.startHideControlBarTimer();
    }

    /**
     * Cancels the timer that hides the control bar.
     * @public
     */
    cancelHideControlBarTimer() {
      this.props.controller.cancelTimer();
    }

    render() {
      return (
        <div
          ref="AutoHideScreen"
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
      )
    }
  }
};

module.exports = withAutoHide;