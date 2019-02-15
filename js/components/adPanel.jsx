import React from 'react';
import ClassNames from 'classnames';

import CONSTANTS from '../constants/constants';
import Utils from './utils';
import Icon from './icon';
import AdPanelTopBarItem from './adPanelTopBarItem';

/**
 * Representation of ad panel
 */
class AdPanel extends React.Component {
  constructor(props) {
    super(props);
    const { controller } = props;
    this.isMobile = controller.state.isMobile;
  }

  handleSkipAdButtonClick = () => {
    const { controller } = this.props;
    controller.onSkipAdClicked();
  }

  handleLearnMoreButtonClick = () => {
    const { controller } = this.props;
    controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.LEARN_MORE_BUTTON);
  }

  /**
   * handle the click
   * @param {Object} event – the event object
   */
  handleAdTopBarClick = (event) => {
    if (event.type === 'touchend' || !this.isMobile) {
      // since mobile would fire both click and touched events,
      // we need to make sure only one actually does the work
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // eslint-disable-line
    }
  }

  /**
   * define if playback info is valid
   * @param {Object} playbackInfo - the playback
   * @returns {boolean} the result of a check
   */
  isValidAdPlaybackInfo = playbackInfo => playbackInfo !== null
    && typeof playbackInfo !== 'undefined'
    && playbackInfo !== '';

  /**
   * define the list of ad panel items based on props
   * @returns {Array} array of React components
   */
  populateAdTopBar = () => {
    const {
      currentAdsInfo,
      contentTree,
      componentWidth,
      language,
      localizableStrings,
      skinConfig,
      controller,
    } = this.props;
    const adTopBarItems = [];

    // Ad title
    let adTitle = 'Unknown';
    if (
      currentAdsInfo
      && currentAdsInfo.currentAdItem
      && contentTree
      && currentAdsInfo.currentAdItem.ooyalaAds
      && contentTree.title
    ) {
      adTitle = contentTree.title;
    } else {
      adTitle = currentAdsInfo.currentAdItem.name;
    }
    // AMC puts "Unknown" in the name field if ad name unavailable
    const componentWidthThreshold = 560;
    if (this.isValidAdPlaybackInfo(adTitle) && componentWidth > componentWidthThreshold) {
      const adTitleDiv = (
        <AdPanelTopBarItem
          key="adTitle"
          ref="adTitle" // eslint-disable-line
          itemClassName="oo-ad-title"
        >
          {adTitle}
        </AdPanelTopBarItem>
      );
      adTopBarItems.push(adTitleDiv);
    }

    // Ad playback Info
    let adPlaybackInfo = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.AD,
      localizableStrings
    );
    const currentAdIndex = currentAdsInfo.currentAdItem.indexInPod;
    const totalNumberOfAds = currentAdsInfo.numberOfAds;
    if (this.isValidAdPlaybackInfo(currentAdIndex) && this.isValidAdPlaybackInfo(totalNumberOfAds)) {
      adPlaybackInfo = `${adPlaybackInfo}: (${currentAdIndex}/${totalNumberOfAds})`;
    }

    if (skinConfig.adScreen.showAdCountDown) {
      let remainingTime = controller.getAdRemainingTime();

      if (Number.isFinite(remainingTime)) {
        remainingTime = Utils.formatSeconds(Math.max(0, remainingTime));
        adPlaybackInfo = `${adPlaybackInfo} - ${remainingTime}`;
      } else {
        OO.log('ad remaining time is not a finite number');
      }
    }

    const adPlaybackInfoDiv = (
      <AdPanelTopBarItem
        ref="adPlaybackInfo" // eslint-disable-line
        key="adPlaybackInfo"
        itemClassName="oo-ad-playback-info"
      >
        {adPlaybackInfo}
      </AdPanelTopBarItem>
    );
    adTopBarItems.push(adPlaybackInfoDiv);

    // Flexible space
    const flexibleSpaceDiv = <AdPanelTopBarItem key="flexibleSpace" itemClassName="oo-flexible-space" />;
    adTopBarItems.push(flexibleSpaceDiv);

    // Learn more
    const learnMoreClass = ClassNames({
      'oo-learn-more': true,
      'oo-hidden': !currentAdsInfo.currentAdItem.hasClickUrl,
    });
    if (
      currentAdsInfo.currentAdItem !== null
      && this.isValidAdPlaybackInfo(currentAdsInfo.currentAdItem.hasClickUrl)
    ) {
      const learnMoreText = Utils.getLocalizedString(
        language,
        CONSTANTS.SKIN_TEXT.LEARN_MORE,
        localizableStrings
      );
      const learnMoreButtonDiv = (
        <AdPanelTopBarItem
          key="learnMoreButton"
          ref="learnMoreButton" // eslint-disable-line
          onButtonClicked={this.handleLearnMoreButtonClick}
          itemClassName={learnMoreClass}
        >
          <Icon {...this.props} icon="learn" className="oo-button-icon" />
          {learnMoreText}
        </AdPanelTopBarItem>
      );
      adTopBarItems.push(learnMoreButtonDiv);
    }

    // Skip
    const skipButtonClass = ClassNames({
      'oo-skip-button': true,
      'oo-visible': currentAdsInfo.skipAdButtonEnabled,
      'oo-enabled': currentAdsInfo.skipAdButtonEnabled,
    });
    const skipButtonText = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.SKIP_AD,
      localizableStrings
    );
    const skipButtonDiv = (
      <AdPanelTopBarItem
        key="skipButton"
        ref="skipButton" // eslint-disable-line
        onButtonClicked={this.handleSkipAdButtonClick}
        itemClassName={skipButtonClass}
      >
        <Icon {...this.props} icon="skip" className="oo-button-icon" />
        {skipButtonText}
      </AdPanelTopBarItem>
    );
    adTopBarItems.push(skipButtonDiv);

    return adTopBarItems;
  }

  render() {
    const adTopBarItems = this.populateAdTopBar();
    return (
      <div className="oo-ad-screen-panel">
        <div className="oo-ad-screen-panel-click-layer" />
        <div // eslint-disable-line
          className="oo-ad-top-bar"
          ref="adTopBar" // eslint-disable-line
          onClick={this.handleAdTopBarClick}
          onTouchEnd={this.handleAdTopBarClick}
        >
          {adTopBarItems}
        </div>
      </div>
    );
  }
}

AdPanel.defaultProps = {
  currentPlayhead: 0,
  currentAdPlayhead: 0,
  adVideoDuration: 0,
  adStartTime: 0,
  currentAdsInfo: {
    numberOfAds: 0,
    skipAdButtonEnabled: false,
    currentAdItem: {
      hasClickUrl: false,
      name: '',
      indexInPod: 0,
      isLive: false,
    },
  },
  adEndTime: 0,
};

module.exports = AdPanel;
