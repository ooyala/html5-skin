jest
.dontMock('../../js/components/controlBar')
.dontMock('../../js/components/volumeControls')
.dontMock('../../js/components/utils')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/logo')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('../../js/constants/constants')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/controlButton')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var CONSTANTS = require('../../js/constants/constants');
var ControlBar = require('../../js/components/controlBar');
var AccessibleButton = require('../../js/components/accessibleButton');
var ControlButton = require('../../js/components/controlButton');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');
var _ = require('underscore');

// start unit test
describe('ControlBar', function() {

  var baseMockController, baseMockProps;
  var defaultSkinConfig = JSON.parse(JSON.stringify(skinConfig));

  // The ControlBar is wrapped by the preserveKeyboardFocus higher order component.
  // For some tests it is necessary to reference the inner component directly, so
  // that's why we have this helper function which can be used instead of
  // TestUtils.renderIntoDocument()
  var renderAndGetComposedComponent = function(Component) {
    var renderedComponent = TestUtils.renderIntoDocument(Component);
    return renderedComponent.composedComponent;
  };

  // Finds a control bar button component using its class as an id. Will throw
  // an error if zero or more than one components are found.
  var getControlBarButtonWithClass = function(DOM, className) {
    var controlBarButtons = TestUtils.scryRenderedComponentsWithType(DOM, ControlButton);

    var result = controlBarButtons.filter(function(button) {
      return (' ' + button.props.className + ' ').indexOf(' ' + className + ' ') > -1;
    });

    if (result.length === 1) {
      return result[0];
    } else {
      throw new Error('Found ' + result.length + ' matches for class instead of one.');
    }
  };

  // TODO
  // Old unit tests should use the base mock controller and props
  // instead of defining them manually each time
  beforeEach(function() {
    baseMockController = {
      state: {
        isMobile: false,
        volumeState: {
          muted: false,
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      cancelTimer: function() {},
      hideVolumeSliderBar: function() {},
      toggleMute: function() {}
    };

    baseMockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: JSON.parse(JSON.stringify(defaultSkinConfig))
    };
  });

  it('creates a control bar', function() {

    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        videoQualityOptions: {},
        closedCaptionOptions: {},
        multiAudioOptions: {}
      }
    };

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: skinConfig,
      duration: 30
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );
  });

  it('enters fullscreen', function() {
    var fullscreenToggled = false;

    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {
          showPopover: true
        },
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleFullscreen: function() {
        fullscreenToggled = true;
      },
      togglePopover: function() { this.state.multiAudioOptions.showPopover = !this.state.multiAudioOptions.showPopover;}
    };

    var fullscreenSkinConfig = Utils.clone(skinConfig);
    fullscreenSkinConfig.buttons.desktopContent = [
      {'name':'fullscreen', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];
    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: fullscreenSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    expect(fullscreenToggled).toBe(false);
    var fullscreenButton = wrapper.find('.oo-fullscreen');
    TestUtils.Simulate.click(fullscreenButton);
    expect(fullscreenToggled).toBe(true);
  });

  it('render one stereo button if content vr', function() {
    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      videoVrSource: {
        vr: {
          stereo: false,
          contentType: 'single',
          startPosition: 0
        }
      }
    };

    var toggleSkinConfig = Utils.clone(skinConfig);
    toggleSkinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: toggleSkinConfig,
      duration: 30,
      vr: mockController.videoVrSource
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var toggleStereoVrButton = wrapper.find('.oo-vr-stereo-button');
    expect(typeof toggleStereoVrButton).toBe('object');
  });

  it('not render stereo button if content not vr', function() {
    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      videoVr: false,
      videoVrSource: false
    };

    var toggleSkinConfig = Utils.clone(skinConfig);
    toggleSkinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];


    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: toggleSkinConfig,
      duration: 30,
      vr: mockController.videoVr
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var toggleStereoVrButtons = wrapper.find('.oo-vr-stereo-button');
    expect(toggleStereoVrButtons.length).toBe(0);
  });

  it('not render stereo button on desktop', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      videoVr: true,
      videoVrSource: false
    };

    var toggleSkinConfig = Utils.clone(skinConfig);
    toggleSkinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];


    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: toggleSkinConfig,
      duration: 30,
      vr: mockController.videoVr
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var toggleStereoVrButtons = wrapper.find('.oo-vr-stereo-button');
    expect(toggleStereoVrButtons.length).toBe(0);
  });

  it('enter stereo mode', function() {
    var stereoMode = false;

    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      videoVrSource: {
        vr: {
          stereo: false,
          contentType: 'single',
          startPosition: 0
        }
      },
      toggleStereoVr: function() {
        stereoMode = true;
      }
    };

    var toggleSkinConfig = Utils.clone(skinConfig);
    toggleSkinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: toggleSkinConfig,
      duration: 30,
      vr: mockController.videoVrSource
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    expect(stereoMode).toBe(false);
    var toggleStereoVrButton = wrapper.find('.oo-vr-stereo-button');
    TestUtils.Simulate.click(toggleStereoVrButton);
    expect(stereoMode).toBe(true);
  });

  it('renders one button', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var buttons = wrapper.find('.oo-control-bar-item');
    expect(buttons.length).toBe(1);
  });

  it('renders multiple buttons', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'fullscreen', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];
    // This might no longer be necessary after the skin.json submodule is updated
    oneButtonSkinConfig.shareScreen.shareContent = ['social', 'embed'];
    oneButtonSkinConfig.shareScreen.socialContent = ['twitter', 'facebook', 'google+', 'email'];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={1200}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var buttons = wrapper.find('.oo-control-bar-item');
    expect(buttons.length).toBe(4);
  });

  it('should mute on click and change volume', function() {
    var muteClicked = false;
    var newVolume = -1;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      handleMuteClick: function() {muteClicked = true;},
      setVolume: function(volume) {newVolume = volume;},
      toggleMute: function() {}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':105 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var volumeButton = wrapper.find('.oo-mute-unmute').firstChild;
    TestUtils.Simulate.click(volumeButton);
    expect(muteClicked).toBe(true);
    var volumeBars = wrapper.find('.oo-volume-bar');
    // JEST doesn't support dataset at the time of writing
    TestUtils.Simulate.click(volumeBars[5], {target: {dataset: {volume: 5}}});
    expect(newVolume).toBeGreaterThan(-1);
  });

  it('should display unmute volume icon when volume is set to a non-zero value', function() {
    baseMockController.state.volumeState.volume = 1;
    baseMockController.state.volumeState.muted = false;

    var mockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: skinConfig
    };

    var DOM = renderAndGetComposedComponent(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    expect(muteUnmuteBtn.props.icon).toBe('volume');
  });

  it('should display mute volume icon when volume is set to 0', function() {
    baseMockController.state.volumeState.volume = 0;
    baseMockController.state.volumeState.muted = false;

    var mockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: skinConfig
    };

    var DOM = renderAndGetComposedComponent(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    expect(muteUnmuteBtn.props.icon).toBe('volumeOff');
  });

  it('should display mute volume icon when volume is muted', function() {
    baseMockController.state.volumeState.volume = 1;
    baseMockController.state.volumeState.muted = true;

    var mockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: skinConfig
    };

    var DOM = renderAndGetComposedComponent(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    expect(muteUnmuteBtn.props.icon).toBe('volumeOff');
  });

  it('to play on play click', function() {
    var playClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      togglePlayPause: function() {playClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':105 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var playButton = wrapper.find('.oo-play-pause').firstChild;
    TestUtils.Simulate.click(playButton);
    expect(playClicked).toBe(true);
  });

  it('should reset quality menu toggle keyboard flag when closing video quality popover', function() {
    baseMockController.state.videoQualityOptions.availableBitrates = [];
    baseMockController.toggleButtons = {};
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'quality', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 }
    ];
    baseMockController.togglePopover = function() {
      this.state.videoQualityOptions.showPopover = !this.state.videoQualityOptions.showPopover;
    };

    var controlBar = renderAndGetComposedComponent(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var qualityBtn = TestUtils.findRenderedComponentWithType(controlBar, AccessibleButton);
    var qualityBtnElement = qualityBtn.getDOMNode();

    expect(qualityBtn.wasTriggeredWithKeyboard()).toBe(false);
    TestUtils.Simulate.keyDown(qualityBtnElement, { key: ' ' });
    TestUtils.Simulate.click(qualityBtnElement);
    expect(qualityBtn.wasTriggeredWithKeyboard()).toBe(true);
    controlBar.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
    expect(qualityBtn.wasTriggeredWithKeyboard()).toBe(false);
  });

  it('should render default state aria labels', function() {
    baseMockController.state.videoQualityOptions.availableBitrates = [];
    baseMockController.state.closedCaptionOptions.availableLanguages = [];
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'volume', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 240 },
      { 'name': 'quality', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'closedCaption', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'fullscreen', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
    ];

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var playPauseButton = wrapper.find('.oo-play-pause');
    var muteUnmuteButton = wrapper.find('.oo-volume').querySelector('.oo-mute-unmute');
    var fullscreenButton = wrapper.find('.oo-fullscreen');
    var qualityButton = wrapper.find('.oo-quality');
    var ccButton = wrapper.find('.oo-closed-caption');
    expect(playPauseButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.PAUSE);
    expect(muteUnmuteButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.MUTE);
    expect(fullscreenButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.FULLSCREEN);
    expect(qualityButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.VIDEO_QUALITY);
    expect(qualityButton.getAttribute('aria-haspopup')).toBe('true');
    expect(qualityButton.getAttribute('aria-expanded')).toBeNull();
    expect(ccButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CLOSED_CAPTIONS);
    expect(ccButton.getAttribute('aria-haspopup')).toBe('true');
    expect(ccButton.getAttribute('aria-expanded')).toBeNull();
  });

  it('should render alternate state aria labels', function() {
    baseMockController.state.videoQualityOptions.availableBitrates = [];
    baseMockController.state.closedCaptionOptions.availableLanguages = [];
    baseMockController.state.videoQualityOptions.showPopover = true;
    baseMockController.state.closedCaptionOptions.showPopover = true;
    baseMockController.state.multiAudioOptions.showPopover = false;
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'volume', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 240 },
      { 'name': 'quality', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'closedCaption', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'fullscreen', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
    ];

    baseMockController.state.fullscreen = true;
    baseMockController.state.volumeState.muted = true;

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var playPauseButton = wrapper.find('.oo-play-pause');
    var muteUnmuteButton = wrapper.find('.oo-volume').querySelector('.oo-mute-unmute');
    var fullscreenButton = wrapper.find('.oo-fullscreen');
    var qualityButton = wrapper.find('.oo-quality');
    var ccButton = wrapper.find('.oo-closed-caption');
    expect(playPauseButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.PLAY);
    expect(muteUnmuteButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.UNMUTE);
    expect(fullscreenButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.EXIT_FULLSCREEN);
    expect(qualityButton.getAttribute('aria-expanded')).toBe('true');
    expect(ccButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('should render alternate state aria labels for the volume icon when volume is 0', function() {
    baseMockController.state.videoQualityOptions.availableBitrates = [];
    baseMockController.state.videoQualityOptions.showPopover = true;
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'volume', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 240 },
      { 'name': 'quality', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
      { 'name': 'fullscreen', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 },
    ];

    baseMockController.state.volumeState.volume = 0;

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var muteUnmuteButton = wrapper.find('.oo-volume').querySelector('.oo-mute-unmute');
    expect(muteUnmuteButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.UNMUTE);
  });

  it('should store playPause button focus state', function() {
    baseMockController.state.focusedControl = null;
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var playPauseButton = wrapper.find('.oo-play-pause');
    TestUtils.Simulate.focus(playPauseButton);
    expect(baseMockController.state.focusedControl).toBe('playPause');
    TestUtils.Simulate.blur(playPauseButton);
    expect(baseMockController.state.focusedControl).toBe(null);
  });

  it('should start auto hide timer after restoring focused control', function() {
    var startHideControlBarTimerCalled = false;
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 }
    ];
    baseMockController.startHideControlBarTimer = function() {
      startHideControlBarTimerCalled = true;
    };
    var controlBar = (
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );
    baseMockController.state.focusedControl = null;
    var wrapper = Enzyme.mount(controlBar);
    expect(startHideControlBarTimerCalled).toBe(false);
    baseMockController.state.focusedControl = 'playPause';
    var wrapper = Enzyme.mount(controlBar);
    expect(startHideControlBarTimerCalled).toBe(true);
  });

  it('to toggle share screen', function() {
    var shareClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleShareScreen: function() {shareClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var shareButton = wrapper.find('.oo-share').firstChild;
    TestUtils.Simulate.click(shareButton);
    expect(shareClicked).toBe(true);
  });

  it('to toggle discovery screen', function() {
    var discoveryClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true
      },
      toggleDiscoveryScreen: function() {discoveryClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.END}
        isLiveStream={mockProps.isLiveStream} />
    );

    var discoveryButton = wrapper.find('.oo-discovery').firstChild;
    TestUtils.Simulate.click(discoveryButton);
    expect(discoveryClicked).toBe(true);
  });

  it('shows/hides closed caption button if captions available', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleButtons: {}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var ccButtons = wrapper.find('.oo-closed-caption');
    expect(ccButtons.length).toBe(0);

    var toggleScreenClicked = false;
    var captionClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleButtons: {},
      toggleScreen: function() {toggleScreenClicked = true;},
      togglePopover: function() {captionClicked = true;}
    };

    // md, test cc popover
    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var ccButtons2 = wrapper.find('.oo-closed-caption');
    expect(ccButtons2.length).toBe(1);

    var ccButton = wrapper.find('.oo-closed-caption').firstChild;
    TestUtils.Simulate.click(ccButton);
    expect(captionClicked).toBe(true);

    // xs, test full window view
    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.xs.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
       componentWidth={350}
       playerState={CONSTANTS.STATE.PLAYING}
       isLiveStream={mockProps.isLiveStream} />
    );

    ccButton = wrapper.find('.oo-closed-caption').firstChild;
    TestUtils.Simulate.click(ccButton);
    expect(toggleScreenClicked).toBe(true);
  });

  it('hides closed caption button if ooyala ad is playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        isOoyalaAds: true
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var ccButtons = wrapper.find('.oo-closed-caption');
    expect(ccButtons.length).toBe(0);
  });

  it('shows closed caption button if ooyala ad is not playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        isOoyalaAds: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var ccButtons = wrapper.find('.oo-closed-caption');
    expect(ccButtons.length).toBe(1);
  });

  it('show/hide audioAndCC button if multiAudio or CC is available', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        isOoyalaAds: false,
        hideMultiAudioIcon: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar
        {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream}
      />
    );

    // there are no CC, no multiaudio
    var multiAudioBtn = wrapper.find('.oo-multiaudio');
    expect(multiAudioBtn.length).toBe(0);

    // there are no CC, but multiaudio is available
    mockController.state.multiAudio = {};
    mockController.state.multiAudio.tracks = [{id: 1, label: 'test'}];

    var DOM2 = TestUtils.renderIntoDocument(
      <ControlBar
        {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream}
      />
    );

    var multiAudioBtn2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM2, 'oo-multiaudio');
    expect(multiAudioBtn2.length).toBe(1);

    // there are no multiaudio, but CC is available
    mockController.state.multiAudio = {};
    mockController.state.closedCaptionOptions = {};
    mockController.state.closedCaptionOptions.availableLanguages = {};
    mockController.state.closedCaptionOptions.availableLanguages.languages = [ 'en', 'de', 'es', 'fr' ];

    var DOM3 = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var multiAudioBtn3 = TestUtils.scryRenderedDOMComponentsWithClass(DOM3, 'oo-multiaudio');
    expect(multiAudioBtn3.length).toBe(1);

    // there are multilaudio, but param hideMultiAudioIcon was set to true
    mockController.state.hideMultiAudioIcon = true;
    mockController.state.closedCaptionOptions.availableLanguages = {};

    var DOM4 = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={500}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var multiAudioBtn4 = TestUtils.scryRenderedDOMComponentsWithClass(DOM4, 'oo-multiaudio');
    expect(multiAudioBtn4.length).toBe(0);
  });

  it('click on the multiAudioBtn should call the corresponding function', function() {
    var multiAudioClicked = false;
    var popoverStateChanged = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {
          availableLanguages: {
            languages: [ 'en', 'de', 'es', 'fr' ]
          }
        },
        multiAudio: {
          tracks: [{id: 1, label: 'test'}]
        },
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        isOoyalaAds: false,
        hideMultiAudioIcon: false
      },
      toggleButtons: {},
      toggleMultiAudioScreen: function() {multiAudioClicked = true;},
      togglePopover: function() {popoverStateChanged = true;},
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    // small screen
    var wrapper = Enzyme.mount(
      <ControlBar
        {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var controlBar = TestUtils.findRenderedComponentWithType(DOM, ControlBar);
    var multiAudioBtn = wrapper.find('.oo-multiaudio').firstChild;
    TestUtils.Simulate.click(multiAudioBtn);
    expect(multiAudioClicked).toBe(true);

    var twoButtonSkinConfig = Utils.clone(skinConfig);
    twoButtonSkinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];
    twoButtonSkinConfig.responsive.breakpoints.lg.multiplier = true;
    var mockProps2 = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: twoButtonSkinConfig,
      responsiveView: 'lg'
    };
    // large screen
    var DOM2 = TestUtils.renderIntoDocument(
      <ControlBar
        {...mockProps2}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );
    var multiAudioBtn2 = TestUtils.findRenderedDOMComponentWithClass(DOM2, 'oo-multiaudio').firstChild;
    TestUtils.Simulate.click(multiAudioBtn2);
    expect(popoverStateChanged).toBe(true);
  });

  it('hides share button if share options are not provided', function() {
    var customSkinConfig = JSON.parse(JSON.stringify(skinConfig));
    var mockController = {
      state: {
        isMobile: false,
        volumeState: { volume: 1 },
        videoQualityOptions: {},
        closedCaptionOptions: {},
        multiAudioOptions: {}
      }
    };
    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: customSkinConfig
    };

    customSkinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    customSkinConfig.shareScreen.shareContent = ['social'];
    customSkinConfig.shareScreen.socialContent = [];

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );
    expect(wrapper.find('.oo-share').length).toBe(0);

    customSkinConfig.shareScreen.shareContent = [];
    customSkinConfig.shareScreen.socialContent = ['twitter'];

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );
    expect(wrapper.find('.oo-share').length).toBe(0);
  });

  it('hides share button when ooyala ad is playing', function() {
    var customSkinConfig = JSON.parse(JSON.stringify(skinConfig));
    var mockController = {
      state: {
        isMobile: false,
        volumeState: { volume: 1 },
        videoQualityOptions: {},
        closedCaptionOptions: {},
        multiAudioOptions: {},
        isOoyalaAds: true
      }
    };
    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: customSkinConfig
    };

    customSkinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    customSkinConfig.shareScreen.shareContent = ['social'];
    customSkinConfig.shareScreen.socialContent = ['twitter'];

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );
    expect(wrapper.find('.oo-share').length).toBe(0);
  });

  it('shows share button when ooyala ad is not playing', function() {
    var customSkinConfig = JSON.parse(JSON.stringify(skinConfig));
    var mockController = {
      state: {
        isMobile: false,
        volumeState: { volume: 1 },
        videoQualityOptions: {},
        closedCaptionOptions: {},
        multiAudioOptions: {},
        isOoyalaAds: false
      }
    };
    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: customSkinConfig
    };

    customSkinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    customSkinConfig.shareScreen.shareContent = ['social'];
    customSkinConfig.shareScreen.socialContent = ['twitter'];

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );
    expect(wrapper.find('.oo-share').length).toBe(1);
  });

  it('shows/hides discovery button if discovery available', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var discoveryButtons = wrapper.find('.oo-discovery');
    expect(discoveryButtons.length).toBe(0);

    var discoveryClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true
      },
      toggleDiscoveryScreen: function() {discoveryClicked = true;}
    };

    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var discoveryButtons2 = wrapper.find('.oo-discovery');
    expect(discoveryButtons2.length).toBe(1);

    var discoveryButton = wrapper.find('.oo-discovery').firstChild;
    TestUtils.Simulate.click(discoveryButton);
    expect(discoveryClicked).toBe(true);
  });

  it('hides discovery button when ooyala ad is playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true,
        isOoyalaAds: true
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var discoveryButtons = wrapper.find('.oo-discovery');
    expect(discoveryButtons.length).toBe(0);
  });

  it('shows discovery button when ooyala ad is not playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true,
        isOoyalaAds: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var discoveryButtons = wrapper.find('.oo-discovery');
    expect(discoveryButtons.length).toBe(1);
  });

  it('shows/hides the more options button appropriately', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton.length).toBe(0);
    var buttons = wrapper.find('.oo-control-bar-item');
    expect(buttons.length).toBe(1);

    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton.length).toBe(1);
    buttons = wrapper.find('.oo-play-pause');
    expect(buttons.length).toBeLessThan(5);
  });

  it('hides the more options button when ooyala ad is playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        isOoyalaAds: true
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton.length).toBe(0);
    buttons = wrapper.find('.oo-play-pause');
    expect(buttons.length).toBe(1);
  });

  it('shows the more options button when ooyala ad is not playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        isOoyalaAds: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton.length).toBe(1);
    buttons = wrapper.find('.oo-play-pause');
    expect(buttons.length).toBeLessThan(5);
  });

  it('handles more options click', function() {
    var moreOptionsClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleMoreOptionsScreen: function() {
        moreOptionsClicked = true;
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];
    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton).not.toBe(null);
    TestUtils.Simulate.click(optionsButton);
    expect(moreOptionsClicked).toBe(true);
  });

  it('handles bad button input', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'doesNotExist', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var buttons = wrapper.find('.oo-control-bar-item');
    expect(buttons.length).toBe(1);
  });

  it('shows/hides the live indicator appropriately', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: true,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var buttons = wrapper.find('.oo-live');
    expect(buttons.length).toBe(1);

    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    buttons = wrapper.find('.oo-live');
    expect(buttons.length).toBe(0);
  });

  it('highlights volume on mouseenter', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];
    oneButtonSkinConfig.controlBar.iconStyle.inactive.opacity = 0;
    oneButtonSkinConfig.controlBar.iconStyle.active.opacity = 1;
    oneButtonSkinConfig.controlBar.iconStyle.active.color = 'red';
    oneButtonSkinConfig.controlBar.iconStyle.inactive.color = 'blue';

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = renderAndGetComposedComponent(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={mockProps.isLiveStream} />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    var volumeIcon = wrapper.find('.oo-icon-volume-on-ooyala-default');
    expect(volumeIcon.style.opacity).toBe('0');
    expect(volumeIcon.style.color).toBe('blue');
    TestUtils.Simulate.mouseEnter(ReactDOM.findDOMNode(muteUnmuteBtn));
    expect(volumeIcon.style.opacity).toBe('1');
    expect(volumeIcon.style.color).toBe('red');
    TestUtils.Simulate.mouseLeave(ReactDOM.findDOMNode(muteUnmuteBtn));
    expect(volumeIcon.style.opacity).toBe('0');
    expect(volumeIcon.style.color).toBe('blue');
  });

  it('uses the volume slider on mobile', function() {
    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1,
          volumeSliderVisible: true
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={mockProps.isLiveStream} />
    );
    var slider = wrapper.find('.oo-volume-slider');
    expect(slider).not.toBe(null);
  });

  it('hides the volume on iOS', function() {
    window.navigator.platform = 'iPhone';
    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={mockProps.isLiveStream} />
    );

    expect(DOM.refs.volumeIcon).toBe(undefined);

  });

  it('shows/hides quality button if bitrates available/not available', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var qualityButtons = wrapper.find('.oo-quality');
    expect(qualityButtons.length).toBe(0);

    var qualityClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: true
        }
      },
      toggleButtons: {},
      toggleScreen: function() {qualityClicked = true;},
      togglePopover: function() {qualityClicked = true;}
    };

    // xsmall
    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.xs.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var qualityButtons2 = wrapper.find('.oo-quality');
    expect(qualityButtons2.length).toBe(1);

    qualityButton = wrapper.find('.oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);

    // medium
    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.md.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var qualityButtons3 = wrapper.find('.oo-quality');
    expect(qualityButtons3.length).toBe(1);

    var qualityButton = wrapper.find('.oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);

    // large
    mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.lg.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var qualityButtons4 = wrapper.find('.oo-quality');
    expect(qualityButtons4.length).toBe(1);

    qualityButton = wrapper.find('.oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);
  });

  it('hides quality button if ooyala ad is playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: true
        },
        isOoyalaAds: true
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var qualityButtons = wrapper.find('.oo-quality');
    expect(qualityButtons.length).toBe(0);
  });

  it('shows quality button if ooyala ad is not playing', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: true
        },
        isOoyalaAds: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var mockProps = {
      isLiveStream: false,
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var qualityButtons = wrapper.find('.oo-quality');
    expect(qualityButtons.length).toBe(1);
  });

  it('renders nonclickable logo', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    oneButtonSkinConfig.controlBar.logo.clickUrl = '';

    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var nonClickableLogo = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');
    expect(nonClickableLogo.length).toBe(0);
  });

  it('renders clickable logo', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    oneButtonSkinConfig.controlBar.logo.imageResource.url = '//player.ooyala.com/static/v4/candidate/latest/skin-plugin/assets/images/ooyala-logo.svg';
    oneButtonSkinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={mockProps.isLiveStream} />
    );

    var logo = wrapper.find('.oo-logo');
    var clickableLogo = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');
    expect(clickableLogo.length).toBe(1);
    TestUtils.Simulate.click(logo);
  });

  it('tests controlbar componentWill*', function() {
    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      cancelTimer:function() {},
      hideVolumeSliderBar:function() {},
      startHideControlBarTimer:function() {},
      onLiveClick:function() {},
      seek: function() {},
      handleMuteClick: function() {},
      showVolumeSliderBar: function() {}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    oneButtonSkinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';
    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var node = document.createElement('div');
    var controlBar = renderAndGetComposedComponent(
      <ControlBar
        {...mockProps}
        controlBarVisible={true}
        componentWidth={100}
        responsiveView="sm" />, node
    );

    ReactDOM.render(
      <ControlBar
        {...mockProps}
        controlBarVisible={true}
        componentWidth={300}
        responsiveView="md" />, node
    );

    var event = {
      stopPropagation: function() {},
      cancelBubble: function() {},
      preventDefault: function() {},
      type: 'touchend'
    };
    controlBar.handleControlBarMouseUp(event);
    controlBar.handleLiveClick(event);

    window.navigator.appVersion = 'Android';
    controlBar.handleVolumeIconClick(event);
    ReactDOM.unmountComponentAtNode(node);
  });

  it('tests logo without image resource url', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        multiAudioOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    oneButtonSkinConfig.controlBar.logo.imageResource.url = '';
    oneButtonSkinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var wrapper = Enzyme.mount(
      <ControlBar {...mockProps} controlBarVisible={true}
                  componentWidth={100}
                  playerState={CONSTANTS.STATE.PLAYING}
                  isLiveStream={mockProps.isLiveStream} />
    );

    var logo = wrapper.find('.oo-logo');
    expect(logo.length).toBe(0);
  });

});
