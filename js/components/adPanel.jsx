import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

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

  /**
   * @param {Object} event – the event object
   */
  handleSkipAdButtonKeyUp = (event) => {
    if (event.keyCode === CONSTANTS.KEYCODES.SPACE_KEY) {
      event.stopPropagation();
      this.handleSkipAdButtonClick();
    }
  }

  handleLearnMoreButtonClick = () => {
    const { controller } = this.props;
    controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.LEARN_MORE_BUTTON);
  }

  /**
   * @param {Object} event – the event object
   */
  handleLearnMoreButtonKeyUp = (event) => {
    if (event.keyCode === CONSTANTS.KEYCODES.SPACE_KEY) {
      event.stopPropagation();
      this.handleLearnMoreButtonClick();
    }
  }

  /**
   * handle the click
   * @param {Object} event – the event object
   */
  handleAdTopBarClick = (event) => {
    if (event.type === 'touchend' || !this.isMobile) {
      // since mobile would fire both click and touched events,
      // we need to make sure only one actually does the work
      event.stopPropagation();
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
          data-testid="adTitle"
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
        key="adPlaybackInfo"
        itemClassName="oo-ad-playback-info"
        data-testid="adPlaybackInfo"
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
          onButtonClick={this.handleLearnMoreButtonClick}
          onButtonKeyUp={this.handleLearnMoreButtonKeyUp}
          itemClassName={learnMoreClass}
        >
          <Icon
            icon="learn"
            className="oo-button-icon"
            skinConfig={skinConfig}
          />
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
        onButtonClick={this.handleSkipAdButtonClick}
        onButtonKeyUp={this.handleSkipAdButtonKeyUp}
        itemClassName={skipButtonClass}
      >
        <Icon
          icon="skip"
          className="oo-button-icon"
          skinConfig={skinConfig}
        />
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
        {/* click and touchEnd handlers are only for preventing event propagation */}
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          className="oo-ad-top-bar"
          onClick={this.handleAdTopBarClick}
          onTouchEnd={this.handleAdTopBarClick}
        >
          {adTopBarItems}
        </div>
      </div>
    );
  }
}


AdPanel.propTypes = {
  currentAdsInfo: PropTypes.shape({
    currentAdItem: PropTypes.shape({
      hasClickUrl: PropTypes.bool,
      name: PropTypes.string,
      indexInPod: PropTypes.number,
      isLive: PropTypes.bool,
    }),
    numberOfAds: 0,
    skipAdButtonEnabled: false,
  }),
  contentTree: PropTypes.shape({
    title: PropTypes.string,
  }),
  controller: PropTypes.shape({
    setCurrentAudio: PropTypes.func,
    onClosedCaptionChange: PropTypes.func,
    state: PropTypes.shape({
      closedCaptionOptions: PropTypes.shape({}),
      multiAudio: PropTypes.shape({
        tracks: PropTypes.array,
      }),
    }),
    languageList: PropTypes.array,
  }).isRequired,
  componentWidth: PropTypes.number,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  skinConfig: PropTypes.shape({}),
};


AdPanel.defaultProps = {
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
  contentTree: {
    title: '',
  },
  componentWidth: null,
  language: '',
  localizableStrings: { en: {} },
  skinConfig: {},
};

module.exports = AdPanel;
