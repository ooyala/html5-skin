jest
.dontMock('../../js/views/pauseScreen')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('../../js/components/utils')
.dontMock('classnames');

var React = require('react');
var sinon = require('sinon');
var Enzyme = require('enzyme');
var ClassNames = require('classnames');
var skinConfig = require('../../config/skin.json');
var SkipControls = require('../../js/components/skipControls');
var Utils = require('../../js/components/utils');
var CONSTANTS = require('../../js/constants/constants');

import {PauseScreen} from '../../js/views/pauseScreen';

describe('PauseScreen', function() {
  var mockController, mockContentTree, mockSkinConfig;

  beforeEach(function() {
    mockController = {
      state: {
        controlBarVisible: true,
        isLiveStream: false,
        duration: 60,
        accessibilityControlsEnabled: false,
        scrubberBar: {
          isHovering: true
        },
        upNextInfo: {
          showing: false
        },
        isMobile: false,
        volumeState: {
          muted: false,
          volume: 1,
          volumeStateVisible: true, 
          volumeSliderVisible: true
        },
        skipControls: {
          hasPreviousVideos: false,
          hasNextVideos: false
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      addBlur: function() {},
      removeBlur: function() {},
      cancelTimer: function() {},
      hideVolumeSliderBar: function() {},
      toggleMute: function() {},
      setFocusedControl: function() {},
      startHideControlBarTimer: function() {},
      rewindOrRequestPreviousVideo: function() {},
      requestNextVideo: function() {},
      setVolume: function() {}
    };
    mockContentTree = {
      title: 'title'
    };
    mockSkinConfig = Utils.clone(skinConfig);
  });

  it('creates an PauseScreen', function() {
    var clicked = false;

    mockController.togglePlayPause = function() {
      clicked = true;
    };

    var handleVrPlayerClick = function() {};
    // Render pause screen into DOM
    var wrapper = Enzyme.mount(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
        playerState={CONSTANTS.STATE.PAUSE}
      />
    );

    var pauseIcon = wrapper.find('.oo-action-icon-pause');
    pauseIcon.simulate('click');
    expect(clicked).toBe(true);
  });

  it('does show the fade underlay when there is a title', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = true;
    mockContentTree.title = 'Video title';
    var handleVrPlayerClick = function() {};
    var wrapper = Enzyme.mount(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
        playerState={CONSTANTS.STATE.PAUSE}
      />
    );

    var underlay = wrapper.find('.oo-fading-underlay');
    expect(spy.callCount > 0).toBe(true);
    spy.restore();
  });

  it('does show the fade underlay when there is a description', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showDescription = true;
    mockContentTree.description = 'Video description';
    var handleVrPlayerClick = function() {};
    var wrapper = Enzyme.mount(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
        playerState={CONSTANTS.STATE.PAUSE}
      />
    );

    var underlay = wrapper.find('.oo-fading-underlay');
    // render gets called more than once due to a descriptino text state change when component is mounted
    expect(spy.callCount).not.toBe(0);
    spy.restore();
  });

  it('does not show the fade underlay when we do not show a title or description', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = false;
    mockSkinConfig.pauseScreen.showDescription = false;
    var handleVrPlayerClick = function() {};
    var wrapper = Enzyme.mount(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
        playerState={CONSTANTS.STATE.PAUSE}
      />
    );

    var underlays = wrapper.find('.oo-fading-underlay');
    expect(underlays.length).toBe(0);
    expect(spy.callCount).toBe(0);
    spy.restore();
  });

  it('does not show the fade underlay when there is no description and no title', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = true;
    mockSkinConfig.pauseScreen.showDescription = true;
    delete mockContentTree.title;
    delete mockContentTree.description;
    var handleVrPlayerClick = function() {};
    var wrapper = Enzyme.mount(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
        playerState={CONSTANTS.STATE.PAUSE}
      />
    );

    var underlays = wrapper.find('.oo-fading-underlay');
    expect(underlays.length).toBe(0);
    expect(spy.callCount).toBe(0);
    spy.restore();
  });

  it('should render skip controls when enabled in skin config', function() {
    let wrapper;
    const component = (
      <PauseScreen
        responsiveView="md"
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={() => {}}
        closedCaptionOptions={{ cueText: 'sample text' }}
        currentPlayhead={0}
        playerState={CONSTANTS.STATE.PAUSE}
      />
    );
    mockSkinConfig.skipControls.enabled = false;
    wrapper = Enzyme.mount(component);
    expect(wrapper.find(SkipControls).length).toBe(0);
    mockSkinConfig.skipControls.enabled = true;
    wrapper = Enzyme.mount(component);
    expect(wrapper.find(SkipControls).length).toBe(1);
  });

});
