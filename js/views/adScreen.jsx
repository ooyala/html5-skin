
import React from 'react';
import ClassNames from 'classnames';

import AdPanel from '../components/adPanel';
import ControlBar from '../components/controlBar';
import Icon from '../components/icon';
import UnmuteIcon from '../components/unmuteIcon';
import CONSTANTS from '../constants/constants';
import Utils from '../components/utils';
/* eslint-disable react/destructuring-assignment */

/**
 * The screen to be displayed on advertising
 */
class AdScreen extends React.Component {
  constructor(props) {
    super(props);
    this.isMobile = this.props.controller.state.isMobile;
    this.state = {
      controlBarVisible: true,
    };
  }

  componentDidMount() {
    // for mobile or desktop fullscreen, hide control bar after 3 seconds
    if (this.isMobile || this.props.fullscreen) {
      this.props.controller.startHideControlBarTimer();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.componentWidth !== this.props.componentWidth) {
      this.handleResize();
    }
  }

  /**
   * Handle show/hide controlBar logic based on nextProps object
   * @param {Object} nextProps props object
   */
  componentWillUpdate(nextProps) {
    if (nextProps) {
      if (nextProps.controller.state.controlBarVisible === false && this.state.controlBarVisible === true) {
        this.hideControlBar();
      }

      if (nextProps.controller.state.controlBarVisible === true && this.state.controlBarVisible === false) {
        this.showControlBar();
      }

      if (
        !this.props.fullscreen
        && nextProps.fullscreen
        && this.state.playerState !== CONSTANTS.STATE.PAUSE
      ) {
        this.props.controller.startHideControlBarTimer();
      }
      if (this.props.fullscreen && !nextProps.fullscreen && this.isMobile) {
        this.showControlBar();
        this.props.controller.startHideControlBarTimer();
      }
    }
  }

  componentWillUnmount() {
    this.props.controller.cancelTimer();
  }

  /**
   * Playback control items array depends on player state. Handle this
   * @returns {Object} array of control items
   */
  getPlaybackControlItems() {
    if (!this.props.controller.state.showAdControls) return null;

    const showControlBar = this.props.playerState === CONSTANTS.STATE.PAUSE
      || this.props.controller.state.forceControlBarVisible
      || this.state.controlBarVisible;

    const playbackControlItemTemplates = {
      controlBar: (
        <ControlBar
          {...this.props}
          height={this.props.skinConfig.controlBar.height}
          animatingControlBar
          controlBarVisible={showControlBar}
          playerState={this.props.playerState}
          key="controlBar"
        />
      ),
    };

    const playbackControlItems = [];
    for (const item in playbackControlItemTemplates) { // eslint-disable-line no-restricted-syntax
      if (playbackControlItemTemplates.hasOwnProperty(item)) { // eslint-disable-line no-prototype-builtins
        playbackControlItems.push(playbackControlItemTemplates[item]);
      }
    }

    return playbackControlItems;
  }

  /**
   * Bubble up the click only for special conditions
   * @param {Object} event object
   */
  handleClick = (event) => {
    event.stopPropagation(); // W3C
    event.cancelBubble = true; /* IE specific */ // eslint-disable-line

    this.props.controller.state.accessibilityControlsEnabled = true;
    if ((event.type === 'click' || !this.isMobile) && !this.props.skinConfig.adScreen.showAdMarquee) {
      this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.VIDEO_WINDOW);
    }
  }

  /**
   * Bubble up the click only for special conditions
   * @param {Object} event object
   */
  handlePlayerClicked = (event) => {
    if (event.type === 'touchend' || !this.isMobile) {
      // since mobile would fire both click and touched events,
      // we need to make sure only one actually does the work

      // since after exiting the full screen, iPhone pauses the video and places an overlay play button in the middle
      // of the screen (which we can't remove), clicking the screen would start the video.
      if (!Utils.canRenderSkin() && this.state.playerState === CONSTANTS.STATE.PAUSE) {
        this.props.controller.togglePlayPause();
      } else {
        event.stopPropagation(); // W3C
        event.cancelBubble = true; /* IE specific */ // eslint-disable-line
        this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.VIDEO_WINDOW);
      }
    }
  }

  /**
   * Update the state with controlBar visible
   */
  showControlBar = () => {
    this.setState({ controlBarVisible: true });
    this.props.controller.showControlBar();
  }

  /**
   * Update the state with controlBar invisible
   * @param {Object} event object
   */
  hideControlBar = (event) => {
    if (this.props.skinConfig.controlBar.autoHide === true && !(this.isMobile && event)) {
      this.setState({ controlBarVisible: false });
      this.props.controller.hideControlBar();
    }
  }

  /**
   * Update the state with controlBar invisible
   * @param {Object} event object
   */
  handleTouchEnd = (event) => {
    // handleTouchEnd is used to verify controlBar visibility.
    if (!this.state.controlBarVisible && this.props.skinConfig.adScreen.showControlBar) {
      this.showControlBar();
      // Do not start the process to hide the control bar unless we are leaving pause state.
      if (this.props.playerState === CONSTANTS.STATE.PAUSE) {
        this.props.controller.startHideControlBarTimer();
      }
    }
    // Even if our action was to start showing the control bar, we should still handle
    // the click to prevent the need to double tap.
    this.handlePlayerClicked(event);
  }

  /**
   * Update the state with controlBar invisible
   * @param {Object} event object
   */
  handlePlayerMouseMove = () => {
    if (this.props.playerState !== CONSTANTS.STATE.PAUSE && !this.isMobile && this.props.fullscreen) {
      this.showControlBar();
      this.props.controller.startHideControlBarTimer();
    }
  }

  /**
   * Update the state with controlBar invisible
   * @param {Object} event object
   */
  handleResize = () => {
    if (this.isMounted()) { // eslint-disable-line
      this.props.controller.startHideControlBarTimer();
    }
  }

  /**
   * Bubble up unmute clicked
   */
  unmuteClick = () => {
    this.props.controller.handleMuteClick();
  }

  render() {
    const actionIconStyle = {
      color: this.props.skinConfig.pauseScreen.PauseIconStyle.color,
      opacity: this.props.skinConfig.pauseScreen.PauseIconStyle.opacity,
    };
    const actionIconClass = ClassNames({
      'oo-action-icon-pause': !this.props.controller.state.adPauseAnimationDisabled,
      'oo-action-icon': this.props.controller.state.adPauseAnimationDisabled,
      'oo-animate-pause': !this.props.controller.state.adPauseAnimationDisabled,
      'oo-action-icon-top':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('top') > -1,
      'oo-action-icon-bottom':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('bottom') > -1,
      'oo-action-icon-left':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('left') > -1,
      'oo-action-icon-right':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('right') > -1,
      'oo-hidden': !this.props.skinConfig.pauseScreen.showPauseIcon,
      'oo-icon-hidden': this.props.playerState !== CONSTANTS.STATE.PAUSE,
    });
    let adPanel = null;
    if (this.props.skinConfig.adScreen.showAdMarquee && this.props.controller.state.showAdMarquee) {
      adPanel = <AdPanel {...this.props} />;
    }
    let playbackControlItems = null;
    if (this.props.skinConfig.adScreen.showControlBar) {
      playbackControlItems = this.getPlaybackControlItems();
    }

    const showUnmute = this.props.controller.state.volumeState.mutingForAutoplay
      && this.props.controller.state.volumeState.muted;

    return (
      <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
        className="oo-state-screen oo-ad-screen"
        ref="adScreen" // eslint-disable-line
        role="presentation"
        onMouseOver={this.showControlBar}
        onMouseOut={this.hideControlBar}
        onMouseMove={this.handlePlayerMouseMove}
        onMouseUp={this.handleClick}
      >
        <a // eslint-disable-line
          className={actionIconClass}
        >
          <Icon {...this.props} icon="pause" style={actionIconStyle} />
        </a>
        <div // eslint-disable-line jsx-a11y/mouse-events-have-key-events
          className="oo-ad-panel"
          role="presentation"
          ref="adPanel" // eslint-disable-line
          onClick={this.handlePlayerClicked}
          onTouchEnd={this.handleTouchEnd}
        >
          {adPanel}
        </div>
        <div className="oo-interactive-container">{playbackControlItems}</div>

        {showUnmute ? <UnmuteIcon {...this.props} /> : null}
      </div>
    );
  }
}
module.exports = AdScreen;
