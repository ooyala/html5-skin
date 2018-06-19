jest.dontMock('../../js/components/adPanel');
jest.dontMock('../../js/components/spinner');
jest.dontMock('../../js/constants/constants');

var React = require('react');
var ReactDOM = require('react-dom');
var AdPanel = require('../../js/components/adPanel');
var Spinner = require('../../js/components/spinner');
var CONSTANTS = require('../../js/constants/constants');
var Enzyme = require('enzyme');

describe('AdPanel', function() {
  var mockController, mockSkinConfig, currentAdsInfo;
  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false
      },
      getAdRemainingTime: function() {
        return 0;
      }
    };

    mockSkinConfig = {
      general: {
        loadingImage: {
          imageResource: {
            url: "url"
          }
        }
      },
      adScreen: {
        showControlBar: true,
        showAdCountDown: true,
        showAdMarquee: true
      },
      icons: {
        skip: {
          fontStyleClass: 'skip'
        }
      }
    };

    currentAdsInfo = {
      numberOfAds: 1,
      currentAdItem: {
        name: 'Test Ad',
        isLive: true,
        indexInPod: 1,
        duration: 15
      }
    };
  });
  it('creates an AdPanel', function() {
    var wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
      />);
  });

  it('handles clicks', function() {
    var isSkipAdClicked = false;
    var learnMoreClicked = false;
    var clickSource = '';

    mockController.onSkipAdClicked = function() {
      isSkipAdClicked = true;
    };

    mockController.onAdsClicked = function(source) {
      learnMoreClicked = true;
      clickSource = source;
    };

    currentAdsInfo.currentAdItem.hasClickUrl = true;

    var wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
      />);

    // our callback doesn't get assigned to the click event in testing
    wrapper.ref('skipButton').props.onButtonClicked({type: 'click',
      stopPropagation: function() {}
    });
    expect(isSkipAdClicked).toBe(true);

    wrapper.ref('learnMoreButton').props.onButtonClicked({type: 'click',
      stopPropagation: function() {}
    });
    expect(learnMoreClicked).toBe(true);
    expect(clickSource).toBe(CONSTANTS.AD_CLICK_SOURCE.LEARN_MORE_BUTTON);
  });

  it('shows the ad metadata', function() {
    mockSkinConfig.adScreen.showAdCountDown = false;

    var wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
        componentWidth={600}
      />);

    expect(wrapper.ref('adTitle')).toBeDefined();

    wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
        componentWidth={500}
      />);

    expect(wrapper.ref('adTitle')).toBeUndefined();
  });

  it('shows the buffering spinner', function() {
    mockController.state.buffering = true;

    var wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
        componentWidth={600}
      />);

    expect(wrapper.find(Spinner)).toBeDefined();
  });

  it('shows the ad count down when enabled', function() {
    var wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
        componentWidth={600}
      />);

    expect(wrapper.ref('adPlaybackInfo')).toBeDefined();
  });

});
