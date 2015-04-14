/********************************************************************
  START SCREEN
*********************************************************************/

var StartScreen = React.createClass({
  getInitialState: function() {
    return {showControls : true};
  },

  handleClick: function() {
    this.props.controller.play();
  },

  render: function() {
    var skinSetting = this.props.data.skin;
    var playClass = skinSetting.startScreen.playButton.icon;
    var playStyle = skinSetting.startScreen.playButton.style;
    playStyle.zIndex = skinSetting.startScreen.style.zIndex + 1;

    var backgroundStyle = skinSetting.startScreen.background.style;
    _.extend(backgroundStyle, {"backgroundImage": "url(" + this.props.contentTree.promo_image + ")"});

    return (
      <div style={skinSetting.startScreen.style}>
        <div style={backgroundStyle} />
        <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
        <div className="startscreen-info" style={skinSetting.startScreen.infoPanel.style} >
          <p style={skinSetting.startScreen.infoPanel.title.style}>{this.props.contentTree.title}</p>
          <p style={skinSetting.startScreen.infoPanel.description.style}>{this.props.contentTree.description}</p>
        </div>
      </div>
    );
  }
});

/********************************************************************
  PLAYING SCREEN
*********************************************************************/

var PlayingScreen = React.createClass({
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
    this.props.controller.pause();
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
    var playClass = skinSetting.pauseButton.icon;
    var playStyle = skinSetting.pauseButton.style;
    playStyle.opacity = this.state.showControls ? 1 : 0;

    return (
      <div style={style} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
        <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
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