import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import ControlBar from '../components/controlBar';
import AdOverlay from '../components/adOverlay';
import UpNextPanel from '../components/upNextPanel';
import TextTrackPanel from '../components/textTrackPanel';
import Watermark from '../components/watermark';
import Icon from '../components/icon';
import SkipControls from '../components/skipControls';
import Utils from '../components/utils';
import CONSTANTS from '../constants/constants';
import ViewControlsVr from '../components/viewControlsVr';
import withAutoHide from './higher-order/withAutoHide';
import CastPanel from '../components/castPanel';
/* eslint-disable react/destructuring-assignment */
/* global document */

/**
 * Represents a screen when a video is paused
 */
class PauseScreen extends React.Component {
  /**
   * call handlePlayerMouseUp when mouseup was called on selectedScreen
   * it prevents propagation
   * @param {Event} event - event object
   */
  static handlePlayerMouseUp(event) {
    event.stopPropagation(); // W3C
    event.cancelBubble = true; /* IE specific */ // eslint-disable-line
  }

  constructor(props) {
    super(props);
    this.state = {
      descriptionText: this.props.contentTree.description,
      containsText:
        (this.props.skinConfig.pauseScreen.showTitle && !!this.props.contentTree.title)
        || (this.props.skinConfig.pauseScreen.showDescription && !!this.props.contentTree.description),
      animate: false,
    };
  }

  componentDidMount() {
    this.animateTimer = setTimeout(this.startAnimation, 1);
    this.handleResize();
    this.hideVrPauseButton();
    if (this.props.controller.videoVr) {
      document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
      document.addEventListener('touchmove', this.handlePlayerMouseMove, { passive: false });
      document.addEventListener('mouseup', this.props.handleVrPlayerMouseUp, false);
      document.addEventListener('touchend', this.props.handleTouchEndOnWindow, { passive: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.componentWidth !== this.props.componentWidth) {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.animateTimer);
    this.props.controller.enablePauseAnimation();
    if (this.props.controller.videoVr) {
      document.removeEventListener('mousemove', this.handlePlayerMouseMove);
      document.removeEventListener('touchmove', this.handlePlayerMouseMove);
      document.removeEventListener('mouseup', this.props.handleVrPlayerMouseUp);
      document.removeEventListener('touchend', this.props.handleTouchEndOnWindow);
    }
  }

  /**
   * Sets the animate state to true.
   * @private
   */
  startAnimation = () => {
    this.setState({
      animate: true,
    });
  }

  /**
   * Handles when the player changes size.
   * @private
   */
  handleResize = () => {
    if (ReactDOM.findDOMNode(this.description)) { // eslint-disable-line
      this.setState({
        descriptionText: Utils.truncateTextToWidth(
          ReactDOM.findDOMNode(this.description), // eslint-disable-line
          this.props.contentTree.description
        ),
      });
    }
  }

  /**
   * call handleClick when an user clicked on document
   * @param {Event} event - event object
   */
  handleClick = (event) => {
    if (this.props.controller.videoVr) {
      event.preventDefault();
    }
    if (!this.props.isVrMouseMove && !this.props.controller.state.isMobile) {
      this.props.controller.togglePlayPause(event);
    }
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.state.isClickedOutside = false;
    this.props.handleVrPlayerClick();
  }

  /**
   * remove the button on pause screen for correct checking mouse movement
   */
  hideVrPauseButton = () => {
    if (this.props.controller.videoVr) {
      const second = 1000;
      setTimeout(() => {
        if (this.pauseButton) {
          this.pauseButton.style.display = 'none';
        }
      }, second);
    }
  }

  /**
   * call handlePlayerMouseDown when mouseDown was called on document and videoType is Vr
   * @param {Event} event - mouse down event object
   */
  handlePlayerMouseDown = (event) => {
    event.preventDefault();
    if (this.props.controller.videoVr) {
      event.persist();
    }
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.state.isClickedOutside = false;
    this.props.handleVrPlayerMouseDown(event);
  }

  /**
   * call handlePlayerMouseMove when mouseMove was called on document and videoType is Vr
   * @param {Event} event - mouse move event object
   */
  handlePlayerMouseMove = (event) => {
    this.props.handleVrPlayerMouseMove(event);
  }

  /**
   * Make sure keyboard controls are active when a focusable element has focus.
   * @param {Event} event - Focus event object
   */
  handleFocus = (event) => {
    const isFocusableElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    if (isFocusableElement) {
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
  }

  render() {
    // inline style for config/skin.json elements only
    const titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color,
    };
    const descriptionStyle = {
      color: this.props.skinConfig.startScreen.descriptionFont.color,
    };
    const actionIconStyle = {
      color: this.props.skinConfig.pauseScreen.PauseIconStyle.color,
      opacity: this.props.skinConfig.pauseScreen.PauseIconStyle.opacity,
    };

    // CSS class manipulation from config/skin.json
    const fadeUnderlayClass = ClassNames({
      'oo-fading-underlay': true,
      'oo-fading-underlay-active':
        this.props.pauseAnimationDisabled
        && this.props.controller.state.controlBarVisible,
      'oo-animate-fade':
        this.state.animate
        && (!this.props.pauseAnimationDisabled
          || this.props.controller.state.cast.connected)
        && this.props.controller.state.controlBarVisible,
    });
    const infoPanelPosition = this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase();
    const infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-inactive': !this.props.controller.state.controlBarVisible,
      'oo-info-panel-top': infoPanelPosition.indexOf('top') > -1,
      'oo-info-panel-bottom': infoPanelPosition.indexOf('bottom') > -1,
      'oo-info-panel-left': infoPanelPosition.indexOf('left') > -1,
      'oo-info-panel-right': infoPanelPosition.indexOf('right') > -1,
    });
    const titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-pull-right': infoPanelPosition.indexOf('right') > -1,
    });
    const descriptionClass = ClassNames({
      'oo-state-screen-description': true,
      'oo-pull-right': infoPanelPosition.indexOf('right') > -1,
    });

    const pauseIconPosition = this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase();
    const actionIconClass = ClassNames({
      'oo-action-icon-pause': !this.props.pauseAnimationDisabled,
      'oo-action-icon': this.props.pauseAnimationDisabled,
      'oo-animate-pause': this.state.animate && !this.props.pauseAnimationDisabled,
      'oo-action-icon-top': pauseIconPosition.indexOf('top') > -1,
      'oo-action-icon-bottom': pauseIconPosition.indexOf('bottom') > -1,
      'oo-action-icon-left': pauseIconPosition.indexOf('left') > -1,
      'oo-action-icon-right': pauseIconPosition.indexOf('right') > -1,
      'oo-hidden': !this.props.skinConfig.pauseScreen.showPauseIcon || this.props.pauseAnimationDisabled,
    });

    const titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {this.props.contentTree.title}
      </div>
    );
    const descriptionMetadata = (
      <div
        className={descriptionClass}
        ref={(text) => { this.description = text; }}
        style={descriptionStyle}
      >
        {this.state.descriptionText}
      </div>
    );

    const adOverlay = this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay
      ? (
        <AdOverlay
          {...this.props}
          overlay={this.props.controller.state.adOverlayUrl}
          showOverlay={this.props.controller.state.showAdOverlay}
          showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}
        />
      )
      : null;

    const upNextPanel = this.props.controller.state.upNextInfo.showing
      && this.props.controller.state.upNextInfo.upNextData
      ? (
        <UpNextPanel
          {...this.props}
          controlBarVisible={this.props.controller.state.controlBarVisible}
          currentPlayhead={this.props.currentPlayhead}
        />
      )
      : null;

    const viewControlsVr = this.props.controller.videoVr ? (
      <ViewControlsVr {...this.props} controlBarVisible={this.props.controller.state.controlBarVisible} />
    ) : null;

    const skipControlsEnabled = Utils.getPropertyValue(
      this.props.skinConfig,
      'skipControls.enabled',
      false
    );
    const isTextTrackInBackground = (
      skipControlsEnabled
      || this.props.controller.state.scrubberBar.isHovering
    );

    if (this.state.containsText && this.props.controller.state.controlBarVisible) {
      this.props.controller.addBlur();
    } else {
      this.props.controller.removeBlur();
    }

    // Always show the poster image on cast session
    const posterImageUrl = this.props.skinConfig.startScreen.showPromo
      ? this.props.contentTree.promo_image
      : '';
    const posterStyle = {};
    if (Utils.isValidString(posterImageUrl)) {
      posterStyle.backgroundImage = `url('${posterImageUrl}')`;
    }

    const stateScreenPosterClass = ClassNames({
      'oo-blur': true,
      'oo-state-screen-poster': this.props.skinConfig.startScreen.promoImageSize !== 'small',
      'oo-state-screen-poster-small': this.props.skinConfig.startScreen.promoImageSize === 'small',
    });

    // Depends of there's another element/panel at the center of the player we will push down
    // the cast panel to allow both elements be visible to the user
    const castPanelClass = ClassNames({
      'oo-info-panel-cast-bottom': skipControlsEnabled,
    });

    return (
      <div className="oo-state-screen oo-pause-screen">
        {
          this.props.controller.state.cast.connected
          && <div className={stateScreenPosterClass} style={posterStyle} />
        }

        {!this.props.controller.videoVr && this.state.containsText && <div className={fadeUnderlayClass} />}

        <div // eslint-disable-line
          className={CONSTANTS.CLASS_NAMES.SELECTABLE_SCREEN}
          onClick={this.handleClick}
          onMouseDown={this.handlePlayerMouseDown}
          onTouchStart={this.handlePlayerMouseDown}
          onTouchEnd={this.props.handleTouchEndOnPlayer}
          onMouseUp={this.handlePlayerMouseUp}
        />

        <Watermark
          {...this.props}
          controlBarVisible={this.props.controller.state.controlBarVisible}
        />

        <div className={infoPanelClass}>
          {this.props.skinConfig.pauseScreen.showTitle ? titleMetadata : null}
          {this.props.skinConfig.pauseScreen.showDescription ? descriptionMetadata : null}
        </div>

        <button
          ref={(btn) => { this.pauseButton = btn; }}
          type="button"
          className={actionIconClass}
          onClick={this.handleClick}
          aria-hidden="true"
          tabIndex="-1"
        >
          <Icon {...this.props} icon="pause" style={actionIconStyle} />
        </button>

        {
          this.props.controller.state.cast.connected
          && (
          <CastPanel
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            device={this.props.controller.state.cast.device}
            className={castPanelClass}
          />
          )
        }

        {viewControlsVr}

        {skipControlsEnabled
          && (
          <SkipControls
            className="oo-absolute-centered"
            config={this.props.controller.state.skipControls}
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            responsiveView={this.props.responsiveView}
            skinConfig={this.props.skinConfig}
            controller={this.props.controller}
            currentPlayhead={this.props.currentPlayhead}
            a11yControls={this.props.controller.accessibilityControls}
            isInactive={!this.props.controller.state.controlBarVisible}
            isInBackground={this.props.controller.state.scrubberBar.isHovering}
            onFocus={this.handleFocus}
          />
          )
        }

        <div className="oo-interactive-container" onFocus={this.handleFocus}>
          {this.props.closedCaptionOptions.enabled && (
            <TextTrackPanel
              closedCaptionOptions={this.props.closedCaptionOptions}
              cueText={this.props.closedCaptionOptions.cueText}
              direction={this.props.captionDirection}
              responsiveView={this.props.responsiveView}
              isInBackground={isTextTrackInBackground}
            />
          )}

          {adOverlay}

          {upNextPanel}

          <ControlBar
            {...this.props}
            height={this.props.skinConfig.controlBar.height}
            animatingControlBar
            controlBarVisible={this.props.controller.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream}
          />
        </div>

      </div>
    );
  }
}

const PauseScreenWithAutoHide = withAutoHide(PauseScreen);

export { PauseScreen, PauseScreenWithAutoHide };
