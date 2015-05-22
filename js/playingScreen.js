/********************************************************************
  PLAYING SCREEN
*********************************************************************/

var PlayingScreen = React.createClass({
  getInitialState: function() {
    return {
      showControls : true,
      playerState : STATE.PLAYING,
      muted: false,
      volume: 1.0,
      fullscreen: false,
      currentPlayhead: this.props.currentPlayhead,
      currentPlayheadX: 0,
      startingPlayheadX: 0,
      scrubbingPlayheadX: 0,
      duration: this.props.duration,
      scrubbing: false,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
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

  handleMouseMove: function() {
    this.setState({showControls : true});
  },

  handleMouseOut: function() {
    this.setState({showControls : false});
  },

  handlePlayClick: function() {
      this.props.controller.togglePlayPause();
  },

  handlePlayheadMouseDown: function(evt) {
    this.getDOMNode().parentNode.addEventListener("mousemove", this.handlePlayheadMouseMove);
    document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
    this.setState({
      scrubbing: true,
      startingPlayheadX: evt.screenX
    });
  },

  handlePlayheadMouseMove: function(evt) {
    if (this.state.scrubbing) {
      var scrubberWidth = evt.target.parentNode.clientWidth;
      this.setState({
        scrubbingPlayheadX: evt.screenX
      });
    }
  },

  handlePlayheadMouseUp: function(evt) {
    evt.chibble = "rawr";
    evt.stopPropagation();
    var newPlayheadX = evt.screenX;
    var diffX = newPlayheadX - this.state.startingPlayheadX;
    var diffTime = (diffX / this.state.controlBarWidth) * this.state.duration;
    var newPlayheadTime = this.state.currentPlayhead + diffTime;
    this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
    document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      scrubbing: false,
      currentPlayhead: newPlayheadTime
    });
  },

  handleScrubberBarMouseUp: function(evt) {
    var offset = evt.clientX - evt.target.getBoundingClientRect().left;
    var newPlayheadTime = (offset / this.state.controlBarWidth) * this.state.duration;
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      currentPlayhead: newPlayheadTime
    });
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
    var playClass = (this.state.playerState == STATE.PLAYING) ? "glyphicon glyphicon-pause" : "glyphicon glyphicon-play";
    var muteClass = (this.state.muted) ? "glyphicon glyphicon-volume-off" : "glyphicon glyphicon-volume-down";
    var fullscreenClass = (this.state.fullscreen) ? "glyphicon glyphicon-resize-small" : "glyphicon glyphicon-resize-full";

    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    playingScreenStyle.controlBarSetting.height = controlBarHeight;
    playingScreenStyle.controlBarSetting.transform = "translate(0,-" + (this.state.showControls ? playingScreenStyle.controlBarSetting.height : 0) + "px)";
    playingScreenStyle.durationIndicatorSetting.lineHeight = controlBarHeight + "px";
    playingScreenStyle.iconSetting.lineHeight = controlBarHeight + "px";
    playingScreenStyle.scrubberBarSetting.bottom = controlBarHeight;
    playingScreenStyle.bufferedIndicatorStyle.width = (parseFloat(this.props.buffered) / parseFloat(this.props.duration)) * 100 + "%";
    playingScreenStyle.playedIndicatorStyle.width = (parseFloat(this.props.currentPlayhead) / parseFloat(this.props.duration)) * 100 + "%";

    playingScreenStyle.playheadStyle.left = ((parseFloat(this.props.currentPlayhead) / parseFloat(this.props.duration)) * this.state.controlBarWidth);

    if (this.state.scrubbing) {
      playingScreenStyle.playheadStyle.left = playingScreenStyle.playheadStyle.left + (this.state.scrubbingPlayheadX - this.state.startingPlayheadX);
    }
    playingScreenStyle.playheadStyle.left = Math.max(Math.min(this.state.controlBarWidth, playingScreenStyle.playheadStyle.left), 0);

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
      "playPause": <div className="play" style={playingScreenStyle.controlBarItemSetting} onClick={this.handlePlayClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={playClass} style={playingScreenStyle.iconSetting}></span>
      </div>,
      "volume": <div className="volume" style={playingScreenStyle.controlBarItemSetting}>
        <span className={muteClass} style={playingScreenStyle.iconSetting} onClick={this.handleMuteClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}></span>
        {volumeBars}
        </div>,
      "timeDuration": <div className="time-duration" style={playingScreenStyle.durationIndicatorSetting}>{Utils.formatSeconds(parseInt(this.props.currentPlayhead))} / {totalTime}</div>,
      "discovery": <div className="discovery" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-cd" style={playingScreenStyle.iconSetting}></span></div>,
      "bitrateSelector": <div className="bitrate-selector" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-equalizer" style={playingScreenStyle.iconSetting}></span></div>,
      "closedCaption": <div className="closed-caption" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-subtitles" style={playingScreenStyle.iconSetting}></span></div>,
      "share": <div className="share" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-share" style={playingScreenStyle.iconSetting}></span></div>,
      "fullScreen": <div className="fullscreen" style={playingScreenStyle.controlBarItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}><span className={fullscreenClass} style={playingScreenStyle.iconSetting}></span></div>
    };

    var controlBarItems = [];
    var controlBarSetting = this.props.skinConfig.controlBar;
    for (i=0; i < controlBarSetting.items.length; i++) {
      controlBarItems.push(controlItemTemplates[controlBarSetting.items[i]]);
    }

    return (
      <div>
        <div className="scrubberBar" style={playingScreenStyle.scrubberBarSetting} onMouseUp={this.handleScrubberBarMouseUp}>
          <div className="bufferedIndicator" style={playingScreenStyle.bufferedIndicatorStyle}></div>
          <div className="playedIndicator" style={playingScreenStyle.playedIndicatorStyle}></div>
          <div className="playhead" style={playingScreenStyle.playheadStyle} onMouseDown={this.handlePlayheadMouseDown}></div>
        </div>
        <div className="controlBar" style={playingScreenStyle.controlBarSetting}>
          {controlBarItems}
        </div>
      </div>
    );
  }
});