/********************************************************************
  CONTROL BAR
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('./utils');

var ControlBar = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      currentVolumeHead: 0,
      mouseOverVolume: false
    };
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
  },

  handleControlBarMouseUp: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
      if (this.props.controller.state.volumeState.volumeSliderVisible){
        this.props.controller.hideVolumeSliderBar();
      }
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleFullscreenClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleFullscreen();
    }
  },

  handleVolumeIconClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work
      if (this.isMobile){
        this.props.controller.startHideControlBarTimer();
        evt.stopPropagation(); // W3C
        evt.cancelBubble = true; // IE
        if (this.props.controller.state.volumeState.volumeSliderVisible){
          this.props.controller.hideVolumeSliderBar();
        }
        else {
          this.props.controller.showVolumeSliderBar();
        }
      }
      else{
        this.props.controller.handleMuteClick();
      }
    }
  },

  handleVolumeBarTouchEnd: function(evt) {
    this.props.controller.startHideControlBarTimer();
    //to prevent volume slider from hiding when clicking on volume slider
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE
  },

  handleVolumeHeadTouchStart: function(evt) {
    this.props.controller.startHideControlBarTimer();
    evt.preventDefault();
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE
    evt = evt.nativeEvent;

    this.getDOMNode().parentNode.addEventListener("touchmove", this.handleVolumeHeadMove);
    document.addEventListener("touchend", this.handleVolumeHeadTouchEnd, true);

    this.setState({
      currentVolumeHead: evt.changedTouches[0].screenX
    });
  },

  handleVolumeHeadMove: function(evt) {
    this.props.controller.startHideControlBarTimer();
    evt.preventDefault();
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE

    this.setNewVolume(evt);
  },

  setNewVolume: function(evt) {
    var newVolumeHeadX = this.isMobile ? evt.changedTouches[0].screenX : evt.screenX;
    var diffX = newVolumeHeadX - this.state.currentVolumeHead;
    var diffVolume = (diffX / parseInt(this.refs.volumeSlider.getDOMNode().clientWidth));
    var newVolume = this.props.controller.state.volumeState.volume + diffVolume;
    newVolume = Math.min(newVolume, 1);
    newVolume = Math.max(newVolume, 0);

    this.props.controller.setVolume(newVolume);
    this.setState({
      currentVolumeHead: newVolumeHeadX
    });
  },

  handleVolumeHeadTouchEnd: function(evt) {
    this.props.controller.startHideControlBarTimer();
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE
    this.setNewVolume(evt);
    this.getDOMNode().parentNode.removeEventListener("touchmove", this.handleVolumeHeadMove);
    document.removeEventListener("touchend", this.handleVolumeHeadTouchEnd, true);
  },

  handlePlayClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.togglePlayPause();
    }
  },

  handleShareClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleShareScreen();
    }
  },

  handleVolumeClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      var newVolume = parseFloat(evt.target.dataset.volume);
      this.props.controller.setVolume(newVolume);
    }
  },

  handleDiscoveryClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleDiscoveryScreen();
    }
  },

  handleMoreOptionsClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE
      this.props.controller.toggleMoreOptionsScreen();
    }
  },

  handleClosedCaptionClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleClosedCaptionScreen();
    }
  },

  //TODO(dustin) revisit this, doesn't feel like the "react" way to do this.
  highlight: function(evt) {
    var color = this.props.skinConfig.controlBar.iconStyle.active.color;
    var opacity = this.props.skinConfig.controlBar.iconStyle.active.opacity;
    Utils.highlight(evt.target, opacity, color);
  },

  removeHighlight: function(evt) {
    var color = this.props.skinConfig.controlBar.iconStyle.inactive.color;
    var opacity = this.props.skinConfig.controlBar.iconStyle.inactive.opacity;
    Utils.removeHighlight(evt.target, opacity, color);
  },

  volumeHighlight:function() {
    this.setState({mouseOverVolume: true});
    this.highlight({target: this.refs.volumeIcon.getDOMNode()});
  },

  volumeRemoveHighlight:function() {
    this.setState({mouseOverVolume: false});
    this.removeHighlight({target: this.refs.volumeIcon.getDOMNode()});
  },

  populateControlBar: function() {
    var dynamicStyles = this.setupControlBarItemForConstantHeight(CONSTANTS.UI.defaultControlBarHeight);
    var playClass = "";
    if (this.props.playerState == CONSTANTS.STATE.PLAYING) {
      playClass = this.props.skinConfig.icons.pause.fontStyleClass;
    } else if (this.props.playerState == CONSTANTS.STATE.END) {
      playClass = this.props.skinConfig.icons.replay.fontStyleClass;
    } else {
      playClass = this.props.skinConfig.icons.play.fontStyleClass;
    }
    var muteClass = (this.props.controller.state.muted) ?
      this.props.skinConfig.icons.volume.fontStyleClass : this.props.skinConfig.icons.volumeOff.fontStyleClass;

    var fullscreenClass = (this.props.controller.state.fullscreen) ?
      this.props.skinConfig.icons.compress.fontStyleClass : this.props.skinConfig.icons.expand.fontStyleClass;

    var totalTime = 0;
    if (this.props.duration == null || typeof this.props.duration == 'undefined' || this.props.duration == ""){
      totalTime = Utils.formatSeconds(0);
    }
    else {
      totalTime = Utils.formatSeconds(this.props.duration);
    }

    var volumeBars = [];
    for (var i=0; i<10; i++) {
      //create each volume tick separately
      var turnedOn = this.props.controller.state.volumeState.volume >= (i+1) / 10;
      var highlighted = this.state.mouseOverVolume;
      var volumeClass = "volumeBar";
      if (turnedOn) volumeClass += " on";
      if (highlighted) volumeClass += " highlighted";
      volumeBars.push(<span data-volume={(i+1)/10} className={volumeClass}
        onMouseOver={this.volumeHighlight} onMouseOut={this.volumeRemoveHighlight}
        onClick={this.handleVolumeClick} onTouchEnd={this.handleVolumeClick}></span>);
    }

    var volumeHeadPaddingStyle = {};
    volumeHeadPaddingStyle.left = parseFloat(this.props.controller.state.volumeState.volume) * 100 + "%";
    var volumeIndicatorStyle = {};
    volumeIndicatorStyle.width = volumeHeadPaddingStyle.left;

    var volumeSlider = [];
    volumeSlider.push(
      <div className="volumeSlider" ref="volumeSlider" style={{width: CONSTANTS.UI.VOLUME_SLIDER_WIDTH + "px"}} onTouchEnd={this.handleVolumeBarTouchEnd}>
        <div className="volumeIndicator" style={volumeIndicatorStyle}></div>
        <div className="playheadPadding" style={volumeHeadPaddingStyle}
          onTouchStart={this.handleVolumeHeadTouchStart}>
          <div className="volumeHead"></div>
        </div>
      </div>);

    var volumeControls;
    if (!this.isMobile){
      volumeControls = volumeBars;
    }
    else {
      volumeControls = this.props.controller.state.volumeState.volumeSliderVisible ? volumeSlider : null;
    }

    var iconSetting = {};
    var volumeIconSetting = Utils.clone(this.props.skinConfig.controlBar.iconStyle.inactive);
    var durationSetting = Utils.extend({color: this.props.skinConfig.controlBar.iconStyle.inactive.color}, dynamicStyles.generalIconSetting);

    var watermarkUrl = this.props.skinConfig.controlBar.watermark.imageResource.url;

    // TODO: Update when implementing localization
    var liveText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.LIVE, this.props.localizableStrings);

    if (this.state.mouseOverVolume) {
      volumeIconSetting.opacity = this.props.skinConfig.controlBar.iconStyle.active.opacity;
      volumeIconSetting.color = this.props.skinConfig.controlBar.iconStyle.active.color;
    }
    else {
      volumeIconSetting.opacity = this.props.skinConfig.controlBar.iconStyle.inactive.opacity;
      volumeIconSetting.color = this.props.skinConfig.controlBar.iconStyle.inactive.color;
    }

    var controlItemTemplates = {
      "playPause": <div className="playPause controlBarItem" style={dynamicStyles.generalIconSetting}>
        <span className={playClass} style={dynamicStyles.iconCharacter}
          onClick={this.handlePlayClick} onTouchEnd={this.handlePlayClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </div>,

      "live": <div className="live controlBarItem">
        <div className="liveIndicator">
          <div className="liveCircle"></div>
          <span className="liveText"> {liveText}</span>
        </div>
      </div>,

      "volume": <div className="volume controlBarItem" style={dynamicStyles.generalIconSetting}>
        <span className={muteClass} style={volumeIconSetting} ref="volumeIcon"
          onClick={this.handleVolumeIconClick} onTouchEnd={this.handleVolumeIconClick}
          onMouseOver={this.volumeHighlight} onMouseOut={this.volumeRemoveHighlight}>
        </span>
        {volumeControls}
      </div>,

      "timeDuration": <div className="timeDuration controlBarDuration" style={durationSetting}>
        {Utils.formatSeconds(parseInt(this.props.currentPlayhead))} / {totalTime}
      </div>,

      "flexibleSpace": <div className="flexibleSpace controlBarFlexSpace" ></div>,

      "moreOptions": <div className="moreOptions controlBarItem" style={dynamicStyles.generalIconSetting}>
        <span className={this.props.skinConfig.icons.ellipsis.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleMoreOptionsClick}
          onTouchEnd={this.handleMoreOptionsClick}>
        </span>
      </div>,

      "quality": <div className="quality controlBarItem" style={dynamicStyles.generalIconSetting}>
        <span className={this.props.skinConfig.icons.quality.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </div>,

      "discovery": <div className="discovery controlBarItem" style={dynamicStyles.generalIconSetting}
        onClick={this.handleDiscoveryClick} onTouchEnd={this.handleDiscoveryClick}>
        <span className={this.props.skinConfig.icons.discovery.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </div>,

      "closedCaption": <div className="closedCaption controlBarItem" style={dynamicStyles.generalIconSetting}>
        <span className={this.props.skinConfig.icons.cc.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.handleClosedCaptionClick} onTouchEnd={this.handleClosedCaptionClick}>
        </span>
      </div>,

      "share": <div className="share controlBarItem" style={dynamicStyles.generalIconSetting}>
        <span className={this.props.skinConfig.icons.share.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.handleShareClick} onTouchEnd={this.handleShareClick}>
        </span>
      </div>,

      "fullscreen": <div className="fullscreen controlBarItem" style={dynamicStyles.generalIconSetting}
        onClick={this.handleFullscreenClick} onTouchEnd={this.handleFullscreenClick}>
        <span className={fullscreenClass} style={iconSetting} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}></span>
      </div>,

      "watermark": <div className="watermark controlBarItem">
        <img src={watermarkUrl}></img>
      </div>
    };

    var controlBarItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;

    //if mobile and not showing the slider or the icon, extra space can be added to control bar width:
    var extraSpaceVolumeSlider = ((this.isMobile && !this.props.controller.state.volumeState.volumeSliderVisible) ? parseInt(InlineStyle.volumeSliderStyle.volumeBarSetting.width) : 0);
    var extraSpaceVolumeIcon = ((Utils.isIos()) ?
                                parseInt(InlineStyle.controlBarStyle.controlBarItemSetting.fontSize)+
                                parseInt(InlineStyle.controlBarStyle.controlBarItemSetting.paddingLeft)+
                                parseInt(InlineStyle.controlBarStyle.controlBarItemSetting.paddingRight)
                                : 0);

    //if no hours, add extra space to control bar width:
    var hours = parseInt(this.props.duration / 3600, 10);
    var extraSpaceDuration = (hours > 0) ? 0 : 45;

    var controlBarLeftRightPadding = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING * 2;

    var collapsedResult = Utils.collapse(this.props.controlBarWidth+extraSpaceDuration+extraSpaceVolumeSlider+extraSpaceVolumeIcon-controlBarLeftRightPadding, defaultItems);
    var collapsedControlBarItems = collapsedResult.fit;
    var collapsedMoreOptionsItems = collapsedResult.overflow;

    for (i = 0; i < collapsedControlBarItems.length; i++) {

      // filter out unrecognized button names
      if (typeof controlItemTemplates[collapsedControlBarItems[i].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.closedCaptionOptions.availableLanguages && (collapsedControlBarItems[i].name === "closedCaption")){
        continue;
      }

      if (Utils.isIos() && (collapsedControlBarItems[i].name === "volume")){
        continue;
      }

      if (collapsedControlBarItems[i].name === "moreOptions" && collapsedMoreOptionsItems.length === 0) {
        continue;
      }

      // Not sure what to do when there are multi streams
      if (collapsedControlBarItems[i].name === "live" &&
          (typeof this.props.authorization === 'undefined' ||
          !(this.props.authorization.streams[0].is_live_stream))) {
        continue;
      }

      controlBarItems.push(controlItemTemplates[collapsedControlBarItems[i].name]);
    }
    return controlBarItems;
  },

  /*
  // Saved for responsive control bar
  scaleControlBarItemsBasedOnControlBarSize: function(controlBarHeight) {
    var controlBarWidth = this.props.controlBarWidth;
    var controlBarWidthBase = 0;
    if (controlBarWidth >= 1280) {
      controlBarWidthBase = 1280;
    } else if (controlBarWidth <= 560) {
      controlBarWidthBase = 560;
    } else {
      controlBarWidthBase = controlBarWidth;
    }
    InlineStyle.controlBarStyle.controlBarItemSetting.fontSize = 18 * controlBarWidth / controlBarWidthBase + "px";
    InlineStyle.controlBarStyle.volumeBarStyle.height = 18 * controlBarWidth / controlBarWidthBase + "px";

    // watermark
    var watermarkHeight = 18 * controlBarWidth / controlBarWidthBase;
    InlineStyle.controlBarStyle.watermarkImageStyle.top = (controlBarHeight - watermarkHeight) / 2 + "px";
    InlineStyle.controlBarStyle.watermarkImageStyle.width = this.props.skinConfig.controlBar.watermark.width / this.props.skinConfig.controlBar.watermark.height * watermarkHeight + "px";
    InlineStyle.controlBarStyle.watermarkImageStyle.height = watermarkHeight + "px";
  },

  // Saved for responsive control bar
  scaleControlBarItemsBasedOnHeight: function(controlBarHeight) {
    InlineStyle.controlBarStyle.controlBarSetting.height = controlBarHeight;
    InlineStyle.controlBarStyle.controlBarSetting.bottom = (this.props.controlBarVisible ?
      0 : -1*InlineStyle.controlBarStyle.controlBarSetting.height);
    InlineStyle.controlBarStyle.durationIndicatorSetting.lineHeight = controlBarHeight + "px";
    InlineStyle.controlBarStyle.iconSetting.lineHeight = controlBarHeight + "px";
    InlineStyle.controlBarStyle.volumeIconSetting.lineHeight = controlBarHeight + "px";
    InlineStyle.controlBarStyle.volumeBarStyle.lineHeight = controlBarHeight + "px";
  },
  */

  setupControlBarItemForConstantHeight: function(constantControlBarHeight) {
    var returnStyles = {};
    returnStyles.watermarkImageStyle = {
      width: this.props.skinConfig.controlBar.watermark.width / this.props.skinConfig.controlBar.watermark.height * 18 + "px"
    };

    returnStyles.controlBarSetting= {
      height: constantControlBarHeight,
      bottom: (this.props.controlBarVisible ? 0 : -1 * CONSTANTS.UI.defaultControlBarHeight)
    };
    returnStyles.generalIconSetting = {lineHeight: constantControlBarHeight + "px"};
    returnStyles.durationIndicatorSetting = {lineHeight: constantControlBarHeight + "px"};
    returnStyles.iconSetting = {lineHeight: constantControlBarHeight + "px"};
    returnStyles.volumeIconSetting = {lineHeight: constantControlBarHeight + "px"};
    returnStyles.volumeBarStyle = {lineHeight: constantControlBarHeight + "px"};
    returnStyles.liveItemStyle = {
      lineHeight: constantControlBarHeight + "px"
    };

    returnStyles.iconCharacter = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity
    };
    return returnStyles;
  },


  render: function() {
    // Liusha: Uncomment the following code to support "threshold scaling control bar implementation"
    // var controlBarHeight = Utils.getScaledControlBarHeight(this.props.controlBarWidth);
    // this.scaleControlBarItemsBasedOnControlBarSize(controlBarHeight);
    // this.scaleControlBarItemsBasedOnHeight(controlBarHeight);
    var controlBarStyle = {
      height: CONSTANTS.UI.defaultControlBarHeight,
      bottom: (this.props.controlBarVisible ? 0 : -1 * CONSTANTS.UI.defaultControlBarHeight)
    }

    var controlBarItems = this.populateControlBar();
    return (
      <div className="controlBar" onMouseUp={this.handleControlBarMouseUp} onTouchEnd={this.handleControlBarMouseUp}
        style={controlBarStyle}>
        <div className="controlBarItemsWrapper">
          {controlBarItems}
        </div>
      </div>
    );
  }
});
module.exports = ControlBar;
