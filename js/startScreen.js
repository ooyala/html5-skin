/********************************************************************
  START SCREEN
*********************************************************************/

var StartScreen = React.createClass({
  getInitialState: function() {
    return {
      description: this.props.contentTree.description,
      title: this.props.contentTree.title,
      promo_image: this.props.contentTree.promo_image
    };
  },


  // CSS doesn't support "truncate N lines" so we need to do DOM width
  // calculations to figure out where to truncate the description
  componentDidMount: function() {
    if (this.props.skinConfig.startScreen.showMetadata) {
      var descriptionNode = this.getDOMNode().getElementsByClassName("startscreen-description")[0];
      var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.description);
      this.setState({description: shortDesc});
    }
  },

  handleClick: function() {
    this.props.controller.play();
  },

  render: function() {
    var screenStyle = this.props.style;
    var playClass = screenStyle.playButton.icon;
    var playStyle = screenStyle.playButton.style;
    var posterStyle = screenStyle.posterStyle;

    // Accent Color
    playStyle.color = screenStyle.infoPanel.style.color = this.props.skinConfig.accentColor;

    // PlayButton position
    switch (this.props.skinConfig.startScreen.playButtonPosition) {
      case "center":
      case "CENTER":
        playStyle.top = "50%";
        playStyle.left = "50%";
        break;
      case "NW":
      case "nw":
        playStyle.top = "15%";
        playStyle.left = "10%";
        break;
      case "NE":
      case "ne":
        playStyle.top = "15%";
        playStyle.left = "90%";
        break;
      case "SE":
      case "se":
        playStyle.top = "80%";
        playStyle.left = "90%";
        break;
      case "SW":
      case "sw":
        playStyle.top = "80%";
        playStyle.left = "10%";
        break;
    }

    // metadata visibility
    var titleMetadata;
    var descriptionMetadata;
    if (this.props.skinConfig.startScreen.showMetadata) {
      titleMetadata = <div className="startscreen-title" style={screenStyle.infoPanel.title.style}>{this.state.title}</div>;
      descriptionMetadata = <div className="startscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>;
    }

    if (this.props.skinConfig.startScreen.mode == "smallPromo") {
      // Small Promo Image configuration
      posterStyle.backgroundSize = "auto";
      return (
        <div style={screenStyle.style}>
          <div className="startscreen-info" style={screenStyle.infoPanel.style}>
            <img className="startscreen-poster" src={this.state.promo_image}/>
            {titleMetadata}
            {descriptionMetadata}
          </div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
      );
    }
    else {
      // Default configuration
      posterStyle.backgroundImage = "url('" + this.state.promo_image + "')";
      return (
        <div style={screenStyle.style}>
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