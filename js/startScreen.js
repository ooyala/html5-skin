/********************************************************************
  START SCREEN
*********************************************************************/

var StartScreen = React.createClass({
  getInitialState: function() {
    return {
      description: this.props.contentTree.description
    };
  },


  // CSS doesn't support "truncate N lines" so we need to do DOM width
  // calculations to figure out where to truncate the description
  componentDidMount: function() {
    if (this.props.skinConfig.startScreen.showTitle ||
      this.props.skinConfig.startScreen.showDescription) {
      var descriptionNode = this.getDOMNode().getElementsByClassName("startscreen-description")[0];
      var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.description);
      this.setState({description: shortDesc});
    }
  },

  handleClick: function() {
    this.props.controller.togglePlayPause();
  },

  render: function() {
    var screenStyle = this.props.style;
    var playClass = screenStyle.playButton.icon;
    var playStyle = screenStyle.playButton.style;
    var posterStyle = screenStyle.posterStyle;
    var infoStyle = screenStyle.infoPanel;

    // Accent Color
    playStyle.color = screenStyle.infoPanel.style.color = this.props.skinConfig.accentColor;

    // PlayButton position, defaulting to centered
    if (this.props.skinConfig.startScreen.showPlayButton) {
      playStyle.top = "50%";
      playStyle.left = "50%";
      if (this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("top") > -1)
        playStyle.top = "15%";
      if (this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("bottom") > -1)
        playStyle.top = "80%";
      if (this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("left") > -1)
        playStyle.left = "10%";
      if (this.props.skinConfig.startScreen.playButtonPosition.toLowerCase().indexOf("right") > -1)
        playStyle.left = "90%";
    }
    else {
      playStyle.display = "none";
    }

    // metadata visibility
    var titleMetadata = null;
    var descriptionMetadata = null;
    if (this.props.skinConfig.startScreen.showTitle) {
      titleMetadata = <div className="startscreen-title" style={screenStyle.infoPanel.title.style}>{this.props.contentTree.title}</div>;
    }
    if (this.props.skinConfig.startScreen.showDescription) {
      descriptionMetadata = <div className="startscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>;
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

    var posterImageUrl = "";
    if (this.props.skinConfig.startScreen.showPromo) {
      posterImageUrl = this.props.contentTree.promo_image;
    }

    if (this.props.skinConfig.startScreen.promoImageSize == "small") {
      // Small Promo Image configuration
      posterStyle.backgroundSize = "auto";
      return (
        <div onClick={this.handleClick} style={screenStyle.style}>
          <div className="startscreen-info" style={screenStyle.infoPanel.style}>
            <img className="startscreen-poster" src={posterImageUrl}/>
            {titleMetadata}
            {descriptionMetadata}
          </div>
          <span className={playClass} style={playStyle} aria-hidden="true"></span>
        </div>
      );
    }
    else {
      // Default configuration
      posterStyle.backgroundImage = "url('" + posterImageUrl + "')";
      return (
        <div onClick={this.handleClick} style={screenStyle.style}>
          <div className="startscreen-poster" style={screenStyle.posterStyle}></div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
          <div className="startscreen-info" style={screenStyle.infoPanel.style}>
            {titleMetadata}
            {descriptionMetadata}
          </div>
        </div>
      );
    }
  }
});