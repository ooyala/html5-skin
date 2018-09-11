jest
.dontMock('../../js/views/endScreen')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/utils')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var EndScreen = require('../../js/views/endScreen');
var ClassNames = require('classnames');
var ResizeMixin = require('../../js/mixins/resizeMixin');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');
var CONSTANTS = require('../../js/constants/constants');

describe('EndScreen', function() {
  var mockController, mockSkinConfig, mockContentTree;

  var getEndScreen = () => {
    return <EndScreen
      skinConfig={mockSkinConfig}
      controller = {mockController}
      contentTree = {mockContentTree}
      playerState={CONSTANTS.STATE.END}
      totalTime={"60:00"}
      playheadTime={"00:00"}
    />
  };

  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          muted: false,
          volume: 1,
          volumeStateVisible: true, 
          volumeSliderVisible: true
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        playbackSpeedOptions: { currentSpeed: 1 },
        videoQualityOptions: {
          availableBitrates: null
        },
        scrubberBar: {
          isHovering: false
        }
      },
      cancelTimer: function() {},
      hideVolumeSliderBar: function() {},
      toggleMute: function() {},
      setFocusedControl: function() {},
      startHideControlBarTimer: function() {},
      setVolume: function() {}
    };
    mockSkinConfig = Utils.clone(skinConfig);
    mockContentTree = {'description': 'description', 'title': 'title'};
  });

  it('creates an EndScreen with replay button', function() {

    var clicked = false;
    mockController.togglePlayPause = function() {
      clicked = true;
    };

    // Render end screen into DOM
    var wrapper = Enzyme.mount(getEndScreen());

    var replayButton = wrapper.find('.oo-action-icon');
    replayButton.simulate('click');
    expect(clicked).toBe(true);
  });

  // replay without button, click on screen
  it('creates an EndScreen without replay button', function() {
    var clicked = false;
    mockController.state.accessibilityControlsEnabled = false;
    mockController.togglePlayPause = function() {
      clicked = true;
    };
    mockSkinConfig.endScreen.showReplayButton = false;

    // Render end screen into DOM
    var wrapper = Enzyme.mount(getEndScreen());

    // replay button hidden
    var replayButton = wrapper.find('.oo-action-icon');
    expect(replayButton.getDOMNode().className).toMatch('hidden');

    // test replay clicking on screen
    var replayScreen = wrapper.find('.oo-state-screen-selectable');
    replayScreen.simulate('click');

    expect(clicked).toBe(true);
  });

  it('creates an EndScreen with description and title', function() {
    mockController.state.accessibilityControlsEnabled = false;
    mockController.togglePlayPause = function() {};
    mockSkinConfig.endScreen.showTitle = true;
    mockSkinConfig.endScreen.showDescription = true;

    // Render end screen into DOM
    var wrapper = Enzyme.mount(getEndScreen());

    // description and title are shown
    var title = wrapper.find('.oo-state-screen-title');
    expect(title.getDOMNode().className).not.toMatch('hidden');
  });

  it('creates an EndScreen without description and title', function() {
    mockController.state.accessibilityControlsEnabled = false;
    mockController.togglePlayPause = function() {};
    mockSkinConfig.endScreen.showTitle = false;
    mockSkinConfig.endScreen.showDescription = false;

    // Render end screen into DOM
    var wrapper = Enzyme.mount(getEndScreen());

    // description and title are hidden
    var title = wrapper.find('.oo-state-screen-title');
    expect(title.getDOMNode().className).toMatch('hidden');
  });
});
