jest.dontMock('../../js/views/adScreen')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/components/higher-order/accessibleMenu');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var AdScreen = require('../../js/views/adScreen');
var defaultSkinConfig = require('../../config/skin.json');
var UnmuteIcon = require('../../js/components/unmuteIcon');
var AdPanel = require('../../js/components/adPanel');
const Spinner = require('../../js/components/spinner');

describe('AdScreen', () => {
  let mockController, mockSkinConfig;

  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          muted: false
        }
      },
      onAdsClicked: jest.fn(),
    };
    mockSkinConfig = {
      adScreen: {
        showControlBar: true,
        showAdMarquee: true
      },
      pauseScreen: {
        showPauseIcon: true,
        pauseIconPosition: 'center',
        PauseIconStyle: {
          color: 'white',
          opacity: 1
        }
      },
      icons: {
        pause: {'fontStyleClass': 'oo-icon oo-icon-pause'}
      },
      controlBar: {
        autoHide: true
      }
    };
  });

  it('creates an ad screen', () => {
    // Render ad screen into DOM
    Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

  });

  it('handles mouseover and mouseout', () => {
    // Render ad screen into DOM
    let controlBarVisible = true;
    mockController.hideControlBar = function() {
      controlBarVisible = false;
    };
    mockController.showControlBar = function() {
      controlBarVisible = true;
    };
    const wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

    expect(wrapper.instance().state.controlBarVisible).toBe(true);
    wrapper.simulate('mouseOut');
    expect(wrapper.instance().state.controlBarVisible).toBe(false);
    expect(controlBarVisible).toBe(false);

    wrapper.simulate('mouseOver');
    expect(wrapper.instance().state.controlBarVisible).toBe(true);
    expect(controlBarVisible).toBe(true);
  });

  it('checks that ad marquee is shown/not shown when appropriate', () => {
    // showing ad marquee
    mockController.state.showAdMarquee = true;

    let wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

    const adPanel = wrapper.find('.oo-ad-panel');
    expect(adPanel.at(0).children().length).not.toBe(0);

    // not showing ad marquee
    mockController.state.showAdMarquee = true;
    mockSkinConfig.adScreen.showAdMarquee = false;

    wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

    const adPanel1 = wrapper.find('.oo-ad-panel');
    expect(adPanel1.at(0).children().length).toBe(0);

    // not showing ad marquee
    mockController.state.showAdMarquee = false;
    mockSkinConfig.adScreen.showAdMarquee = true;

    wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

    const adPanel2 = wrapper.find('.oo-ad-panel');
    expect(adPanel2.at(0).children().length).toBe(0);

  });

  it('handles mousemove', function() {

    // Render ad screen into DOM
    let controlBarVisible = true;
    mockController.hideControlBar = () => {
      controlBarVisible = false;
    };
    mockController.showControlBar = () => {
      controlBarVisible = true;
    };
    mockController.startHideControlBarTimer = () => {};
    mockController.state.controlBarVisible = false;
    const wrapper = Enzyme.mount(
      <AdScreen
        playerState={"playing"}
        controller={mockController}
        skinConfig={mockSkinConfig}
        fullscreen={true}
      />);

    expect(wrapper.instance().state.controlBarVisible).toBe(true);
    wrapper.simulate('mouseMove');
    expect(wrapper.instance().state.controlBarVisible).toBe(false);
  });

  it('test player clicks', () => {
    // Render ad screen into DOM
    mockController.state.accessibilityControlsEnabled = false;
    const wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
      />);

    wrapper.simulate('mouseUp');
    expect(mockController.state.accessibilityControlsEnabled).toBe(true);

    wrapper.find('.oo-ad-panel').simulate('click');
    expect(mockController.onAdsClicked).toBeCalled();
  });

  it('tests ad componentWill*', () => {
    mockController.cancelTimer = () => {};
    mockController.startHideControlBarTimer = () => {};
    mockController.state.accessibilityControlsEnabled = false;
    mockController.state.controlBarVisible = false;

    const mockController2 = {
      state: {
        isMobile: true,
        accessibilityControlsEnabled: false,
        controlBarVisible: true,
        volumeState: {
          muted: false
        }
      },
      cancelTimer: function() {},
      startHideControlBarTimer: function() {}
    };

    const node = document.createElement('div');
    const wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        componentWidth={400}
        fullscreen={true} />, node
    );

    Enzyme.mount(
      <AdScreen
        controller={mockController2}
        skinConfig={mockSkinConfig}
        componentWidth={800}
        fullscreen={false} />, node
    );

    const event = {
      stopPropagation: function() {},
      cancelBubble: function() {},
      type: 'touchend'
    };

    wrapper.instance().handleTouchEnd(event);
    wrapper.unmount();
  });

  it('should display unmute icon when handling muted autoplay', function() {
    mockController.state.upNextInfo = {
      showing: false
    };
    mockController.state.volumeState = {
      muted: true,
      mutingForAutoplay: true
    };

    const wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={defaultSkinConfig}
      />);
    const unmuteIcon = wrapper.find(UnmuteIcon);
    expect(unmuteIcon).toBeTruthy();
  });

  describe('Spinner tests', () => {
    const createAdScreen = (buffered, buffering) => {
      mockController.state.buffering = buffering;
      return (
        Enzyme.mount(
          <AdScreen
            controller={ mockController }
            skinConfig={ defaultSkinConfig }
            buffered={ buffered }
          />
        )
      );
    };

    it('Spinner should not be shown when buffering is false and buffered !== 0', function(){
      let wrapper = createAdScreen(2, false);
      expect(wrapper.find(Spinner).length).toBe(0);
    });

    it('Spinner should not be shown when buffering is false and buffered === null', function(){
      let wrapper = createAdScreen(null, false);
      expect(wrapper.find(Spinner).length).toBe(0);
    });

    it('Spinner should be shown when buffered === 0', function(){
      let wrapper = createAdScreen(0, false);
      expect(wrapper.find(Spinner).length).toBe(1);
    });

    it('Spinner should be shown when buffering is true even if buffered !== 0', function(){
      let wrapper = createAdScreen(2, true);
      expect(wrapper.find(Spinner).length).toBe(1);
    });
  });

  it('should not display unmute icon when not muted', () => {
    mockController.state.upNextInfo = {
      showing: false
    };
    mockController.state.volumeState = {
      muted: false,
      mutingForAutoplay: true
    };

    const wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={defaultSkinConfig}
      />);
    const unmuteIcons = wrapper.find(UnmuteIcon);
    expect(unmuteIcons.length).toBe(0);
  });

  it('should hide controlBar after resize', () => {

    mockController.startHideControlBarTimer = jest.fn();

    const wrapper = Enzyme.mount(
      <AdScreen
        controller={mockController}
        skinConfig={mockSkinConfig}
        componentWidth={400}
      />
    );

    wrapper.setProps({ componentWidth: 600 });

    expect(mockController.startHideControlBarTimer).toBeCalledTimes(1);
  });

});
