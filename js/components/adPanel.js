/********************************************************************
 AD PANEL
 *********************************************************************/
/**
 * The screen used while the video is playing.
 *
 * @class AdPanel
 * @constructor
 */
var React = require('react'),
  CONSTANTS = require('../constants/constants'),
  InlineStyle = require('../styles/inlineStyle'),
  Utils = require('./utils');

var AdPanelTopBarItem = React.createClass({
  render: function() {
    return <div className={this.props.itemClassName} style={this.props.style} onClick={this.props.onButtonClicked} onTouchEnd={this.props.onButtonClicked}>
      {this.props.data}
    </div>;
  }
});

var AdPanel = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
  },

  componentDidMount: function(){
    if (Utils.isSafari()){
      InlineStyle.adScreenStyle.topBarStyle.display = "-webkit-flex";
    }
    else {
      InlineStyle.adScreenStyle.topBarStyle.display = "flex";
    }
  },

  handleSkipAdButtonClick: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.onSkipAdClicked();
    }
  },

  handleLearnMoreButtonClick: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.LEARN_MORE_BUTTON);
    }
  },

  handleAdTopBarClick: function(event){
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
    }
  },

  isValidAdPlaybackInfo: function(playbackInfo) {
    return (playbackInfo !== null &&
    typeof playbackInfo !== 'undefined' &&
    playbackInfo !== "");
  },

  populateAdTopBar: function() {
    var adTopBarItems = [];

    // // Ad title
    var adTitle = this.props.currentAdsInfo.currentAdItem.name;
    // AMC puts "Unknown" in the name field if ad name unavailable
    if (this.isValidAdPlaybackInfo(adTitle) && this.props.controlBarWidth > 560) {
      var adTitleDiv = <AdPanelTopBarItem key="AdTitle" style={InlineStyle.adScreenStyle.adPanelTopBarTextStyle} data={adTitle} itemClassName="adTitle"/>;
      adTopBarItems.push(adTitleDiv);
    }

    // Ad playback Info
    var adPlaybackInfo = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.AD, this.props.localizableStrings);
    var currentAdIndex = this.props.currentAdsInfo.currentAdItem.indexInPod;
    var totalNumberOfAds = this.props.currentAdsInfo.numberOfAds;
    if (this.isValidAdPlaybackInfo(currentAdIndex) && this.isValidAdPlaybackInfo(totalNumberOfAds)) {
      adPlaybackInfo = adPlaybackInfo + ": (" + currentAdIndex + "/" + totalNumberOfAds + ")";
    }

    var remainingTime = Utils.formatSeconds(parseInt(this.props.currentAdsInfo.currentAdItem.duration - this.props.currentPlayhead));
    adPlaybackInfo = adPlaybackInfo + " - " + remainingTime;

    var adPlaybackInfoDiv = <AdPanelTopBarItem key="adPlaybackInfo" style={InlineStyle.adScreenStyle.adPanelTopBarTextStyle} data={adPlaybackInfo} itemClassName="adPlaybackInfo"/>;
    adTopBarItems.push(adPlaybackInfoDiv);

    // Flexible space
    var flexibleSpaceDiv = <AdPanelTopBarItem key="flexibleSpace" style={InlineStyle.adScreenStyle.flexibleSpace} itemClassName="flexibleSpace"/>;
    adTopBarItems.push(flexibleSpaceDiv);

    // Learn more
    if (this.props.currentAdsInfo.currentAdItem !== null && this.isValidAdPlaybackInfo(this.props.currentAdsInfo.currentAdItem.clickUrl)) {
      var learnMoreText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.LEARN_MORE, this.props.localizableStrings);
      var learnMoreButtonDiv = <AdPanelTopBarItem key="learnMoreButton" onButtonClicked={this.handleLearnMoreButtonClick} style={InlineStyle.adScreenStyle.learnMoreButtonStyle} data={learnMoreText} itemClassName="learnMore"/>;
      adTopBarItems.push(learnMoreButtonDiv);
    }

    // Skip
    var handleSkipAdButtonClick;
    if (!this.props.currentAdsInfo.skipAdButtonEnabled) {
      InlineStyle.adScreenStyle.skipButtonStyle.opacity = "0.3";
      handleSkipAdButtonClick = null;
      InlineStyle.adScreenStyle.skipButtonStyle.cursor = "default";
    }
    else {
      InlineStyle.adScreenStyle.skipButtonStyle.opacity = "1";
      handleSkipAdButtonClick = this.handleSkipAdButtonClick;
      InlineStyle.adScreenStyle.skipButtonStyle.cursor = "pointer";
    }

    var skipButtonText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SKIP_AD, this.props.localizableStrings);
    var skipButtonDiv = <AdPanelTopBarItem key="skipButton" onButtonClicked={handleSkipAdButtonClick} style={InlineStyle.adScreenStyle.skipButtonStyle} data={skipButtonText} itemClassName="skip"/>;
    adTopBarItems.push(skipButtonDiv);

    return adTopBarItems;
  },


  render: function() {
    var adTopBarItems = this.populateAdTopBar();
    return (
      <div style={InlineStyle.adScreenStyle.panelStyle}>
        <div className="adTopBar" style={InlineStyle.adScreenStyle.topBarStyle} onClick={this.handleAdTopBarClick} onTouchEnd={this.handleAdTopBarClick}>
          {adTopBarItems}
        </div>
      </div>
    );
  }
});
module.exports = AdPanel;