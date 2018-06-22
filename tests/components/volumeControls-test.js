jest
.dontMock('../../js/components/volumeControls')
.dontMock('../../js/components/slider')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('../../config/skin.json')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var VolumeControls = require('../../js/components/volumeControls');
var defaultSkinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');
var sinon = require('sinon');

describe('VolumeControls', function() {
  var mockCtrl, skinConfig;

  beforeEach(function() {
    mockCtrl = {
      state: {
        isMobile: false,
        volumeState: {
          volumeSliderVisible: false,
          volume: 1.0,
          muted: false
        }
      },
      setVolume: function(volume) {
        mockCtrl.state.volumeState.volume = volume;
      },
      accessibilityControls: {
        changeVolumeBy: function() {}
      },
      toggleMute: function() {}
    };
    skinConfig = JSON.parse(JSON.stringify(defaultSkinConfig));
  });

  it('should change volume according to value of clicked volume bar', function() {
    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeBars = wrapper.find('.oo-volume-bar');
    volumeBars.at(4).simulate('click', { target: { dataset: { volume: 0.5 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.5);
    volumeBars.at(0).simulate('click', { target: { dataset: { volume: 0.1 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.1);
  });

  it('should set active css class on bars that match the current volume level', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeBars = wrapper.find('.oo-volume-bar');
    for (var i = 0; i < volumeBars.length; i++) {
      var volumeBar = volumeBars.at(i).getDOMNode();
      if (i < 5) {
        expect(volumeBar.className).toEqual('oo-volume-bar oo-on');
      } else {
        expect(volumeBar.className).toEqual('oo-volume-bar');
      }
    }
  });

  it('should set the right ARIA attributes on volume controls', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeControls = wrapper.find('.oo-volume-controls').getDOMNode();
    expect(volumeControls.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.VOLUME_SLIDER);
    expect(volumeControls.getAttribute('aria-valuemin')).toBe('0');
    expect(volumeControls.getAttribute('aria-valuemax')).toBe('100');
    expect(volumeControls.getAttribute('aria-valuenow')).toBe('50');
    expect(volumeControls.getAttribute('aria-valuetext')).toBe('50% volume');
  });

  it('should allow changing the volume with the keyboard', function() {
    var increaseVolumeCalled = 0;
    var decreaseVolumeCalled = 0;
    mockCtrl.accessibilityControls = {
      changeVolumeBy: function(percent, increase) {
        if (increase) {
          increaseVolumeCalled++;
        } else {
          decreaseVolumeCalled++;
        }
      }
    };
    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeControls = wrapper.find('.oo-volume-controls');
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_UP });
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_RIGHT });
    expect(increaseVolumeCalled).toBe(2);
    expect(decreaseVolumeCalled).toBe(0);
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_DOWN });
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_LEFT });
    expect(increaseVolumeCalled).toBe(2);
    expect(decreaseVolumeCalled).toBe(2);
  });

  it('should change volume by 100% when using the HOME or END keys', function() {
    var volumePercent, volumeIncrease;
    mockCtrl.accessibilityControls = {
      changeVolumeBy: function(percent, increase) {
        volumePercent = percent;
        volumeIncrease = increase;
      }
    };
    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeControls = wrapper.find('.oo-volume-controls');
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.HOME });
    expect(volumePercent).toBe(100);
    expect(volumeIncrease).toBe(false);
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.END });
    expect(volumePercent).toBe(100);
    expect(volumeIncrease).toBe(true);
  });

  it('should unmute when volume is changed when muted', function() {
    var spy = sinon.spy(mockCtrl, 'toggleMute');
    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeBars = wrapper.find('.oo-volume-bar');
    volumeBars.at(4).simulate('click', { target: { dataset: { volume: 0.5 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.5);
    expect(spy.callCount).toBe(1);
    expect(spy.calledWith(false)).toBe(true);

    spy.restore();
  });

  it('should not set active css class on any volume bars when muted', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.muted = true;

    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeBars = wrapper.find('.oo-volume-bar');
    for (var i = 0; i < volumeBars.length; i++) {
      var volumeBar = volumeBars.at(i).getDOMNode();
      expect(volumeBar.className).toEqual('oo-volume-bar');
    }
  });

  it('mobile volume slider should have correct value when not muted', function() {
    mockCtrl.state.isMobile = true;
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.volumeSliderVisible = true;

    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );

    var volumeSlider = wrapper.find('.oo-slider').getDOMNode();
    expect(volumeSlider.value).toEqual('0.5');
  });

  it('mobile volume slider should have value of 0 when muted', function() {
    mockCtrl.state.isMobile = true;
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.volumeSliderVisible = true;
    mockCtrl.state.volumeState.muted = true;

    var wrapper = Enzyme.mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );

    var volumeSlider = wrapper.find('.oo-slider').getDOMNode();
    expect(volumeSlider.value).toEqual('0');
  });

});
