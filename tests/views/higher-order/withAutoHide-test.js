jest
.dontMock('classnames')
.dontMock('../../../js/views/higher-order/withAutoHide');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var skinConfig = require('../../../config/skin.json');
var Utils = require('../../../js/components/utils');
var CONSTANTS = require('../../../js/constants/constants');

var withAutoHide = require('../../../js/views/higher-order/withAutoHide');

describe('withAutoHide', function() {
  var mockController, mockSkinConfig, closedCaptionOptions;

  class TestScreen extends React.Component {
    render() {
      return (
        <div>

        </div>
      )
    }
  }

  const TestScreenWithAutoHide = withAutoHide(TestScreen);

  const renderAutoHideScreen = (fullscreen) => {
    return Enzyme.mount(
      <TestScreenWithAutoHide
        controller={mockController}
        skinConfig={mockSkinConfig}
        fullscreen={fullscreen}
      />
    );;
  };

  beforeEach(function() {
    mockController = {
      state: {
        isLiveStream: false,
        duration: 60,
        isMobile: false,
        accessibilityControlsEnabled: false,
        controlBarVisible: true,
        scrubberBar: {
          isHovering: true
        },
        upNextInfo: {
          showing: false
        },
        volumeState: {
          volume: 1,
          muted: false,
          mutingForAutoplay: false,
          volumeStateVisible: true, 
          volumeSliderVisible: true
        },
        skipControls: {
          hasPreviousVideos: false,
          hasNextVideos: false,
        },
        config: {
          isVrAnimationEnabled: {
            vrNotification: true,
            vrIcon: true
          }
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      cancelTimer: function() {},
      hideVolumeSliderBar: function() {},
      toggleMute: function() {},
      setFocusedControl: function() {},
      startHideControlBarTimer: function() {},
      rewindOrRequestPreviousVideo: function() {},
      requestNextVideo: function() {},
      showControlBar: function() {},
      setVolume: function() {}
    };
    mockSkinConfig = Utils.clone(skinConfig);
    closedCaptionOptions = {
      cueText: 'cue text'
    };
  });

  it('creates a screen with auto hide and checks mouseOut, mouseOver, and mouseMove with fullscreen', function() {
    var over = false;
    var out = false;
    var moved = false;

    mockController.startHideControlBarTimer = function() {
      moved = true;
    };

    mockController.showControlBar = function() {
      over = true;
    };
    mockController.hideControlBar = function() {
      out = true;
    };

    // Render pause screen into DOM
    const wrapper = renderAutoHideScreen(true);

    wrapper.simulate('mouseOut');
    expect(out).toBe(true);

    wrapper.simulate('mouseOver');
    expect(over).toBe(true);

    wrapper.simulate('mouseMove');
    expect(moved).toBe(true);
  });

  it('creates a screen with auto hide and checks mouseOut, mouseOver, and mouseMove without fullscreen', function() {
    var over = false;
    var out = false;
    var moved = false;

    mockController.startHideControlBarTimer = function() {
      moved = true;
    };

    mockController.showControlBar = function() {
      over = true;
    };
    mockController.hideControlBar = function() {
      out = true;
    };

    // Render pause screen into DOM
    const wrapper = renderAutoHideScreen(false);

    wrapper.simulate('mouseOut');
    expect(out).toBe(true);

    wrapper.simulate('mouseOver');
    expect(over).toBe(true);

    wrapper.simulate('mouseMove');
    expect(moved).toBe(false);
  });

  it('should show control bar when pressing the tab key', function() {
    var autoHide = false;
    var controlBar = false;

    mockController.startHideControlBarTimer = function() {
      autoHide = true;
    };
    mockController.showControlBar = function() {
      controlBar = true;
    };

    const wrapper = renderAutoHideScreen(false);

    wrapper.simulate('keyDown', {key: 'Tab', which: 9, keyCode: 9});
    expect(autoHide && controlBar).toBe(true);
  });

  it('should show control bar when pressing the tab, space bar or enter key', function() {
    var autoHide = false;
    var controlBar = false;

    mockController.startHideControlBarTimer = function() {
      autoHide = true;
    };
    mockController.showControlBar = function() {
      controlBar = true;
    };

    const wrapper = renderAutoHideScreen(false);

    wrapper.simulate('keyDown', {key: 'Tab', which: 9, keyCode: 9});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    wrapper.simulate('keyDown', {key: 'Enter', which: 13, keyCode: 13});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    wrapper.simulate('keyDown', {key: ' ', which: 32, keyCode: 32});
    expect(autoHide && controlBar).toBe(true);

    autoHide = false;
    controlBar = false;

    wrapper.simulate('keyDown', {key: 'Dead', which: 16, keyCode: 16});
    expect(autoHide && controlBar).toBe(false);
  });

});