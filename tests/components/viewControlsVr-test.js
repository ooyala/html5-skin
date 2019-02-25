jest.dontMock('../../js/components/viewControlsVr')
.dontMock('../../js/components/directionControlVr')
.dontMock('../../js/components/ControlButton')
.dontMock('../../js/components/utils')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/logo')
.dontMock('../../js/constants/constants')
.dontMock('classnames')
.dontMock('underscore');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const skinConfig = require('../../config/skin.json');
const CONSTANTS = require('../../js/constants/constants');
const ViewControlsVr = require('../../js/components/viewControlsVr');
const _ = require('underscore');

import DirectionControlVr from '../../js/components/directionControlVr';
import ControlButton from '../../js/components/controlButton';

describe('viewControlsVr', function() {
  
  let baseMockProps;
  let defaultSkinConfig = JSON.parse(JSON.stringify(skinConfig));
  skinConfig.buttons.desktopContent =  [
    {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':45 },
    {'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':240 },
    {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':45},
    {'name':'timeDuration', 'location':'controlBar', 'whenDoesNotFit':'drop', 'minWidth':145 },
    {'name':'flexibleSpace', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':1 },
    {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 },
    {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 },
    {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 },
    {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 },
    {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':125 },
    {'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':45 },
    {'name':'fullscreen', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':45 },
    {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':45 },
    {'name':'arrowsBlack', 'location': 'mainView', 'whenDoesNotFit':'keep', 'minWidth':45 }
  ];
  
  beforeEach(function() {
    baseMockProps = {
      controller: {
        state: {
          isMobile: false,
          isPlayingAd: false,
        },
      },
      isLiveStream: false,
      skinConfig: JSON.parse(JSON.stringify(defaultSkinConfig)),
      focusId: 'test',
    };
  });

  it('creates a viewControlsVr', function() {
    const controller = {
      state: {
        isPlayingAd: false
      },
      videoVrSource: {
        vr: {
          stereo: false
        }
      }
    };
    
    let mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller,
    };

    mockProps = _.extend(mockProps, baseMockProps);

    const wrapper = Enzyme.mount(<ViewControlsVr {...mockProps}/>);
  });
  
  it('create buttons in a viewControlsVr', function() {
    let controller = {
      state: {
        isMobile: false
      },
    };

    let mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      clickButton: false,
      handleVrViewControlsClick: function() {
        mockProps.clickButton = true;
      },
      controller: controller,
    };

    mockProps = _.extend(mockProps, baseMockProps);

    const wrapper = Enzyme.mount(
      <DirectionControlVr
        {...mockProps}
        handleVrViewControlsClick={mockProps.handleVrViewControlsClick}
        dir="left"
      />
    );

    const buttons = wrapper.find(ControlButton);
    
    expect(mockProps.clickButton).toBe(false);
    buttons.simulate('mouseDown');
    expect(mockProps.clickButton).toBe(true);
  });

  it('check condition: if video support vr360 then viewControlsVr exist', () => {
    const controller = {
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

    this.icon = {'name':'arrowsBlack', 'location': 'mainView', 'whenDoesNotFit':'keep', 'minWidth':45 };

    const mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    const wrapper = Enzyme.mount(<ViewControlsVr {...mockProps}/>);
    const buttons = wrapper.find(ControlButton);

    expect(buttons.length).toBe(5);
  });
   
  it('on the ViewControlsVr should be two icons: one icon of the background and one icon of the symbol',
    () => {
      const controller = {
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
        'name':'arrowsBlack',
        'location': 'mainView',
        'whenDoesNotFit':'keep',
        'minWidth':45
      };

      const mockProps = {
        skinConfig: skinConfig,
        playerState: CONSTANTS.STATE.PLAYING,
        controller: controller
      };
      const wrapper = Enzyme.mount(<ViewControlsVr {...mockProps}/>);
      const iconSubstrate = wrapper.find('.oo-vr-icon--substrate').hostNodes();
      const iconSymbol = wrapper.find('.oo-vr-icon--icon-symbol').hostNodes();

      expect(iconSubstrate.length).toBe(1);
      expect(iconSymbol.length).toBe(1);
    }
  );

  it('should be render viewControlsVr only desktop', () => {
    const controller = {
      state: {
        isPlayingAd: false,
        isMobile: true
      },
      videoVrSource: {
        vr: {
          stereo: false
        }
      }
    };

    this.icon = {
      'name':'arrowsBlack',
      'location': 'mainView',
      'whenDoesNotFit':'keep',
      'minWidth':45
    };

    const mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    const wrapper = Enzyme.mount(<ViewControlsVr {...mockProps}/>);
    const buttons = wrapper.find(ControlButton);

    expect(buttons.length).toBe(0);
  });

  it('should not be rendered on advertising', () => {
    const controller = {
      state: {
        isPlayingAd: true,
        isMobile: true
      },
      videoVrSource: {
        vr: {
          stereo: true
        }
      }
    };

    this.icon = {
      'name':'arrowsBlack',
      'location': 'mainView',
      'whenDoesNotFit':'keep',
      'minWidth':45
    };

    const mockProps = {
      skinConfig: skinConfig,
      playerState: CONSTANTS.STATE.PLAYING,
      controller: controller
    };
    const wrapper = Enzyme.mount(<ViewControlsVr {...mockProps}/>);
    const buttons = wrapper.find(ControlButton);

    expect(buttons.length).toBe(0);
  });
});