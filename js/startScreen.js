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
    var actualNode = this.getDOMNode();
    var testText = document.createElement("span");
    testText.style.visibility = "hidden";
    testText.style.position = "absolute";
    testText.style.whiteSpace = "nowrap";
    testText.style.fontSize = this.props.style.infoPanel.description.style.fontSize;
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
      this.setState({ posterFullsize : false });
    }
    actualNode.getElementsByClassName("startscreen-poster")[0].style.visibility = "visible";
  },

  render: function() {
    var screenStyle = this.props.style;
    var playClass = screenStyle.playButton.icon;
    var playStyle = screenStyle.playButton.style;
    var posterStyle = screenStyle.posterStyle;

    if (this.state.posterFullsize) {
      // If the image is large enough, cover the entire player div
      posterStyle.backgroundImage = "url('" + this.props.contentTree.promo_image + "')";
      return (
        <div style={screenStyle.style}>
          <div className="startscreen-poster" style={screenStyle.posterStyle}></div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
          <div className="startscreen-info" style={screenStyle.infoPanel.style}>
            <div className="startscreen-title" style={screenStyle.infoPanel.title.style}>{this.props.contentTree.title}</div>
            <div className="startscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>
          </div>
        </div>
      );
    } else {
      // If the image is smaller than the player, have it layout with the
      // title and description
      posterStyle.backgroundSize = "auto";
      posterStyle.backgroundPosition = "left " + screenStyle.infoPanel.style.left + " bottom " +
        this.getDOMNode().getElementsByClassName("startscreen-info")[0].clientHeight + "px";

      return (
        <div style={screenStyle.style}>
          <div className="startscreen-info" style={screenStyle.infoPanel.style}>
            <img className="startscreen-poster" src={this.props.contentTree.promo_image}/>
            <div className="startscreen-title" style={screenStyle.infoPanel.title.style}>{this.props.contentTree.title}</div>
            <div className="startscreen-description" style={screenStyle.infoPanel.description.style}>{this.state.description}</div>
          </div>
          <span className={playClass} style={playStyle} aria-hidden="true" onClick={this.handleClick}></span>
        </div>
      );
    }
  }
});