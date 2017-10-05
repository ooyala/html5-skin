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
      getVrParams: function () {
        return {stereo: false};
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
      handleDirection: function () {
        mockProps.clickButton = true;
      }
    };

    mockProps = _.extend(mockProps, baseMockProps);
    
    var DOM = TestUtils.renderIntoDocument(
      <DirectionControlVr {...mockProps} handleDirection={mockProps.handleDirection} dir="left"/>
    );
    
    var button = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-direction-control');
    
    expect(mockProps.clickButton).toBe(false);
    TestUtils.Simulate.mouseDown(button);
    expect(mockProps.clickButton).toBe(true);
  });
  
  it('check condition: if video support vr360 then viewControlsVr exist', function () {
    var controller = {
      getVrParams: function () {
        return {stereo: false};
      }
    };
    
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };

    mockProps = _.extend(mockProps, baseMockProps);
    
    var DOM = TestUtils.renderIntoDocument( <ViewControlsVr {...mockProps}/> );
    
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-direction-control');
    expect(buttons.length).toBe(4);
  });
  
  it('check condition: if video does not support vr360 then viewControlsVr does not exist', function () {
    var controller = {
      getVrParams: function () {
        return null;
      }
    };
    
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };

    mockProps = _.extend(mockProps, baseMockProps);
    
    var DOM = TestUtils.renderIntoDocument( <ViewControlsVr {...mockProps}/> );
    
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-direction-control');
    expect(buttons.length).toBe(4);
  });
});