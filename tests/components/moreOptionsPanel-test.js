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
          availableBitrates: null
        }
      },
      toggleDiscoveryScreen: function() {
        discoveryScreenToggled = true;
      },
      toggleShareScreen: function() {
        shareScreenToggled = true;
      },
      toggleClosedCaptionScreen: function() {
        ccScreenToggled = true;
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
  });
});