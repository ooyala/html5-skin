/********************************************************************
  PAUSE SCREEN
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('../components/utils'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    AdOverlay = require('../components/adOverlay'),
    UpNextPanel = require('../components/upNextPanel'),
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
    window.addEventListener('webkitfullscreenchange', this.handleResize);
    window.addEventListener('mozfullscreenchange', this.handleResize);
    window.addEventListener('fullscreenchange', this.handleResize);
    window.addEventListener('msfullscreenchange', this.handleResize);

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
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('webkitfullscreenchange', this.handleResize);
    window.removeEventListener('mozfullscreenchange', this.handleResize);
    window.removeEventListener('fullscreenchange', this.handleResize);
    window.removeEventListener('msfullscreenchange', this.handleResize);
  },

  handleClick: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE

      this.props.controller.togglePlayPause();
      this.props.controller.state.accessibilityControlsEnabled = true;

      if (this.props.controller.state.volumeState.volumeSliderVisible) {
        this.props.controller.hideVolumeSliderBar();
      }
    }
  },

  handlePlayerMouseDown: function(event) {
    //to prevent cursor changing to text cursor if click and drag
    event.preventDefault();
  },

  render: function() {
    var screenStyle = InlineStyle.pauseScreenStyle;
    var pauseClass = this.props.skinConfig.icons.pause.fontStyleClass;
    var pauseStyle = screenStyle.pauseIcon.style;
    var infoStyle = screenStyle.infoPanel;

    //title style
    infoStyle.title.style.fontSize = this.props.skinConfig.startScreen.titleFont.fontSize + "pt";
    infoStyle.title.style.fontFamily = this.props.skinConfig.startScreen.titleFont.fontFamily;
    infoStyle.title.style.color = this.props.skinConfig.startScreen.titleFont.color;

    //description style
    infoStyle.description.style.fontSize = this.props.skinConfig.startScreen.descriptionFont.fontSize + "pt";
    infoStyle.description.style.fontFamily = this.props.skinConfig.startScreen.descriptionFont.fontFamily;
    infoStyle.description.style.color = this.props.skinConfig.startScreen.descriptionFont.color;

    // Accent Color
    pauseStyle.color = this.props.skinConfig.pauseScreen.PauseIconStyle.color;

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
        infoStyle.style.bottom = InlineStyle.controlBarStyle.controlBarSetting.height;
      if (this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1)
        infoStyle.style.left = "5%";
      if (this.props.skinConfig.pauseScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1) {
        infoStyle.style.right = "5%";
        infoStyle.title.style.float = "right";
        infoStyle.description.style.float = "right";
      }
    }

    var upNext = null;
    if (this.props.controller.state.upNextInfo.showing && this.props.controller.state.upNextInfo.upNextData) {
      upNext = <UpNextPanel {...this.props} controlBarVisible={this.state.controlBarVisible} currentPlayhead={this.props.currentPlayhead}/>;
    }
    return (
      <div className="pauseScreen" style={InlineStyle.defaultScreenStyle.style}>
        <div onMouseUp={this.handleClick} onMouseDown={this.handlePlayerMouseDown} onTouchEnd={this.handleClick} style={screenStyle.style}>
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
            playerState={this.state.playerState}
            authorization={this.props.authorization} />
        </div>
        {upNext}
      </div>
    );
  }
});
module.exports = PauseScreen;
