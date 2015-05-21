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
    console.log("playhead");
    evt.chibble = "rawr";
    evt.stopPropagation();
    console.dir(evt);
    var newPlayheadX = evt.screenX;
    var diffX = newPlayheadX - this.state.startingPlayheadX;
    var diffTime = (diffX / this.state.controlBarWidth) * this.state.duration;
    console.log("diffTime", diffTime, "currentPlayhead", this.state.currentPlayhead);
    var newPlayheadTime = this.state.currentPlayhead + diffTime;
    this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
    document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    console.log("seeking to " + newPlayheadTime);
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      scrubbing: false,
      currentPlayhead: newPlayheadTime
    });
  },

  handleScrubberBarMouseUp: function(evt) {
    console.log("scrubber up");
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
    this.setState({volume: newVolume});
  },

  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  render: function() {
    //var skinSetting = this.props.data.skin;
    var playClass = (this.state.playerState == STATE.PLAYING) ? "glyphicon glyphicon-pause" : "glyphicon glyphicon-play";
    var muteClass = (this.state.muted) ? "glyphicon glyphicon-volume-off" : "glyphicon glyphicon-volume-down";
    var fullscreenClass = (this.state.fullscreen) ? "glyphicon glyphicon-resize-small" : "glyphicon glyphicon-resize-full";

    var controlBarHeight = 32;

    var controlBarSetting = {
      "background": "rgba(48, 48, 48, 0.8)",
      "width": "100%",
      "height": controlBarHeight,
      "top": "100%",
      "position": "absolute",
      "padding": 0,
      "margin": 0,
      "listStyle": "none",
      "display": "flex",
      "flexFlow": "row nowrap",
      "justifyContent": "flex-start",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none"
    };
    controlBarSetting.transform = "translate(0,-" + (this.state.showControls ? controlBarSetting.height : 0) + "px)";

    var controlItemSetting = {
      "height": "100%",
      "color": "rgba(255, 255, 255, 0.6)",
      "fontWeight": "bold",
      "fontSize": "18",
      "textAlign": "center",
      "paddingLeft": "8px",
      "paddingRight": "8px"
    };

    var controlItemSetting2 = {
      "height": "100%",
      "color": "#ffffff",
      "opacity": 0.6,
      "fontWeight": "bold",
      "fontSize": 14,
      "textAlign": "left",
      "flex": 1,
      "lineHeight": controlBarHeight+"px"
    };

    var iconSetting = {
      "lineHeight": controlBarHeight+"px"
    };

    var volumeBarStyle = {
      "display": "inline-block",
      "height": "12px",
      "width": "4px",
      "paddingRight": "2px",
      "backgroundClip": "content-box",
      "position": "relative",
      "top": "-1px"
    };

    var scrubberBarSetting = {
      "background": "#afafaf",
      "width": "100%",
      "height": "4px",
      "padding": 0,
      "margin": 0,
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "position": "absolute",
      "bottom": controlBarHeight
    };

    var bufferedIndicatorStyle = {
      "background": "#7f7f7f",
      "width": (parseFloat(this.props.buffered) / parseFloat(this.props.duration)) * 100 + "%",
      "height": "100%",
      "position": "absolute"
    };

    var playedIndicatorStyle = {
      "background": "#4389ff",
      "width": (parseFloat(this.props.currentPlayhead) / parseFloat(this.props.duration)) * 100 + "%",
      "height": "100%",
      "position": "absolute"
    };

    var playheadStyle = {
      "background": "#ffffff",
      "width": "10px",
      "height": "10px",
      "border": "solid white 1px",
      "borderRadius": "10px",
      "position": "absolute",
      "zIndex": 1,
      "top": "50%",
      "transform": "translateY(-50%)",
      "left": (parseFloat(this.props.currentPlayhead) / parseFloat(this.props.duration)) * this.state.controlBarWidth
    };

    if (this.state.scrubbing) {
      playheadStyle.left = playheadStyle.left + (this.state.scrubbingPlayheadX - this.state.startingPlayheadX);
    }
    playheadStyle.left = Math.max(Math.min(this.state.controlBarWidth, playheadStyle.left), 0);

    var volumeBars = [];
    for (var i=0; i<10; i++) {
      var turnedOn = this.state.volume >= (i+1) / 10;
      var singleBarStyle = Utils.clone(volumeBarStyle);
      singleBarStyle.backgroundColor = (turnedOn ? "rgba(67, 137, 255, 0.6)" : "rgba(255, 255, 255, 0.6)");
      volumeBars.push(<span data-volume={(i+1)/10} style={singleBarStyle} onClick={this.handleVolumeClick}></span>);
    }

    var totalTime = 0;
    if (this.props.contentTree && this.props.contentTree.duration) totalTime = Utils.formatSeconds(this.props.contentTree.duration / 1000);

    return (
      <div>
        <div className="scrubberBar" style={scrubberBarSetting} onMouseUp={this.handleScrubberBarMouseUp}>
          <div className="bufferedIndicator" style={bufferedIndicatorStyle}></div>
          <div className="playedIndicator" style={playedIndicatorStyle}></div>
          <div className="playhead" style={playheadStyle} onMouseDown={this.handlePlayheadMouseDown}></div>
        </div>
        <div className="controlBar" style={controlBarSetting}>
          <div className="play" style={controlItemSetting} onClick={this.handlePlayClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
            <span className={playClass} style={iconSetting}></span>
          </div>
          <div className="volume" style={controlItemSetting}>
            <span className={muteClass} style={iconSetting} onClick={this.handleMuteClick} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}></span>
            {volumeBars}
            </div>
          <div className="time-duration" style={controlItemSetting2}>{Utils.formatSeconds(parseInt(this.props.currentPlayhead))} / {totalTime}</div>
          <div className="discovery" style={controlItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-cd" style={iconSetting}></span></div>
          <div className="bitrate-selector" style={controlItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-equalizer" style={iconSetting}></span></div>
          <div className="closed-caption" style={controlItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-subtitles" style={iconSetting}></span></div>
          <div className="share" style={controlItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="glyphicon glyphicon-share" style={iconSetting}></span></div>
          <div className="fullscreen" style={controlItemSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}><span className={fullscreenClass} style={iconSetting}></span></div>
        </div>
      </div>
    );
  }
});