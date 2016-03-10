/********************************************************************
  CONTROL BAR
*********************************************************************/
var React = require('react'),
    ReactDOM = require('react-dom'),
    CONSTANTS = require('../constants/constants'),
    ClassNames = require('classnames'),
    Slider = require('./slider'),
    Utils = require('./utils'),
    VideoQualityPopover = require('./videoQualityPopover');

var ControlBar = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(this.props.responsiveView);
    this.volumeSliderValue = 0;

    return {
      currentVolumeHead: 0,
      showVideoQualityPopover: false
    };
  },

  getResponsiveUIMultiple: function(responsiveView){
    return responsiveView == this.props.skinConfig.responsive.breakpoints.sm.name ?
      this.props.skinConfig.responsive.breakpoints.sm.multiplier :
      this.props.skinConfig.responsive.breakpoints.md.multiplier;
  },

  componentWillUnmount: function () {
    this.props.controller.cancelTimer();
    if (Utils.isAndroid()){
      this.props.controller.hideVolumeSliderBar();
    }
  },

  componentDidUpdate: function () {
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(this.props.responsiveView);
  },

  handleControlBarMouseUp: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.props.controller.startHideControlBarTimer();
    }
  },

  handleFullscreenClick: function(evt) {
    // On mobile, we get a following click event that fires after the Video
    // has gone full screen, clicking on a different UI element. So we prevent
    // the following click.
    evt.stopPropagation();
    evt.cancelBubble = true;
    evt.preventDefault();
    this.props.controller.toggleFullscreen();
  },

  handleVolumeIconClick: function(evt) {
    if (this.isMobile){
      this.props.controller.startHideControlBarTimer();
      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE
      if (!this.props.controller.state.volumeState.volumeSliderVisible){
        this.props.controller.showVolumeSliderBar();
      }
      else {
        this.props.controller.handleMuteClick();
      }
    }
    else{
      this.props.controller.handleMuteClick();
    }
  },

  handlePlayClick: function() {
    this.props.controller.togglePlayPause();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleQualityClick: function() {
    if(this.props.responsiveView == this.props.skinConfig.responsive.breakpoints.sm.name) {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
    } else {
      this.toggleQualityPopover();
    }

  },

  toggleQualityPopover: function() {
    this.setState({
      showVideoQualityPopover: !this.state.showVideoQualityPopover
    });
  },

  handleVolumeClick: function(evt) {
    evt.preventDefault();
    var newVolume = parseFloat(evt.target.dataset.volume);
    this.props.controller.setVolume(newVolume);
  },

  handleDiscoveryClick: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleMoreOptionsClick: function() {
    this.props.controller.toggleMoreOptionsScreen();
  },

  handleClosedCaptionClick: function() {
    this.props.controller.toggleClosedCaptionScreen();
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
    this.highlight({target: ReactDOM.findDOMNode(this.refs.volumeIcon)});
  },

  volumeRemoveHighlight:function() {
    this.removeHighlight({target: ReactDOM.findDOMNode(this.refs.volumeIcon)});
  },

  handleWatermarkClick: function() {
    var watermarkClickUrl = this.props.skinConfig.controlBar.watermark.clickUrl;
    if (watermarkClickUrl){
      window.open(watermarkClickUrl,'_blank');
    }
  },

  changeVolumeSlider: function(event) {
    var newVolume = parseFloat(event.target.value);
    this.props.controller.setVolume(newVolume);
    this.setState({
      volumeSliderValue: event.target.value
    });
  },
  populateControlBar: function() {
    var dynamicStyles = this.setupItemStyle();
    var playClass = "";
    if (this.props.playerState == CONSTANTS.STATE.PLAYING) {
      playClass = this.props.skinConfig.icons.pause.fontStyleClass;
    } else if (this.props.playerState == CONSTANTS.STATE.END) {
      playClass = this.props.skinConfig.icons.replay.fontStyleClass;
    } else {
      playClass = this.props.skinConfig.icons.play.fontStyleClass;
    }
    var muteClass = (this.props.controller.state.volumeState.muted) ?
      this.props.skinConfig.icons.volumeOff.fontStyleClass : this.props.skinConfig.icons.volume.fontStyleClass;

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
      var volumeClass = ClassNames({
        "volumeBar": true,
        "on": turnedOn
      });
      volumeBars.push(<a data-volume={(i+1)/10} className={volumeClass} key={i}
        onClick={this.handleVolumeClick}></a>);
    }

    var volumeSlider = <div className="volumeSlider"><Slider value={parseFloat(this.props.controller.state.volumeState.volume)}
                        onChange={this.changeVolumeSlider}
                        className={"slider slider-volume"}
                        itemRef={"volumeSlider"}
                        minValue={"0"}
                        maxValue={"1"}
                        step={"0.1"}/></div>;

    var volumeControls;
    if (!this.isMobile){
      volumeControls = volumeBars;
    }
    else {
      volumeControls = this.props.controller.state.volumeState.volumeSliderVisible ? volumeSlider : null;
    }

    var iconSetting = {};
    var volumeIconSetting = Utils.clone(this.props.skinConfig.controlBar.iconStyle.inactive);
    var durationSetting = {color: this.props.skinConfig.controlBar.iconStyle.inactive.color};
    var watermarkUrl = this.props.skinConfig.controlBar.watermark.imageResource.url;
    var currentPlayheadTime = isFinite(parseInt(this.props.currentPlayhead)) ? Utils.formatSeconds(parseInt(this.props.currentPlayhead)) : null;
    var totalTimeContent = this.props.authorization.streams[0].is_live_stream ? null : <span className="total-time">{totalTime}</span>;

    // TODO: Update when implementing localization
    var liveText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.LIVE, this.props.localizableStrings);

    var qualityClass = ClassNames({
      "quality": true,
      "controlBarItem": true,
      "selected": this.state.showVideoQualityPopover
    });

    var watermarkClass = ClassNames({
      "watermark": true,
      "controlBarItem": true,
      "nonClickableWatermark": !this.props.skinConfig.controlBar.watermark.clickUrl
    });

    var controlItemTemplates = {
      "playPause": <button className="playPause controlBarItem" onClick={this.handlePlayClick} key="playPause">
        <span className={playClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "live": <div className="live controlBarItem" key="live">
        <div className="liveIndicator">
          <div className="liveCircle"></div>
          <span className="liveText"> {liveText}</span>
        </div>
      </div>,

      "volume": <div className="volume controlBarItem" key="volume">
        <span className={muteClass} style={volumeIconSetting} ref="volumeIcon" onClick={this.handleVolumeIconClick}
              onMouseOver={this.volumeHighlight} onMouseOut={this.volumeRemoveHighlight}>
        </span>
        {volumeControls}
      </div>,

      "timeDuration": <div className="timeDuration controlBarDuration" style={durationSetting} key="timeDuration">
        <span>{currentPlayheadTime}</span>{totalTimeContent}
      </div>,

      "flexibleSpace": <div className="flexibleSpace controlBarFlexSpace" key="flexibleSpace"></div>,

      "moreOptions": <button className="moreOptions controlBarItem"
        onClick={this.handleMoreOptionsClick} key="moreOptions">
        <span className={this.props.skinConfig.icons.ellipsis.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "quality": <button className={qualityClass}
        onClick={this.handleQualityClick} key="quality">
        <span className={this.props.skinConfig.icons.quality.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "discovery": <button className="discovery controlBarItem"
        onClick={this.handleDiscoveryClick} key="discovery">
        <span className={this.props.skinConfig.icons.discovery.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "closedCaption": <button className="closedCaption controlBarItem"
        onClick={this.handleClosedCaptionClick} key="closedCaption">
        <span className={this.props.skinConfig.icons.cc.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "share": <button className="share controlBarItem"
        onClick={this.handleShareClick} key="share">
        <span className={this.props.skinConfig.icons.share.fontStyleClass} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "fullscreen": <button className="fullscreen controlBarItem"
        onClick={this.handleFullscreenClick} key="fullscreen">
        <span className={fullscreenClass} style={iconSetting} style={dynamicStyles.iconCharacter}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span>
      </button>,

      "watermark": <div className={watermarkClass} key="watermark" style = {dynamicStyles.watermarkImageStyle}>
        <img src={watermarkUrl} onClick={this.handleWatermarkClick}/>
      </div>
    };

    var controlBarItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;

    //if mobile and not showing the slider or the icon, extra space can be added to control bar width:
    var volumeItem = null;
    for (var j = 0; j < defaultItems.length; j++) {
      if (defaultItems[j].name == "volume") {
        volumeItem = defaultItems[j];
        break;
      }
    }
    var extraSpaceVolumeSlider = (((volumeItem && this.isMobile && !this.props.controller.state.volumeState.volumeSliderVisible) || volumeItem && Utils.isIos()) ? parseInt(volumeItem.minWidth) : 0);

    //if no hours, add extra space to control bar width:
    var hours = parseInt(this.props.duration / 3600, 10);
    var extraSpaceDuration = (hours > 0) ? 0 : 45;

    var controlBarLeftRightPadding = this.responsiveUIMultiple * CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING * 2;

    var collapsedResult = Utils.collapse(this.props.controlBarWidth + extraSpaceDuration + extraSpaceVolumeSlider - controlBarLeftRightPadding, defaultItems, this.responsiveUIMultiple);
    var collapsedControlBarItems = collapsedResult.fit;
    var collapsedMoreOptionsItems = collapsedResult.overflow;

    for (var k = 0; k < collapsedControlBarItems.length; k++) {

      // filter out unrecognized button names
      if (typeof controlItemTemplates[collapsedControlBarItems[k].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.closedCaptionOptions.availableLanguages && (collapsedControlBarItems[k].name === "closedCaption")){
        continue;
      }

      //do not show quality button if no bitrates available
      if (!this.props.controller.state.videoQualityOptions.availableBitrates && (collapsedControlBarItems[k].name === "quality")){
        continue;
      }

      //do not show discovery button if no related videos available
      if (!this.props.controller.state.discoveryData && (collapsedControlBarItems[k].name === "discovery")){
        continue;
      }

      if (Utils.isIos() && (collapsedControlBarItems[k].name === "volume")){
        continue;
      }

      if (collapsedControlBarItems[k].name === "moreOptions" && collapsedMoreOptionsItems.length === 0) {
        continue;
      }

      // Not sure what to do when there are multi streams
      if (collapsedControlBarItems[k].name === "live" &&
          (typeof this.props.authorization === 'undefined' ||
          !(this.props.authorization.streams[0].is_live_stream))) {
        continue;
      }

      controlBarItems.push(controlItemTemplates[collapsedControlBarItems[k].name]);
    }
    return controlBarItems;
  },

  setupItemStyle: function() {
    var returnStyles = {};

    for (element in this.props.skinConfig.buttons.desktopContent){
      if (this.props.skinConfig.buttons.desktopContent[element].name == "watermark"){
        returnStyles.watermarkImageStyle = {
          width: this.responsiveUIMultiple * this.props.skinConfig.buttons.desktopContent[element].minWidth + "px"
        };
      }
    }

    returnStyles.iconCharacter = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity
    };
    return returnStyles;
  },


  render: function() {
    var controlBarClass = ClassNames({
      "control-bar": true,
      "control-bar-hidden": !this.props.controlBarVisible,
      "control-bar-visible": this.props.controlBarVisible
    });

    var controlBarItems = this.populateControlBar();

    var videoQualityPopover = this.state.showVideoQualityPopover ? <VideoQualityPopover {...this.props} togglePopoverAction={this.toggleQualityPopover}/> : null;

    return (
      <div className={controlBarClass} onMouseUp={this.handleControlBarMouseUp} onTouchEnd={this.handleControlBarMouseUp}
>
        <div className="controlBarItemsWrapper">
          {controlBarItems}
        </div>
        {videoQualityPopover}
      </div>
    );
  }
});

ControlBar.defaultProps = {
  authorization: {
    streams: [
      {is_live_stream: false}
    ]
  }
};

module.exports = ControlBar;