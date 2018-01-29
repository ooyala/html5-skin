jest.dontMock('../../js/components/viewControlsVr')
.dontMock('../../js/components/directionControlVr')
.dontMock('../../js/components/utils')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/logo')
.dontMock('../../js/constants/constants')
.dontMock('classnames')
.dontMock('underscore');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var skinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');
var ViewControlsVr = require('../../js/components/viewControlsVr');
var DirectionControlVr = require('../../js/components/directionControlVr');
var _ = require('underscore');

describe('viewControlsVr', function () {
  
  var baseMockController, baseMockProps;
  var defaultSkinConfig = JSON.parse(JSON.stringify(skinConfig));
  
  beforeEach(function () {
    baseMockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: JSON.parse(JSON.stringify(defaultSkinConfig))
    };
  });
  
  it('creates a viewControlsVr', function () {
    var controller = {
      state: {
        isPlayingAd: false
      },
      videoVrSource: {
        vr: {
          stereo: false
        }
      }
    };
    
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };

    mockProps = _.extend(mockProps, baseMockProps);

    var DOM = TestUtils.renderIntoDocument(	<ViewControlsVr {...mockProps}/> );
  });
  
  it('create buttons in a viewControlsVr', function () {
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      clickButton: false,
      handleVrViewControlsClick: function () {
        mockProps.clickButton = true;
      }
    };

    mockProps = _.extend(mockProps, baseMockProps);

    var DOM = TestUtils.renderIntoDocument(
      <DirectionControlVr {...mockProps} handleVrViewControlsClick={mockProps.handleVrViewControlsClick} dir="left"/>
    );

    var button = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-direction-control');
    
    expect(mockProps.clickButton).toBe(false);
    TestUtils.Simulate.mouseDown(button);
    expect(mockProps.clickButton).toBe(true);
  });
  
  it('check condition: if video support vr360 then viewControlsVr exist', function () {
    var controller = {
      state: {
        isPlayingAd: false,
        isMobile: false
      },
      videoVrSource: {
        vr: {
          stereo: false
        }
      }
    };

    this.icon = {"name":"arrowsBlack", "location": "mainView", "whenDoesNotFit":"keep", "minWidth":45 };

    skinConfig.buttons.desktopContent =  [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":240 },
      {"name":"live", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45},
      {"name":"timeDuration", "location":"controlBar", "whenDoesNotFit":"drop", "minWidth":145 },
      {"name":"flexibleSpace", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":1 },
      {"name":"share", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"closedCaption", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"quality", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"logo", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":125 },
      {"name":"stereoscopic", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"fullscreen", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"arrowsBlack", "location": "mainView", "whenDoesNotFit":"keep", "minWidth":45 }
    ];
    
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    var DOM = TestUtils.renderIntoDocument( <ViewControlsVr {...mockProps}/> );
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-direction-control');
    
    expect(buttons.length).toBe(5);
  });
  
  it('check condition: if video does not support vr360 then viewControlsVr does not exist', function () {
    var DOM = TestUtils.renderIntoDocument( <ViewControlsVr {...baseMockProps}/> );
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-direction-control');
    expect(buttons.length).toBe(0);
  });

  it('on the ViewControlsVr should be two icons: one icon of the background and one icon of the symbol', function () {
    var controller = {
      state: {
        isPlayingAd: false,
        isMobile: false
      },
      videoVrSource: {
        vr: {
          stereo: false
        }
      }
    };

    this.icon = {
      "name":"arrowsBlack",
      "location": "mainView",
      "whenDoesNotFit":"keep",
      "minWidth":45
    };

    skinConfig.buttons.desktopContent =  [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":240 },
      {"name":"live", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45},
      {"name":"timeDuration", "location":"controlBar", "whenDoesNotFit":"drop", "minWidth":145 },
      {"name":"flexibleSpace", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":1 },
      {"name":"share", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"closedCaption", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"quality", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":45 },
      {"name":"logo", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":125 },
      {"name":"stereoscopic", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"fullscreen", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"arrowsBlack", "location": "mainView", "whenDoesNotFit":"keep", "minWidth":45 }
    ];

    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    var DOM = TestUtils.renderIntoDocument( <ViewControlsVr {...mockProps}/> );
    var iconSubstrate = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-vr-icon--substrate');
    var iconSymbol = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-vr-icon--icon-symbol');

    expect(iconSubstrate.length).toBe(1);
    expect(iconSymbol.length).toBe(1);
  });
});