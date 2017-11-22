/********************************************************************
 PAUSE SCREEN
 *********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClassNames = require('classnames'),
    ControlBar = require('../components/controlBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    TextTrack = require('../components/textTrackPanel'),
    Watermark = require('../components/watermark'),
    ResizeMixin = require('../mixins/resizeMixin'),
    Icon = require('../components/icon'),
    Utils = require('../components/utils'),
    CONSTANTS = require('./../constants/constants'),
    AnimateMixin = require('../mixins/animateMixin'),
    ViewControlsVr = require('../components/viewControlsVr');

var PauseScreen = React.createClass({
  mixins: [ResizeMixin, AnimateMixin],

  getInitialState: function() {
    return {
      descriptionText: this.props.contentTree.description,
      controlBarVisible: true
    };
  },

  componentDidMount: function() {
    this.handleResize();
  },

  componentWillUnmount: function() {
    this.props.controller.enablePauseAnimation();
  },

  handleResize: function() {
    if (ReactDOM.findDOMNode(this.refs.description)){
      this.setState({
        descriptionText: Utils.truncateTextToWidth(ReactDOM.findDOMNode(this.refs.description), this.props.contentTree.description)
      });
    }
  },

  handleClick: function(event) {
    event.preventDefault();
    if(!this.props.isVrMouseMove){
      this.props.controller.togglePlayPause(event);
    }
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.state.isClickedOutside = false;
    this.props.handleVrPlayerClick();
  },

  handlePlayerMouseDown: function(e) {
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.state.isClickedOutside = false;
    this.props.handleVrPlayerMouseDown(e);
  },
  handlePlayerMouseMove: function(e) {
    e.preventDefault();
    this.props.handleVrPlayerMouseMove(e);
  },
  handlePlayerMouseUp: function(e) {
    e.stopPropagation(); // W3C
    e.cancelBubble = true; // IE
    this.props.handleVrPlayerMouseUp();
  },
  handlePlayerMouseLeave: function() {
    this.props.handleVrPlayerMouseLeave()
  },

  /**
   * Make sure keyboard controls are active when a control bar element has focus.
   *
   * @param {object} event Focus event object
   */
  handleFocus: function(event) {
    var isControlBarElement = event.target || event.target.hasAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR);
    if (isControlBarElement) {
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.state.isClickedOutside = false;
    }
  },

  render: function() {
    //inline style for config/skin.json elements only
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

    //CSS class manipulation from config/skin.json
    var fadeUnderlayClass = ClassNames({
      'oo-fading-underlay': !this.props.pauseAnimationDisabled,
      'oo-fading-underlay-active': this.props.pauseAnimationDisabled,
      'oo-animate-fade': this.state.animate && !this.props.pauseAnimationDisabled
    });
    var infoPanelClass = ClassNames({
      'oo-state-screen-info': true,
      'oo-info-panel-top': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("top") > -1,
      'oo-info-panel-bottom': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("bottom") > -1,
      'oo-info-panel-left': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1,
      'oo-info-panel-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var titleClass = ClassNames({
      'oo-state-screen-title': true,
      'oo-text-truncate': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var descriptionClass = ClassNames({
      'oo-state-screen-description': true,
      'oo-pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });

    var actionIconClass = ClassNames({
      'oo-action-icon-pause': !this.props.pauseAnimationDisabled,
      'oo-action-icon': this.props.pauseAnimationDisabled,
      'oo-animate-pause': this.state.animate && !this.props.pauseAnimationDisabled,
      'oo-action-icon-top': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("top") > -1,
      'oo-action-icon-bottom': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("bottom") > -1,
      'oo-action-icon-left': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("left") > -1,
      'oo-action-icon-right': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("right") > -1,
      'oo-hidden': !this.props.skinConfig.pauseScreen.showPauseIcon || this.props.pauseAnimationDisabled
    });

    var titleMetadata = (<div className={titleClass} style={titleStyle}>{this.props.contentTree.title}</div>);
    var descriptionMetadata = (<div className={descriptionClass} ref="description" style={descriptionStyle}>{this.state.descriptionText}</div>);

    var adOverlay = (this.props.controller.state.adOverlayUrl && this.props.controller.state.showAdOverlay) ?
      <AdOverlay
        {...this.props}
        overlay={this.props.controller.state.adOverlayUrl}
        showOverlay={this.props.controller.state.showAdOverlay}
        showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}
      />
      :
      null;

    var upNextPanel = (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) ?
      <UpNextPanel
        {...this.props}
        controlBarVisible={this.state.controlBarVisible}
        currentPlayhead={this.props.currentPlayhead}
      />
      :
      null;

    var viewControlsVr = this.props.controller.videoVr ?
      <ViewControlsVr
        {...this.props}
        controlBarVisible={this.state.controlBarVisible}
      /> : null;

    return (
      <div className="oo-state-screen oo-pause-screen">

        {
          !this.props.controller.videoVr &&
          <div className={fadeUnderlayClass} />
        }

        <div
          className="oo-state-screen-selectable"
          onClick={this.handleClick}
          onMouseDown={this.handlePlayerMouseDown}
          onMouseUp={this.handlePlayerMouseUp}
          onMouseMove={this.handlePlayerMouseMove}
          onMouseLeave={this.handlePlayerMouseLeave}
        />

        <Watermark {...this.props} controlBarVisible={this.state.controlBarVisible}/>

        <div className={infoPanelClass}>
          {this.props.skinConfig.pauseScreen.showTitle ? titleMetadata : null}
          {this.props.skinConfig.pauseScreen.showDescription ? descriptionMetadata : null}
        </div>

        <button
          type="button"
          className={actionIconClass}
          onClick={this.handleClick}
          aria-hidden="true"
          tabIndex="-1">
          <Icon {...this.props} icon="pause" style={actionIconStyle}/>
        </button>

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

          <ControlBar
            {...this.props}
            controlBarVisible={this.state.controlBarVisible}
            playerState={this.state.playerState}
            isLiveStream={this.props.isLiveStream}
          />
        </div>
      </div>
    );
  }
});
module.exports = PauseScreen;
