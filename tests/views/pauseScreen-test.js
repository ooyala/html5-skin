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

const CastPanel = require('../../js/components/castPanel');

import {PauseScreen} from '../../js/views/pauseScreen';

describe('PauseScreen', function() {
  var mockController, mockContentTree, mockSkinConfig;

  const handleVrPlayerClick = () => {};
  const handleTouchEndOnPlayer = () => {
    mockController.togglePlayPause();
  };
  const handleTouchEndOnWindow = () => {};

  var getPauseScreen = () => {
    return <PauseScreen
      skinConfig={mockSkinConfig}
      controller={mockController}
      contentTree={mockContentTree}
      handleVrPlayerClick={handleVrPlayerClick}
      handleTouchEndOnPlayer={handleTouchEndOnPlayer}
      handleTouchEndOnWindow={handleTouchEndOnWindow}
      closedCaptionOptions={{cueText: 'sample text'}}
      playerState={CONSTANTS.STATE.PAUSE}
      totalTime={"60:00"}
      playheadTime={"00:00"}
      />
  };

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
        playbackSpeedOptions: { currentSpeed: 1 },
        videoQualityOptions: {
          availableBitrates: null
        },
        cast: {
          showButton: false,
          connected: false,
          device: ""
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
      setVolume: function() {},
      togglePlayPause: () => {}
    };
    mockContentTree = {
      promo_image: 'image.png',
      description: 'description',
      title: 'title'
    };
    mockSkinConfig = Utils.clone(skinConfig);
  });

  it('creates an PauseScreen', function() {
    var clicked = false;

    mockController.togglePlayPause = function() {
      clicked = true;
    };

    // Render pause screen into DOM
    var wrapper = Enzyme.mount(getPauseScreen());

    var pauseIcon = wrapper.find('.oo-action-icon-pause');
    pauseIcon.simulate('click');
    expect(clicked).toBe(true);

    clicked = false;
    wrapper.find('.oo-state-screen-selectable').simulate('click');
    expect(clicked).toBe(true);
  });

  it('toggles play pause on touch end instead of click on mobile', function() {
    let clicked = false;

    mockController.state.isMobile = true;
    mockController.togglePlayPause = function() {
      clicked = true;
    };


    // Render pause screen into DOM
    const wrapper = Enzyme.mount(getPauseScreen());

    const stateScreen = wrapper.find('.oo-state-screen-selectable');

    stateScreen.simulate('click');
    expect(clicked).toBe(false);

    stateScreen.simulate('touchEnd');
    expect(clicked).toBe(true);
  });

  it('does show the fade underlay when there is a title', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = true;
    mockContentTree.title = 'Video title';
    var wrapper = Enzyme.mount(getPauseScreen());

    var underlay = wrapper.find('.oo-fading-underlay');
    expect(spy.callCount > 0).toBe(true);
    spy.restore();
  });

  it('does show the fade underlay when there is a description', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showDescription = true;
    mockContentTree.description = 'Video description';
    var wrapper = Enzyme.mount(getPauseScreen());

    var underlay = wrapper.find('.oo-fading-underlay');
    // render gets called more than once due to a descriptino text state change when component is mounted
    expect(spy.callCount).not.toBe(0);
    spy.restore();
  });

  it('does not show the fade underlay when we do not show a title or description', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = false;
    mockSkinConfig.pauseScreen.showDescription = false;
    var wrapper = Enzyme.mount(getPauseScreen());

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
    var wrapper = Enzyme.mount(getPauseScreen());

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
        totalTime={"60:00"}
        playheadTime={"00:00"}
      />
    );
    mockSkinConfig.skipControls.enabled = false;
    wrapper = Enzyme.mount(component);
    expect(wrapper.find(SkipControls).length).toBe(0);
    mockSkinConfig.skipControls.enabled = true;
    wrapper = Enzyme.mount(component);
    expect(wrapper.find(SkipControls).length).toBe(1);
  });

  it('[Chromecast] should not display cast panel', function(){
    mockSkinConfig.skipControls.enabled = false;
    const wrapper = Enzyme.mount(getPauseScreen());
    const castPanel = wrapper.find(CastPanel);
    expect(castPanel.exists()).toBe(false);
  });

  it('[Chromecast] should display cast panel with poster image and blur effect', function(){
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
        totalTime={"60:00"}
        playheadTime={"00:00"}
      />
    );
    mockController.state.cast = {
      connected: true,
      device: "PlayerTV"
    };
    wrapper = Enzyme.mount(component);
    const castPanel = wrapper.find(CastPanel);
    expect(castPanel.exists()).toBe(true);
    expect(castPanel.props().device).toBe("PlayerTV");
    expect(wrapper.find('.oo-state-screen-poster.oo-blur').length).toBe(1);
  });

  it('[Chromecast] should display cast panel with poster image, blur effect and located near to the bottom', function(){
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
        totalTime={"60:00"}
        playheadTime={"00:00"}
      />
    );
    mockController.state.cast = {
      connected: true,
      device: "PlayerTV"
    }
    mockSkinConfig.skipControls.enabled = true;
    const wrapper = Enzyme.mount(component);
    const castPanel = wrapper.find(CastPanel);
    expect(castPanel.exists()).toBe(true);
    expect(castPanel.props().device).toBe("PlayerTV");
    expect(wrapper.find('.oo-info-panel-cast.oo-info-panel-cast-bottom').length).toBe(1);
    expect(wrapper.find('.oo-state-screen-poster.oo-blur').length).toBe(1);
  });

});
