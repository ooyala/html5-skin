import React from 'react';
import ClassNames from 'classnames';
import ControlBar from '../components/controlBar';
import AdOverlay from '../components/adOverlay';
import UpNextPanel from '../components/upNextPanel';
import TextTrackPanel from '../components/textTrackPanel';
import Watermark from '../components/watermark';
import Icon from '../components/icon';
import SkipControls from '../components/skipControls';
import Spinner from '../components/spinner';
import Utils from '../components/utils';
import CONSTANTS from '../constants/constants';
import ViewControlsVr from '../components/viewControlsVr';
import withAutoHide from './higher-order/withAutoHide';
import CastPanel from '../components/castPanel';

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
    event.stopPropagation();
  }

  description = null;

  constructor(props) {
    super(props);
    this.state = {
      descriptionText: props.contentTree.description,
      containsText:
        (props.skinConfig.pauseScreen.showTitle && !!props.contentTree.title)
        || (props.skinConfig.pauseScreen.showDescription && !!props.contentTree.description),
      animate: false,
    };
  }

  componentDidMount() {
    const { controller, handleVrPlayerMouseUp, handleTouchEndOnWindow } = this.props;
    this.animateTimer = setTimeout(this.startAnimation, 1);
    this.truncateText();
    this.hideVrPauseButton();
    if (controller.videoVr) {
      document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
      document.addEventListener('touchmove', this.handlePlayerMouseMove, { passive: false });
      document.addEventListener('mouseup', handleVrPlayerMouseUp, false);
      document.addEventListener('touchend', handleTouchEndOnWindow, { passive: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { componentWidth } = this.props;
    if (nextProps.componentWidth !== componentWidth) {
      this.truncateText();
    }
  }

  componentWillUnmount() {
    const { controller, handleVrPlayerMouseUp, handleTouchEndOnWindow } = this.props;
    clearTimeout(this.animateTimer);
    controller.enablePauseAnimation();
    if (controller.videoVr) {
      document.removeEventListener('mousemove', this.handlePlayerMouseMove);
      document.removeEventListener('touchmove', this.handlePlayerMouseMove);
      document.removeEventListener('mouseup', handleVrPlayerMouseUp);
      document.removeEventListener('touchend', handleTouchEndOnWindow);
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
   * Truncate description text
   */
  truncateText = () => {
    if (!this.description) {
      return;
    }
    const { contentTree } = this.props;
    this.setState({
      descriptionText: Utils.truncateTextToWidth(
        this.description,
        contentTree.description
      ),
    });
  }

  /**
   * call handleClick when an user clicked on document
   * @param {Event} event - event object
   */
  handleClick = (event) => {
    const { controller, handleVrPlayerClick, isVrMouseMove } = this.props;
    if (controller.videoVr) {
      event.preventDefault();
    }
    if (
      (!isVrMouseMove && !controller.state.isMobile)
      || typeof controller.state.playerParam.onTogglePlayPause === 'function'
    ) {
      controller.togglePlayPause(event);
    }
    controller.state.accessibilityControlsEnabled = true;
    controller.state.isClickedOutside = false;
    handleVrPlayerClick();
  };

  /**
   * remove the button on pause screen for correct checking mouse movement
   */
  hideVrPauseButton = () => {
    const { controller } = this.props;
    if (controller.videoVr) {
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
    const { controller, handleVrPlayerMouseDown } = this.props;
    if (controller.videoVr) {
      event.persist();
    }
    controller.state.accessibilityControlsEnabled = true;
    controller.state.isClickedOutside = false;
    handleVrPlayerMouseDown(event);
  }

  /**
   * call handlePlayerMouseMove when mouseMove was called on document and videoType is Vr
   * @param {Event} event - mouse move event object
   */
  handlePlayerMouseMove = (event) => {
    const { handleVrPlayerMouseMove } = this.props;
    handleVrPlayerMouseMove(event);
  }

  /**
   * Make sure keyboard controls are active when a focusable element has focus.
   * @param {Event} event - Focus event object
   */
  handleFocus = (event) => {
    const { controller } = this.props;
    const isFocusableElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    if (isFocusableElement) {
      controller.state.accessibilityControlsEnabled = true;
      controller.state.isClickedOutside = false;
    }
  }

  render() {
    const {
      skinConfig,
      pauseAnimationDisabled,
      controller,
      contentTree,
      currentPlayhead,
      buffered,
      handleTouchEndOnPlayer,
      language,
      localizableStrings,
      responsiveView,
      closedCaptionOptions,
      playerState,
      isLiveStream,
    } = this.props;

    const {
      animate,
      descriptionText,
      containsText,
    } = this.state;

    // inline style for config/skin.json elements only
    const titleStyle = {
      color: skinConfig.startScreen.titleFont.color,
    };
    const descriptionStyle = {
      color: skinConfig.startScreen.descriptionFont.color,
    };
    const actionIconStyle = {
      color: skinConfig.pauseScreen.PauseIconStyle.color,
      opacity: skinConfig.pauseScreen.PauseIconStyle.opacity,
    };

    // CSS class manipulation from config/skin.json
    const fadeUnderlayClass = ClassNames({
      'oo-fading-underlay': true,
      'oo-fading-underlay-active':
        pauseAnimationDisabled
        && controller.state.controlBarVisible,
      'oo-animate-fade':
        animate
        && (!pauseAnimationDisabled
          || controller.state.cast.connected)
        && controller.state.controlBarVisible,
    });
    const infoPanelPosition = skinConfig.pauseScreen.infoPanelPosition.toLowerCase();
    const infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-inactive': !controller.state.controlBarVisible,
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

    const pauseIconPosition = skinConfig.pauseScreen.pauseIconPosition.toLowerCase();
    const actionIconClass = ClassNames({
      'oo-action-icon-pause': !pauseAnimationDisabled,
      'oo-action-icon': pauseAnimationDisabled,
      'oo-animate-pause': animate && !pauseAnimationDisabled,
      'oo-action-icon-top': pauseIconPosition.indexOf('top') > -1,
      'oo-action-icon-bottom': pauseIconPosition.indexOf('bottom') > -1,
      'oo-action-icon-left': pauseIconPosition.indexOf('left') > -1,
      'oo-action-icon-right': pauseIconPosition.indexOf('right') > -1,
      'oo-hidden': !skinConfig.pauseScreen.showPauseIcon || pauseAnimationDisabled,
    });

    const titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {contentTree.title}
      </div>
    );
    const descriptionMetadata = (
      <div
        className={descriptionClass}
        ref={(text) => { this.description = text; }}
        style={descriptionStyle}
      >
        {descriptionText}
      </div>
    );

    const adOverlay = controller.state.adOverlayUrl && controller.state.showAdOverlay
      ? (
        <AdOverlay
          {...this.props}
          overlay={controller.state.adOverlayUrl}
          showOverlay={controller.state.showAdOverlay}
          showOverlayCloseButton={controller.state.showAdOverlayCloseButton}
        />
      )
      : null;

    const upNextPanel = controller.state.upNextInfo.showing
      && controller.state.upNextInfo.upNextData
      ? (
        <UpNextPanel
          {...this.props}
          controlBarVisible={controller.state.controlBarVisible}
          currentPlayhead={currentPlayhead}
        />
      )
      : null;

    const viewControlsVr = controller.videoVr ? (
      <ViewControlsVr {...this.props} controlBarVisible={controller.state.controlBarVisible} />
    ) : null;

    const skipControlsEnabled = Utils.getPropertyValue(
      skinConfig,
      'skipControls.enabled',
      false
    );
    const isTextTrackInBackground = (
      skipControlsEnabled
      || controller.state.scrubberBar.isHovering
    );

    if (containsText && controller.state.controlBarVisible) {
      controller.addBlur();
    } else {
      controller.removeBlur();
    }

    // Always show the poster image on cast session
    const posterImageUrl = skinConfig.startScreen.showPromo
      ? contentTree.promo_image
      : '';
    const posterStyle = {};
    if (Utils.isValidString(posterImageUrl)) {
      posterStyle.backgroundImage = `url('${posterImageUrl}')`;
    }

    const stateScreenPosterClass = ClassNames({
      'oo-blur': true,
      'oo-state-screen-poster': skinConfig.startScreen.promoImageSize !== 'small',
      'oo-state-screen-poster-small': skinConfig.startScreen.promoImageSize === 'small',
    });

    // Depends of there's another element/panel at the center of the player we will push down
    // the cast panel to allow both elements be visible to the user
    const castPanelClass = ClassNames({
      'oo-info-panel-cast-bottom': skipControlsEnabled,
    });

    const {
      buffering,
      cast,
    } = controller.state;

    const showSpinner = buffering || (!cast.connected && buffered === 0 && !isLiveStream);
    const interactiveContainerClasses = ClassNames('oo-interactive-container');

    return (
      <div className="oo-state-screen oo-pause-screen">
        {
          controller.state.cast.connected
          && <div className={stateScreenPosterClass} style={posterStyle} />
        }

        {!controller.videoVr && containsText && <div className={fadeUnderlayClass} />}

        <div // eslint-disable-line
          className={CONSTANTS.CLASS_NAMES.SELECTABLE_SCREEN}
          onClick={this.handleClick}
          onMouseDown={this.handlePlayerMouseDown}
          onTouchStart={this.handlePlayerMouseDown}
          onTouchEnd={handleTouchEndOnPlayer}
          onMouseUp={this.handlePlayerMouseUp}
        />

        <Watermark
          {...this.props}
          controlBarVisible={controller.state.controlBarVisible}
        />

        <div className={infoPanelClass}>
          {skinConfig.pauseScreen.showTitle ? titleMetadata : null}
          {skinConfig.pauseScreen.showDescription ? descriptionMetadata : null}
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
          controller.state.cast.connected
          && (
          <CastPanel
            language={language}
            localizableStrings={localizableStrings}
            device={controller.state.cast.device}
            className={castPanelClass}
          />
          )
        }

        {showSpinner && (
          <Spinner loadingImage={skinConfig.general.loadingImage.imageResource.url} />
        )}

        {viewControlsVr}

        {skipControlsEnabled
          && (
          <SkipControls
            className="oo-absolute-centered"
            config={controller.state.skipControls}
            language={language}
            localizableStrings={localizableStrings}
            responsiveView={responsiveView}
            skinConfig={skinConfig}
            controller={controller}
            currentPlayhead={currentPlayhead}
            a11yControls={controller.accessibilityControls}
            isInactive={!controller.state.controlBarVisible}
            isInBackground={controller.state.scrubberBar.isHovering}
            onFocus={this.handleFocus}
          />
          )
        }

        <div className={interactiveContainerClasses} onFocus={this.handleFocus}>
          {closedCaptionOptions.enabled && (
            <TextTrackPanel
              closedCaptionOptions={closedCaptionOptions}
              cueText={closedCaptionOptions.cueText}
              responsiveView={responsiveView}
              isInBackground={isTextTrackInBackground}
            />
          )}

          {adOverlay}

          {upNextPanel}

          <ControlBar
            {...this.props}
            height={skinConfig.controlBar.height}
            animatingControlBar
            controlBarVisible={controller.state.controlBarVisible}
            playerState={playerState}
            isLiveStream={isLiveStream}
          />
        </div>

      </div>
    );
  }
}

const PauseScreenWithAutoHide = withAutoHide(PauseScreen);

export { PauseScreen, PauseScreenWithAutoHide };
