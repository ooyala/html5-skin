jest.dontMock('../../js/components/adOverlay');
jest.dontMock('../../js/constants/constants');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var AdOverlay = require('../../js/components/adOverlay');
var CONSTANTS = require('../../js/constants/constants');

describe('AdOverlay', function() {
  var mockController, mockSkinConfig;
  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false
      },
      closeNonlinearAd: jest.fn(),
      onSkipAdClicked: jest.fn(),
      onAdsClicked: jest.fn(),
    };
    mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      icons: {
        dismiss: {
          fontStyleClass: 'dismiss'
        }
      }
    };
  });

  afterEach(function() {

  });

  it('creates an AdOverlay', function() {
    var loaded = false;
    mockController.onAdOverlayLoaded = function() {
      loaded = true;
    };

    var wrapper = Enzyme.mount(
      <AdOverlay
        controller={mockController}
        skinConfig={mockSkinConfig}
        overlay={"overlay"}
        showOverlay={true}
      />);
    var adOverlayImage = wrapper.find('.oo-ad-overlay-image');
    adOverlayImage.simulate('load');
    expect(loaded).toBe(true);
  });

  it('handles a click', function() {
    var wrapper = Enzyme.mount(
      <AdOverlay
        controller={mockController}
        skinConfig={mockSkinConfig}
        overlay={"overlay"}
        showOverlay={true}
      />);

    var ad = wrapper.find('a');
    ad.simulate('click');
    expect(mockController.onAdsClicked).toBeCalled();
  });

  it('closes', function() {
    var wrapper = Enzyme.mount(
      <AdOverlay
        controller={mockController}
        skinConfig={mockSkinConfig}
        overlay={"overlay"}
        showOverlay={true}
      />);

    var closeBtn = wrapper.find('button.oo-ad-overlay-close-button');
    closeBtn.simulate('click');
    expect(mockController.closeNonlinearAd).toBeCalled();
    expect(mockController.onSkipAdClicked).toBeCalled();
  });

  it('hides and shows the close button', function() {
    var wrapper = Enzyme.mount(
      <AdOverlay
        controller={mockController}
        skinConfig={mockSkinConfig}
        showOverlayCloseButton={false}
        overlay={"overlay"}
        showOverlay={true}
      />);

    var closeBtn = wrapper.find('button.oo-ad-overlay-close-button');
    expect(closeBtn.instance().className).toMatch('hidden');

    wrapper = Enzyme.mount(
      <AdOverlay
        controller={mockController}
        skinConfig={mockSkinConfig}
        showOverlayCloseButton={true}
        overlay={"overlay"}
        showOverlay={true}
      />);

    closeBtn = wrapper.find('button.oo-ad-overlay-close-button');
    expect(closeBtn.instance().className).not.toMatch('hidden');
  });
});
