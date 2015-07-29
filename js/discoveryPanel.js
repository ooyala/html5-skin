/********************************************************************
  DISCOVERY PANEL
*********************************************************************/
/**
* @class DiscoveryPanel
* @constructor
*/

var DiscoveryPanel = React.createClass({
  getInitialState: function() { 
    return {
      discoveryToasterLeftOffset: 25,
      showDiscoveryCountDown: this.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen
    };
  },

  handleLeftButtonClick: function() {
    // discoveryToasterLeftOffset = left border of discovery toaster container - left border of discovery toaster
    var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;
    if(this.hasItemsToShowOnLeftSide(newDiscoveryToasterLeftOffset)) {
      newDiscoveryToasterLeftOffset += 400;
      if(newDiscoveryToasterLeftOffset > 25) {
        newDiscoveryToasterLeftOffset = 25;
      }
    }

    this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
  },

  handleRightButtonClick: function() {
    // discoveryToasterLeftOffset = left border of discovery toaster container - left border of discovery toaster
    var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;
    if(this.hasItemsToShowOnRightSide(newDiscoveryToasterLeftOffset)) {
      var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
      var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;
      // rightOffset = right border of discovery toaster container - right border of discovery toaster
      var rightOffset = toasterContainerWidth  - (newDiscoveryToasterLeftOffset + toasterWidth);
      newDiscoveryToasterLeftOffset -= 400;
      rightOffset = toasterContainerWidth  - (newDiscoveryToasterLeftOffset + toasterWidth);

      if(rightOffset > 25) {
        newDiscoveryToasterLeftOffset = toasterContainerWidth - 25 - toasterWidth;
      }
    }

    this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
  },

  shouldShowLeftButton: function(newState) {
    if(this.hasItemsToShowOnLeftSide(newState.discoveryToasterLeftOffset)) {
      if(newState.discoveryToasterLeftOffset !== 25) {
        return true;
      }
    }
    return false;
  },

  shouldShowRightButton: function(newState) {
    if(this.hasItemsToShowOnRightSide(newState.discoveryToasterLeftOffset)) {
      var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
      var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;
      // discoveryToasterLeftOffset = left border of discovery toaster container - left border of discovery toaster
      var newDiscoveryToasterLeftOffset = newState.discoveryToasterLeftOffset;//this.state.discoveryToasterLeftOffset;
      // rightOffset = right border of discovery toaster container - right border of discovery toaster
      var rightOffset = toasterContainerWidth  - (newDiscoveryToasterLeftOffset + toasterWidth);
      if(rightOffset !== 25) {
        return true;
      }
    }
    return false;
  },

  hasItemsToShowOnLeftSide: function(newLeftOffset) {
    var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
    var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;
    return (toasterContainerWidth <= toasterWidth) || (newLeftOffset < 0);
  },

  hasItemsToShowOnRightSide: function(newLeftOffset) {
    var toasterContainerWidth = this.refs.DiscoveryToasterContainer.getDOMNode().clientWidth;
    var toasterWidth = this.refs.DiscoveryToaster.getDOMNode().clientWidth;
    var rightOffset = toasterContainerWidth  - (newLeftOffset + toasterWidth);
    return (toasterContainerWidth <= toasterWidth) || (rightOffset <= 25);
  },
  
  componentWillUpdate: function(propsParam, newState){
    var chevronLeftButtonStyle = discoveryScreenStyle.discoveryChevronLeftButton.style;
    var chevronRightButtonStyle = discoveryScreenStyle.discoveryChevronRightButton.style;
    if(this.shouldShowLeftButton(newState)) {
      chevronLeftButtonStyle.visibility = "visible";
    }
    else {
      chevronLeftButtonStyle.visibility = "hidden";
    }
    if(this.shouldShowRightButton(newState)) {
      chevronRightButtonStyle.visibility = "visible";
    }
    else {
      chevronRightButtonStyle.visibility = "hidden";
    }
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
    return this.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen && this.props.playerState === STATE.END; 
  },

  handleDiscoveryCountDownClick: function(event) {
    this.setState({showDiscoveryCountDown: false});
    this.refs.CountDownClock.handleClick(event);
    event.stopPropagation();
  },

  render: function() {
    var panelStyle = discoveryScreenStyle.panelStyle;    
    var controlBarHeight = 60;
    panelStyle.bottom = controlBarHeight + "px"; 

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

    var discoveryCountDownStyle = discoveryScreenStyle.discoveryCountDownStyle;
    var discoveryCountDownIconStyle = discoveryScreenStyle.discoveryCountDownIconStyle;
    var discoveryCountDownWrapperStyle = discoveryScreenStyle.discoveryCountDownWrapperStyle;
    if(!this.state.showDiscoveryCountDown) {
      discoveryCountDownWrapperStyle.display="none";
    }

    // Build discovery content blocks
    if (discoveryData !== null)  {
        // 214 is width of content images and 60 is horizontal space between each content image
        discoveryToasterStyle.width = 214 * discoveryData.relatedVideos.length + 60*(discoveryData.relatedVideos.length-1);
        for (var i = 0; i < this.props.discoveryData.relatedVideos.length; i++) {
          if(this.shouldShowCountdownTimer() && i === 0) {
            discoveryContentBlocks.push(
            <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
              <div style={discoveryScreenStyle.discoveryImageWrapperStyle}>
                <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}>
                     <div style={discoveryCountDownWrapperStyle} onClick={this.handleDiscoveryCountDownClick}>
                     <CountDownClock {...this.props} timeToShow={this.props.skinConfig.discoveryScreen.countDownTime} ref="CountDownClock" />
                     <span className="icon icon-pause" style={discoveryCountDownIconStyle}></span>
                     </div>
                 </img>
              </div>
              <div className="discoveryContentName" style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
            </div> );
          }
          else {
            discoveryContentBlocks.push(
              <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
                <div style={discoveryScreenStyle.discoveryImageWrapperStyle}>
                  <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}></img>
                </div>
                <div className="discoveryContentName" style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
              </div> );
          }
        }
    }
    return (
      <div style={panelStyle}>

        <div style={panelTitleBarStyle}>
          <h1 style={panelTitleTextStyle}>{panelTitle}
            <span style={{top: "3px", position: "relative", marginLeft: "7px"}} className="icon icon-topmenu-discovery"></span>
          </h1>
        </div>

        <div style={discoveryToasterContainerStyle} ref="DiscoveryToasterContainer" >

          <div style={discoveryToasterStyle} ref="DiscoveryToaster">
              {discoveryContentBlocks}
          </div>

          <div style={chevronLeftButtonContainer}>
            <span className={chevronLeftButtonClass} style={chevronLeftButtonStyle} ref="ChevronLeftButton" aria-hidden="true" onClick={this.handleLeftButtonClick}></span>
          </div>

          <div style={chevronRightButtonContainer}>
            <span className={chevronRightButtonClass} style={chevronRightButtonStyle} ref="ChevronRightButton" aria-hidden="true" onClick={this.handleRightButtonClick}></span>
          </div>
        </div>
      </div>
    );
  }
});