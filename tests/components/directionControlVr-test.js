jest
  .dontMock('../../js/components/directionControlVr')
  .dontMock('../../js/components/controlButton')
  .dontMock('../../js/components/accessibleButton')
  .dontMock('../../js/components/nonAccessibleButton')
  .dontMock('../../js/constants/constants')
  .dontMock('classnames');

const React = require('react');
const Enzyme = require('enzyme');
const skinConfig = require('../../config/skin.json');
const CONSTANTS = require('../../js/constants/constants');
const sinon = require('sinon');

import DirectionControlVr from '../../js/components/directionControlVr';

describe('directionControlVr', function() {
  let spyClick;
  let mockProps = {
    controller: {
      state: {
        isMobile: false
      }
    },
    skinConfig: skinConfig,
    playerState: CONSTANTS.STATE.PLAYING,
    clickButton: false,
    handleVrViewControlsClick: function() {
      mockProps.clickButton = true;
    },
    focusId: 'test',
  };
  beforeEach(function() {
    spyClick = sinon.spy(mockProps, 'handleVrViewControlsClick');
  });
  afterEach(function() {
    spyClick.restore();
  });
  it('should creates a directionControlVr', function() {
    const wrapper = Enzyme.mount(<DirectionControlVr {...mockProps}/>);
    const button = wrapper.find('.oo-direction-control').hostNodes();

    expect(mockProps.clickButton).toBe(false);
    button.simulate('mouseDown');
    expect(mockProps.clickButton).toBe(true);
  });
  it('should call handleVrViewControlsClick with specific params when it is neccessary', function() {
    mockProps.dir = 'left';
    const wrapper = Enzyme.mount(<DirectionControlVr {...mockProps}/>);
    const button = wrapper.find('.oo-direction-control').hostNodes();

    button.simulate('mousedown');
    expect(spyClick.callCount).toBe(1);
    expect(spyClick.firstCall.args[1]).toBe(true);
    button.simulate('mouseup');
    expect(spyClick.callCount).toBe(2); // should call handleVrViewControlsClick
    expect(spyClick.secondCall.args[1]).toBe(false);
    button.simulate('mouseout');
    expect(spyClick.callCount).toBe(2); // should not call handleVrViewControlsClick
  });
});