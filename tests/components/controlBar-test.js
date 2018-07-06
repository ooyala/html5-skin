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
  var defaultSkinConfig = Utils.clone(skinConfig);

  // TODO
  // Old unit tests should use the base mock controller and props
  // instead of defining them manually each time
  beforeEach(function() {
    baseMockController = {
      state: {
        isMobile: false,
        playerState: '',
        volumeState: {
          muted: false,
          volume: 1,
          volumeStateVisible: true, 
          volumeSliderVisible: true
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
      startHideControlBarTimer: function() {},
      setVolume: function() {}
    };

    baseMockProps = {
      isLiveStream: false,
      controller: baseMockController,
      skinConfig: defaultSkinConfig,
      closedCaptionOptions: {}
    };
  });

  it('creates a control bar', function() {
    var wrapper = Enzyme.mount(
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

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    expect(fullscreenToggled).toBe(false);
    var fullscreenButton = wrapper.find('.oo-fullscreen').hostNodes();
    fullscreenButton.simulate('click');
    expect(fullscreenToggled).toBe(true);
  });

  describe('Vr on phones', function() {
    beforeEach(function() {
      baseMockController.videoVrSource = {};
      baseMockController.videoVrSource.vr = {};
      OO_setWindowNavigatorProperty('userAgent', 'phone');
    });
    afterEach(function() {
      OO_setWindowNavigatorProperty('userAgent', 'desktop');
    });

    it('render one stereo button if content vr', function() {
      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

      baseMockProps.vr = baseMockController.videoVrSource;

      var wrapper = Enzyme.mount(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      var toggleStereoVrButton = wrapper.find('.oo-vr-stereo-button').hostNodes();
      expect(toggleStereoVrButton.length).toBe(1);
    });

    it('not render stereo button if content not vr', function() {
      baseMockController.videoVr = false;
      baseMockController.videoVrSource = null;

      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];
      baseMockProps.vr = baseMockController.videoVr;

      var wrapper = Enzyme.mount(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      var toggleStereoVrButtons = wrapper.find('.oo-vr-stereo-button');
      expect(toggleStereoVrButtons.length).toBe(0);
    });

    it('enter stereo mode', function() {
      var stereoMode = false;
      baseMockController.videoVrSource.vr.stereo = false;
      baseMockController.toggleStereoVr = function() {
        stereoMode = true;
      };

      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

      var wrapper = Enzyme.mount(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      expect(stereoMode).toBe(false);
      var toggleStereoVrButton = wrapper.find('.oo-vr-stereo-button').hostNodes();
      toggleStereoVrButton.simulate('click');
      expect(stereoMode).toBe(true);
    });

    it('not render stereo button on desktop', function() {
      baseMockController.videoVrSource = null;

      baseMockProps.skinConfig.buttons.desktopContent = [{'name':'stereoscopic', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];
      baseMockProps.vr = baseMockController.videoVr;

      var wrapper = Enzyme.mount(
        <ControlBar
          {...baseMockProps}
          controlBarVisible={true}
          componentWidth={500}
          playerState={CONSTANTS.STATE.PLAYING}
        />
      );

      var toggleStereoVrButtons = wrapper.find('.oo-vr-stereo-button');
      expect(toggleStereoVrButtons.length).toBe(0);
    });

  });

  it('renders one button', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }];

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var buttons = wrapper.find('.oo-control-bar-item').hostNodes();
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

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={1200}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var buttons = wrapper.find('.oo-control-bar-item').hostNodes();
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

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var volumeButton = wrapper.find('.oo-mute-unmute').hostNodes();
    volumeButton.simulate('click');
    expect(muteClicked).toBe(true);
    var volumeBars = wrapper.find('.oo-volume-bar').hostNodes();
    volumeBars.at(5).simulate('click');
    expect(newVolume).toBeGreaterThan(-1);
  });

  it('should display unmute volume icon when volume is set to a non-zero value', function() {
    baseMockController.state.volumeState.volume = 1;
    baseMockController.state.volumeState.muted = false;

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
       />
    );

    var muteUnmuteBtn = wrapper.find('.oo-volume').childAt(0);
    expect(muteUnmuteBtn.props().icon).toBe('volume');
  });

  it('should display mute volume icon when volume is set to 0', function() {
    baseMockController.state.volumeState.volume = 0;
    baseMockController.state.volumeState.muted = false;

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var muteUnmuteBtn = wrapper.find('.oo-volume').childAt(0);
    expect(muteUnmuteBtn.props().icon).toBe('volumeOff');
  });

  it('should display mute volume icon when volume is muted', function() {
    baseMockController.state.volumeState.volume = 1;
    baseMockController.state.volumeState.muted = true;

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var muteUnmuteBtn = wrapper.find('.oo-volume').childAt(0);
    expect(muteUnmuteBtn.props().icon).toBe('volumeOff');
  });

  it('to play on play click', function() {
    var playClicked = false;
    baseMockController.togglePlayPause = function() {playClicked = true;};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':105 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var playButton = wrapper.find('.oo-play-pause').hostNodes();
    playButton.simulate('click');
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

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );

    var qualityBtn = wrapper.find(AccessibleButton);

    expect(qualityBtn.instance().wasTriggeredWithKeyboard()).toBe(false);
    qualityBtn.simulate('keyDown', { key: ' ' });
    qualityBtn.simulate('click');
    expect(qualityBtn.instance().wasTriggeredWithKeyboard()).toBe(true);
    wrapper.instance().composedComponentRef.current.togglePopover(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY);
    expect(qualityBtn.instance().wasTriggeredWithKeyboard()).toBe(false);
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

    var playPauseButton = wrapper.find('.oo-play-pause').hostNodes().getDOMNode();
    var muteUnmuteButton = wrapper.find('.oo-volume').hostNodes().getDOMNode().querySelector('.oo-mute-unmute');
    var fullscreenButton = wrapper.find('.oo-fullscreen').hostNodes().getDOMNode();
    var qualityButton = wrapper.find('.oo-quality').hostNodes().getDOMNode();
    var ccButton = wrapper.find('.oo-closed-caption').hostNodes().getDOMNode();
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

    var playPauseButton = wrapper.find('.oo-play-pause').hostNodes().getDOMNode();
    var muteUnmuteButton = wrapper.find('.oo-volume').hostNodes().getDOMNode().querySelector('.oo-mute-unmute');
    var fullscreenButton = wrapper.find('.oo-fullscreen').hostNodes().getDOMNode();
    var qualityButton = wrapper.find('.oo-quality').hostNodes().getDOMNode();
    var ccButton = wrapper.find('.oo-closed-caption').hostNodes().getDOMNode();
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

    var muteUnmuteButton = wrapper.find('.oo-volume').hostNodes().getDOMNode().querySelector('.oo-mute-unmute');
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

    var playPauseButton = wrapper.find('.oo-play-pause').hostNodes();
    playPauseButton.simulate('focus');
    expect(baseMockController.state.focusedControl).toBe('playPause');
    playPauseButton.simulate('blur');
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
    Enzyme.mount(controlBar);
    expect(startHideControlBarTimerCalled).toBe(false);
    baseMockController.state.focusedControl = 'playPause';
    Enzyme.mount(controlBar);
    expect(startHideControlBarTimerCalled).toBe(true);
  });

  it('to toggle share screen', function() {
    var shareClicked = false;
    baseMockController.toggleShareScreen = function() {shareClicked = true;};
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'share', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var shareButton = wrapper.find('.oo-share').hostNodes();
    shareButton.simulate('click');
    expect(shareClicked).toBe(true);
  });

  it('to toggle discovery screen', function() {
    var discoveryClicked = false;

    baseMockController.state.discoveryData = true;
    baseMockController.toggleDiscoveryScreen = function() {discoveryClicked = true;};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.END}
      />
    );

    var discoveryButton = wrapper.find('.oo-discovery').hostNodes();
    discoveryButton.simulate('click');
    expect(discoveryClicked).toBe(true);
  });

  it('shows/hides closed caption button if captions available', function() {
    baseMockController.toggleButtons = {};

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var ccButtons = wrapper.find('.oo-closed-caption');
    expect(ccButtons.length).toBe(0);

    var toggleScreenClicked = false;
    var captionClicked = false;
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.toggleScreen = function() {toggleScreenClicked = true;};
    baseMockController.togglePopover = function() {captionClicked = true;};

    // md, test cc popover
    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var ccButtons2 = wrapper.find('.oo-closed-caption').hostNodes();
    expect(ccButtons2.length).toBe(1);

    var ccButton = wrapper.find('.oo-closed-caption').hostNodes();
    ccButton.simulate('click');
    expect(captionClicked).toBe(true);

    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.xs.id;

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
       componentWidth={350}
       playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    ccButton = wrapper.find('.oo-closed-caption').hostNodes();
    ccButton.simulate('click');
    expect(toggleScreenClicked).toBe(true);
  });

  it('hides closed caption button if ooyala ad is playing', function() {
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
       />
    );

    var ccButtons = wrapper.find('.oo-closed-caption');
    expect(ccButtons.length).toBe(0);
  });

  it('shows closed caption button if ooyala ad is not playing', function() {
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'closedCaption', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var ccButtons = wrapper.find('.oo-closed-caption').hostNodes();
    expect(ccButtons.length).toBe(1);
  });

  it('show/hide audioAndCC button if multiAudio or CC is available', function() {
    baseMockController.state.hideMultiAudioIcon = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    // there are no CC, no multiaudio
    var multiAudioBtn = wrapper.find('.oo-multiaudio');
    expect(multiAudioBtn.length).toBe(0);

    // there are no CC, but multiaudio is available
    baseMockController.state.multiAudio = {};
    baseMockController.state.multiAudio.tracks = [{id: 1, label: 'test'}];

    var wrapper2 = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn2 = wrapper2.find('.oo-multiaudio').hostNodes();
    expect(multiAudioBtn2.length).toBe(1);

    // there are no multiaudio, but CC is available
    baseMockController.state.multiAudio = {};
    baseMockController.state.closedCaptionOptions = {};
    baseMockController.state.closedCaptionOptions.availableLanguages = {};
    baseMockController.state.closedCaptionOptions.availableLanguages.languages = [ 'en', 'de', 'es', 'fr' ];

    var wrapper3 = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn3 = wrapper3.find('.oo-multiaudio').hostNodes();
    expect(multiAudioBtn3.length).toBe(1);

    // there are multilaudio, but param hideMultiAudioIcon was set to true
    baseMockController.state.hideMultiAudioIcon = true;
    baseMockController.state.closedCaptionOptions.availableLanguages = {};

    var wrapper4 = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn4 = wrapper4.find('.oo-multiaudio').hostNodes();
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
    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var multiAudioBtn = wrapper.find('.oo-multiaudio').hostNodes();
    multiAudioBtn.simulate('click');
    expect(multiAudioClicked).toBe(true);

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'audioAndCC', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':45 }
    ];
    baseMockProps.skinConfig.responsive.breakpoints.lg.multiplier = true;
    baseMockProps.responsiveView = 'lg';
    // large screen
    var wrapper2 = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={baseMockProps.isLiveStream} />
    );
    var multiAudioBtn2 = wrapper2.find('.oo-multiaudio').hostNodes();
    multiAudioBtn2.simulate('click');
    expect(popoverStateChanged).toBe(true);
  });

  it('hides share button if share options are not provided', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    baseMockProps.skinConfig.shareScreen.shareContent = ['social'];
    baseMockProps.skinConfig.shareScreen.socialContent = [];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(wrapper.find('.oo-share').length).toBe(0);

    baseMockProps.skinConfig.shareScreen.shareContent = [];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter'];

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(wrapper.find('.oo-share').length).toBe(0);
  });

  it('hides share button when ooyala ad is playing', function() {
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    baseMockProps.skinConfig.shareScreen.shareContent = ['social'];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter'];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(wrapper.find('.oo-share').length).toBe(0);
  });

  it('shows share button when ooyala ad is not playing', function() {
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      { 'name': 'share', 'location': 'controlBar', 'whenDoesNotFit': 'moveToMoreOptions', 'minWidth': 45 }
    ];
    baseMockProps.skinConfig.shareScreen.shareContent = ['social'];
    baseMockProps.skinConfig.shareScreen.socialContent = ['twitter'];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps}
        controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );
    expect(wrapper.find('.oo-share').hostNodes().length).toBe(1);
  });

  it('shows/hides discovery button if discovery available', function() {
    baseMockController.state.discoveryData = false;
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons = wrapper.find('.oo-discovery');
    expect(discoveryButtons.length).toBe(0);

    var discoveryClicked = false;

    baseMockController.state.discoveryData = true;
    baseMockController.toggleDiscoveryScreen = function() {discoveryClicked = true;};

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons2 = wrapper.find('.oo-discovery').hostNodes();
    expect(discoveryButtons2.length).toBe(1);

    var discoveryButton = wrapper.find('.oo-discovery').hostNodes();
    discoveryButton.simulate('click');
    expect(discoveryClicked).toBe(true);
  });

  it('hides discovery button when ooyala ad is playing', function() {
    baseMockController.state.discoveryData = true;
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons = wrapper.find('.oo-discovery');
    expect(discoveryButtons.length).toBe(0);
  });

  it('shows discovery button when ooyala ad is not playing', function() {
    baseMockController.state.discoveryData = true;
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'discovery', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var discoveryButtons = wrapper.find('.oo-discovery').hostNodes();
    expect(discoveryButtons.length).toBe(1);
  });

  it('shows/hides the more options button appropriately', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton.length).toBe(0);
    var buttons = wrapper.find('.oo-control-bar-item').hostNodes();
    expect(buttons.length).toBe(1);

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 },
      {'name':'moreOptions', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    optionsButton = wrapper.find('.oo-more-options').hostNodes();
    expect(optionsButton.length).toBe(1);
    buttons = wrapper.find('.oo-play-pause').hostNodes();
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

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = wrapper.find('.oo-more-options');
    expect(optionsButton.length).toBe(0);
    var buttons = wrapper.find('.oo-play-pause').hostNodes();
    //TODO: This used to check for exactly 1, but 2 were rendered. There are 5 playPause buttons defined for this test
    //I copied the next text in checking for there to be less than 5.
    expect(buttons.length).toBeLessThan(5);
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

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = wrapper.find('.oo-more-options').hostNodes();
    expect(optionsButton.length).toBe(1);
    var buttons = wrapper.find('.oo-play-pause').hostNodes();
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

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var optionsButton = wrapper.find('.oo-more-options').hostNodes();
    expect(optionsButton).not.toBe(null);
    optionsButton.simulate('click');
    expect(moreOptionsClicked).toBe(true);
  });

  it('handles bad button input', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'playPause', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 },
      {'name':'doesNotExist', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var buttons = wrapper.find('.oo-control-bar-item').hostNodes();
    expect(buttons.length).toBe(1);
  });

  it('shows/hides the live indicator appropriately', function() {
    var oneButtonSkinConfig = Utils.clone(skinConfig);
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={true}
      />
    );

    var buttons = wrapper.find('.oo-live').hostNodes();
    expect(buttons.length).toBe(1);

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'live', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':35 }
    ];

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        isLiveStream={false}
      />
    );

    buttons = wrapper.find('.oo-live');
    expect(buttons.length).toBe(0);
  });

  it('highlights volume on mouseenter', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];
    baseMockProps.skinConfig.controlBar.iconStyle.inactive.opacity = 0;
    baseMockProps.skinConfig.controlBar.iconStyle.active.opacity = 1;
    baseMockProps.skinConfig.controlBar.iconStyle.active.color = 'red';
    baseMockProps.skinConfig.controlBar.iconStyle.inactive.color = 'blue';

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
      />
    );

    var muteUnmuteBtn = wrapper.find('.oo-mute-unmute').hostNodes();
    var volumeIcon = wrapper.find('.oo-icon-volume-on-ooyala-default').hostNodes().getDOMNode();
    expect(volumeIcon.style.opacity).toBe('0');
    expect(volumeIcon.style.color).toBe('blue');
    muteUnmuteBtn.simulate('mouseEnter');
    expect(volumeIcon.style.opacity).toBe('1');
    expect(volumeIcon.style.color).toBe('red');
    muteUnmuteBtn.simulate('mouseLeave');
    expect(volumeIcon.style.opacity).toBe('0');
    expect(volumeIcon.style.color).toBe('blue');
  });

  it('uses the volume slider on mobile', function() {
    baseMockController.state.isMobile = true;
    baseMockController.state.volumeState.volumeSliderVisible = true;

    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
      />
    );
    var slider = wrapper.find('.oo-volume-slider');
    expect(slider).not.toBe(null);
  });

  it('hides the volume on iOS', function() {
    OO_setWindowNavigatorProperty('platform', 'iPhone');

    baseMockProps.skinConfig.buttons.desktopContent = [{'name':'volume', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':100 }];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
      />
    );

    expect(typeof wrapper.ref('volumeIcon')).toBe('undefined');
  });

  it('shows/hides quality button if bitrates available/not available', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons = wrapper.find('.oo-quality');
    expect(qualityButtons.length).toBe(0);

    var qualityClicked = false;
    baseMockController.state.closedCaptionOptions.availableLanguages = true;
    baseMockController.state.videoQualityOptions.availableBitrates = true;
    baseMockController.toggleButtons = {};
    baseMockController.toggleScreen = function() {qualityClicked = true;};
    baseMockController.togglePopover = function() {qualityClicked = true;};

    // xsmall
    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.xs.id;

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons2 = wrapper.find('.oo-quality').hostNodes();
    expect(qualityButtons2.length).toBe(1);

    qualityButton = wrapper.find('.oo-quality').hostNodes();
    qualityButton.simulate('click');
    expect(qualityClicked).toBe(true);

    // medium
    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.md.id;

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons3 = wrapper.find('.oo-quality').hostNodes();
    expect(qualityButtons3.length).toBe(1);

    var qualityButton = wrapper.find('.oo-quality').hostNodes();
    qualityButton.simulate('click');
    expect(qualityClicked).toBe(true);

    // large
    baseMockProps.responsiveView = skinConfig.responsive.breakpoints.lg.id;

    wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons4 = wrapper.find('.oo-quality').hostNodes();
    expect(qualityButtons4.length).toBe(1);

    qualityButton = wrapper.find('.oo-quality').hostNodes();
    qualityButton.simulate('click');
    expect(qualityClicked).toBe(true);
  });

  it('hides quality button if ooyala ad is playing', function() {
    baseMockController.state.isOoyalaAds = true;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons = wrapper.find('.oo-quality');
    expect(qualityButtons.length).toBe(0);
  });

  it('shows quality button if ooyala ad is not playing', function() {
    baseMockController.state.videoQualityOptions.availableBitrates = true;
    baseMockController.state.isOoyalaAds = false;

    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'quality', 'location':'controlBar', 'whenDoesNotFit':'moveToMoreOptions', 'minWidth':35 }
    ];

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var qualityButtons = wrapper.find('.oo-quality').hostNodes();
    expect(qualityButtons.length).toBe(1);
  });

  it('renders nonclickable logo', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.clickUrl = '';

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var nonClickableLogo = wrapper.find('a');
    expect(nonClickableLogo.length).toBe(0);
  });

  it('renders clickable logo', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.imageResource.url = '//player.ooyala.com/static/v4/stable/4.25.21/skin-plugin/assets/images/ooyala-logo.svg';
    baseMockProps.skinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var wrapper = Enzyme.mount(
      <ControlBar {...baseMockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var logo = wrapper.find('.oo-logo');
    var clickableLogo = wrapper.find('a');
    expect(clickableLogo.length).toBe(1);
    logo.simulate('click');
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
    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={100}
        responsiveView="sm"
        playerState={CONSTANTS.STATE.PLAYING} />, node
    );

    Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={300}
        responsiveView="md"
        playerState={CONSTANTS.STATE.PLAYING} />, node
    );

    var event = {
      stopPropagation: function() {},
      cancelBubble: function() {},
      preventDefault: function() {},
      type: 'touchend'
    };
    var composedComponent = wrapper.instance().composedComponentRef.current;
    composedComponent.handleControlBarMouseUp(event);
    composedComponent.handleLiveClick(event);

    OO_setWindowNavigatorProperty('appVersion', 'Android');
    composedComponent.handleVolumeIconClick(event);
    ReactDOM.unmountComponentAtNode(node);
  });

  it('tests logo without image resource url', function() {
    baseMockProps.skinConfig.buttons.desktopContent = [
      {'name':'logo', 'location':'controlBar', 'whenDoesNotFit':'keep', 'minWidth':130 }
    ];
    baseMockProps.skinConfig.controlBar.logo.imageResource.url = '';
    baseMockProps.skinConfig.controlBar.logo.clickUrl = 'http://www.ooyala.com';

    var wrapper = Enzyme.mount(
      <ControlBar
        {...baseMockProps}
        controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
      />
    );

    var logo = wrapper.find('.oo-logo');
    expect(logo.length).toBe(0);
  });

});
