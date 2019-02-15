jest.dontMock('../../js/views/contentScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

const React = require('react');
const Enzyme = require('enzyme');
const AudioOnlyScreen = require('../../js/views/audioOnlyScreen');
const skinConfig = require('../../config/skin.json');
const ControlBar = require('../../js/components/controlBar');
const ScrubberBar = require('../../js/components/scrubberBar');
const CONSTANTS = require('../../js/constants/constants');
const Utils = require('../../js/components/utils');

describe('Audio Only Screen', () => {
  let mockController, mockSkinConfig, mockContentTree;

  const renderAudioOnlyScreen = () => {
    const wrapper = Enzyme.mount(
      <AudioOnlyScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        contentTree={mockContentTree}
        closedCaptionOptions={{ enabled: true }}
        handleVrPlayerMouseUp={() => {}}
        currentPlayhead={0}
        playerState={CONSTANTS.STATE.PLAYING}
        totalTime={"60:00"}
        playheadTime={"00:00"}
      />
    );
    return wrapper;
  };

  const renderAudioOnlyLiveScreen = (currentPlayhead, playheadTime) => {
    const wrapper = Enzyme.mount(
      <AudioOnlyScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        contentTree={mockContentTree}
        closedCaptionOptions={{ enabled: true }}
        handleVrPlayerMouseUp={() => {}}
        currentPlayhead={currentPlayhead}
        duration={30}
        playerState={CONSTANTS.STATE.PLAYING}
        totalTime={"30:00"}
        isLiveStream={true}
        playheadTime={playheadTime}
      />
    );
    return wrapper;
  };

  beforeEach(() => {
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
        playbackSpeedOptions: { currentSpeed: 1 },
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
      setVolume: function() {},
      togglePlayPause: () => {},
      togglePopover: () => {},
      toggleScreen: () => {},
    };
    mockSkinConfig = Utils.clone(skinConfig);
    mockContentTree = {
      title: 'title'
    };
  });

  it('renders an Audio Only Screen', () => {
    renderAudioOnlyScreen();
  });

  it('renders a title', () => {
    var wrapper = renderAudioOnlyScreen();
    var titleWrapper = wrapper.find('.oo-state-screen-audio-info').hostNodes().getDOMNode();
    expect(titleWrapper.innerHTML).toBe('title');
  });

  it('renders a title and description', () => {
    mockContentTree.description = 'description';
    var wrapper = renderAudioOnlyScreen();
    var titleWrapper = wrapper.find('.oo-state-screen-audio-info').hostNodes().getDOMNode();
    expect(titleWrapper.innerHTML).toBe('title');

    var textWrapper = wrapper.find('.oo-text-truncate').hostNodes().getDOMNode();
    expect(textWrapper.innerHTML.includes(':&nbsp;description')).toBe(true);
  });

  it('renders an audio only control bar', () => {
    var wrapper = renderAudioOnlyScreen();
    var controlBar = wrapper.find(ControlBar);
    expect(controlBar.length).toBe(1);

    var props = controlBar.props();
    expect(props.audioOnly).toBe(true);
    expect(props.hideVolumeControls).toBe(true);
    expect(props.hideScrubberBar).toBe(true);
    expect(props.controlBarVisible).toBe(true);
  });

  it('renders an audio only scrubber bar', () => {
    var wrapper = renderAudioOnlyScreen();
    var scrubberBar = wrapper.find(ScrubberBar);
    expect(scrubberBar.length).toBe(1);
    expect(scrubberBar.props().audioOnly).toBe(true);
  });

  it('renders playhead and total time', () => {
    var wrapper = renderAudioOnlyScreen();
    expect(wrapper.find('.oo-scrubber-bar-current-time').length).toBe(1);
    expect(wrapper.find('.oo-scrubber-bar-right').length).toBe(1);
  });

  it('renders LIVE indicator and does not show a dvr time for live stream when playing from live edge', () => {
    mockController.state.isLiveStream = true;
    var wrapper = renderAudioOnlyLiveScreen(30, "");
    var dvrText = wrapper.find('.oo-scrubber-bar-right').hostNodes().getDOMNode();
    expect(wrapper.find('.oo-live-indicator').length).toBe(1);
    expect(wrapper.find('.oo-live-text').length).toBe(1);
    expect(wrapper.find('.oo-live-circle').length).toBe(1);
    expect(dvrText.innerHTML).toBe("--:--")
  });

  it('renders LIVE indicator and DVR position for live stream when playing from DVR', () => {
    mockController.state.isLiveStream = true;
    var wrapper = renderAudioOnlyLiveScreen(15, "-15:00");
    var dvrText = wrapper.find('.oo-scrubber-bar-right').hostNodes().getDOMNode();
    expect(wrapper.find('.oo-live-indicator').length).toBe(1);
    expect(wrapper.find('.oo-live-text').length).toBe(1);
    expect(wrapper.find('.oo-live-circle').length).toBe(1);
    expect(dvrText.innerHTML).toBe("-15:00")
  });

});
