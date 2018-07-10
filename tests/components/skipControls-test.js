jest
.dontMock('../../js/components/skipControls')
.dontMock('../../js/components/controlButton')
.dontMock('../../js/components/holdControlButton')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/utils')
.dontMock('../../js/components/higher-order/holdOnClick')
.dontMock('../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('../../js/constants/constants')
.dontMock('../../js/constants/macros')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const SkipControls = require('../../js/components/skipControls');
const ControlButton = require('../../js/components/controlButton');
const CONSTANTS = require('../../js/constants/constants');
const MACROS = require('../../js/constants/macros');

describe('SkipControls', function() {
  let wrapper, component, props;

  const renderComponent = () => {
    wrapper = Enzyme.mount(<SkipControls {...props} />);
    component = wrapper.instance().composedComponentRef.current;
  };

  // Configures the props with the default conditions that are needed for all
  // buttons to be rendered
  const enableAllButtons = () => {
    props.skinConfig.skipControls.enabled = true;
    props.skinConfig.skipControls.buttons.previousVideo.enabled = true;
    props.skinConfig.skipControls.buttons.skipBackward.enabled = true;
    props.skinConfig.skipControls.buttons.skipForward.enabled = true;
    props.skinConfig.skipControls.buttons.nextVideo.enabled = true;
    props.config.hasPreviousVideos = true;
    props.config.hasNextVideos = true;
    props.controller.state.duration = 60;
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      isInactive: false,
      isInBackground: false,
      language: 'en',
      localizableStrings: {},
      responsiveView: '',
      skinConfig: {
        skipControls: {
          enabled: true,
          skipBackwardTime: 10,
          skipForwardTime: 10,
          buttons: {
            previousVideo: {
              enabled: true,
              index: 1
            },
            skipBackward: {
              enabled: true,
              index: 2
            },
            skipForward: {
              enabled: true,
              index: 3
            },
            nextVideo: {
              enabled: true,
              index: 4
            }
          }
        }
      },
      currentPlayhead: 0,
      playerState: CONSTANTS.STATE.PLAYING,
      onFocus: () => {},
      onBlur: () => {},
      config: {
        hasPreviousVideos: false,
        hasNextVideos: false
      },
      controller: {
        state: {
          isMobile: false,
          isLiveStream: false,
          duration: 60,
          scrubberBar: {
            isHovering: false
          }
        },
        rewindOrRequestPreviousVideo: () => {},
        requestNextVideo: () => {},
        setFocusedControl: () => {},
        cancelTimer: () => {},
        startHideControlBarTimer: () => {}
      },
      a11yControls: {
        seekBy: () => {}
      }
    };
  });

  it('should render a SkipControls', function() {
    renderComponent();
    expect(component).toBeTruthy();
    expect(wrapper.find('.oo-skip-controls').length).toBe(1);
  });

  it('should NOT render SkipControls when all buttons are disabled', function() {
    props.skinConfig.skipControls.enabled = true;
    props.skinConfig.skipControls.buttons.previousVideo.enabled = false;
    props.skinConfig.skipControls.buttons.skipBackward.enabled = false;
    props.skinConfig.skipControls.buttons.skipForward.enabled = false;
    props.skinConfig.skipControls.buttons.nextVideo.enabled = false;
    renderComponent();
    expect(wrapper.find('.oo-skip-controls').length).toBe(0);
  });

  it('should call onMount callback with clientRect of DOM element', function() {
    let clientRect;
    props.onMount = (rect) => {
      clientRect = rect;
    };
    renderComponent();
    expect(clientRect).toEqual({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    });
  });

  it('should cancel auto-hide timer on mouse enter', function() {
    const spy = jest.spyOn(props.controller, 'cancelTimer');
    renderComponent();
    expect(spy.mock.calls.length).toBe(0);
    wrapper.simulate('mouseEnter');
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls.length).toBe(1);
    spy.mockRestore();
  });

  it('should correctly determine whether video is at live edge', function() {
    props.controller.state.isLiveStream = true;
    props.controller.state.duration = 100;
    props.currentPlayhead = 100;
    renderComponent();
    expect(component.isAtLiveEdge()).toBe(true);
    props.controller.state.isLiveStream = false;
    props.controller.state.duration = 100;
    props.currentPlayhead = 100;
    renderComponent();
    expect(component.isAtLiveEdge()).toBe(false);
    props.controller.state.isLiveStream = true;
    props.controller.state.duration = 100;
    props.currentPlayhead = 0;
    renderComponent();
    expect(component.isAtLiveEdge()).toBe(false);
  });

  it('should set inactive class when component is inactive', function() {
    props.isInactive = true;
    renderComponent();
    expect(wrapper.find('.oo-skip-controls.oo-inactive').length).toBe(1);
  });

  it('should set pointer events to none on buttons when component is inactive', function() {
    enableAllButtons();
    props.isInactive = true;
    renderComponent();
    wrapper.find(ControlButton).forEach((button) => {
      expect(button.props().style).toMatchObject({ pointerEvents: 'none' });
    });
  });

  it('should set background class when component is in background', function() {
    props.isInBackground = true;
    renderComponent();
    expect(wrapper.find('.oo-skip-controls.oo-in-background').length).toBe(1);
  });

  it('should render all enabled buttons', function() {
    enableAllButtons();
    renderComponent();
    expect(wrapper.find(ControlButton).length).toBe(4);
  });

  it('should NOT render buttons that are disabled in the skin config', function() {
    enableAllButtons();
    props.skinConfig.skipControls.buttons.skipBackward.enabled = false;
    props.skinConfig.skipControls.buttons.nextVideo.enabled = false;
    renderComponent();
    expect(wrapper.find(ControlButton).length).toBe(2);
    expect(wrapper.find('.oo-previous-video').hostNodes().length).toBe(1);
    expect(wrapper.find('.oo-skip-backward').hostNodes().length).toBe(0);
    expect(wrapper.find('.oo-skip-forward').hostNodes().length).toBe(1);
    expect(wrapper.find('.oo-next-video').hostNodes().length).toBe(0);
  });

  it('should NOT render Skip Forward/Back buttons when duration is 0', function() {
    enableAllButtons();
    props.controller.state.duration = 0;
    renderComponent();
    expect(wrapper.find(ControlButton).length).toBe(2);
    expect(wrapper.find('.oo-previous-video').hostNodes().length).toBe(1);
    expect(wrapper.find('.oo-skip-backward').hostNodes().length).toBe(0);
    expect(wrapper.find('.oo-skip-forward').hostNodes().length).toBe(0);
    expect(wrapper.find('.oo-next-video').hostNodes().length).toBe(1);
  });

  it('should NOT render Previous/Next video buttons when video is single', function() {
    enableAllButtons();
    props.config.hasPreviousVideos = false;
    props.config.hasNextVideos = false;
    renderComponent();
    expect(wrapper.find(ControlButton).length).toBe(2);
    expect(wrapper.find('.oo-previous-video').hostNodes().length).toBe(0);
    expect(wrapper.find('.oo-skip-backward').hostNodes().length).toBe(1);
    expect(wrapper.find('.oo-skip-forward').hostNodes().length).toBe(1);
    expect(wrapper.find('.oo-next-video').hostNodes().length).toBe(0);
  });

  it('should disable Previous Video button when there are no previous videos', function() {
    enableAllButtons();
    props.config.hasNextVideos = false;
    renderComponent();
    expect(wrapper.find('.oo-next-video').hostNodes().props().disabled).toBe(true);
  });

  it('should disable Next Video button when there are no next videos', function() {
    enableAllButtons();
    props.config.hasPreviousVideos = false;
    renderComponent();
    expect(wrapper.find('.oo-previous-video').hostNodes().props().disabled).toBe(true);
  });

  it('should disable Skip Forward button when at the live edge', function() {
    enableAllButtons();
    props.controller.state.isLiveStream = true;
    props.controller.state.duration = 100;
    props.currentPlayhead = 100;
    renderComponent();
    expect(wrapper.find('.oo-skip-forward').hostNodes().props().disabled).toBe(true);
  });

  it('should render appropriate Aria labels', function() {
    enableAllButtons();
    props.skinConfig.skipControls.skipBackwardTime = 5;
    props.skinConfig.skipControls.skipForwardTime = 15;
    const skipBackwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_BACKWARD.replace(
      MACROS.SECONDS,
      props.skinConfig.skipControls.skipBackwardTime
    );
    const skipForwardAriaLabel = CONSTANTS.ARIA_LABELS.SKIP_FORWARD.replace(
      MACROS.SECONDS,
      props.skinConfig.skipControls.skipForwardTime
    );
    renderComponent();
    expect(wrapper.find('.oo-previous-video').hostNodes().props()['aria-label']).toBe(CONSTANTS.ARIA_LABELS.PREVIOUS_VIDEO);
    expect(wrapper.find('.oo-skip-backward').hostNodes().props()['aria-label']).toBe(skipBackwardAriaLabel);
    expect(wrapper.find('.oo-skip-forward').hostNodes().props()['aria-label']).toBe(skipForwardAriaLabel);
    expect(wrapper.find('.oo-next-video').hostNodes().props()['aria-label']).toBe(CONSTANTS.ARIA_LABELS.NEXT_VIDEO);
  });

  it('should render Skip button counters using values from skin config', function() {
    enableAllButtons();
    props.skinConfig.skipControls.skipBackwardTime = 20;
    props.skinConfig.skipControls.skipForwardTime = 40;
    renderComponent();
    const backwardCounter = wrapper.find('.oo-skip-backward').find('.oo-btn-counter').getDOMNode().innerHTML;
    const forwardCounter = wrapper.find('.oo-skip-forward').find('.oo-btn-counter').getDOMNode().innerHTML;
    expect(Number(backwardCounter)).toBe(props.skinConfig.skipControls.skipBackwardTime);
    expect(Number(forwardCounter)).toBe(props.skinConfig.skipControls.skipForwardTime);
  });

  it('should render buttons in specified order', function() {
    enableAllButtons();
    props.skinConfig.skipControls.buttons.previousVideo.index = 4;
    props.skinConfig.skipControls.buttons.skipBackward.index = 3;
    props.skinConfig.skipControls.buttons.skipForward.index = 2;
    props.skinConfig.skipControls.buttons.nextVideo.index = 1;
    renderComponent();
    const buttons = wrapper.find(ControlButton).map(button => button.props().className);
    expect(buttons).toEqual([
      "oo-next-video",
      "oo-center-button oo-skip-forward",
      "oo-center-button oo-skip-backward",
      "oo-previous-video"
    ]);
  });

  it('should call rewindOrRequestPreviousVideo() when clicking on Previous Video button', function() {
    const spy = jest.spyOn(props.controller, 'rewindOrRequestPreviousVideo');
    enableAllButtons();
    renderComponent();
    expect(spy.mock.calls.length).toBe(0);
    wrapper.find('.oo-previous-video').hostNodes().simulate('click');
    expect(spy.mock.calls.length).toBe(1);
    spy.mockRestore();
  });

  it('should call requestNextVideo() when clicking on Next Video button', function() {
    const spy = jest.spyOn(props.controller, 'requestNextVideo');
    enableAllButtons();
    renderComponent();
    expect(spy.mock.calls.length).toBe(0);
    wrapper.find('.oo-next-video').hostNodes().simulate('click');
    expect(spy.mock.calls.length).toBe(1);
    spy.mockRestore();
  });

  it('should call seekBy() with appropriate params when clicking on Skip Backward button', function() {
    let parameters;
    enableAllButtons();
    props.skinConfig.skipControls.skipBackwardTime = 20;
    props.a11yControls.seekBy = (...args) => {
      parameters = args;
    };
    renderComponent();
    wrapper.find('.oo-skip-backward').hostNodes().simulate('mouseDown');
    expect(parameters).toEqual([20, false, true]);
  });

  it('should call seekBy() with appropriate params when clicking on Skip Forward button', function() {
    let parameters;
    enableAllButtons();
    props.skinConfig.skipControls.skipForwardTime = 30;
    props.a11yControls.seekBy = (...args) => {
      parameters = args;
    };
    renderComponent();
    wrapper.find('.oo-skip-forward').hostNodes().simulate('mouseDown');
    expect(parameters).toEqual([30, true, true]);
  });

});
