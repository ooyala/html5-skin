jest.dontMock('../../js/components/viewControls')
.dontMock('../../js/components/directionControl')
.dontMock('../../js/components/utils')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/logo')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var skinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');
var ViewControls = require('../../js/components/viewControls');
var DirectionControl = require('../../js/components/directionControl');

describe('viewControls', function () {
  
  var baseMockController, baseMockProps;
  var defaultSkinConfig = JSON.parse(JSON.stringify(skinConfig));
  
  beforeEach(function () {
    baseMockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: JSON.parse(JSON.stringify(defaultSkinConfig))
    };
  });
  
  it('creates a viewControls', function () {
    
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
      isLiveStream: false,
      duration: 30,
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller,
    };
    
    var DOM = TestUtils.renderIntoDocument(	<ViewControls {...mockProps}/> );
  });
  
  it('create buttons in a viewControls', function () {
    var mockProps = {
      isLiveStream: false,
      duration: 30,
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      clickButton: false,
      handleVRViewControlsClick: function () {
        mockProps.clickButton = true;
      }
    };
    
    var DOM = TestUtils.renderIntoDocument(
      <DirectionControl {...mockProps}  handleVRViewControlsClick={mockProps.handleVRViewControlsClick} dir="left"/>
    );
    
    var button = TestUtils.findRenderedDOMComponentWithClass(DOM, 'direction-control');
    
    expect(mockProps.clickButton).toBe(false);
    TestUtils.Simulate.mouseDown(button);
    expect(mockProps.clickButton).toBe(true);
  });
  
  it('check condition: if video support vr360 and view on desktop then viewControls exist', function () {
   
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
      "whenDoesNotFit":"keep"
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
      {"name":"stereo", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"fullscreen", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":45 },
      {"name":"arrowsBlack", "location": "mainView", "whenDoesNotFit":"keep"}
    ];
    
    var mockProps = {
      isLiveStream: false,
      duration: 30,
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    
    var DOM = TestUtils.renderIntoDocument( <ViewControls {...mockProps}/> );
    
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'direction-control');
    expect(buttons.length).toBe(4);
  });
  
  it('check condition: if video does not support vr360 then viewControls does not exist', function () {
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
      isLiveStream: false,
      duration: 30,
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    
    var DOM = TestUtils.renderIntoDocument( <ViewControls {...mockProps}/> );
    
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'direction-control');
    expect(buttons.length).toBe(4);
  });
});