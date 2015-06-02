/********************************************************************
  CONTROL BAR
*********************************************************************/

var ControlBar = React.createClass({
  getInitialState: function() {
    return {
      fullscreen: false,
      muted: false,
      oldVolume: 1.0,
      volume: 1.0
    };
  },

  handleControlBarMouseUp: function(evt) {
    evt.stopPropagation();
  },

  handleFullscreenClick: function() {
    this.props.controller.toggleFullscreen(!this.state.fullscreen);
    this.setState({fullscreen: !this.state.fullscreen});
  },

  handleMuteClick: function() {
    var newVolumeSettings = {};
    if (!this.state.muted) {
      this.props.controller.setVolume(0);
      //if we're muting, save the current volume so we can
      //restore it when we un-mute
      newVolumeSettings = {
        oldVolume: this.state.volume,
        volume: 0,
        muted: !this.state.muted
      };
    }
    else {
      //restore the volume to the previous setting
      this.props.controller.setVolume(this.state.oldVolume);
      newVolumeSettings = {
        oldVolume: 0,
        volume: this.state.oldVolume,
        muted: !this.state.muted
      };
    }
    this.setState(newVolumeSettings);
  },

  handlePlayClick: function() {
      this.props.controller.togglePlayPause();
  },

  handleVolumeClick: function(evt) {
    var newVolume = parseFloat(evt.target.dataset.volume);
    this.props.controller.setVolume(newVolume);
    this.setState({
      volume: newVolume,
      muted: false
    });
  },

  //TODO(dustin) revisit this, doesn't feel like the "react" way to do this.
  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  populateControlBar: function() {
    var playClass = (this.props.playerState == STATE.PLAYING) ?
      "glyphicon glyphicon-pause" : "glyphicon glyphicon-play";
    var muteClass = (this.state.muted) ?
      "glyphicon glyphicon-volume-off" : "glyphicon glyphicon-volume-down";
    var fullscreenClass = (this.state.fullscreen) ?
      "glyphicon glyphicon-resize-small" : "glyphicon glyphicon-resize-full";

    var totalTime = 0;
    if (this.props.contentTree && this.props.contentTree.duration) {
      totalTime = Utils.formatSeconds(this.props.contentTree.duration / 1000);
    }

    var volumeBars = [];
    for (var i=0; i<10; i++) {
      //create each volume tick separetely
      var turnedOn = this.state.volume >= (i+1) / 10;
      var singleBarStyle = Utils.clone(controlBarStyle.volumeBarStyle);
      singleBarStyle.backgroundColor = (turnedOn ?
        "rgba(67, 137, 255, 0.6)" : "rgba(255, 255, 255, 0.6)");
      //we store which value the tick correlates to via a data attribute on the element
      volumeBars.push(<span data-volume={(i+1)/10} style={singleBarStyle}
        onClick={this.handleVolumeClick}></span>);
    }

    var controlItemTemplates = {
      "playPause": <div className="playPause" style={controlBarStyle.controlBarItemSetting}
        onClick={this.handlePlayClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={playClass} style={controlBarStyle.iconSetting}></span>
      </div>,
      "volume": <div className="volume" style={controlBarStyle.controlBarItemSetting}>
        <span className={muteClass} style={controlBarStyle.iconSetting} onClick={this.handleMuteClick}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}></span>
        {volumeBars}
        </div>,
      "timeDuration": <div className="timeDuration" style={controlBarStyle.durationIndicatorSetting}>
        {Utils.formatSeconds(parseInt(this.props.currentPlayhead))} / {totalTime}</div>,
      "discovery": <div className="discovery" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className="glyphicon glyphicon-cd" style={controlBarStyle.iconSetting}></span></div>,
      "bitrateSelector": <div className="bitrateSelector" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-equalizer"
        style={controlBarStyle.iconSetting}></span></div>,
      "closedCaption": <div className="closedCaption" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-subtitles"
        style={controlBarStyle.iconSetting}></span></div>,
      "share": <div className="share" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-share"
        style={controlBarStyle.iconSetting}></span></div>,
      "fullScreen": <div className="fullscreen" style={controlBarStyle.controlBarItemSetting}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}>
        <span className={fullscreenClass} style={controlBarStyle.iconSetting}></span></div>
    };

    var controlBarItems = [];
    var controlBarSetting = this.props.skinConfig.controlBar;
    for (i=0; i < controlBarSetting.items.length; i++) {
      //filter out unrecognized button names
      if (typeof controlItemTemplates[controlBarSetting.items[i]] === "undefined") {
        continue;
      }
      controlBarItems.push(controlItemTemplates[controlBarSetting.items[i]]);
    }
    return controlBarItems;
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = this.props.controlBarHeight;
    controlBarStyle.controlBarSetting.height = controlBarHeight;
    controlBarStyle.controlBarSetting.transform = "translate(0,-" +
      (this.props.controlBarVisible ? controlBarStyle.controlBarSetting.height : 0) + "px)";
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