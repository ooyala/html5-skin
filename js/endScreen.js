/********************************************************************
  END SCREEN
*********************************************************************/

var EndScreen = React.createClass({
  getInitialState: function() {
    return {
      description: this.props.contentTree.description,
      controlBarVisible: true
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

  handlePlayerMouseUp: function() {
    // pause or play the video if the skin is clicked
    this.props.controller.togglePlayPause();
  },

  showControlBar: function() {
    this.setState({controlBarVisible: true});
  },

  hideControlBar: function() {
    this.setState({controlBarVisible: false});
  },

  handleClick: function() {
    this.props.controller.togglePlayPause();
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
      titleMetadata = <div className="endscreen-title" style={screenStyle.infoPanel.title.style}>{this.props.contentTree.title}</div>;
      descriptionMetadata = <div className="endscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>;
    }

    if (this.props.skinConfig.endScreen.mode == "discovery") {
      posterStyle.backgroundSize = "auto";
      return (
        <div style={screenStyle.style}>
        </div>
      );
    }
    else {
      // Default configuration
      posterStyle.backgroundImage = "url('" + this.props.contentTree.promo_image + "')";
      var controlBarHeight = 32;
      return (
        <div onMouseOver={this.showControlBar} 
              onMouseOut={this.hideControlBar}
               onMouseUp={this.handlePlayerMouseUp} 
               style={{height: "100%", width: "100%"}}>
        <div className="endscreen-poster" style={screenStyle.posterStyle}></div>
        <span className={repeatClass} style={repeatStyle} aria-hidden="true" onClick={this.handleClick}></span>
        <div className="endscreen-info" style={screenStyle.infoPanel.style}>
          {titleMetadata}
          {descriptionMetadata}
        </div>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight} />
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} controlBarHeight={controlBarHeight}
          playerState={this.state.playerState} screenToShow={STATE.END} />
      </div>
      );
    }
  }
});