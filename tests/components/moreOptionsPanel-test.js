jest.dontMock('../../js/components/moreOptionsPanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var CONSTANTS = require('../../js/constants/constants');
var MoreOptionsPanel = require('../../js/components/moreOptionsPanel');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');

// start unit test
describe('MoreOptionsPanel', function () {
  it('creates more options panel', function () {

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"share", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 },
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 },
      {"name":"closedCaption", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 },
      {"name":"quality", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 }
    ];

    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        videoQualityOptions: {
          availableBitrates: true
        },
        discoveryData: true
      },
      toggleDiscoveryScreen: function() {
        discoveryScreenToggled = true;
      },
      toggleShareScreen: function() {
        shareScreenToggled = true;
      },
      toggleClosedCaptionScreen: function() {
        ccScreenToggled = true;
      },
      toggleScreen: function() {
        qualityClicked = true;
      }
    };

    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <MoreOptionsPanel {...mockProps}
        playerState={CONSTANTS.STATE.PLAYING}
        controlBarVisible={true}
        controlBarWidth={100} />
    );

    //test mouseover highlight
    var span = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'span');
    for(var i=0; i<span.length; i++){
      TestUtils.Simulate.mouseOver(span[i]);
      TestUtils.Simulate.mouseOut(span[i]);
    }

    //test btn clicks
    var button = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'button');
    for(var j=0; j<button.length; j++){
      TestUtils.Simulate.click(button[j]);
    }
    expect(qualityClicked).toBe(true);
    expect(ccScreenToggled).toBe(true);
    expect(shareScreenToggled).toBe(true);
    expect(discoveryScreenToggled).toBe(true);
  });
});

//bitrate selection, closed captions, discovery buttons not available
describe('MoreOptionsPanel', function () {
  it('checks cc button not available', function () {

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"closedCaption", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 },
      {"name":"quality", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 },
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":200 }
    ];

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
        discoveryData: null
      }
    };
    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <MoreOptionsPanel {...mockProps}
        playerState={CONSTANTS.STATE.PLAYING}
        controlBarVisible={true}
        controlBarWidth={100} />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'closedCaption');
    expect(ccButtons.length).toBe(0);

    var qualityButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality');
    expect(qualityButtons.length).toBe(0);

    var discoveryButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'discovery');
    expect(discoveryButtons.length).toBe(0);
  });
});