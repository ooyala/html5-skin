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
  Spinner = require('./spinner'),
  ClassNames = require('classnames'),
  Utils = require('./utils'),
  Icon = require('../components/icon');

var AdPanelTopBarItem = React.createClass({
  render: function() {
    return <div className={this.props.itemClassName} onClick={this.props.onButtonClicked} onTouchEnd={this.props.onButtonClicked}>
      {this.props.icon}{this.props.data}
    </div>;
  }
});

var AdPanel = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
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
    if (event.type == 'touchend' || !this.isMobile) {
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.LEARN_MORE_BUTTON);
    }
  },

  handleAdTopBarClick: function(event){
    if (event.type == 'touchend' || !this.isMobile) {
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
      var adTitleDiv = <AdPanelTopBarItem key="adTitle" ref="adTitle" data={adTitle} itemClassName="adTitle"/>;
      adTopBarItems.push(adTitleDiv);
    }

    // Ad playback Info
    var adPlaybackInfo = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.AD, this.props.localizableStrings);
    var currentAdIndex = this.props.currentAdsInfo.currentAdItem.indexInPod;
    var totalNumberOfAds = this.props.currentAdsInfo.numberOfAds;
    if (this.isValidAdPlaybackInfo(currentAdIndex) && this.isValidAdPlaybackInfo(totalNumberOfAds)) {
      adPlaybackInfo = adPlaybackInfo + ": (" + currentAdIndex + "/" + totalNumberOfAds + ")";
    }

    var remainingTime = Utils.formatSeconds(Math.max(0, parseInt(this.props.adVideoDuration - this.props.currentPlayhead)));
    adPlaybackInfo = adPlaybackInfo + " - " + remainingTime;

    var adPlaybackInfoDiv = <AdPanelTopBarItem key="adPlaybackInfo" data={adPlaybackInfo} itemClassName="adPlaybackInfo"/>;
    adTopBarItems.push(adPlaybackInfoDiv);

    // Flexible space
    var flexibleSpaceDiv = <AdPanelTopBarItem key="flexibleSpace" itemClassName="flexibleSpace"/>;
    adTopBarItems.push(flexibleSpaceDiv);

    // Learn more
    var learnMoreClass = ClassNames({
      "learnMore": true,
      "hidden": !this.props.currentAdsInfo.currentAdItem.hasClickUrl
    });
    if (this.props.currentAdsInfo.currentAdItem !== null && this.isValidAdPlaybackInfo(this.props.currentAdsInfo.currentAdItem.hasClickUrl)) {
      var learnMoreText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.LEARN_MORE, this.props.localizableStrings);
      var learnMoreButtonDiv = <AdPanelTopBarItem key="learnMoreButton" ref="learnMoreButton" onButtonClicked={this.handleLearnMoreButtonClick}
        data={learnMoreText}
        icon={<Icon
          iconStyle={{fontFamily: this.props.skinConfig.icons.learn.fontFamilyName}}
          iconClass={this.props.skinConfig.icons.learn.fontStyleClass + " buttonIcon"}
          iconString={this.props.skinConfig.icons.learn.fontString}/>
        }
        itemClassName={learnMoreClass}/>;
      adTopBarItems.push(learnMoreButtonDiv);
    }

    // Skip
    var skipButtonClass = ClassNames({
      "skipButton": true,
      "visible": this.props.currentAdsInfo.skipAdButtonEnabled,
      "enabled": this.props.currentAdsInfo.skipAdButtonEnabled
    });
    var skipButtonText = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SKIP_AD, this.props.localizableStrings);
    var skipAdClass = this.props.skinConfig.icons.skip.fontStyleClass + " skipIcon";
    var skipButtonDiv = <AdPanelTopBarItem key="skipButton" ref="skipButton" onButtonClicked={this.handleSkipAdButtonClick}
                        data={skipButtonText}
                        icon={<Icon iconClass={skipAdClass}
                                iconStyle={{fontFamily: this.props.skinConfig.icons.skip.fontFamilyName}}
                                iconString={this.props.skinConfig.icons.skip.fontString}/>}
                        itemClassName={skipButtonClass}/>;
    adTopBarItems.push(skipButtonDiv);

    return adTopBarItems;
  },


  render: function() {
    var spinner = null;
    if (this.props.controller.state.buffering === true) {
      spinner = <Spinner loadingImage={this.props.skinConfig.general.loadingImage.imageResource.url}/>;
    }
    var adTopBarItems = this.populateAdTopBar();
    return (
      <div className="adScreenPanel">
        {spinner}
        <div className="adTopBar" ref="adTopBar" onClick={this.handleAdTopBarClick} onTouchEnd={this.handleAdTopBarClick}>
          {adTopBarItems}
        </div>
      </div>
    );
  }
});
module.exports = AdPanel;
