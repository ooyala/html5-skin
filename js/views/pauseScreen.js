/** ******************************************************************
 PAUSE SCREEN
 *********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClassNames = require('classnames'),
    ControlBar = require('../components/controlBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    TextTrackPanel = require('../components/textTrackPanel'),
    Watermark = require('../components/watermark'),
    Icon = require('../components/icon'),
    SkipControls = require('../components/skipControls'),
    Utils = require('../components/utils'),
    CONSTANTS = require('./../constants/constants'),
    ViewControlsVr = require('../components/viewControlsVr');

class PauseScreen extends React.Component{
  //Alex: When transitioning to a class, I've removed the usage of mixins since they have been
  //deprecated. I've brought in the animate and resize mixin functionalities directly into this class.
  constructor(props) {
    super(props);
    this.state = {
      descriptionText: this.props.contentTree.description,
      containsText:
        (this.props.skinConfig.pauseScreen.showTitle && !!this.props.contentTree.title) ||
        (this.props.skinConfig.pauseScreen.showDescription && !!this.props.contentTree.description),
      controlBarVisible: true,
      animate: false,
      hidden: false
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.componentWidth !== this.props.componentWidth) {
      this.handleResize(nextProps);
    }
  }

  componentDidMount() {
    this.handleResize();
    this.hideVrPauseButton();
    document.addEventListener('mousemove', this.handlePlayerMouseMove, false);
    document.addEventListener('touchmove', this.handlePlayerMouseMove, false);
    document.addEventListener('mouseup', this.handleVrMouseUp, false);
    document.addEventListener('touchend', this.handleVrTouchEnd, false);

    if (this.state.containsText) {
      this.props.controller.addBlur();
    }

    this.animateTimer = setTimeout(this.startAnimation, 1);
  }

  componentWillUnmount() {
    this.props.controller.enablePauseAnimation();
    document.removeEventListener('mousemove', this.handlePlayerMouseMove);
    document.removeEventListener('touchmove', this.handlePlayerMouseMove);
    document.removeEventListener('mouseup', this.handleVrMouseUp);
    document.removeEventListener('touchend', this.handleVrTouchEnd);

    clearTimeout(this.animateTimer);
  }

  /**
   * Originally part of the animationMixin. Sets the animate state to true. Used
   * to animate the fade of the pause button in the center of the screen upon pausing.
   * @private
   */
  startAnimation = () => {
    this.setState({
      animate: true
    });
  };

  /**
   * Show the pause screen by setting the hidden state to false.
   * @private
   */
  showPauseScreen = () => {
    this.setState({
      hidden: false
    });
  };

  /**
   * Hide the pause screen by setting the hidden state to true.
   * @private
   */
  hidePauseScreen = () => {
    this.setState({
      hidden: true
    });
  };

  handleResize = () => {
    if (ReactDOM.findDOMNode(this.refs.description)) {
      this.setState({
        descriptionText: Utils.truncateTextToWidth(
          ReactDOM.findDOMNode(this.refs.description),
          this.props.contentTree.description
        )
      });
    }
  };

  handleClick = (event) => {
    if (this.props.controller.videoVr) {
      event.preventDefault();
    }
    if (!this.props.isVrMouseMove) {
      this.props.controller.togglePlayPause(event);
    }
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.state.isClickedOutside = false;
    this.props.handleVrPlayerClick();
  };

  /**
   * call handleTouchEnd when touchend was called on selectedScreen and videoType is Vr
   * @param {Event} e - event object
   */
  handleTouchEnd = (e) => {
    if (this.props.controller.videoVr) {
      e.preventDefault();
      if (!this.props.isVrMouseMove) {
        this.props.controller.togglePlayPause(e);
      }
    }
  };

  /**
   * call handleVrTouchEnd when touchend was called on selectedScreen and videoType is Vr
   * @param {Event} e - event object
   */
  handleVrTouchEnd = (e) => {
    this.props.handleVrPlayerMouseUp(e);
  };

  /**
   * remove the button on pause screen for correct checking mouse movement
   */
  hideVrPauseButton = () => {
    if (this.props.controller.videoVr) {
      var pauseButton = document.getElementById('oo-pause-button');
      setTimeout(function() {
        if (pauseButton) {
          pauseButton.style.display = 'none';
        }
      }, 1000);
    }
  };

  handlePlayerMouseDown = (e) => {
    if (this.props.controller.videoVr) {
      e.persist();
    }
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.state.isClickedOutside = false;
    this.props.handleVrPlayerMouseDown(e);
  };

  handlePlayerMouseMove = (e) => {
    this.props.handleVrPlayerMouseMove(e);
  };

  /**
   * call handleVrMouseUp when mouseup was called on selectedScreen
   * @param {Event} e - event object
   */
  handlePlayerMouseUp = (e) => {
    e.stopPropagation(); // W3C
    e.cancelBubble = true; // IE
  };

  /**
   * call handleVrMouseUp when mouseup was called on document
   * @param {Event} e - event object
   */
  handleVrMouseUp = (e) => {
    this.props.handleVrPlayerMouseUp(e);
  };

  /**
   * Make sure keyboard controls are active when a focusable element has focus.
   *
   * @param {Event} event - Focus event object
   */
  handleFocus = (event) => {
    var isFocusableElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    if (isFocusableElement) {
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
  };

  /**
   * MouseLeave event handler. Hides the pause screen if the autoHide skin config is set to true.
   * @private
   */
  handleMouseLeave = () => {
    if (this.props.skinConfig.pauseScreen.autoHide) {
      this.hidePauseScreen();
    }
  };

  /**
   * MouseEnter event handler. Shows the pause screen.
   * @private
   */
  handleMouseEnter = () => {
    this.showPauseScreen();
  };

  render() {
    // inline style for config/skin.json elements only
    var titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    var descriptionStyle = {
      color: this.props.skinConfig.startScreen.descriptionFont.color
    };
    var actionIconStyle = {
      color: this.props.skinConfig.pauseScreen.PauseIconStyle.color,
      opacity: this.props.skinConfig.pauseScreen.PauseIconStyle.opacity
    };

    // CSS class manipulation from config/skin.json
    var fadeUnderlayClass = ClassNames({
      'oo-fading-underlay': !this.props.pauseAnimationDisabled,
      'oo-fading-underlay-active': this.props.pauseAnimationDisabled,
      'oo-animate-fade': this.state.animate && !this.props.pauseAnimationDisabled
    });
    var infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-info-panel-top':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('top') > -1,
      'oo-info-panel-bottom':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('bottom') > -1,
      'oo-info-panel-left':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('left') > -1,
      'oo-info-panel-right':
        this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    var titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });
    var descriptionClass = ClassNames({
      'oo-state-screen-description': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf('right') > -1
    });

    var actionIconClass = ClassNames({
      'oo-action-icon-pause': !this.props.pauseAnimationDisabled,
      'oo-action-icon': this.props.pauseAnimationDisabled,
      'oo-animate-pause': this.state.animate && !this.props.pauseAnimationDisabled,
      'oo-action-icon-top':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('top') > -1,
      'oo-action-icon-bottom':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('bottom') > -1,
      'oo-action-icon-left':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('left') > -1,
      'oo-action-icon-right':
        this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf('right') > -1,
      'oo-hidden': !this.props.skinConfig.pauseScreen.showPauseIcon || this.props.pauseAnimationDisabled
    });

    var titleMetadata = (
      <div className={titleClass} style={titleStyle}>
        {this.props.contentTree.title}
      </div>
    );
    var descriptionMetadata = (
      <div className={descriptionClass} ref="description" style={descriptionStyle}>
        {this.state.descriptionText}
      </div>
    );

    var adOverlay =
      this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay ? (
        <AdOverlay
          {...this.props}
          overlay={this.props.controller.state.adOverlayUrl}
          showOverlay={this.props.controller.state.showAdOverlay}
          showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}
        />
      ) : null;

    var upNextPanel =
      this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData ? (
        <UpNextPanel
          {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          currentPlayhead={this.props.currentPlayhead}
        />
      ) : null;

    var viewControlsVr = this.props.controller.videoVr ? (
      <ViewControlsVr {...this.props} controlBarVisible={this.state.controlBarVisible} />
    ) : null;

    var skipControlsEnabled = Utils.getPropertyValue(
      this.props.skinConfig,
      'skipControls.enabled',
      false
    );
    var isTextTrackInBackground = (
      skipControlsEnabled ||
      this.props.controller.state.scrubberBar.isHovering
    );

    var pauseScreenClass = ClassNames({
      'oo-state-screen': true,
      'oo-pause-screen': true,
      'oo-pause-screen-hidden': this.state.hidden
    });

    return (
      <div className={pauseScreenClass}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {!this.props.controller.videoVr && this.state.containsText && <div className={fadeUnderlayClass} />}

        <div
          className={CONSTANTS.CLASS_NAMES.SELECTABLE_SCREEN}
          onClick={this.handleClick}
          onMouseDown={this.handlePlayerMouseDown}
          onTouchStart={this.handlePlayerMouseDown}
          onMouseUp={this.handlePlayerMouseUp}
          onTouchEnd={this.handleTouchEnd} />

        <Watermark
          {...this.props}
          controlBarVisible={this.state.controlBarVisible} />

        <div className={infoPanelClass}>
          {this.props.skinConfig.pauseScreen.showTitle ? titleMetadata : null}
          {this.props.skinConfig.pauseScreen.showDescription ? descriptionMetadata : null}
        </div>

        <button
          id="oo-pause-button"
          type="button"
          className={actionIconClass}
          onClick={this.handleClick}
          aria-hidden="true"
          tabIndex="-1">
          <Icon {...this.props} icon="pause" style={actionIconStyle} />
        </button>

        {viewControlsVr}

        {skipControlsEnabled &&
          <SkipControls
            config={this.props.controller.state.skipControls}
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            responsiveView={this.props.responsiveView}
            skinConfig={this.props.skinConfig}
            controller={this.props.controller}
            a11yControls={this.props.controller.accessibilityControls}
            isInBackground={this.props.controller.state.scrubberBar.isHovering}
            onFocus={this.handleFocus} />
        }

        <div className="oo-interactive-container" onFocus={this.handleFocus}>
          {this.props.closedCaptionOptions.enabled && (
            <TextTrackPanel
              closedCaptionOptions={this.props.closedCaptionOptions}
              cueText={this.props.closedCaptionOptions.cueText}
              direction={this.props.captionDirection}
              responsiveView={this.props.responsiveView}
              isInBackground={isTextTrackInBackground} />
          )}

          {adOverlay}

          {upNextPanel}

          <ControlBar
            {...this.props}
            controlBarVisible={this.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream} />
        </div>

      </div>
    );
  }
}

module.exports = PauseScreen;
