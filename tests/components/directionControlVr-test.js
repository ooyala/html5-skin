jest
  .dontMock('../../js/components/directionControlVr')
  .dontMock('../../js/constants/constants')
  .dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var skinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');
var DirectionControlVr = require('../../js/components/directionControlVr');

describe('directionControlVr', function () {
  it('should creates a directionControlVr', function () {
    var mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      clickButton: false,
      handleVrViewControlsClick: function () {
        mockProps.clickButton = true
      }
    };
    var DOM = TestUtils.renderIntoDocument(	<DirectionControlVr {...mockProps}/> );
    var button = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-direction-control');

    expect(mockProps.clickButton).toBe(false);
    TestUtils.Simulate.mouseDown(button);
    expect(mockProps.clickButton).toBe(true);
  });
});