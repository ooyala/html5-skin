/********************************************************************
  CONTROL BAR
*********************************************************************/

var ControlBar = React.createClass({
  getInitialState: function() {
    return {
      muted: false,
      volume: 1.0,
      fullscreen: false
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
    this.props.controller.toggleMute(!this.state.muted);
    this.setState({
      muted: !this.state.muted,
      volume: (!this.state.muted ? 0 : 1.0)
    });
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

  render: function() {
    var playClass = (this.props.playerState == STATE.PLAYING) ? "glyphicon glyphicon-pause" : "glyphicon glyphicon-play";
    var muteClass = (this.state.muted) ? "glyphicon glyphicon-volume-off" : "glyphicon glyphicon-volume-down";
    var fullscreenClass = (this.state.fullscreen) ? "glyphicon glyphicon-resize-small" : "glyphicon glyphicon-resize-full";

    //Fill in all the dynamic style values we need
    var controlBarHeight = this.props.controlBarHeight;
    playingScreenStyle.controlBarSetting.height = controlBarHeight;
    playingScreenStyle.controlBarSetting.transform = "translate(0,-" + (this.props.controlBarVisible ? playingScreenStyle.controlBarSetting.height : 0) + "px)";
    playingScreenStyle.durationIndicatorSetting.lineHeight = controlBarHeight + "px";
    playingScreenStyle.iconSetting.lineHeight = controlBarHeight + "px";

    var volumeBars = [];
    for (var i=0; i<10; i++) {
      var turnedOn = this.state.volume >= (i+1) / 10;
      var singleBarStyle = Utils.clone(playingScreenStyle.volumeBarStyle);
      singleBarStyle.backgroundColor = (turnedOn ? "rgba(67, 137, 255, 0.6)" : "rgba(255, 255, 255, 0.6)");
      volumeBars.push(<span data-volume={(i+1)/10} style={singleBarStyle} onClick={this.handleVolumeClick}></span>);
    }

    var totalTime = 0;
    if (this.props.contentTree && this.props.contentTree.duration) totalTime = Utils.formatSeconds(this.props.contentTree.duration / 1000);

    var controlItemTemplates = {
      "playPause": <div className="playPause" style={playingScreenStyle.controlBarItemSetting} onClick={this.handlePlayClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={playClass} style={playingScreenStyle.iconSetting}></span>
      </div>,
      "volume": <div className="volume" style={playingScreenStyle.controlBarItemSetting}>
        <span className={muteClass} style={playingScreenStyle.iconSetting} onClick={this.handleMuteClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}></span>
        {volumeBars}
        </div>,
      "timeDuration": <div className="timeDuration" style={playingScreenStyle.durationIndicatorSetting}>{Utils.formatSeconds(parseInt(this.props.currentPlayhead))} / {totalTime}</div>,
      "discovery": <div className="discovery" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-cd" style={playingScreenStyle.iconSetting}></span></div>,
      "bitrateSelector": <div className="bitrateSelector" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-equalizer" style={playingScreenStyle.iconSetting}></span></div>,
      "closedCaption": <div className="closedCaption" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-subtitles" style={playingScreenStyle.iconSetting}></span></div>,
      "share": <div className="share" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-share" style={playingScreenStyle.iconSetting}></span></div>,
      "fullScreen": <div className="fullscreen" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}><span className={fullscreenClass} style={playingScreenStyle.iconSetting}></span></div>
    };

    var controlBarItems = [];
    var controlBarSetting = this.props.skinConfig.controlBar;
    for (i=0; i < controlBarSetting.items.length; i++) {
      if (typeof controlItemTemplates[controlBarSetting.items[i]] === "undefined") {
        continue;
      }
      controlBarItems.push(controlItemTemplates[controlBarSetting.items[i]]);
    }

    return (
      <div className="controlBar" onMouseUp={this.handleControlBarMouseUp} style={playingScreenStyle.controlBarSetting}>
        {controlBarItems}
      </div>
    );
  }
});