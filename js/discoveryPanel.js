/********************************************************************
  DISCOVERY PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class DiscoveryPanel
* @constructor
*/

var DiscoveryPanel = React.createClass({
  getInitialState: function() {
    return {
      discoveryToasterLeftOffset: 25,
    };
  },

  handleLeftButtonClick: function() {
    var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;
    newDiscoveryToasterLeftOffset += 400;
    if (newDiscoveryToasterLeftOffset > 25) {
      newDiscoveryToasterLeftOffset = 25;
    }
    this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
  },

  handleRightButtonClick: function() {
    var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
    var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;

    var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;
    newDiscoveryToasterLeftOffset -= 400;
    if (newDiscoveryToasterLeftOffset < toasterContainerWidth - toasterWidth) {
      newDiscoveryToasterLeftOffset = toasterContainerWidth - toasterWidth;
    }
    this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
  },

  handleDiscoveryContentClick: function(index) {
    var eventData = {
          "clickedVideo" : this.props.discoveryData.relatedVideos[index],
          "custom" : this.props.discoveryData.custom
        };
    // TODO: figure out countdown value
    eventData.custom.countdown = 0;
    this.props.controller.sendDiscoveryClickEvent(eventData);
  },

  render: function() {
    var panelStyle = discoveryScreenStyle.panelStyle;

    var panelTitleBarStyle = discoveryScreenStyle.panelTitleBarStyle;
    var panelTitleTextStyle = discoveryScreenStyle.panelTitleTextStyle;

    var discoveryToasterContainerStyle = discoveryScreenStyle.discoveryToasterContainerStyle;
    var discoveryToasterStyle = discoveryScreenStyle.discoveryToasterStyle;
    discoveryToasterStyle.left = this.state.discoveryToasterLeftOffset;

    var contentBlockStyle = discoveryScreenStyle.discoveryContentBlockStyle;
    var imageStyle = discoveryScreenStyle.discoveryImageStyle;

    var contentTitleStyle = discoveryScreenStyle.discoveryContentTitleStyle;

    var chevronLeftButtonContainer = discoveryScreenStyle.discoveryChevronLeftButtonContainer;
    var chevronLeftButtonClass = discoveryScreenStyle.discoveryChevronLeftButton.icon;
    var chevronLeftButtonStyle = discoveryScreenStyle.discoveryChevronLeftButton.style;

    var chevronRightButtonContainer = discoveryScreenStyle.discoveryChevronRightButtonContainer;
    var chevronRightButtonClass = discoveryScreenStyle.discoveryChevronRightButton.icon;
    var chevronRightButtonStyle = discoveryScreenStyle.discoveryChevronRightButton.style;

    var discoveryData = this.props.discoveryData;
    var discoveryContentBlocks = [];

    // This is for turning off the old discovery panel.
    // TODO: Remove the following line when we drop the old discovery panel in mjolnir side.
    document.getElementsByClassName("discovery_toaster")[0].style.display="none"; 

    // Build discovery content blocks
    if (discoveryData !== null)  {
        discoveryToasterStyle.width = 150 * discoveryData.relatedVideos.length;
        for (var i = 0; i < this.props.discoveryData.relatedVideos.length; i++) {
          discoveryContentBlocks.push(
            <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
                 <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}></img>
                 <div style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
            </div> );
        }
    }
    return (
      <div style={panelStyle}>

        <div style={panelTitleBarStyle}>
          <h1 style={panelTitleTextStyle}>DISCOVERY</h1>
        </div>

        <div style={discoveryToasterContainerStyle} ref="DiscoveryToasterContainer" >
          
          <div style={discoveryToasterStyle} ref="DiscoveryToaster">
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