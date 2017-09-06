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
      getVrParams: function () {
        return {stereo: false};
      }
    };
    
    var mockProps = {
      isLiveStream: false,
      duration: 30,
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
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
      handleDirection: function () {
        mockProps.clickButton = true;
      }
    };
    
    var DOM = TestUtils.renderIntoDocument(
      <DirectionControl {...mockProps} handleDirection={mockProps.handleDirection} dir="left"/>
    );
    
    var button = TestUtils.findRenderedDOMComponentWithClass(DOM, 'direction-control');
    
    expect(mockProps.clickButton).toBe(false);
    TestUtils.Simulate.mouseDown(button);
    expect(mockProps.clickButton).toBe(true);
  });
  
  it('check condition: if video support vr360 then viewControls exist', function () {
    var controller = {
      getVrParams: function () {
        return {stereo: false};
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
  
  it('check condition: if video does not support vr360 then viewControls does not exist', function () {
    var controller = {
      getVrParams: function () {
        return null;
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