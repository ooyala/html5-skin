/********************************************************************
  CONTROL BAR
*********************************************************************/

var ControlBar = React.createClass({
  componentDidMount: function(){
    if (Utils.isSafari()){
      controlBarStyle.controlBarSetting.display = "-webkit-flex";
    }
    else {
      controlBarStyle.controlBarSetting.display = "flex";
    }
  },

  handleControlBarMouseUp: function(evt) {
    evt.stopPropagation();
  },

  handleFullscreenClick: function() {
    this.props.controller.toggleFullscreen();
  },

  handleMuteClick: function() {
    this.props.controller.handleMuteClick();
  },

  handlePlayClick: function() {
    this.props.controller.togglePlayPause();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleVolumeClick: function(evt) {
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
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  populateControlBar: function() {
    if (this.props.playerState == STATE.PLAYING) {
      playClass = this.props.skinConfig.icons.pause.fontStyleClass;
    } else if (this.props.playerState == STATE.END) {
      playClass = this.props.skinConfig.icons.replay.fontStyleClass;
    } else {
      playClass = this.props.skinConfig.icons.play.fontStyleClass;
    }
    var muteClass = (this.props.controller.state.muted) ?
      this.props.skinConfig.icons.volume.fontStyleClass : this.props.skinConfig.icons.volumeOff.fontStyleClass;

    var fullscreenClass = (this.props.controller.state.fullscreen) ?
      this.props.skinConfig.icons.compress.fontStyleClass : this.props.skinConfig.icons.expand.fontStyleClass;

    var totalTime = 0;
    totalTime = Utils.formatSeconds(this.props.duration);

    var volumeBars = [];
    for (var i=0; i<10; i++) {
      //create each volume tick separately
      var turnedOn = this.props.controller.state.volumeState.volume >= (i+1) / 10;
      var singleBarStyle = Utils.clone(controlBarStyle.volumeBarStyle);
      singleBarStyle.backgroundColor = (turnedOn ?
        "rgba(67, 137, 255, 0.6)" : "rgba(255, 255, 255, 0.6)");
      //we store which value the tick correlates to via a data attribute on the element
      volumeBars.push(<span data-volume={(i+1)/10} style={singleBarStyle}
        onClick={this.handleVolumeClick}></span>);
    }
    var watermarkUrl = this.props.skinConfig.controlBar.watermark.imageResource.url;
    var watermarkImageStyle = controlBarStyle.watermarkImageStyle;

    // TODO: Update when implementing localization
    var liveText = "LIVE";

    var controlItemTemplates = {
      "playPause": <div className="playPause" style={controlBarStyle.controlBarItemSetting}
        onClick={this.handlePlayClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={playClass} style={controlBarStyle.iconSetting}></span>
      </div>,

      "live": <div className="live" style={controlBarStyle.liveItemStyle}>
        <div style={controlBarStyle.liveCircleStyle}></div>
        <div style={controlBarStyle.liveTextStyle}>{liveText}</div>
      </div>,
      
      "volume": <div className="volume" style={controlBarStyle.controlBarItemSetting}>
        <span className={muteClass} style={controlBarStyle.iconSetting} onClick={this.handleMuteClick}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}></span>
        {volumeBars}
      </div>,
      
      "timeDuration": <div className="timeDuration" style={controlBarStyle.durationIndicatorSetting}>
        {Utils.formatSeconds(parseInt(this.props.currentPlayhead))} / {totalTime}</div>,

      "flexibleSpace": <div className="flexibleSpace" style={controlBarStyle.flexibleSpace}></div>,

      "moreOptions": <div className="moreOptions" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleMoreOptionsClick}>
        <span className={this.props.skinConfig.icons.setting.fontStyleClass} style={controlBarStyle.iconSetting}></span></div>,

      "quality": <div className="quality" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={this.props.skinConfig.icons.quality.fontStyleClass} style={controlBarStyle.iconSetting}></span></div>,

      "discovery": <div className="discovery" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick}>
        <span className={this.props.skinConfig.icons.discovery.fontStyleClass} style={controlBarStyle.iconSetting}></span></div>,
    
      "closedCaption": <div className="closedCaption" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className={this.props.skinConfig.icons.cc.fontStyleClass}
        onClick={this.handleClosedCaptionClick} style={controlBarStyle.iconSetting}></span></div>,
      
      "share": <div className="share" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className={this.props.skinConfig.icons.share.fontStyleClass}
        onClick={this.handleShareClick} style={controlBarStyle.iconSetting}></span></div>,

      "fullscreen": <div className="fullscreen" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}>
        <span className={fullscreenClass} style={controlBarStyle.iconSetting}></span></div>,
      
      "watermark": <div className="watermark" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <img src={watermarkUrl} style={controlBarStyle.watermarkImageStyle}></img></div>
    };

    var controlBarItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;
    var collapsedResult = Utils.collapse(this.props.controlBarWidth, defaultItems);
    var collapsedControlBarItems = collapsedResult.fit; 
    var collapsedMoreOptionsItems = collapsedResult.overflow;

    for (i = 0; i < collapsedControlBarItems.length; i++) {

      // filter out unrecognized button names
      if (typeof controlItemTemplates[collapsedControlBarItems[i].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.ccOptions.availableLanguages && (collapsedControlBarItems[i].name === "closedCaption")){
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
    controlBarStyle.controlBarItemSetting.fontSize = 18 * controlBarWidth / controlBarWidthBase + "px";
    controlBarStyle.volumeBarStyle.height = 18 * controlBarWidth / controlBarWidthBase + "px";
    
    // watermark
    var watermarkHeight = 18 * controlBarWidth / controlBarWidthBase;
    controlBarStyle.watermarkImageStyle.top = (controlBarHeight - watermarkHeight) / 2 + "px";
    controlBarStyle.watermarkImageStyle.width = this.props.skinConfig.controlBar.watermark.width / this.props.skinConfig.controlBar.watermark.height * watermarkHeight + "px";
    controlBarStyle.watermarkImageStyle.height = watermarkHeight + "px";
  },

  // Saved for responsive control bar
  scaleControlBarItemsBasedOnHeight: function(controlBarHeight) {
    controlBarStyle.controlBarSetting.height = controlBarHeight;
    controlBarStyle.controlBarSetting.bottom = (this.props.controlBarVisible ?
      0 : -1*controlBarStyle.controlBarSetting.height);
    controlBarStyle.durationIndicatorSetting.lineHeight = controlBarHeight + "px";
    controlBarStyle.iconSetting.lineHeight = controlBarHeight + "px"; 
    controlBarStyle.volumeBarStyle.lineHeight = controlBarHeight + "px";
  },


  setupControlBarItemForConstantHeight: function(constantControlBarHeight) {
    controlBarStyle.watermarkImageStyle.width = this.props.skinConfig.controlBar.watermark.width / this.props.skinConfig.controlBar.watermark.height * 18 + "px";

    controlBarStyle.controlBarSetting.height = constantControlBarHeight;
    controlBarStyle.controlBarSetting.bottom = (this.props.controlBarVisible ?
      0 : -1*controlBarStyle.controlBarSetting.height);
    controlBarStyle.durationIndicatorSetting.lineHeight = constantControlBarHeight + "px";
    controlBarStyle.iconSetting.lineHeight = constantControlBarHeight + "px"; 
    controlBarStyle.volumeBarStyle.lineHeight = constantControlBarHeight + "px";
  },


  render: function() {
    // Liusha: Uncomment the following code to support "threshold scaling control bar implementation"
    // var controlBarHeight = Utils.getScaledControlBarHeight(this.props.controlBarWidth);
    // this.scaleControlBarItemsBasedOnControlBarSize(controlBarHeight);
    // this.scaleControlBarItemsBasedOnHeight(controlBarHeight);

    this.setupControlBarItemForConstantHeight(60);
    var controlBarItems = this.populateControlBar();
    return (
      <div className="controlBar" onMouseUp={this.handleControlBarMouseUp}
        style={controlBarStyle.controlBarSetting}>
        {controlBarItems}
      </div>
    );
  }
});