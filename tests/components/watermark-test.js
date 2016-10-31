jest.dontMock('../../js/components/watermark');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var Watermark = require('../../js/components/watermark');

describe('Watermark', function () {
  var clicked = false;
  var paused = false;
  var playerState = 'playing';
  var mockProps = {
    skinConfig: {
      general: {
        watermark: {
          imageResource: {
            url: 'http://ooyala.com'
          },
          clickUrl: 'http://ooyala.com',
          position: 'bottomRight',
          target: '_blank',
          transparency: 1,
          scalingOption: 'default',
          scalingPercentage: 20
        }
      }
    },
    playerState: playerState,
    controller: {
      togglePlayPause: function(){
        if (playerState == 'playing') {
          paused = true;
          playerState = 'paused';
        }
        else paused = false;
      },
      state: {
        isMobile: false
      }
    }
  }
  it('tests clickable watermark', function () {
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={true}
        controlBarVisible={true}/>
    );

    //test clickable watermark
    var watermarkClickableLayer = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-watermark-clickable');
  });

  it('tests watermark image', function () {
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={false}
        controlBarVisible={true}/>
    );

    //test clickable watermark
    var watermarkClickableLayer = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-watermark-image');
  });

  it('tests watermark image default width', function () {
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={false}
        controlBarVisible={true}/>
    );

    //test watermark width is default
    var image = DOM.refs['watermark-image'];
    expect(image.style.width).toBe('10%');
    // expect(image.style.width).toBe(mockProps.skinConfig.general.watermark.scalingPercentage +'%');
  });

  it('tests watermark image with set width', function () {
    mockProps.skinConfig.general.watermark.scalingOption = 'width';
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={false}
        controlBarVisible={true}/>
    );

    //test watermark width is default
    var image = DOM.refs['watermark-image'];
    expect(image.style.width).toBe(mockProps.skinConfig.general.watermark.scalingPercentage +'%');
  });

  it('tests watermark image with set height', function () {
    mockProps.skinConfig.general.watermark.scalingOption = 'height';
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={false}
        controlBarVisible={true}/>
    );

    //test watermark width is default
    var image = DOM.refs['watermark-image'];
    expect(image.style.height).toBe(mockProps.skinConfig.general.watermark.scalingPercentage +'%');
  });

  it('tests watermark image with no scaling option', function () {
    mockProps.skinConfig.general.watermark.scalingOption = 'none';
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={false}
        controlBarVisible={true}/>
    );

    //test watermark width is default
    var image = DOM.refs['watermark-image'];
    expect(image.style.width).toBe('');
  });

  it('tests watermark click on desktop', function () {
    var clicked = false;
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={true}
        controlBarVisible={false}/>
    );

    DOM.handleWatermarkClick = function() {clicked = true;};

    //test clickable watermark
    var clickable = DOM.refs['watermark-clickable'];
    TestUtils.Simulate.mouseUp(clickable);
    expect(paused).toBe(true);
    expect(clicked).toBe(true);

    mockProps.playerState = 'paused';
    playerState = 'paused';
    TestUtils.Simulate.mouseUp(clickable);
    expect(paused).toBe(false);
    expect(clicked).toBe(true);

    mockProps.playerState = 'playing';
    playerState = 'playing';
  });

  it('tests watermark click window open', function () {
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={true}
        controlBarVisible={false}/>
    );

    spyOn(window, 'open').andCallFake(function() {
      return true;
    } );

    var clickable = DOM.refs['watermark-clickable'];
    TestUtils.Simulate.mouseUp(clickable);
    expect(window.open).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(mockProps.skinConfig.general.watermark.clickUrl,mockProps.skinConfig.general.watermark.target);
  });

  it('tests watermark click on mobile', function () {
    mockProps.controller.state.isMobile = true;
    var clicked = false;
    //Render watermark into DOM
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={true}
        controlBarVisible={false}/>
    );
    DOM.handleWatermarkClick = function() {clicked = true;};

    //test clickable watermark
    var clickable = DOM.refs['watermark-clickable'];
    TestUtils.Simulate.touchEnd(clickable);
    expect(clicked).toBe(true);
    mockProps.controller.state.isMobile = false;

    mockProps.playerState = 'paused';
    playerState = 'paused';
    TestUtils.Simulate.touchEnd(clickable);
    expect(paused).toBe(false);
    expect(clicked).toBe(true);

    mockProps.playerState = 'playing';
    playerState = 'playing';
  });

  it('tests no watermark shown', function () {
    //Render watermark into DOM
    mockProps.skinConfig.general.watermark.imageResource.url = '';
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={true}
        controlBarVisible={false}/>
    );
    expect(DOM.refs['watermark-clickable']).toBe(undefined);
    mockProps.skinConfig.general.watermark.imageResource.url = 'http://ooyala.com';
  });

  it('tests watermark is not shown', function () {
    //Render watermark into DOM
    var mockProps1 = mockProps;
    mockProps.skinConfig.general.watermark.clickUrl = '';
    DOM = TestUtils.renderIntoDocument(
      <Watermark {...mockProps}
        clickableLayer={true}
        controlBarVisible={false}/>
    );
    expect(DOM.refs['watermark-clickable']).toBe(undefined);
    mockProps.skinConfig.general.watermark.clickUrl = 'http://ooyala.com';
  });
});