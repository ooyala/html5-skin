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
    var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
    var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;
    // discoveryToasterLeftOffset = left border of discovery toaster container - left border of discovery toaster
    var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;

    if(toasterContainerWidth <= toasterWidth || newDiscoveryToasterLeftOffset < 0) {
      newDiscoveryToasterLeftOffset += 400;
      if(newDiscoveryToasterLeftOffset > 25) {
        newDiscoveryToasterLeftOffset = 25;
      }
    }
   
    this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
  },

  handleRightButtonClick: function() {
    var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
    var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;
    // discoveryToasterLeftOffset = left border of discovery toaster container - left border of discovery toaster
    var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;
    // rightOffset = right border of discovery toaster container - right border of discovery toaster
    var rightOffset = toasterContainerWidth  - (newDiscoveryToasterLeftOffset + toasterWidth);
    if(toasterContainerWidth <= toasterWidth || rightOffset <= 25) {
      newDiscoveryToasterLeftOffset -= 400;
      rightOffset = toasterContainerWidth  - (newDiscoveryToasterLeftOffset + toasterWidth);
      
      if(rightOffset > 25) {
        newDiscoveryToasterLeftOffset = toasterContainerWidth - 25 - toasterWidth;
      } 
    }
    
    this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
    debugger;
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

  shouldShowCountdownTimer: function() {
    if(this.props.skinConfig.showCountdownTimer && this.state.playerState === STATE.END) {
      return true;
    }
    return false;
  },

  render: function() {
    var panelStyle = discoveryScreenStyle.panelStyle;

    var panelTitleBarStyle = discoveryScreenStyle.panelTitleBarStyle;
    var panelTitle = this.props.skinConfig.discoveryScreen.panelTitle.text;
    var panelTitleTextStyle = discoveryScreenStyle.panelTitleTextStyle;

    var discoveryToasterContainerStyle = discoveryScreenStyle.discoveryToasterContainerStyle;
    var discoveryToasterStyle = discoveryScreenStyle.discoveryToasterStyle;
    discoveryToasterStyle.left = this.state.discoveryToasterLeftOffset;

    var contentBlockStyle = discoveryScreenStyle.discoveryContentBlockStyle;
    var imageStyle = discoveryScreenStyle.discoveryImageStyle;

    var contentTitleStyle = discoveryScreenStyle.discoveryContentTitleStyle;
    if (!this.props.skinConfig.discoveryScreen.showContentTitle) {
       contentTitleStyle.display = "none";
    }

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

    //temporary
     var discoveryCountDownStyle = discoveryScreenStyle.discoveryCountDownStyle;

    // Build discovery content blocks
    if (discoveryData !== null)  {
        discoveryToasterStyle.width = 150 * discoveryData.relatedVideos.length;
        for (var i = 0; i < this.props.discoveryData.relatedVideos.length; i++) {
          if(this.shouldShowCountdownTimer && i === 0) {
            discoveryContentBlocks.push(
            <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
                 <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}>
                     <div style={{height:"100%", width:"100%"}}>
                     <CountDownClock {...this.props} timeToShow={this.props.skinConfig.upNextScreen.timeToShow} countDownStyle={discoveryCountDownStyle}/>
                     </div>
                 </img>
                 <div style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
            </div> );
          }
          //add else statement here
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
          <h1 style={panelTitleTextStyle}>{panelTitle}</h1>
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