jest
  .dontMock('../../js/components/directionControlVr')
  .dontMock('../../js/constants/constants')
  .dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var skinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');
var DirectionControlVr = require('../../js/components/directionControlVr');

describe('directionControlVr', function() {
  it('should creates a directionControlVr', function() {
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      clickButton: false,
      handleVrViewControlsClick: function() {
        mockProps.clickButton = true;
      }
    };
    var wrapper = Enzyme.mount(<DirectionControlVr {...mockProps}/>);
    var button = wrapper.find('.oo-direction-control');

    expect(mockProps.clickButton).toBe(false);
    button.simulate('mouseDown');
    expect(mockProps.clickButton).toBe(true);
  });
});