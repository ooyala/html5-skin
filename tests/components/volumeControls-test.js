jest
.dontMock('../../js/components/volumeControls')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('../../config/skin.json')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var VolumeControls = require('../../js/components/volumeControls');
var defaultSkinConfig = require('../../config/skin.json');
var CONSTANTS = require('../../js/constants/constants');

describe('VolumeControls', function() {
  var mockCtrl, skinConfig;

  beforeEach(function() {
    mockCtrl = {
      state: {
        isMobile: false,
        volumeState: {
          volumeSliderVisible: false,
          volume: 1.0
        }
      },
      setVolume: function(volume) {
        mockCtrl.state.volumeState.volume = volume;
      },
      accessibilityControls: {
        changeVolumeBy: function() {}
      }
    };
    skinConfig = JSON.parse(JSON.stringify(defaultSkinConfig));
  });

  it('should change volume according to value of clicked volume bar', function() {
    var DOM = TestUtils.renderIntoDocument(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeBars = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-volume-bar');
    TestUtils.Simulate.click(volumeBars[4], { target: { dataset: { volume: 0.5 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.5);
    TestUtils.Simulate.click(volumeBars[0], { target: { dataset: { volume: 0.1 } } });
    expect(mockCtrl.state.volumeState.volume).toBe(0.1);
  });

  it('should set active css class on bars that match the current volume level', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    var DOM = TestUtils.renderIntoDocument(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeBars = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-volume-bar');
    for (var i = 0; i < volumeBars.length; i++) {
      var volumeBar = volumeBars[i];
      if (i < 5) {
        expect(volumeBar.className).toEqual('oo-volume-bar oo-on');
      } else {
        expect(volumeBar.className).toEqual('oo-volume-bar');
      }
    }
  });

  it('should set the right ARIA attributes on volume controls', function() {
    mockCtrl.state.volumeState.volume = 0.5;
    var DOM = TestUtils.renderIntoDocument(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeControls = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume-controls');
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
    var DOM = TestUtils.renderIntoDocument(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeControls = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume-controls');
    TestUtils.Simulate.keyDown(volumeControls, { key: CONSTANTS.KEY_VALUES.ARROW_UP });
    TestUtils.Simulate.keyDown(volumeControls, { key: CONSTANTS.KEY_VALUES.ARROW_RIGHT });
    expect(increaseVolumeCalled).toBe(2);
    expect(decreaseVolumeCalled).toBe(0);
    TestUtils.Simulate.keyDown(volumeControls, { key: CONSTANTS.KEY_VALUES.ARROW_DOWN });
    TestUtils.Simulate.keyDown(volumeControls, { key: CONSTANTS.KEY_VALUES.ARROW_LEFT });
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
    var DOM = TestUtils.renderIntoDocument(
      <VolumeControls controller={mockCtrl} skinConfig={skinConfig} />
    );
    var volumeControls = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume-controls');
    TestUtils.Simulate.keyDown(volumeControls, { key: CONSTANTS.KEY_VALUES.HOME });
    expect(volumePercent).toBe(100);
    expect(volumeIncrease).toBe(false);
    TestUtils.Simulate.keyDown(volumeControls, { key: CONSTANTS.KEY_VALUES.END });
    expect(volumePercent).toBe(100);
    expect(volumeIncrease).toBe(true);
  });

});
