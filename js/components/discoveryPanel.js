/********************************************************************
  DISCOVERY PANEL
*********************************************************************/
/**
* @class DiscoveryPanel
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('./utils'),
    CountDownClock = require('./countDownClock');

var DiscoveryPanel = React.createClass({
  componentDidMount: function(){
    if (Utils.isSafari()){
      InlineStyle.discoveryScreenStyle.panelStyle.display = "-webkit-flex";
      InlineStyle.discoveryScreenStyle.discoveryToasterStyle.display = "-webkit-flex";
    }
    else {
      InlineStyle.discoveryScreenStyle.panelStyle.display = "flex";
      InlineStyle.discoveryScreenStyle.discoveryToasterStyle.display = "flex";
    }
  },

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      discoveryToasterLeftOffset: 25,
      showDiscoveryCountDown: this.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen
    };
  },

  handleLeftButtonClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      // discoveryToasterLeftOffset = left border of discovery toaster container - left border of discovery toaster
      var newDiscoveryToasterLeftOffset = this.state.discoveryToasterLeftOffset;
      if(this.hasItemsToShowOnLeftSide(newDiscoveryToasterLeftOffset)) {
        newDiscoveryToasterLeftOffset += 400;
        if(newDiscoveryToasterLeftOffset > 25) {
          newDiscoveryToasterLeftOffset = 25;
        }
      }

      this.setState({discoveryToasterLeftOffset: newDiscoveryToasterLeftOffset});
    }
  },

  handleRightButtonClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

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
    }
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
    var chevronLeftButtonStyle = InlineStyle.discoveryScreenStyle.discoveryChevronLeftButton.style;
    var chevronRightButtonStyle = InlineStyle.discoveryScreenStyle.discoveryChevronRightButton.style;
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

  handleDiscoveryContentClick: function(index, event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      var eventData = {
        "clickedVideo" : this.props.discoveryData.relatedVideos[index],
        "custom" : this.props.discoveryData.custom
      };
      // TODO: figure out countdown value
      // eventData.custom.countdown = 0;
      this.props.controller.sendDiscoveryClickEvent(eventData, false);
    }
  },

  shouldShowCountdownTimer: function() {
    return this.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen && this.props.playerState === CONSTANTS.STATE.END;
  },

  handleDiscoveryCountDownClick: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.setState({showDiscoveryCountDown: false});
      this.refs.CountDownClock.handleClick(event);
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
    }
  },

  render: function() {
    var panelStyle = InlineStyle.discoveryScreenStyle.panelStyle;

    var panelTitleBarStyle = InlineStyle.discoveryScreenStyle.panelTitleBarStyle;
    var panelTitle = CONSTANTS.SKIN_TEXT.DISCOVER;
    panelTitle = Utils.getLocalizedString(this.props.language, panelTitle, this.props.localizableStrings);
    var panelTitleTextStyle = InlineStyle.discoveryScreenStyle.panelTitleTextStyle;

    var discoveryToasterContainerStyle = InlineStyle.discoveryScreenStyle.discoveryToasterContainerStyle;
    var discoveryToasterStyle = InlineStyle.discoveryScreenStyle.discoveryToasterStyle;
    discoveryToasterStyle.left = this.state.discoveryToasterLeftOffset;

    var contentBlockStyle = InlineStyle.discoveryScreenStyle.discoveryContentBlockStyle;
    var imageStyle = InlineStyle.discoveryScreenStyle.discoveryImageStyle;

    var contentTitleStyle = InlineStyle.discoveryScreenStyle.discoveryContentTitleStyle;
    if (!this.props.skinConfig.discoveryScreen.showContentTitle) {
       contentTitleStyle.display = "none";
    }

    var chevronLeftButtonContainer = InlineStyle.discoveryScreenStyle.discoveryChevronLeftButtonContainer;
    var chevronLeftButtonClass = this.props.skinConfig.icons.left.fontStyleClass;
    var chevronLeftButtonStyle = InlineStyle.discoveryScreenStyle.discoveryChevronLeftButton.style;

    var chevronRightButtonContainer = InlineStyle.discoveryScreenStyle.discoveryChevronRightButtonContainer;
    var chevronRightButtonClass = this.props.skinConfig.icons.right.fontStyleClass;
    var chevronRightButtonStyle = InlineStyle.discoveryScreenStyle.discoveryChevronRightButton.style;

    var discoveryData = this.props.discoveryData;
    var discoveryContentBlocks = [];

    var discoveryCountDownStyle = InlineStyle.discoveryScreenStyle.discoveryCountDownStyle;
    var discoveryCountDownIconStyle = InlineStyle.discoveryScreenStyle.discoveryCountDownIconStyle;
    var discoveryCountDownWrapperStyle = InlineStyle.discoveryScreenStyle.discoveryCountDownWrapperStyle;
    if(!this.state.showDiscoveryCountDown) {
      discoveryCountDownWrapperStyle.display="none";
    }

    // Build discovery content blocks
    if (discoveryData !== null)  {
        // 214 is width of content images and 60 is horizontal space between each content image
        discoveryToasterStyle.width = 214 * discoveryData.relatedVideos.length + 60*(discoveryData.relatedVideos.length-1);
        for (var i = 0; i < this.props.discoveryData.relatedVideos.length; i++) {
          var contentBlockClassName = "content" + i;
          if(this.shouldShowCountdownTimer() && i === 0) {
            discoveryContentBlocks.push(
            <div className="contentBlockClassName" style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)} onTouchEnd={this.handleDiscoveryContentClick.bind(this, i)}>
              <div style={InlineStyle.discoveryScreenStyle.discoveryImageWrapperStyle}>
                <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}>
                     <div className="countdownClock" style={discoveryCountDownWrapperStyle} onClick={this.handleDiscoveryCountDownClick} onTouchEnd={this.handleDiscoveryCountDownClick}>
                       <CountDownClock {...this.props} timeToShow={this.props.skinConfig.discoveryScreen.countDownTime} ref="CountDownClock" />
                       <span className={this.props.skinConfig.icons.pause.fontStyleClass} style={discoveryCountDownIconStyle}></span>
                     </div>
                 </img>
              </div>
              <div className="discoveryContentName" style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
            </div> );
          }
          else {
            discoveryContentBlocks.push(
              <div className={contentBlockClassName} style={contentBlockStyle} onClick={this.handleDiscoveryContentClick.bind(this, i)} onTouchEnd={this.handleDiscoveryContentClick.bind(this, i)}>
                <div style={InlineStyle.discoveryScreenStyle.discoveryImageWrapperStyle}>
                  <img style={imageStyle} src={this.props.discoveryData.relatedVideos[i].preview_image_url}></img>
                </div>
                <div className="discoveryContentName" style={contentTitleStyle}>{this.props.discoveryData.relatedVideos[i].name}</div>
              </div> );
          }
        }
    }
    return (
      <div className="discoveryPanel" style={panelStyle}>

        <div className="discoveryPanelTitle" style={panelTitleBarStyle}>
          <h1 style={panelTitleTextStyle}>{panelTitle}
            <span style={{top: "3px", position: "relative", marginLeft: "7px"}} className={this.props.skinConfig.icons.discovery.fontStyleClass}></span>
          </h1>
        </div>

        <div style={discoveryToasterContainerStyle} ref="DiscoveryToasterContainer" >

          <div className="discoveryToaster" style={discoveryToasterStyle} ref="DiscoveryToaster">
              {discoveryContentBlocks}
          </div>

          <div className="leftButton" style={chevronLeftButtonContainer}>
            <span className={chevronLeftButtonClass} style={chevronLeftButtonStyle} ref="ChevronLeftButton" aria-hidden="true" onClick={this.handleLeftButtonClick} onTouchEnd={this.handleLeftButtonClick}></span>
          </div>

          <div className="rightButton" style={chevronRightButtonContainer}>
            <span className={chevronRightButtonClass} style={chevronRightButtonStyle} ref="ChevronRightButton" aria-hidden="true" onClick={this.handleRightButtonClick} onTouchEnd={this.handleRightButtonClick}></span>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = DiscoveryPanel;