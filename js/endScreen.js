/********************************************************************
  END SCREEN
*********************************************************************/

var EndScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      description: this.props.contentTree.description,
      controlBarVisible: Utils.isIPhone()?false:true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function() {
    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);

    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    //for iPhone end screen mimics the start screen
    if (Utils.isIPhone() &&
      (this.props.skinConfig.startScreen.showTitle ||
      this.props.skinConfig.startScreen.showDescription)) {
      var descriptionNode = this.getDOMNode().getElementsByClassName("endscreen-description")[0];
      var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.description);
      this.setState({description: shortDesc});
    }
  },  

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handlePlayerMouseUp: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      // pause or play the video if the skin is clicked
      this.props.controller.togglePlayPause();
    }
  },

  showControlBar: function() {
    this.setState({controlBarVisible: true});
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
  },

  render: function() {
    var screenStyle = this.props.style;
    var repeatClass = this.props.skinConfig.icons.replay.fontStyleClass;
    var repeatStyle = screenStyle.repeatButton.style;

    repeatStyle.color = screenStyle.infoPanel.style.color = this.props.skinConfig.endScreen.replayIconStyle.color;

    // ReplayButton position, defaulting to centered
    if (this.props.skinConfig.endScreen.showReplayButton) {
      repeatStyle.top = "50%";
      repeatStyle.left = "50%";
    }
    else {
      repeatStyle.display = "none";
    }
    if (!Utils.isIPhone()){
      return (
        <div onMouseOver={this.showControlBar}
         onMouseUp={this.handlePlayerMouseUp}
         onTouchEnd={this.handlePlayerMouseUp}
         style={{height: "100%", width: "100%"}}>
          <div style={screenStyle.backgroundStyle}></div>
          <span className={repeatClass} style={repeatStyle} aria-hidden="true"></span>
          <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
            controlBarWidth={this.state.controlBarWidth} />
          <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
            controlBarWidth={this.state.controlBarWidth}
            playerState={this.props.playerState} />
        </div>
      );
    }

    else {
      var posterStyle = screenStyle.posterStyle;
      var infoStyle = screenStyle.infoPanel;

      var posterImageUrl = "";
      if (this.props.skinConfig.startScreen.showPromo) {
        posterImageUrl = this.props.contentTree.promo_image;
      }

      // metadata visibility
      var titleMetadata = null;
      var descriptionMetadata = null;
      if (this.props.skinConfig.startScreen.showTitle) {
        titleMetadata = <div className="endscreen-title" style={screenStyle.infoPanel.title.style}>{this.props.contentTree.title}</div>;
      }
      if (this.props.skinConfig.startScreen.showDescription) {
        descriptionMetadata = <div className="endscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>;
      }

      if (this.props.skinConfig.startScreen.showTitle ||
        this.props.skinConfig.startScreen.showDescription) {
        if (this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("top") > -1)
          infoStyle.style.top = "5%";
        if (this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("bottom") > -1)
          infoStyle.style.bottom = "5%";
        if (this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("left") > -1)
          infoStyle.style.left = "5%";
        if (this.props.skinConfig.startScreen.infoPanelPosition.toLowerCase().indexOf("right") > -1) {
          infoStyle.style.right = "5%";
          infoStyle.title.style.float = "right";
          infoStyle.description.style.float = "right";
        }
      }

      if (this.props.skinConfig.startScreen.promoImageSize == "small") {
        // Small Promo Image configuration
        posterStyle.backgroundSize = "auto";
        return (
          <div onTouchEnd={this.handlePlayerMouseUp} style={screenStyle.style}>
            <div className="endcreen-info" style={screenStyle.infoPanel.style}>
              <img className="endscreen-poster" src={posterImageUrl}/>
              {titleMetadata}
              {descriptionMetadata}
            </div>
            <span className={repeatClass} style={repeatStyle} aria-hidden="true"></span>
          </div>
        );
      }
      else {
        // Default configuration
        posterStyle.backgroundImage = "url('" + posterImageUrl + "')";
        return (
          <div onTouchEnd={this.handlePlayerMouseUp} style={screenStyle.style}>
            <div className="endscreen-poster" style={screenStyle.posterStyle}></div>
            <span className={repeatClass} style={repeatStyle} aria-hidden="true"></span>
            <div className="endscreen-info" style={screenStyle.infoPanel.style}>
              {titleMetadata}
              {descriptionMetadata}
            </div>
          </div>
        );
      }
    }
  }
});