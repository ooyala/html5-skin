jest.dontMock('../js/skin');
jest.dontMock('../js/constants/constants');
jest.dontMock('../js/components/utils');
jest.dontMock('../js/mixins/responsiveManagerMixin');
jest.dontMock('screenfull');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Skin = require('../js/skin');
var CONSTANTS = require('../js/constants/constants');
var skin = null;

describe('Skin', function () {
  it('tests methods', function () {
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
    skinComponent.handleClickOutsidePlayer();
    skinComponent.updatePlayhead(4,6,8);
    skinComponent.componentWillUnmount();
  });
});

describe('Skin screenToShow state', function () {
  beforeEach(function() {
    
    var testProps = {
      skinConfig: {
        general: {
          loadingImage: {
            imageResource: {
              url: null
            }
          }
        },
        startScreen: {
          titleFont: {
          },
          descriptionFont: {
          },
          playIconStyle: {
            color: 'white'
          },
          infoPanelPosition: 'topLeft',
          playButtonPosition: 'center',
          showPlayButton: true,
          showPromo: true,
          showTitle: true,
          showDescription: true,
          promoImageSize: 'default'
        },
        icons: {
          play:{fontStyleClass:'oo-icon oo-icon-play'},
          replay:{fontStyleClass:'oo-icon oo-icon-upnext-replay'}
        },
        controlBar: {
          height: 90
        },
        "responsive": {
          "breakpoints": {
            "xs": {"id": "xs", "name": "oo-xsmall", "maxWidth": 559, "multiplier": 0.7},
            "sm": {"id": "sm", "name": "oo-small", "minWidth": 560, "maxWidth": 839, "multiplier": 1},
            "md": {"id": "md", "name": "oo-medium", "minWidth": 840, "maxWidth": 1279, "multiplier": 1},
            "lg": {"id": "lg", "name": "oo-large", "minWidth": 1280, "multiplier": 1.2}
          },
        }
      },
      controller: {
        state: {
          adVideoDuration: 0,
          errorCode: 404
        },
        publishOverlayRenderingEvent: function() {}
      }
    };
    
    // Render skin into DOM
    skin = TestUtils.renderIntoDocument(<Skin {...testProps}/>);
  });

  it('tests LOADING SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.LOADING_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests START SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests PLAYING SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PLAYING_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests SHARE SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.SHARE_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests PAUSE SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PAUSE_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests END SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.END_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests AD SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.AD_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests DISCOVERY SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.DISCOVERY_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests MORE OPTIONS SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests CLOSED CAPTION SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests VIDEO QUALITY SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN,
      responsiveId: "md",
      videoQualityOptions: {
        autoFocus: false
      }
    });
  });

  it('tests ERROR SCREEN', function () {
    skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.ERROR_SCREEN,
      responsiveId: "md"
    });
  });

  it('tests DEFAULT SCREEN', function () {
    skin.switchComponent({
      responsiveId: "md"
    });
  });

  it('tests w/o args', function () {
    skin.switchComponent();
  });
});

describe('Skin', function () {
  test('tests IE10', function () {
    // set user agent to IE 10
    window.navigator.userAgent = "MSIE 10";

    // render skin into DOM
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
  });

  test('tests IE10 START SCREEN', function () {
    //set user agent to IE 10
    window.navigator.userAgent = "MSIE 10";

    // render skin into DOM
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
    
    
    skinComponent.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      responsiveId: "md"
    });
  });
});
