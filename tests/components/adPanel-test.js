jest.dontMock('../../src/js/components/adPanel');
jest.dontMock('../../src/js/components/spinner');
jest.dontMock('../../src/js/constants/constants');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var AdPanel = require('../../src/js/components/adPanel');
var Spinner = require('../../src/js/components/spinner');
var CONSTANTS = require('../../src/js/constants/constants');

describe('AdPanel', function () {
  it('creates an AdPanel', function () {
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      icons: {
        skip: {
          fontStyleClass: "skip"
        },
      }
    };
    var currentAdsInfo = {
      currentAdItem: {
        name: "Test Ad"
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
      />);

  });

  it('handles clicks', function () {
    var isSkipAdClicked = false;
    var learnMoreClicked = false;
    var clickSource = "";
    var mockController = {
      state: {
        isMobile: false
      },
      onSkipAdClicked: function() {
        isSkipAdClicked = true;
      },
      onAdsClicked: function(source) {
        learnMoreClicked = true;
        clickSource = source;
      }
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      icons: {
        skip: {
          fontStyleClass: "skip"
        },
        learn: {
          fontStyleClass: "learn"
        }
      }
    };
    var currentAdsInfo = {
      currentAdItem: {
        name: "Test Ad",
        skippable: true,
        skipAdButtonEnabled: true,
        hasClickUrl: true
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
      />);

    TestUtils.Simulate.click(DOM.refs.adTopBar);

    //our callback doesn't get assigned to the click event in testing
    DOM.refs.skipButton.props.onButtonClicked({type: "click",
      stopPropagation: function(){}
    });
    expect(isSkipAdClicked).toBe(true);

    DOM.refs.learnMoreButton.props.onButtonClicked({type: "click",
      stopPropagation: function(){}
    });
    expect(learnMoreClicked).toBe(true);
    expect(clickSource).toBe(CONSTANTS.AD_CLICK_SOURCE.LEARN_MORE_BUTTON);
  });

  it('shows the ad metadata', function () {
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      icons: {
        skip: {
          fontStyleClass: "skip"
        },
      }
    };
    var currentAdsInfo = {
      numberOfAds: 1,
      currentAdItem: {
        name: "Test Ad",
        indexInPod: 1,
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
        componentWidth={600}
      />);

    expect(DOM.refs.adTitle).toBeDefined();

      DOM = TestUtils.renderIntoDocument(
        <AdPanel
          controller={mockController}
          skinConfig={mockSkinConfig}
          currentAdsInfo={currentAdsInfo}
          componentWidth={500}
        />);

      expect(DOM.refs.adTitle).toBeUndefined();
  });

  it('shows the buffering spinner', function () {
    var mockController = {
      state: {
        isMobile: false,
        buffering: true
      }
    };
    var mockSkinConfig = {
      general: {
        loadingImage: {
          imageResource: {
            url: true
          }
        }
      },
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      icons: {
        skip: {
          fontStyleClass: "skip"
        },
      }
    };
    var currentAdsInfo = {
      numberOfAds: 1,
      currentAdItem: {
        name: "Test Ad",
        indexInPod: 1,
      }
    };
    var DOM = TestUtils.renderIntoDocument(
      <AdPanel
        controller={mockController}
        skinConfig={mockSkinConfig}
        currentAdsInfo={currentAdsInfo}
        componentWidth={600}
      />);

      expect(TestUtils.findRenderedComponentWithType(DOM, Spinner)).toBeDefined();

  });

});