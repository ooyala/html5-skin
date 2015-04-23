/********************************************************************
  START SCREEN
*********************************************************************/

var StartScreen = React.createClass({
  getInitialState: function() {
    return {
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
    var descriptionNode = this.getDOMNode().getElementsByClassName("startscreen-description")[0];
    var shortDesc = Utils.truncateTextToWidth(descriptionNode, this.state.description);
    this.setState({description: shortDesc});
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
      //this.setState({ posterFullsize : false });
    }
    actualNode.getElementsByClassName("startscreen-poster")[0].style.visibility = "visible";
  },

  render: function() {
    var playClass = this.props.style.playButton.icon;
    var playStyle = this.props.style.playButton.style;
    var posterStyle = this.props.style.posterStyle;

    if (this.state.posterFullsize) {
      // If the image is large enough, cover the entire player div
      posterStyle.backgroundImage = "url('" + this.props.contentTree.promo_image + "')";
      return (
        <div style={this.props.style.style}>
          <div className="startscreen-poster" style={this.props.style.posterStyle}></div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
          <div className="startscreen-info" style={this.props.style.infoPanel.style}>
            <div className="startscreen-title" style={this.props.style.infoPanel.title.style}>{this.props.contentTree.title}</div>
            <div className="startscreen-description" style={this.props.style.infoPanel.description.style}>{this.state.description}</div>
          </div>
        </div>
      );
    } else {
      // If the image is smaller than the player, have it layout with the
      // title and description
      posterStyle.backgroundSize = "auto";
      posterStyle.backgroundPosition = "left " + this.props.style.infoPanel.style.left + " bottom " +
        this.getDOMNode().getElementsByClassName("startscreen-info")[0].clientHeight + "px";

      return (
        <div style={this.props.style.style}>
          <div className="startscreen-info" style={this.props.style.infoPanel.style}>
            <img className="startscreen-poster" src={this.props.contentTree.promo_image}/>
            <div className="startscreen-title" style={this.props.style.infoPanel.title.style}>{this.props.contentTree.title}</div>
            <div className="startscreen-description" style={this.props.style.infoPanel.description.style}>{this.state.description}</div>
          </div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
      );
    }
  }
});