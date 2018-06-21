jest
  .dontMock('../../js/components/directionControlVr')
  .dontMock('../../js/constants/constants')
  .dontMock('classnames');

var React = require('react');
var skinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');
var DirectionControlVr = require('../../js/components/directionControlVr');
var Enzyme = require('enzyme');

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