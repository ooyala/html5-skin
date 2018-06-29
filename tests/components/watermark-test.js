jest.dontMock('../../js/components/watermark')
    .dontMock('../../js/components/utils');

var React = require('react');
var Enzyme = require('enzyme');
var Watermark = require('../../js/components/watermark');

describe('Watermark', function() {
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
      togglePlayPause: function() {
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
  };
  it('renders watermark', function() {
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    // test clickable watermark
    var watermark = wrapper.ref('watermark');
  });

  it('tests watermark position', function() {
    mockProps.skinConfig.general.watermark.position = 'left';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    var watermark = wrapper.ref('watermark');
  });

  it('tests watermark position', function() {
    mockProps.skinConfig.general.watermark.position = 'right';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    var watermark = wrapper.ref('watermark');
  });

  it('tests watermark position', function() {
    mockProps.skinConfig.general.watermark.position = 'bottom';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    var watermark = wrapper.ref('watermark');
  });

  it('tests watermark position', function() {
    mockProps.skinConfig.general.watermark.position = 'top';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    var watermark = wrapper.ref('watermark');
  });

  it('tests watermark image default width', function() {
    mockProps.skinConfig.general.watermark.scalingOption = 'default';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    // test watermark width is default
    var image = wrapper.ref('watermark');
    expect(image.style.width).toBe('10%');
  });

  it('tests watermark image with set width', function() {
    mockProps.skinConfig.general.watermark.scalingOption = 'width';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    // test watermark width
    var image = wrapper.ref('watermark');
    expect(image.style.width).toBe(mockProps.skinConfig.general.watermark.scalingPercentage +'%');
  });

  it('tests watermark image with set height', function() {
    mockProps.skinConfig.general.watermark.scalingOption = 'height';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    // test watermark height
    var image = wrapper.ref('watermark');
    expect(image.style.height).toBe(mockProps.skinConfig.general.watermark.scalingPercentage +'%');
  });

  it('tests watermark image with no scaling option', function() {
    mockProps.skinConfig.general.watermark.scalingOption = 'none';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={true}/>
    );

    // test watermark width is not changed
    var image = wrapper.ref('watermark');
    var check = (image.style.width == 'auto' || image.style.width == '');
    expect(check).toBe(true);
  });

  it('tests watermark click', function() {
    var clicked = false;
    // Render watermark into DOM
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={false}/>
    );

    wrapper.simulate('click');
    expect(paused).toBe(true);

    mockProps.playerState = 'paused';
    playerState = 'paused';
    wrapper.simulate('click');
    expect(paused).toBe(false);

    mockProps.playerState = 'playing';
    playerState = 'playing';
  });

  it('tests watermark not clickable', function() {
    var clicked = false;
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={false}
        nonClickable = {true}/>
    );

    wrapper.instance().handleWatermarkClick = function() {clicked = true;};
    wrapper.simulate('click');
    expect(clicked).toBe(false);

    mockProps.playerState = 'playing';
    playerState = 'playing';
  });

  it('tests no watermark shown', function() {
    mockProps.skinConfig.general.watermark.imageResource.url = '';
    var wrapper = Enzyme.mount(
      <Watermark {...mockProps}
        controlBarVisible={false}/>
    );
    expect(wrapper.ref('watermark')).toBe(undefined);
    mockProps.skinConfig.general.watermark.imageResource.url = 'http://ooyala.com';
  });
});