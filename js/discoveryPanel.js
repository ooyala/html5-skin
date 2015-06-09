/********************************************************************
  DISCOVERY SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/

var DiscoveryPanel = React.createClass({
  getInitialState: function() {
    return {
      discoveryToasterLeftOffset: 25,
      discoveryDataStructure: {},
      relatedVideos: {},
      tempContentInfo: {}
    };
  },

  handleLeftButtonClick: function() {
    this.state.discoveryToasterLeftOffset += 400;
    if (this.state.discoveryToasterLeftOffset > 25) {
      this.state.discoveryToasterLeftOffset = 25;
    }
    this.setState({discoveryToasterLeftOffset: this.state.discoveryToasterLeftOffset});
  },

  handleRightButtonClick: function() {
    var toasterContainerWidth = document.getElementById("discovery_toaster_cintainer").clientWidth;
    var toasterWidth = document.getElementById("discovery_toaster_alice").clientWidth;
    this.state.discoveryToasterLeftOffset -= 250;
    if (this.state.discoveryToasterLeftOffset < toasterContainerWidth - toasterWidth) {
      this.state.discoveryToasterLeftOffset = toasterContainerWidth - toasterWidth;
    }
    console.log("toasterContainerWidth = " + toasterContainerWidth);
    console.log("toasterWidth = " + toasterWidth);
    console.log("discoveryToasterLeftOffset = " + this.state.discoveryToasterLeftOffset);
    this.setState({discoveryToasterLeftOffset: this.state.discoveryToasterLeftOffset});
  },

  handleDiscoveryContentClick: function(index) {
    var eventData = {
          "clickedVideo" : this.props.discoveryData.relatedVideos[index],
          "custom" : { "source" : "endScreen" }
        };
    eventData.custom.countdown = 0;
    this.props.controller.sendDiscoveryClickEvent(eventData);
  },

  render: function() {
    var dismissButtonContainerStyle = discoveryScreenStyle.dismissButtonContainerStyle;
    var dismissButtonClass = discoveryScreenStyle.dismissButtonStyle.icon;
    var dismissButtonStyle = discoveryScreenStyle.dismissButtonStyle.style;

    var panelStyle = discoveryScreenStyle.panelStyle;

    var panelTitleBarStyle = discoveryScreenStyle.panelTitleBarStyle;
    var panelTitleTextStyle = discoveryScreenStyle.panelTitleTextStyle;

    var discoveryToasterContainerStyle = discoveryScreenStyle.discoveryToasterContainerStyle;
    var discoveryToasterStyle = discoveryScreenStyle.discoveryToasterStyle;
    discoveryToasterStyle.left = this.state.discoveryToasterLeftOffset;

    var contentBlockStyle = discoveryScreenStyle.discoveryContentBlockStyle;
    var imageStyle = discoveryScreenStyle.discoveryImageStyle;

    var contentTitleStyle = discoveryScreenStyle.discoveryContentTitleStyle;
    var contentPlaysStyle = discoveryScreenStyle.discoveryContentPlaysStyle; 

    var chevronLeftButtonContainer = discoveryScreenStyle.discoveryChevronLeftButtonContainer;
    var chevronLeftButtonClass = discoveryScreenStyle.discoveryChevronLeftButton.icon;
    var chevronLeftButtonStyle = discoveryScreenStyle.discoveryChevronLeftButton.style;

    var chevronRightButtonContainer = discoveryScreenStyle.discoveryChevronRightButtonContainer;
    var chevronRightButtonClass = discoveryScreenStyle.discoveryChevronRightButton.icon;
    var chevronRightButtonStyle = discoveryScreenStyle.discoveryChevronRightButton.style;

    var discoveryData = this.props.discoveryData;
    var discoveryContentBlocks = [];

    document.getElementsByClassName("discovery_toaster")[0].style.display="none";
    if (discoveryData !== null)  {
        discoveryToasterStyle.width = 150 * discoveryData.relatedVideos.length;
        for (var i = 0; i < this.props.discoveryData.relatedVideos.length; i++) {
          discoveryContentBlocks.push(
            <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
                 <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}></img>
                 <div style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
                 <div style={contentPlaysStyle}>141 plays</div>
            </div> );
        }
    }
    return (
      <div style={panelStyle}>
        <div style={panelTitleBarStyle}>
          <h1 style={panelTitleTextStyle}>DISCOVERY</h1>
          <div style={dismissButtonContainerStyle}>
            <span className={dismissButtonClass} style={dismissButtonStyle} aria-hidden="true"></span>
          </div>
        </div>
        <div id="discovery_toaster_cintainer" style={discoveryToasterContainerStyle}>
          <div id="discovery_toaster_alice" style={discoveryToasterStyle}>
              {discoveryContentBlocks}
          </div>
            
          <div style={chevronLeftButtonContainer}>
            <span className={chevronLeftButtonClass} style={chevronLeftButtonStyle} aria-hidden="true" onClick={this.handleLeftButtonClick}></span>
          </div>
          <div style={chevronRightButtonContainer}>
            <span className={chevronRightButtonClass} style={chevronRightButtonStyle} aria-hidden="true" onClick={this.handleRightButtonClick}></span>
          </div>
        </div>
      </div>
    );
  }
});