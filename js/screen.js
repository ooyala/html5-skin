/********************************************************************
  PLAYING SCREEN
*********************************************************************/

var PlayingScreen = React.createClass({
  getInitialState: function() {
    return {
      showControls : true,
      playerState : STATE.PLAYING,
    };
  },

  handleMouseMove: function() {
    this.setState({showControls : true});
  },

  handleMouseOut: function() {
    this.setState({showControls : false});
  },

  handleClick: function() {
    this.props.controller.togglePlayPause();
  },

  render: function() {
    var skinSetting = this.props.data.skin;
    var playClass = (this.state.playerState == STATE.PLAYING) ? skinSetting.pauseButton.icon : skinSetting.playButton.icon;

    var controlBarSetting = {
      "background": "rgba(48, 48, 48, 0.8)",
      "width": "100%",
      "height": 24,
      "top": "100%",
      "position": "absolute",
      "padding": 0,
      "margin": 0,
      "listStyle": "none",

      "display": "flex",
      "flexFlow": "row nowrap",
      "justifyContent": "flex-start",
      "zIndex": 11000
    };
    controlBarSetting.transform = "translate(0,-" + (this.state.showControls ? controlBarSetting.height : 0) + "px)";

    var controlItemSetting = {
      "background": "tomato",
      "height": "100%",
      "color": "white",
      "fontWeight": "bold",
      "fontSize": "10",
      "textAlign": "center",
      "width": 50
    };

    var controlItemSetting2 = {
      "background": "green",
      "height": "100%",
      "color": "white",
      "fontWeight": "bold",
      "fontSize": "10",
      "textAlign": "left",
      "flex": 1
    };

    return (
      <div className="controlBar" style={controlBarSetting} >
        <div className={playClass} style={controlItemSetting} onClick={this.handleClick}></div>
        <div className="volume" style={controlItemSetting}>volume button</div>
        <div className="time-duration" style={controlItemSetting2}>time : duration</div>
        <div className="discovery" style={controlItemSetting}>discovery button</div>
        <div className="bitrate-selector" style={controlItemSetting}>bitrate button</div>
        <div className="closed-caption" style={controlItemSetting}>closed caption button</div>
        <div className="share" style={controlItemSetting}>share button</div>
        <div className="fullscreen" style={controlItemSetting}>fullscreen button</div>
      </div>
    );
  }
});

/********************************************************************
  PAUSE SCREEN
*********************************************************************/

var PauseScreen = React.createClass({
  getInitialState: function() {
    return {showControls : true};
  },

  handleMouseMove: function() {
    this.setState({showControls : true});
  },

  handleMouseOut: function() {
    this.setState({showControls : false});
  },

  handleClick: function() {
    this.props.controller.play();
  },

  render: function() {
    var style = {
      width : "100%",
      height : "100%",
      position : "absolute",
      zIndex : 20000,
      overflow: "hidden",
    };

    var skinSetting = this.props.data.skin;
    var playClass = skinSetting.playButton.icon;
    var playStyle = skinSetting.playButton.style;
    playStyle.opacity = this.state.showControls ? 1 : 0;

    return (
      <div style={style} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
      </div>
    );
  }
});

/********************************************************************
  END SCREEN
*********************************************************************/

var EndScreen = React.createClass({
  render: function() {
    return false;
  }
});

/********************************************************************
  ERROR SCREEN
*********************************************************************/

var ErrorScreen = React.createClass({
  render: function() {
    return false;
  }
});
