/********************************************************************
  END SCREEN
*********************************************************************/

var EndScreen = React.createClass({
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
    if (this.props.skinConfig.endScreen.mode != "discovery") {
      var descriptionNode = this.getDOMNode().getElementsByClassName("endscreen-description")[0];
      var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.description);
      this.setState({description: shortDesc});
    }
  },

  handleClick: function() {
    this.props.controller.play();
  },

  render: function() {
    var screenStyle = this.props.style;
    var repeatClass = screenStyle.repeatButton.icon;
    var repeatStyle = screenStyle.repeatButton.style;
    var posterStyle = screenStyle.posterStyle;

    // Accent Color
    repeatStyle.color = screenStyle.infoPanel.style.color = this.props.skinConfig.accentColor;

    // metadata visibility
    var titleMetadata;
    var descriptionMetadata;
    if (this.props.skinConfig.endScreen.mode != "discovery") {
      titleMetadata = <div className="endscreen-title" style={screenStyle.infoPanel.title.style}>{this.state.title}</div>;
      descriptionMetadata = <div className="endscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>;
    }

    if (this.props.skinConfig.endScreen.mode == "discovery") {
      // Small Promo Image configuration
      posterStyle.backgroundSize = "auto";
      return (
        <div style={screenStyle.style}>
          <div className="endscreen-info" style={screenStyle.infoPanel.style}>
            <img className="endscreen-poster" src={this.state.promo_image}/>
            {titleMetadata}
            {descriptionMetadata}
          </div>
          <span className={repeatClass} style={repeatStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
      );
    }
    else {
      // Default configuration
      posterStyle.backgroundImage = "url('" + this.state.promo_image + "')";
      return (
        <div style={screenStyle.style}>
          <div className="endscreen-poster" style={screenStyle.posterStyle}></div>
          <span className={repeatClass} style={repeatStyle} aria-hidden="true" onClick={this.handleClick}></span>
          <div className="endscreen-info" style={screenStyle.infoPanel.style}>
            {titleMetadata}
            {descriptionMetadata}
          </div>
        </div>
      );
    }
  }
});