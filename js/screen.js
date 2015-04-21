/********************************************************************
  START SCREEN
*********************************************************************/

var StartScreen = React.createClass({
  getInitialState: function() {
    return {
      showControls : true,
      style: {
        width: "100%",
        height: "100%",
        position: "absolute",
        overflow: "hidden",
      },
      posterStyle: {
        height: "100%",
        width: "100%",
        position: "absolute",
        backgroundImage: "url('"+this.props.contentTree.promo_image+"')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        visibility: "hidden"
      },
      infoPanel: {
        style: {
          position: "absolute",
          bottom: "3%",
          left: "3%",
          width: "100%"
        },
        title: {
          style: {
            fontSize: "32px",
            color: "rgba(255, 255, 255, 1)",
            fontWeight: "bold",
            maxWidth: "70%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }
        },
        description: {
          style: {
            fontSize: "24",
            color: "rgba(255, 255, 255, 1)",
            maxWidth: "70%",
            overflow: "visible"
          }
        }
      },
      playButton: {
        icon: "glyphicon glyphicon-play",
        style: {
          fontSize: "72",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "absolute",
          opacity: 1,
          transition: "opacity .25s ease-in-out",
          color:"white"
        }
      },
      posterFullsize: true,
      description: this.props.contentTree.description
    };
  },

  // Fetch the image so we can get the actual dimensions to determine which
  // preview layout we need to use.
  componentWillMount: function() {
    var posterImage = document.createElement("img");
    posterImage.addEventListener("load", _.bind(this.renderPoster, this, posterImage));
    posterImage.src = this.props.contentTree.promo_image;
  },

  // CSS doesn't support "truncate N lines" so we need to do DOM width
  // calculations to figure out where to truncate the description
  componentDidMount: function() {
    var actualNode = this.getDOMNode();
    var testText = document.createElement("span");
    testText.style.visibility = "hidden";
    testText.style.position = "absolute";
    testText.style.whiteSpace = "nowrap";
    testText.style.fontSize = this.state.infoPanel.description.style.fontSize;
    testText.innerHTML = this.state.description;
    actualNode.appendChild(testText);
    var actualWidth = actualNode.getElementsByClassName("startscreen-description")[0].clientWidth;
    var textWidth = testText.scrollWidth;

    if (textWidth > (actualWidth * 1.8)){
      var truncPercent = actualWidth / textWidth;
      var newWidth = (Math.floor(truncPercent * this.state.description.length) * 1.8) - 3;
      this.setState({description: (this.state.description.slice(0,newWidth) + "...")});
    }
    testText.parentNode.removeChild(testText);
  },

  handleClick: function() {
    this.props.controller.play();
  },

  renderPoster: function(posterImage) {
    var actualNode = this.getDOMNode();
    var elemWidth = actualNode.clientWidth;
    var elemHeight = actualNode.clientHeight;
    var infoBox = actualNode.getElementsByClassName("startscreen-info")[0];
    if (posterImage.height < elemHeight && posterImage.width < elemWidth) {
      var newPosterStyle = _.clone(this.state);
      newPosterStyle.posterFullsize = false;
      newPosterStyle.posterStyle.backgroundSize = "auto";
      newPosterStyle.posterStyle.backgroundPosition = "left " +
        this.props.data.skin.startScreen.infoPanel.style.left +
        " bottom " + infoBox.clientHeight + "px";
      this.setState(newPosterStyle);
    }
    actualNode.getElementsByClassName("startscreen-poster")[0].style.visibility = "visible";
  },

  render: function() {
    var playClass = this.state.playButton.icon;
    var playStyle = this.state.playButton.style;

    if (this.state.posterFullsize) {
      // If the image is large enough, cover the entire player div
      return (
        <div style={this.state.style}>
          <div className="startscreen-poster" style={this.state.posterStyle}></div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
          <div className="startscreen-info" style={this.state.infoPanel.style}>
            <div className="startscreen-title" style={this.state.infoPanel.title.style}>{this.props.contentTree.title}</div>
            <div className="startscreen-description" style={this.state.infoPanel.description.style}>{this.state.description}</div>
          </div>
        </div>
      );
    } else {
      // If the image is smaller than the player, have it layout with the
      // title and description
      return (
        <div style={this.state.style}>
          <div className="startscreen-info" style={this.state.infoPanel.style}>
            <img className="startscreen-poster" src={this.props.contentTree.promo_image}/>
            <div className="startscreen-title" style={this.state.infoPanel.title.style}>{this.props.contentTree.title}</div>
            <div className="startscreen-description" style={this.state.infoPanel.description.style}>{this.state.description}</div>
          </div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
      );
    }

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
