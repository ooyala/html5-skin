jest
.dontMock('../../js/components/volumeControls')
.dontMock('../../js/components/slider')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('../../config/skin.json')
.dontMock('classnames');

import React from 'react';
import {mount} from 'enzyme';
import VolumeControls from '../../js/components/volumeControls';
import defaultSkinConfig from '../../config/skin.json';
import CONSTANTS from '../../js/constants/constants';
import sinon from 'sinon';

describe('VolumeControls', function() {
  let mockCtrl;
  let skinConfig;

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
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeBars = wrapper.find('.oo-volume-bar');
    volumeBars.at(4).simulate('click', { target: { dataset: { volume: 0.5 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.5);
    volumeBars.at(0).simulate('click', { target: { dataset: { volume: 0.1 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.1);
  });

  it(`should set volume aria-valuetext to "${CONSTANTS.ARIA_LABELS.MUTED}" if player is muted`, function() {
    mockCtrl.state.volumeState.muted = true;
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeControls = wrapper.find('.oo-volume-controls').getDOMNode();
    const ariaValueText = volumeControls.getAttribute('aria-valuetext');
    expect(ariaValueText).toBe(CONSTANTS.ARIA_LABELS.MUTED);
    mockCtrl.state.volumeState.muted = false;
  });

  it('should set active css class on bars that match the current volume level', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    wrapper.find('.oo-volume-bar').forEach((bar, i) => {
      const className = bar.getDOMNode().className;
      const expected = i < 5 ? 'oo-volume-bar oo-on' : 'oo-volume-bar';
      expect(className).toEqual(expected);
    });
  });

  it('should set the right ARIA attributes on volume controls', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeControls = wrapper.find('.oo-volume-controls').getDOMNode();
    expect(volumeControls.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.VOLUME_SLIDER);
    expect(volumeControls.getAttribute('aria-valuemin')).toBe('0');
    expect(volumeControls.getAttribute('aria-valuemax')).toBe('100');
    expect(volumeControls.getAttribute('aria-valuenow')).toBe('50');
    expect(volumeControls.getAttribute('aria-valuetext')).toBe('50% volume');
  });

  it('should allow changing the volume with the keyboard', function() {
    let increaseVolumeCalled = 0;
    let decreaseVolumeCalled = 0;
    mockCtrl.accessibilityControls = {
      changeVolumeBy: function(percent, increase) {
        if (increase) {
          increaseVolumeCalled++;
        } else {
          decreaseVolumeCalled++;
        }
      }
    };
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeControls = wrapper.find('.oo-volume-controls');
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
    let volumePercent;
    let volumeIncrease;
    mockCtrl.accessibilityControls = {
      changeVolumeBy: function(percent, increase) {
        volumePercent = percent;
        volumeIncrease = increase;
      }
    };
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeControls = wrapper.find('.oo-volume-controls');
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.HOME });
    expect(volumePercent).toBe(100);
    expect(volumeIncrease).toBe(false);
    volumeControls.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.END });
    expect(volumePercent).toBe(100);
    expect(volumeIncrease).toBe(true);
  });

  it('should unmute when volume is changed when muted', function() {
    const spy = sinon.spy(mockCtrl, 'toggleMute');
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeBars = wrapper.find('.oo-volume-bar');
    volumeBars.at(4).simulate('click', { target: { dataset: { volume: 0.5 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.5);
    expect(spy.callCount).toBe(1);
    expect(spy.calledWith(false)).toBe(true);

    spy.restore();
  });

  it('should not set active css class on any volume bars when muted', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.muted = true;

    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    wrapper.find('.oo-volume-bar').forEach(bar => {
      const className = bar.getDOMNode().className;
      expect(className).toEqual('oo-volume-bar')
    });
  });

  it('mobile volume slider should have correct value when not muted', function() {
    mockCtrl.state.isMobile = true;
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.volumeSliderVisible = true;
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeSlider = wrapper.find('.oo-slider').getDOMNode();
    expect(volumeSlider.value).toEqual('0.5');
  });

  it('mobile volume slider should have value of 0 when muted', function() {
    mockCtrl.state.isMobile = true;
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.volumeSliderVisible = true;
    mockCtrl.state.volumeState.muted = true;
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeSlider = wrapper.find('.oo-slider').getDOMNode();
    expect(volumeSlider.value).toEqual('0');
  });

  it('should render slider with correct volume when audio only', function() {
    mockCtrl.state.audioOnly = true;
    mockCtrl.state.volumeState.volume = 0.5;
    mockCtrl.state.volumeState.volumeSliderVisible = true;
    const wrapper = mount(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    const volumeSlider = wrapper.find('.oo-slider').getDOMNode();
    expect(volumeSlider.value).toEqual('0.5');
  });

});
