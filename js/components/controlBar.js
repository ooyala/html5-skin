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
      playClass = "icon icon-pause";
    } else if (this.props.playerState == STATE.END) {
      playClass = "icon icon-upnext-replay";
    } else {
      playClass = "icon icon-play";
    }
    var muteClass = (this.props.controller.state.muted) ?
      "icon icon-volume-desktop" : "icon icon-volume-desktop";

    var fullscreenClass = (this.props.controller.state.fullscreen) ?
      "icon icon-resize-small" : "icon icon-resize-large";

    var totalTime = 0;
    console.log("***************");
    console.log(this.props.duration);
    console.log("***************");
    totalTime = Utils.formatSeconds(this.props.duration);

    var volumeBars = [];
    for (var i=0; i<10; i++) {
      //create each volume tick separetely
      var turnedOn = this.props.controller.state.volumeState.volume >= (i+1) / 10;
      var singleBarStyle = Utils.clone(controlBarStyle.volumeBarStyle);
      singleBarStyle.backgroundColor = (turnedOn ?
        "rgba(67, 137, 255, 0.6)" : "rgba(255, 255, 255, 0.6)");
      //we store which value the tick correlates to via a data attribute on the element
      volumeBars.push(<span data-volume={(i+1)/10} style={singleBarStyle}
        onClick={this.handleVolumeClick}></span>);
    }
    var watermarkUrl = this.props.skinConfig.controlBar.watermark.url;
    var watermarkImageStyle = controlBarStyle.watermarkImageStyle;
    // 16 is 50% of control bar height right now. Will be fetched from config file later
    watermarkImageStyle.width = this.props.skinConfig.controlBar.watermark.width / this.props.skinConfig.controlBar.watermark.height * 16;

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
      "moreOptions": <div className="moreOptions" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleMoreOptionsClick}>
        <span className="icon icon-menu" style={controlBarStyle.iconSetting}></span></div>,
      "discovery": <div className="discovery" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick}>
        <span className="icon icon-topmenu-discovery" style={controlBarStyle.iconSetting}></span></div>,
      "bitrateSelector": <div className="bitrateSelector" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-quality"
        style={controlBarStyle.iconSetting}></span></div>,
      "closedCaption": <div className="closedCaption" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-cc"
        onClick={this.handleClosedCaptionClick} style={controlBarStyle.iconSetting}></span></div>,
      "share": <div className="share" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-share"
        onClick={this.handleShareClick} style={controlBarStyle.iconSetting}></span></div>,
      "fullscreen": <div className="fullscreen" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}>
        <span className={fullscreenClass} style={controlBarStyle.iconSetting}></span></div>,
      "watermark": <div className="watermark" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <img src={watermarkUrl} style={controlBarStyle.watermarkImageStyle}></img></div>
    };

    var controlBarItems = [];
    var controlBarSetting = this.props.skinConfig.controlBar;
    for (i=0; i < controlBarSetting.items.length; i++) {
      // filter out unrecognized button names
      if (typeof controlItemTemplates[controlBarSetting.items[i].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.ccOptions.availableLanguages && (controlBarSetting.items[i].name === "closedCaption")){
        continue;
      }

      // Not sure what to do when there are multi streams
      if (controlBarSetting.items[i].name === "live" &&
          (typeof this.props.authorization === 'undefined' ||
          !(this.props.authorization.streams[0].is_live_stream))) {
        continue;
      }

      controlBarItems.push(controlItemTemplates[controlBarSetting.items[i].name]);
    }
    return controlBarItems;
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = this.props.controlBarHeight;
    controlBarStyle.controlBarSetting.height = controlBarHeight;
    controlBarStyle.controlBarSetting.bottom = (this.props.controlBarVisible ?
      0 : -1*this.props.controlBarHeight);

    controlBarStyle.durationIndicatorSetting.lineHeight = controlBarHeight + "px";
    controlBarStyle.iconSetting.lineHeight = controlBarHeight + "px";

    var controlBarItems = this.populateControlBar();

    return (
      <div className="controlBar" onMouseUp={this.handleControlBarMouseUp}
        style={controlBarStyle.controlBarSetting}>
        {controlBarItems}
      </div>
    );
  }
});