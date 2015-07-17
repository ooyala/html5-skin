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

  closeDiscoveryPanel: function() {
    this.props.controller.toggleDiscoveryScreen();
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
        discoveryToasterStyle.width = 150 * discoveryData.relatedVideos.length;
        for (var i = 0; i < this.props.discoveryData.relatedVideos.length; i++) {
          if(this.shouldShowCountdownTimer() && i === 0) {
            discoveryContentBlocks.push(
            <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
                 <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}>
                     <div style={discoveryCountDownWrapperStyle} onClick={this.handleDiscoveryCountDownClick}>
                     <CountDownClock {...this.props} timeToShow={this.props.skinConfig.discoveryScreen.timeToShow} ref="CountDownClock" />
                     <span className="icon icon-pause" style={discoveryCountDownIconStyle}></span>
                     </div>
                 </img>
                 <div style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
            </div> );
          }
          else {
            discoveryContentBlocks.push(
              <div style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)}>
                   <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}></img>
                   <div style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
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
            <span className={chevronLeftButtonClass} style={chevronLeftButtonStyle} aria-hidden="true" onClick={this.handleLeftButtonClick}></span>
          </div>

          <div style={chevronRightButtonContainer}>
            <span className={chevronRightButtonClass} style={chevronRightButtonStyle} aria-hidden="true" onClick={this.handleRightButtonClick}></span>
          </div>
        </div>
        <div onClick={this.closeDiscoveryPanel} style={discoveryScreenStyle.closeButton} className="icon icon-close"></div>
      </div>
    );
  }
});