jest.dontMock('../js/skin');
jest.dontMock('../js/constants/constants');
jest.dontMock('../js/components/utils');
jest.dontMock('../js/components/higher-order/accessibleMenu');
jest.dontMock('../js/mixins/responsiveManagerMixin');
jest.dontMock('screenfull');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Skin = require('../js/skin');
var CONSTANTS = require('../js/constants/constants');
var sinon = require('sinon');

describe('Skin', function() {
  it('tests methods', function() {
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
    skinComponent.handleClickOutsidePlayer();
    skinComponent.updatePlayhead(4,6,8);
    skinComponent.componentWillUnmount();
  });
});

describe('Skin screenToShow state', function() {
  beforeEach(function() {
    // Render skin into DOM
    this.skin = TestUtils.renderIntoDocument(<Skin />);
  });

  it('tests LOADING SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.LOADING_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests START SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests PLAYING SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PLAYING_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests SHARE SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.SHARE_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests PAUSE SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.PAUSE_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests END SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.END_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests AD SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.AD_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests DISCOVERY SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.DISCOVERY_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests MORE OPTIONS SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.MORE_OPTIONS_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests CLOSED CAPTION SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN,
      responsiveId: 'md',
      closedCaptionOptions: {
        autoFocus: false
      }
    });
  });

  it('tests VIDEO QUALITY SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN,
      responsiveId: 'md',
      videoQualityOptions: {
        autoFocus: false
      }
    });
  });

  it('tests ERROR SCREEN', function() {
    this.skin.switchComponent({
      screenToShow: CONSTANTS.SCREEN.ERROR_SCREEN,
      responsiveId: 'md'
    });
  });

  it('tests DEFAULT SCREEN', function() {
    this.skin.switchComponent({
      responsiveId: 'md'
    });

  });

  it('tests w/o args', function() {
    this.skin.switchComponent();
  });

  describe('Vr methods tests', function() {
    it('getDirectionParams should returns correct values', function() {
      this.skin.state.xVrMouseStart = 0;
      this.skin.state.yVrMouseStart = 0;
      this.skin.state.componentWidth = 300;
      this.skin.state.componentHeight = 180;
      var res = this.skin.getDirectionParams(20, 90);
      /*
      * An explanation:
      *
      * pageX = 20;
      * pageY = 90;
      * dx = 20 - 0 = 20;
      * dy = 90 - 0 = 90;
      * maxDegreesX = 90;
      * maxDegreesY = 120;
      * degreesForPixelYaw = 90 / 300 = 0.3;
      * degreesForPixelPitch = 120 / 180 = 0.666666667;
      * yaw = 0 + 20 * 0.3 = 6;
      * pitch = 0 + 90 * 0.666666667 = 60;
      */
      expect(res).toEqual([ 6, 0, 60 ]);
      var res2 = this.skin.getDirectionParams('', undefined);
      expect(res2).toEqual([ 0, 0, 0 ]);
    });
    it('handleVrPlayerMouseMove should returns correct values', function() {
      var mockController = {
        onTouchMove: function() {}
      };

      var event = {
        preventDefault: function() {},
        pageX: 20,
        pageY: 90
      };

      OO = {};

      var skinComponent = TestUtils.renderIntoDocument(<Skin controller={mockController} />);

      skinComponent.state.componentWidth = 300;
      skinComponent.state.componentHeight = 180;

      var preventDefaultSpy = sinon.spy(event, 'preventDefault');
      var onTouchMoveSpy = sinon.spy(skinComponent.props.controller, 'onTouchMove');

      skinComponent.state.isVrMouseDown = true;
      skinComponent.props.controller.videoVr = true;
      skinComponent.handleVrPlayerMouseMove(event);

      expect(preventDefaultSpy.called).toBe(true);
      var params = [6, 0, 60]; //this value was tested in prev test
      expect(onTouchMoveSpy.args[0][0]).toEqual(params);
    });
  });
});

describe('Skin', function() {
  it('tests IE10', function() {
    // set user agent to IE 10
    window.navigator.userAgent = 'MSIE 10';

    // render skin into DOM
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
  });

  it('tests IE10 START SCREEN', function() {
    // set user agent to IE 10
    window.navigator.userAgent = 'MSIE 10';

    // render skin into DOM
    var skinComponent = TestUtils.renderIntoDocument(<Skin />);
    skinComponent.switchComponent({
      screenToShow: CONSTANTS.SCREEN.START_SCREEN,
      responsiveId: 'md'
    });
  });
});
