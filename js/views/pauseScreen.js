/********************************************************************
  PAUSE SCREEN
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('../components/utils'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
    CONSTANTS = require('../constants/constants');

var PauseScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      description: this.props.contentTree.description,
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  // CSS doesn't support "truncate N lines" so we need to do DOM width
  // calculations to figure out where to truncate the description
  componentDidMount: function() {
    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);

    //need this to display fading pause button and dimming the screen
    InlineStyle.pauseScreenStyle.pauseIcon.style.opacity = 0;
    InlineStyle.pauseScreenStyle.pauseIcon.style.fontSize = "72";
    InlineStyle.pauseScreenStyle.fading.opacity = 0.5;
    InlineStyle.pauseScreenStyle.fading.transition = (this.props.pauseAnimationDisabled === true ? "opacity 0s" : "opacity 1s");

    this.setState({
      controlBarWidth: this.getDOMNode().clientWidth,
      description: this.getShortenedDescription()
    });
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({
        controlBarWidth: this.getDOMNode().clientWidth,
        description: this.getShortenedDescription()
      });
    }
  },

  getShortenedDescription: function() {
    if (this.props.skinConfig.pauseScreen.showTitle ||
      this.props.skinConfig.pauseScreen.showDescription) {
      var descriptionNode = this.getDOMNode().getElementsByClassName("pauseScreen-description")[0];
      var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.description);
      return shortDesc;
    }
    else {
      return this.state.description;
    }
  },

  componentWillUnmount: function() {
    //setting styles back to normal, for fading the pause button and dimming the screen next time
    InlineStyle.pauseScreenStyle.pauseIcon.style.opacity = 1;
    InlineStyle.pauseScreenStyle.pauseIcon.style.fontSize = "24";
    InlineStyle.pauseScreenStyle.fading.opacity = 0;
    this.props.controller.enablePauseAnimation();
  },

  handleClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.togglePlayPause();

      if (this.props.controller.state.volumeState.volumeSliderVisible) {
        this.props.controller.hideVolumeSliderBar();
      }
    }
  },

  render: function() {
    var screenStyle = InlineStyle.pauseScreenStyle;
    var pauseClass = this.props.skinConfig.icons.pause.fontStyleClass;
    var pauseStyle = screenStyle.pauseIcon.style;
    var infoStyle = screenStyle.infoPanel;

    // Accent Color
    pauseStyle.color = screenStyle.infoPanel.style.color = this.props.skinConfig.pauseScreen.PauseIconStyle.color;

    // PlayButton position, defaulting to centered
    if (this.props.skinConfig.pauseScreen.showPauseIcon) {
      pauseStyle.top = "50%";
      pauseStyle.left = "50%";
      if (this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("top") > -1)
        pauseStyle.top = "15%";
      if (this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("bottom") > -1)
        pauseStyle.top = "80%";
      if (this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("left") > -1)
        pauseStyle.left = "10%";
      if (this.props.skinConfig.pauseScreen.pauseIconPosition.toLowerCase().indexOf("right") > -1)
        pauseStyle.left = "90%";
    }
    else {
      pauseStyle.display = "none";
    }

    // metadata visibility
    var titleMetadata = null;
    var descriptionMetadata = null;
    if (this.props.skinConfig.pauseScreen.showTitle) {
      titleMetadata = <div className="pauseScreen-title" style={screenStyle.infoPanel.title.style}>{this.props.contentTree.title}</div>;
    }
    if (this.props.skinConfig.pauseScreen.showDescription) {
      descriptionMetadata = <div className="pauseScreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>;
    }

    if (this.props.skinConfig.pauseScreen.showTitle ||
      this.props.skinConfig.pauseScreen.showDescription) {
      if (this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("top") > -1)
        infoStyle.style.top = "5%";
      if (this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("bottom") > -1)
        infoStyle.style.bottom = "5%";
      if (this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1)
        infoStyle.style.left = "5%";
      if (this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1) {
        infoStyle.style.right = "5%";
        infoStyle.title.style.float = "right";
        infoStyle.description.style.float = "right";
      }
    }

    return (
      <div onMouseUp={this.handleClick} onTouchEnd={this.handleClick} style={screenStyle.style}>
        <div style ={screenStyle.fading}></div>
        <span className={this.props.pauseAnimationDisabled === true ? null : pauseClass} style={pauseStyle} aria-hidden="true"></span>
        <div style={screenStyle.infoPanel.style}>
          {titleMetadata}
          {descriptionMetadata}
        </div>
        <AdOverlay {...this.props} overlay={this.props.controller.state.adOverlayUrl} showOverlay={this.props.controller.state.showAdOverlay}
          showOverlayCloseButton={this.props.controller.state.showAdOverlayCloseButton} controlBarVisible={this.state.controlBarVisible} />
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth}
          playerState={this.state.playerState} />
      </div>
    );
  }
});
module.exports = PauseScreen;
