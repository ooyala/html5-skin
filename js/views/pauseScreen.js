/********************************************************************
 PAUSE SCREEN
 *********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
    TruncateTextMixin = require('../mixins/truncateTextMixin'),
    ResizeMixin = require('../mixins/resizeMixin');

var PauseScreen = React.createClass({
  mixins: [ResizeMixin, TruncateTextMixin],

  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0,
      animate: false
    };
  },

  componentDidMount: function() {
    this.truncateText(this.refs.description, this.props.contentTree.description);
    this.setState({
      controlBarWidth: this.getDOMNode().clientWidth,
      animate: true
    });
  },

  componentWillUnmount: function() {
    this.props.controller.enablePauseAnimation();
  },

  handleClick: function(event) {
    event.preventDefault();
    this.props.controller.togglePlayPause();
    this.props.controller.state.accessibilityControlsEnabled = true;
    if (this.props.controller.state.volumeState.volumeSliderVisible) {
      this.props.controller.hideVolumeSliderBar();
    }
  },

  handleResize: function() {
    this.truncateText(this.refs.description, this.props.contentTree.description);
    if (this.isMounted()) {
      this.setState({
        controlBarWidth: this.getDOMNode().clientWidth
      });
    }
  },

  render: function() {
    //inline style for config/skin.json elements only
    var titleStyle = {
      //fontSize: this.props.skinConfig.startScreen.titleFont.fontSize + "pt",
      //fontFamily: this.props.skinConfig.startScreen.titleFont.fontFamily,
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    var descriptionStyle = {
      //fontSize: this.props.skinConfig.startScreen.descriptionFont.fontSize + "pt",
      //fontFamily: this.props.skinConfig.startScreen.descriptionFont.fontFamily,
      color: this.props.skinConfig.startScreen.descriptionFont.color
    };
    var actionIconStyle = {
      color: this.props.skinConfig.pauseScreen.PauseIconStyle.color,
      opacity: this.props.skinConfig.pauseScreen.PauseIconStyle.opacity
    };

    //CSS class manipulation from config/skin.json
    var fadeUnderlayClass = ClassNames({
      'fading-underlay': !this.props.pauseAnimationDisabled,
      'fading-underlay-active': this.props.pauseAnimationDisabled,
      'animate-fade': this.state.animate && !this.props.pauseAnimationDisabled
    });
    var infoPanelClass = ClassNames({
      'state-screen-info': true,
      'info-panel-top': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("top") > -1,
      'info-panel-bottom': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("bottom") > -1,
      'info-panel-left': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1,
      'info-panel-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var titleClass = ClassNames({
      'state-screen-title': true,
      'text-truncate': true,
      'text-capitalize': true,
      'pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var descriptionClass = ClassNames({
      'state-screen-description': true,
      'pull-right': this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1
    });
    var actionIconClass = ClassNames({
      'action-icon-pause': !this.props.pauseAnimationDisabled,
      'action-icon': this.props.pauseAnimationDisabled,
      'animate-pause': this.state.animate && !this.props.pauseAnimationDisabled,
      'action-icon-top': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("top") > -1,
      'action-icon-bottom': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("bottom") > -1,
      'action-icon-left': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("left") > -1,
      'action-icon-right': this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("right") > -1,
      'hidden': !this.props.skinConfig.pauseScreen.showPauseIcon || this.props.pauseAnimationDisabled
    });

    var titleMetadata = (<div className={titleClass} style={titleStyle}>{this.props.contentTree.title}</div>);
    var descriptionMetadata = (<div className={descriptionClass} ref="description" style={descriptionStyle}>{this.props.contentTree.description}</div>);

    return (
      <div className="state-screen pauseScreen">
        <div className={fadeUnderlayClass}></div>
        <div className={infoPanelClass}>
          {this.props.skinConfig.startScreen.showTitle ? titleMetadata : ''}
          {this.props.skinConfig.startScreen.showDescription ? descriptionMetadata : ''}
        </div>

        <a className="state-screen-selectable" onClick={this.handleClick}></a>

        <a className={actionIconClass} onClick={this.handleClick}>
          <span className={this.props.skinConfig.icons.pause.fontStyleClass}
                style={actionIconStyle}
                aria-hidden="true"></span>
        </a>

        <AdOverlay {...this.props}
          overlay={this.props.controller.state.adOverlayUrl}
          showOverlay={this.props.controller.state.showAdOverlay}
          showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton}
          controlBarVisible={this.state.controlBarVisible}
        />
        <ScrubberBar {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
        />
        <ControlBar {...this.props}
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.state.playerState}
          authorization={this.props.authorization}
        />

        {(this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) ?
          <UpNextPanel {...this.props} controlBarVisible={this.state.controlBarVisible} currentPlayhead={this.props.currentPlayhead}/> : ''}
      </div>
    );
  }
});
module.exports = PauseScreen;