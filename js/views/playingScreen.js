/********************************************************************
 PLAYING SCREEN
 *********************************************************************/
var React = require('react'),
  ReactDOM = require('react-dom'),
  ControlBar = require('../components/controlBar'),
  AdOverlay = require('../components/adOverlay'),
  ClassNames = require('classnames'),
  UpNextPanel = require('../components/upNextPanel'),
  Spinner = require('../components/spinner'),
  TextTrack = require('../components/textTrackPanel'),
  Watermark = require('../components/watermark'),
  ResizeMixin = require('../mixins/resizeMixin'),
  CONSTANTS = require('../constants/constants'),
  ViewControlsVr = require('../components/viewControlsVr'),
  Icon = require('../components/icon'),
  Tooltip = require('../components/tooltip'),
  UnmuteIcon = require('../components/unmuteIcon');

var PlayingScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.browserSupportsTouch = this.props.controller.state.browserSupportsTouch;
    return {
      controlBarVisible: true,
      isVrNotificationHidden: false,
      timer: null
    };
  },

  componentDidMount: function () {
    //for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen || this.browserSupportsTouch){
      this.props.controller.startHideControlBarTimer();
    }
    this.handleVrAnimationEnd("vrNotificatioContainer", "isVrNotificationHidden");
  },

  componentWillUpdate: function(nextProps) {
    if(nextProps) {
      if (nextProps.controller.state.controlBarVisible == false && this.state.controlBarVisible == true) {
        this.hideControlBar();
      }
      if(!this.props.fullscreen && nextProps.fullscreen) {
        this.props.controller.startHideControlBarTimer();
      }
      if(this.props.fullscreen && !nextProps.fullscreen && this.isMobile) {
        this.setState({controlBarVisible: true});
        this.props.controller.showControlBar();
        this.props.controller.startHideControlBarTimer();
      }
    }
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
  },

  /**
   * @description need to show special information labels (or/and icons).
   * The labels should be animated.
   * Need to remove the labels (icons) after animation
   * Animation should be only one time
   * @param id - unique identificator of the label(icon)
   * @param stateName - name for a state which indicates about necessary to show the label(icon)
   */
  handleVrAnimationEnd: function(id, stateName) {
    var vrContainer = document.getElementById(id);
    if (vrContainer) {
      var listener = function() {
        var newState = {};
        newState[stateName] = true;
        this.setState(newState);
        this.props.controller.isNewVideo = false;
      };
      vrContainer.addEventListener("animationend", listener.bind(this), false);
    }
  },

  handleResize: function() {
    if (this.isMounted()) {
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleKeyDown: function(event) {
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
        this.props.controller.startHideControlBarTimer();
        break;
      default:
        break;
    }
  },

  /**
   * The keydown event is not fired when the scrubber bar is first focused with
   * a tab unless playback was activated with a click. As a workaround, we make sure
   * that the control bar is shown when a control bar element is focused.
   *
   * @param {object} event Focus event object.
   */
  handleFocus: function(event) {
    var isControlBarElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    // Only do this if the control bar hasn't been shown by now and limit to focus
    // events that are triggered on known control bar elements
    if (!this.state.controlBarVisible && isControlBarElement) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
  },

  handleTouchEnd: function(event) {
    event.preventDefault();//to prevent mobile from propagating click to discovery shown on pause
    if (!this.state.controlBarVisible){
      this.showControlBar(event);
      this.props.controller.startHideControlBarTimer();
    }
    else if (!this.props.controller.videoVr) {
      this.props.controller.togglePlayPause(event);
    }
  },

  handlePlayerMouseDown: function(e) {
    this.props.handleVrPlayerMouseDown(e);
  },

  handlePlayerMouseMove: function(e) {
    e.preventDefault();
    if(!this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
    this.props.handleVrPlayerMouseMove(e);
  },

  handlePlayerMouseUp: function(e) {
    // pause or play the video if the skin is clicked on desktop
    if (!this.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
      if (!this.props.controller.videoVr) {
        this.props.controller.togglePlayPause();
      }
    }
    this.props.handleVrPlayerMouseUp();
    // for mobile, touch is handled in handleTouchEnd
  },

  handlePlayerMouseLeave: function () {
    this.props.handleVrPlayerMouseLeave();
  },

  handlePlayerClicked: function (event) {
    if (!this.props.isVrMouseMove) {
      this.props.controller.togglePlayPause(event);
    }
    this.props.handleVrPlayerClick();
  },

  handlePlayerFocus: function() {
    this.props.handleVrPlayerFocus();
  },

  showControlBar: function(event) {
    if (!this.isMobile || event.type == 'touchend') {
      this.setState({controlBarVisible: true});
      this.props.controller.showControlBar();
      ReactDOM.findDOMNode(this.refs.PlayingScreen).style.cursor="auto";
    }
  },

  hideControlBar: function(event) {
    if (this.props.controlBarAutoHide == true && !(this.isMobile && event)) {
      this.setState({controlBarVisible: false});
      this.props.controller.hideControlBar();
      ReactDOM.findDOMNode(this.refs.PlayingScreen).style.cursor="none";
    }
  },

  unmuteClick: function(event) {
    this.props.controller.handleMuteClick();
  },

  render: function() {
    var adOverlay = (this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay) ?
      <AdOverlay {...this.props}
                 overlay={this.props.controller.state.adOverlayUrl}
                 showOverlay={this.props.controller.state.showAdOverlay}
                 showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}/> : null;

    var upNextPanel = (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) ?
      <UpNextPanel {...this.props}
                   controlBarVisible={this.state.controlBarVisible}
                   currentPlayhead={this.props.currentPlayhead}/> : null;

    var viewControlsVr = this.props.controller.videoVr ?
      <ViewControlsVr
        {...this.props}
        controlBarVisible={this.state.controlBarVisible}
      /> : null;

    var showUnmute = this.props.controller.state.volumeState.mutingForAutoplay && this.props.controller.state.volumeState.muted;

    var vrNotification = null;
    if (this.props.controller.state.config.isVrAnimationEnabled !== null &&
      typeof this.props.controller.state.config.isVrAnimationEnabled === "object" &&
      this.props.controller.state.config.isVrAnimationEnabled.vrNotification &&
      this.props.controller.videoVr &&
      !this.state.isVrNotificationHidden &&
      this.props.controller.isNewVideo) {
      var style = {};
      var defaultDuration = 3;
      if (this.props.controller.state.config.animationDurations !== undefined &&
        this.props.controller.state.config.animationDurations.vrIcon !== undefined &&
        Utils.ensureNumber(this.props.controller.state.config.animationDurations.vrNotification, defaultDuration)) {
        var duration = this.props.controller.state.config.animationDurations.vrNotification + "s";
        style = {
          "animationDuration": duration,
          "webkitAnimationDuration": duration
        };
      }
      vrNotification = (
        <div id="vrNotificatioContainer" className="oo-state-screen-vr-notification-container">
          <p className="oo-state-screen-vr-notification" style={style}>{"Select and drag to look around"}</p>
        </div>
      );
    }

    return (
      <div
        className="oo-state-screen oo-playing-screen"
        ref="PlayingScreen"
        onMouseOver={this.showControlBar}
        onMouseOut={this.hideControlBar}
        onKeyDown={this.handleKeyDown}
      >
        <div
          className="oo-state-screen-selectable"
          onMouseDown={this.handlePlayerMouseDown}
          onMouseUp={this.handlePlayerMouseUp}
          onMouseMove={this.handlePlayerMouseMove}
          onMouseLeave={this.handlePlayerMouseLeave}
          onTouchEnd={this.handleTouchEnd}
          onClick={this.handlePlayerClicked}
          onFocus={this.handlePlayerFocus}
        />

        {vrNotification}

        <Watermark {...this.props} controlBarVisible={this.state.controlBarVisible}/>

        {this.props.controller.state.buffering ? <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/> : null}

        {viewControlsVr}

        <div className="oo-interactive-container" onFocus={this.handleFocus}>

          {this.props.closedCaptionOptions.enabled ?
            <TextTrack
              closedCaptionOptions={this.props.closedCaptionOptions}
              cueText={this.props.closedCaptionOptions.cueText}
              direction={this.props.captionDirection}
              responsiveView={this.props.responsiveView}
            /> : null
          }

          {adOverlay}

          {upNextPanel}

          <ControlBar {...this.props}
                      controlBarVisible={this.state.controlBarVisible}
                      playerState={this.props.playerState}
                      isLiveStream={this.props.isLiveStream} />

        </div>

        {showUnmute ? <UnmuteIcon {...this.props}/> : null}

      </div>
    );
  }
});
module.exports = PlayingScreen;