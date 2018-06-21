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
var TestUtils = require('react-addons-test-utils');
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
  var defaultSkinConfig = Utils.clone(skinConfig);

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
      skinConfig: defaultSkinConfig
    };
  });

  it('creates a control bar', function() {
    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );
  });

  it('enters fullscreen', function() {
    var fullscreenToggled = false;
    baseMockController.state.multiAudioOptions.showPopover = true;
    baseMockController.toggleFullscreen = function() {
      fullscreenToggled = true;
    };
    baseMockController.togglePopover = function() {
      this.state.multiAudioOptions.showPopover = !this.state.multiAudioOptions.showPopover;
    };

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'fullscreen', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    expect(fullscreenToggled).toBe(false);
    var fullscreenButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-fullscreen');
    TestUtils.Simulate.click(fullscreenButton);
    expect(fullscreenToggled).toBe(true);
  });

  describe('Vr on phones', function() {
    beforeEach(function() {
      baseMockController.videoVrSource = {};
      baseMockController.videoVrSource.vr = {};
      window.navigator.userAgent = 'phone';
    });
    afterEach(function() {
      window.navigator.userAgent = 'desktop';
    });

    it('render one stereo button if content vr', function() {
      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

      baseMockProps.vr = baseMockController.videoVrSource;

      var DOM = TestUtils.renderIntoDocument(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      var toggleStereoVrButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-vr-stereo-button');
      expect(toggleStereoVrButton.length).toBe(1);
    });

    it('not render stereo button if content not vr', function() {
      baseMockController.videoVr = false;
      baseMockController.videoVrSource = false;

      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];
      baseMockProps.vr = baseMockController.videoVr;

      var DOM = TestUtils.renderIntoDocument(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      var toggleStereoVrButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-vr-stereo-button');
      expect(toggleStereoVrButtons.length).toBe(0);
    });

    it('enter stereo mode', function() {
      var stereoMode = false;
      baseMockController.videoVrSource.vr.stereo = false;
      baseMockController.toggleStereoVr = function() {
        stereoMode = true;
      };

      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

      var DOM = TestUtils.renderIntoDocument(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      expect(stereoMode).toBe(false);
      var toggleStereoVrButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-vr-stereo-button');
      TestUtils.Simulate.click(toggleStereoVrButton);
      expect(stereoMode).toBe(true);
    });

    it('not render stereo button on desktop', function() {
      baseMockController.videoVrSource = false;

      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];
      baseMockProps.vr = baseMockController.videoVr;

      var DOM = TestUtils.renderIntoDocument(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      var toggleStereoVrButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-vr-stereo-button');
      expect(toggleStereoVrButtons.length).toBe(0);
    });

  });

  it('renders one button', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
    expect(buttons.length).toBe(1);
  });

  it('renders multiple buttons', function() {
    baseMockController.state.discoveryData = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'fullscreen', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];
    // This might no longer be necessary after the skin.json submodule is updated
    baseMockProps.skinConfig.shareScreen.shareContent = ['social', 'embed'];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter', 'facebook', 'google+', 'email'];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={1200}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
    expect(buttons.length).toBe(4);
  });

  it('should mute on click and change volume', function() {
    var muteClicked = false;
    var newVolume = -1;
    baseMockController.handleMuteClick = function() {muteClicked = true;};
    baseMockController.setVolume = function(volume) {newVolume = volume;};
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':105 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var volumeButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-mute-unmute').firstChild;
    TestUtils.Simulate.click(volumeButton);
    expect(muteClicked).toBe(true);
    var volumeBars = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-volume-bar');
    // JEST doesn't support dataset at the time of writing
    TestUtils.Simulate.click(volumeBars[5], {target: {dataset: {volume: 5}}});
    expect(newVolume).toBeGreaterThan(-1);
  });

  it('should display unmute volume icon when volume is set to a non-zero value', function() {
    baseMockController.state.volumeState.volume = 1;
    baseMockController.state.volumeState.muted = false;

    var DOM = renderAndGetComposedComponent(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
       />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    expect(muteUnmuteBtn.props.icon).toBe('volume');
  });

  it('should display mute volume icon when volume is set to 0', function() {
    baseMockController.state.volumeState.volume = 0;
    baseMockController.state.volumeState.muted = false;

    var DOM = renderAndGetComposedComponent(
      <ControlBar
        {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    expect(muteUnmuteBtn.props.icon).toBe('volumeOff');
  });

  it('should display mute volume icon when volume is muted', function() {
    baseMockController.state.volumeState.volume = 1;
    baseMockController.state.volumeState.muted = true;

    var DOM = renderAndGetComposedComponent(
      <ControlBar
        {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    expect(muteUnmuteBtn.props.icon).toBe('volumeOff');
  });

  it('to play on play click', function() {
    var playClicked = false;
    baseMockController.togglePlayPause = function() {playClicked = true;};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':105 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var playButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-play-pause').firstChild;
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

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var playPauseButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-play-pause');
    var muteUnmuteButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume').querySelector('.oo-mute-unmute');
    var fullscreenButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-fullscreen');
    var qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality');
    var ccButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-closed-caption');
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

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var playPauseButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-play-pause');
    var muteUnmuteButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume').querySelector('.oo-mute-unmute');
    var fullscreenButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-fullscreen');
    var qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality');
    var ccButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-closed-caption');
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

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var muteUnmuteButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume').querySelector('.oo-mute-unmute');
    expect(muteUnmuteButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.UNMUTE);
  });

  it('should store playPause button focus state', function() {
    baseMockController.state.focusedControl = null;
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'playPause', 'location': 'controlBar', 'whenDoesNotFit': 'keep', 'minWidth': 45 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var playPauseButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-play-pause');
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
    var DOM = TestUtils.renderIntoDocument(controlBar);
    expect(startHideControlBarTimerCalled).toBe(false);
    baseMockController.state.focusedControl = 'playPause';
    var DOM = TestUtils.renderIntoDocument(controlBar);
    expect(startHideControlBarTimerCalled).toBe(true);
  });

  it('to toggle share screen', function() {
    var shareClicked = false;
    baseMockController.toggleShareScreen = function() {shareClicked = true;};
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var shareButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-share').firstChild;
    TestUtils.Simulate.click(shareButton);
    expect(shareClicked).toBe(true);
  });

  it('to toggle discovery screen', function() {
    var discoveryClicked = false;

    baseMockController.state.discoveryData = true;
    baseMockController.toggleDiscoveryScreen = function() {discoveryClicked = true;};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.END}
      />
    );

    var discoveryButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-discovery').firstChild;
    TestUtils.Simulate.click(discoveryButton);
    expect(discoveryClicked).toBe(true);
  });

  it('shows/hides closed caption button if captions available', function() {
    baseMockController.toggleButtons = {};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-closed-caption');
    expect(ccButtons.length).toBe(0);

    var toggleScreenClicked = false;
    var captionClicked = false;
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.toggleScreen = function() {toggleScreenClicked = true;};
    baseMockController.togglePopover = function() {captionClicked = true;};

    // md, test cc popover
    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var ccButtons2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-closed-caption');
    expect(ccButtons2.length).toBe(1);

    var ccButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-closed-caption').firstChild;
    TestUtils.Simulate.click(ccButton);
    expect(captionClicked).toBe(true);

    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.xs.id;

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
       componentWidth={350}
       playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    ccButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-closed-caption').firstChild;
    TestUtils.Simulate.click(ccButton);
    expect(toggleScreenClicked).toBe(true);
  });

  it('hides closed caption button if ooyala ad is playing', function() {
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
       />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-closed-caption');
    expect(ccButtons.length).toBe(0);
  });

  it('shows closed caption button if ooyala ad is not playing', function() {
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-closed-caption');
    expect(ccButtons.length).toBe(1);
  });

  it('show/hide audioAndCC button if multiAudio or CC is available', function() {
    baseMockController.state.hideMultiAudioIcon = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    // there are no CC, no multiaudio
    var multiAudioBtn = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-multiaudio');
    expect(multiAudioBtn.length).toBe(0);

    // there are no CC, but multiaudio is available
    baseMockController.state.multiAudio = {};
    baseMockController.state.multiAudio.tracks = [{id: 1, label: 'test'}];

    var DOM2 = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM2, 'oo-multiaudio');
    expect(multiAudioBtn2.length).toBe(1);

    // there are no multiaudio, but CC is available
    baseMockController.state.multiAudio = {};
    baseMockController.state.closedCaptionOptions = {};
    baseMockController.state.closedCaptionOptions.availableLanguages = {};
    baseMockController.state.closedCaptionOptions.availableLanguages.languages = [ 'en', 'de', 'es', 'fr' ];

    var DOM3 = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn3 = TestUtils.scryRenderedDOMComponentsWithClass(DOM3, 'oo-multiaudio');
    expect(multiAudioBtn3.length).toBe(1);

    // there are multilaudio, but param hideMultiAudioIcon was set to true
    baseMockController.state.hideMultiAudioIcon = true;
    baseMockController.state.closedCaptionOptions.availableLanguages = {};

    var DOM4 = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn4 = TestUtils.scryRenderedDOMComponentsWithClass(DOM4, 'oo-multiaudio');
    expect(multiAudioBtn4.length).toBe(0);
  });

  it('click on the multiAudioBtn should call the corresponding function', function() {
    var multiAudioClicked = false;
    var popoverStateChanged = false;

    baseMockController.state.closedCaptionOptions.availableLanguages = {};
    baseMockController.state.closedCaptionOptions.availableLanguages.languages = [ 'en', 'de', 'es', 'fr' ];
    baseMockController.state.multiAudio = {};
    baseMockController.state.multiAudio.tracks = [{id: 1, label: 'test'}];
    baseMockController.toggleButtons = {};
    baseMockController.toggleMultiAudioScreen = function() {multiAudioClicked = true;};
    baseMockController.togglePopover = function() {popoverStateChanged = true;};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];

    // small screen
    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var controlBar = TestUtils.findRenderedComponentWithType(DOM, ControlBar);
    var multiAudioBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-multiaudio').firstChild;
    TestUtils.Simulate.click(multiAudioBtn);
    expect(multiAudioClicked).toBe(true);

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];
    baseMockProps.skinConfig.responsive.breakpoints.lg.multiplier = true;
    baseMockProps.responsiveView = 'lg';
    // large screen
    var DOM2 = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
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
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    baseMockProps.skinConfig.shareScreen.shareContent = ['social'];
    baseMockProps.skinConfig.shareScreen.socialContent = [];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-share').length).toBe(0);

    baseMockProps.skinConfig.shareScreen.shareContent = [];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter'];

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-share').length).toBe(0);
  });

  it('hides share button when ooyala ad is playing', function() {
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    baseMockProps.skinConfig.shareScreen.shareContent = ['social'];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter'];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-share').length).toBe(0);
  });

  it('shows share button when ooyala ad is not playing', function() {
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    baseMockProps.skinConfig.shareScreen.shareContent = ['social'];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter'];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-share').length).toBe(1);
  });

  it('shows/hides discovery button if discovery available', function() {
    baseMockController.state.discoveryData = false;
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-discovery');
    expect(discoveryButtons.length).toBe(0);

    var discoveryClicked = false;

    baseMockController.state.discoveryData = true;
    baseMockController.toggleDiscoveryScreen = function() {discoveryClicked = true;};

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-discovery');
    expect(discoveryButtons2.length).toBe(1);

    var discoveryButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-discovery').firstChild;
    TestUtils.Simulate.click(discoveryButton);
    expect(discoveryClicked).toBe(true);
  });

  it('hides discovery button when ooyala ad is playing', function() {
    baseMockController.state.discoveryData = true;
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-discovery');
    expect(discoveryButtons.length).toBe(0);
  });

  it('shows discovery button when ooyala ad is not playing', function() {
    baseMockController.state.discoveryData = true;
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-discovery');
    expect(discoveryButtons.length).toBe(1);
  });

  it('shows/hides the more options button appropriately', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-more-options');
    expect(optionsButton.length).toBe(0);
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
    expect(buttons.length).toBe(1);

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-more-options');
    expect(optionsButton.length).toBe(1);
    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-play-pause');
    expect(buttons.length).toBeLessThan(5);
  });

  it('hides the more options button when ooyala ad is playing', function() {
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-more-options');
    expect(optionsButton.length).toBe(0);
    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-play-pause');
    expect(buttons.length).toBe(1);
  });

  it('shows the more options button when ooyala ad is not playing', function() {
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-more-options');
    expect(optionsButton.length).toBe(1);
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-play-pause');
    expect(buttons.length).toBeLessThan(5);
  });

  it('handles more options click', function() {
    var moreOptionsClicked = false;

    baseMockController.toggleMoreOptionsScreen = function() {
      moreOptionsClicked = true;
    };

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-more-options');
    expect(optionsButton).not.toBe(null);
    TestUtils.Simulate.click(optionsButton);
    expect(moreOptionsClicked).toBe(true);
  });

  it('handles bad button input', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'doesNotExist', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
    expect(buttons.length).toBe(1);
  });

  it('shows/hides the live indicator appropriately', function() {
    var oneButtonSkinConfig = Utils.clone(skinConfig);
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={true}
      />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-live');
    expect(buttons.length).toBe(1);

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={false}
      />
    );

    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-live');
    expect(buttons.length).toBe(0);
  });

  it('highlights volume on mouseenter', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];
    baseMockProps.skinConfig.controlBar.iconStyle.inactive.opacity = 0;
    baseMockProps.skinConfig.controlBar.iconStyle.active.opacity = 1;
    baseMockProps.skinConfig.controlBar.iconStyle.active.color = 'red';
    baseMockProps.skinConfig.controlBar.iconStyle.inactive.color = 'blue';

    var DOM = renderAndGetComposedComponent(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
      />
    );

    var muteUnmuteBtn = getControlBarButtonWithClass(DOM, 'oo-mute-unmute');
    var volumeIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-icon-volume-on-ooyala-default');
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
    baseMockController.state.isMobile = true;
    baseMockController.state.volumeState.volumeSliderVisible = true;

    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
      />
    );
    var slider = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume-slider');
    expect(slider).not.toBe(null);
  });

  it('hides the volume on iOS', function() {
    window.navigator.platform = 'iPhone';

    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
      />
    );

    expect(DOM.refs.volumeIcon).toBe(undefined);
  });

  it('shows/hides quality button if bitrates available/not available', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons.length).toBe(0);

    var qualityClicked = false;
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.state.videoQualityOptions.availableBitrates = true;
    baseMockController.toggleButtons = {};
    baseMockController.toggleScreen = function() {qualityClicked = true;};
    baseMockController.togglePopover = function() {qualityClicked = true;};

    // xsmall
    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.xs.id;

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons2.length).toBe(1);

    qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);

    // medium
    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.md.id;

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons3 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons3.length).toBe(1);

    var qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);

    // large
    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.lg.id;

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons4 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons4.length).toBe(1);

    qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);
  });

  it('hides quality button if ooyala ad is playing', function() {
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons.length).toBe(0);
  });

  it('shows quality button if ooyala ad is not playing', function() {
    baseMockController.state.videoQualityOptions.availableBitrates = true;
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons.length).toBe(1);
  });

  it('renders nonclickable logo', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.clickUrl = '';

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var nonClickableLogo = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');
    expect(nonClickableLogo.length).toBe(0);
  });

  it('renders clickable logo', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.imageResource.url = '//player.ooyala.com/static/v4/candidate/latest/skin-plugin/assets/images/ooyala-logo.svg';
    baseMockProps.skinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var logo = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-logo');
    var clickableLogo = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');
    expect(clickableLogo.length).toBe(1);
    TestUtils.Simulate.click(logo);
  });

  it('tests controlbar componentWill*', function() {
    baseMockController.state.isMobile = true;
    baseMockController.cancelTimer = function() {};
    baseMockController.hideVolumeSliderBar = function() {};
    baseMockController.startHideControlBarTimer = function() {};
    baseMockController.onLiveClick = function() {};
    baseMockController.seek = function() {};
    baseMockController.handleMuteClick = function() {};
    baseMockController.showVolumeSliderBar = function() {};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var node = document.createElement('div');
    var controlBar = renderAndGetComposedComponent(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={100}
        responsiveView="sm" />, node
    );

    ReactDOM.render(
      <ControlBar
        {...baseMockProps}
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
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.imageResource.url = '';
    baseMockProps.skinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var logo = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-logo');
    expect(logo.length).toBe(0);
  });

});
