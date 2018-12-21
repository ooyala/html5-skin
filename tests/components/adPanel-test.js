jest.dontMock('../../js/components/adPanel');
jest.dontMock('../../js/components/spinner');
jest.dontMock('../../js/constants/constants');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var AdPanel = require('../../js/components/adPanel');
var Spinner = require('../../js/components/spinner');
var CONSTANTS = require('../../js/constants/constants');

describe('AdPanel', function() {
  var mockController, mockSkinConfig, currentAdsInfo;
  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false
      },
      getAdRemainingTime: function() {
        return 0;
      },
      onSkipAdClicked: jest.fn(),
      onAdsClicked: jest.fn(),
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
    currentAdsInfo.currentAdItem.hasClickUrl = true;

    var wrapper = Enzyme.mount(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
      />);

    var skipButton = wrapper.find('.oo-skip-button');
    skipButton.simulate('click');
    expect(mockController.onSkipAdClicked).toBeCalled();

    var learnMoreButton = wrapper.find('.oo-learn-more');
    learnMoreButton.simulate('click');
    expect(mockController.onAdsClicked).toBeCalled();
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
