jest.dontMock('../../js/components/moreOptionsPanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/constants/constants')
    .dontMock('../../js/mixins/animateMixin')
    .dontMock('classnames');

var React = require('react');
var CONSTANTS = require('../../js/constants/constants');
var MoreOptionsPanel = require('../../js/components/moreOptionsPanel');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');
var Enzyme = require('enzyme');

// start unit test
describe('MoreOptionsPanel', function() {
  var oneButtonSkinConfig, mockController, mockProps;
  var discoveryScreenToggled = false;
  var shareScreenToggled = false;
  var toggleScreenClicked = false;

  beforeEach(function() {
    oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':200 },
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':200 },
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':200 },
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':200 },
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':200 }
    ];

    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        videoQualityOptions: {
          availableBitrates: true
        },
        discoveryData: true,
        moreOptionsItems: oneButtonSkinConfig.buttons.desktopContent
      },
      toggleDiscoveryScreen: function() {
        discoveryScreenToggled = true;
      },
      toggleShareScreen: function() {
        shareScreenToggled = true;
      },
      toggleScreen: function() {
        toggleScreenClicked = true;
      }
    };

    mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };
  });

  it('creates more options panel', function() {
    var wrapper = Enzyme.mount(
      <MoreOptionsPanel {...mockProps}
        playerState={CONSTANTS.STATE.PLAYING}
        controlBarVisible={true}
        controlBarWidth={100} />
    );

    // test mouseover highlight
    var span = wrapper.find('span');
    for (var i=0; i<span.length; i++) {
      span.at(i).simulate('mouseOver');
      span.at(i).simulate('mouseOut');
    }

    // test btn clicks
    var button = wrapper.find('a');
    for (var j=0; j<button.length; j++) {
      button.at(j).simulate('click');
    }
    expect(toggleScreenClicked).toBe(true);
    expect(shareScreenToggled).toBe(true);
    expect(discoveryScreenToggled).toBe(true);
  });
});

// bitrate selection, closed captions, discovery buttons not available
describe('MoreOptionsPanel', function() {
  var oneButtonSkinConfig, mockController, mockProps;
  beforeEach(function() {
    oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [];

    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: null},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: null,
        moreOptionsItems: oneButtonSkinConfig.buttons.desktopContent
      }
    };
    mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };
  });
  it('checks cc button not available', function() {
    var wrapper = Enzyme.mount(
      <MoreOptionsPanel {...mockProps}
        playerState={CONSTANTS.STATE.PLAYING}
        controlBarVisible={true}
        controlBarWidth={100} />
    );

    var ccButtons = wrapper.find('.oo-closed-caption');
    expect(ccButtons.length).toBe(0);

    var qualityButtons = wrapper.find('.oo-quality');
    expect(qualityButtons.length).toBe(0);

    var discoveryButtons = wrapper.find('.oo-discovery');
    expect(discoveryButtons.length).toBe(0);

    var audioAndCCButtons = wrapper.find('.oo-discovery');
    expect(audioAndCCButtons.length).toBe(0);
  });
});