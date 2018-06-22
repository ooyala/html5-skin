jest.dontMock('../../js/components/scrubberBar')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/thumbnail')
    .dontMock('../../js/components/thumbnailCarousel')
    .dontMock('../../js/components/thumbnailContainer')
    .dontMock('../../js/constants/constants')
    .dontMock('../../config/skin.json')
    .dontMock('underscore');

var React = require('react');
var Enzyme = require('enzyme');
var CONSTANTS = require('../../js/constants/constants');
var skinConfig = require('../../config/skin.json');
var ReactDOM = require('react-dom');
var ScrubberBar = require('../../js/components/scrubberBar');
var Utils = require('../../js/components/utils');
var _ = require('underscore');

var thumbnails = { 'data':{ 'available_time_slices':[ 0, 10 ], 'available_widths':[ 120 ], 'thumbnails':{ '0':{ '120':{ 'url':'http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_1.jpg', 'width':120, 'height':80 } }, '10':{ '120':{ 'url':'http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_2.jpg', 'width':120, 'height':80 } }, 'errors':[ { 'status':404, 'code':'Not Found', 'title':'unable to find thumbnail images', 'detail':'embed code not found' } ] } }};

// start unit test
describe('ScrubberBar', function() {

  var baseMockController, baseMockProps;
  var defaultSkinConfig = JSON.parse(JSON.stringify(skinConfig));

  // NOTE
  // Most props actually come from the controller but they're passed separately.
  // In order to avoid modifying both baseMockController and baseMockProps you can
  // update the baseMockController object and then just call updateBaseMockProps().
  var updateBaseMockProps = function() {
    _.extend(baseMockProps, {
      currentPlayhead: baseMockController.state.currentPlayhead,
      duration: baseMockController.state.duration,
      controlBarVisible: baseMockController.state.controlBarVisible,
      playerState: baseMockController.state.playerState,
      isLiveStream: baseMockController.state.isLiveStream,
      controller: baseMockController
    });
  };

  // TODO
  // Old unit tests should use the base mock controller and skinConfig
  // instead of defining them manually each time
  beforeEach(function() {
    baseMockController = {
      state: {
        isMobile: false,
        currentPlayhead: 0,
        duration: 120,
        playerState: CONSTANTS.STATE.PLAYING,
        controlBarVisible: true,
        isLiveStream: false
      }
    };
    baseMockProps = {
      skinConfig: JSON.parse(JSON.stringify(defaultSkinConfig))
    };
    updateBaseMockProps();
  });

  it('creates a scrubber bar', function() {

    var mockController = {
      state: {
        isMobile: false
      }
    };

    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig}
        />
    );
  });

  it('creates a scrubber bar played bar and play head with accent color', function() {
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var mockSkinConfig = Utils.clone(skinConfig);
    mockSkinConfig.general.accentColor = 'blue';
    mockSkinConfig.controlBar.scrubberBar.playedColor = '';

    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={mockSkinConfig}
        />
    );
    var playheadBar = wrapper.find('.oo-playhead');
    expect(playheadBar.getDOMNode().style.backgroundColor).toBe('blue');
    expect(wrapper.ref('playhead').style.backgroundColor).toBe('blue');
  });

  it('should render ARIA attributes', function() {
    baseMockController.state.currentPlayhead = 0;
    baseMockController.state.duration = 60;
    updateBaseMockProps();
    var wrapper = Enzyme.mount(<ScrubberBar {...baseMockProps}/>);
    var scrubberBar = wrapper.find('.oo-scrubber-bar').getDOMNode();
    expect(scrubberBar.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.SEEK_SLIDER);
    expect(scrubberBar.getAttribute('aria-valuemin')).toBe('0');
    expect(scrubberBar.getAttribute('aria-valuemax')).toBe(baseMockController.state.duration.toString());
    expect(scrubberBar.getAttribute('aria-valuenow')).toBe(baseMockController.state.currentPlayhead.toFixed(2));
    expect(scrubberBar.getAttribute('aria-valuetext')).toBe('00:00 of 01:00');
    expect(scrubberBar.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe('scrubberBar');
  });

  it('should update the ARIA value in order to reflect the current playhead', function() {
    baseMockController.state.currentPlayhead = 2;
    baseMockController.state.duration = 60;
    updateBaseMockProps();
    var wrapper = Enzyme.mount(<ScrubberBar {...baseMockProps}/>);
    var scrubberBar = wrapper.find('.oo-scrubber-bar').getDOMNode();
    expect(scrubberBar.getAttribute('aria-valuenow')).toBe('2.00');
    expect(scrubberBar.getAttribute('aria-valuetext')).toBe('00:02 of 01:00');

    baseMockController.state.currentPlayhead = 60;
    updateBaseMockProps();
    wrapper = Enzyme.mount(<ScrubberBar {...baseMockProps}/>);
    scrubberBar = wrapper.find('.oo-scrubber-bar').getDOMNode();
    expect(scrubberBar.getAttribute('aria-valuenow')).toBe('60.00');
    expect(scrubberBar.getAttribute('aria-valuetext')).toBe('01:00 of 01:00');
  });

  it('should use different ARIA value text for live videos', function() {
    baseMockController.state.isLiveStream = true;
    baseMockController.state.currentPlayhead = 2;
    baseMockController.state.duration = 0;
    updateBaseMockProps();
    var wrapper = Enzyme.mount(<ScrubberBar {...baseMockProps}/>);
    var scrubberBar = wrapper.find('.oo-scrubber-bar').getDOMNode();
    expect(scrubberBar.getAttribute('aria-valuetext')).toBe('Live video');

    baseMockController.state.currentPlayhead = 60;
    baseMockController.state.duration = 120;
    updateBaseMockProps();
    wrapper = Enzyme.mount(<ScrubberBar {...baseMockProps}/>);
    scrubberBar = wrapper.find('.oo-scrubber-bar').getDOMNode();
    expect(scrubberBar.getAttribute('aria-valuetext')).toBe('01:00 of 02:00 live video');
  });

  it('should call a11y ctrls seek method when arrow keys are pressed', function() {
    var seekForwardCalled = 0;
    var seekBackCalled = 0;
    baseMockController.state.duration = 60;
    baseMockController.accessibilityControls = {
      seekBy: function(seconds, forward) {
        if (forward) {
          seekForwardCalled++;
        } else {
          seekBackCalled++;
        }
      }
    };
    updateBaseMockProps();
    var wrapper = Enzyme.mount(<ScrubberBar {...baseMockProps}/>);
    var scrubberBar = wrapper.find('.oo-scrubber-bar');
    scrubberBar.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_UP });
    scrubberBar.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_RIGHT });
    expect(seekForwardCalled).toBe(2);
    expect(seekBackCalled).toBe(0);
    scrubberBar.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_DOWN });
    scrubberBar.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ARROW_LEFT });
    expect(seekForwardCalled).toBe(2);
    expect(seekBackCalled).toBe(2);
  });

  it('creates a scrubber bar played bar and play head with scrubberbar played color setting', function() {
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var mockSkinConfig = Utils.clone(skinConfig);
    mockSkinConfig.general.accentColor = 'blue';
    mockSkinConfig.controlBar.scrubberBar.playedColor = 'green';
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={mockSkinConfig}
        />
    );
    var playheadBar = wrapper.find('.oo-playhead').getDOMNode();
    expect(playheadBar.style.backgroundColor).toBe('green');
    expect(wrapper.ref('playhead').style.backgroundColor).toBe('green');
  });

  it('handles a mousedown', function() {
    var scrubberBarClicked = false;
    var mockController = {
      state: {
        isMobile: false
      },
      updateSeekingPlayhead: function() {
        scrubberBarClicked = true;
      },
      startHideControlBarTimer: function() {},
      beginSeeking: function() {},
      renderSkin: function() {}
    };
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig}
        />
    );

    var scrubberBar = wrapper.find('.oo-scrubber-bar-padding');
    scrubberBar.simulate('mouseDown');
    expect(scrubberBarClicked).toBe(true);
  });

  it('handles a mouseup', function() {
    var scrubberBarClicked = false;
    var seekTriggered = false;
    var mockController = {
      state: {
        isMobile: false
      },
      updateSeekingPlayhead: function() {
        scrubberBarClicked = true;
      },
      startHideControlBarTimer: function() {},
      beginSeeking: function() {},
      renderSkin: function() {},
      seek: function() {
        seekTriggered = true;
      },
      endSeeking: function() {}
    };
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig}
        />
    );

    var scrubberBar = wrapper.find('.oo-scrubber-bar-padding');
    scrubberBar.simulate('mouseDown');
    wrapper.instance().handlePlayheadMouseUp({
      preventDefault: function() {},
      stopPropagation: function() {}
    });
    expect(scrubberBarClicked).toBe(true);
    expect(seekTriggered).toBe(true);
  });

  it('represents current time with playhead position', function() {
    var mockController = {
      state: {
        isMobile: false
      }
    };
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig}
        />
    );

    wrapper.setState({
      scrubberBarWidth: 470,
      playheadWidth: 10
    });

    var playhead = wrapper.find('.oo-playhead-padding').getDOMNode();
    var leftPos = parseInt(playhead.style.left);
    expect(leftPos).toBeGreaterThan(200);
    expect(leftPos).toBeLessThan(300);
  });

  it('enters ad mode', function() {
    var mockController = {
      state: {
        isMobile: false,
        screenToShow: CONSTANTS.SCREEN.AD_SCREEN
      }
    };
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={false}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig} />
    );

    var playhead = wrapper.find('.oo-playhead').getDOMNode();
    expect(playhead.className).toMatch('oo-ad-playhead');
  });

  it('display thumbnail on hover', function() {
    var mockController = {
      state: {
        isMobile: false,
        thumbnails: thumbnails
      },
      setScrubberBarHoverState: function() {},
    };
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={true}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        skinConfig={skinConfig}/>
    );

    var evt = {nativeEvent: {offsetX: 10}};
    wrapper.simulate('mouseEnter', evt);
    var thumbnailContainer = wrapper.find('.oo-scrubber-thumbnail-wrapper');
    expect(thumbnailContainer.length).toBe(1);
  });

  it('display thumbnailCarousel on scrubber bar mouse down', function() {
    var mockController = {
      state: {
        isMobile: false,
        thumbnails: thumbnails
      },
      updateSeekingPlayhead: function() {},
      startHideControlBarTimer: function() {},
      beginSeeking: function() {},
      renderSkin: function() {}
    };
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={true}
        controller={mockController}
        currentPlayhead={30}
        duration={60}
        padding={0}
        skinConfig={skinConfig}/>
    );

    var evt = {nativeEvent: {offsetX: 10}};
    wrapper.find('.oo-scrubber-bar-padding').simulate('mouseDown', evt);
    var thumbnailCarousel = wrapper.find('.oo-scrubber-thumbnail-wrapper');
    expect(thumbnailCarousel.length).toBe(1);
  });

  it('tests a scrubber bar componentWillReceiveProps', function() {
    var mockController = {
      state: {
        isMobile: false
      }
    };

    var node = document.createElement('div');
    Enzyme.mount(
      <ScrubberBar
      controlBarVisible={true}
      seeking={true}
      controller={mockController}
      skinConfig={skinConfig} />, node
    );

    Enzyme.mount(
      <ScrubberBar
        controlBarVisible={false}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig} />, node
    );

    ReactDOM.unmountComponentAtNode(node);
  });

  it('tests a scrubber bar functions', function() {
    var mockController = {
      state: {
        isMobile: true
      },
      startHideControlBarTimer: function() {},
      updateSeekingPlayhead: function() {},
      beginSeeking: function() {},
      endSeeking: function() {},
      seek: function() {},
      renderSkin: function() {},
      setScrubberBarHoverState: function() {}
    };

    var node = document.createElement('div');
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={true}
        duration={8}
        controller={mockController}
        skinConfig={skinConfig} />, node
    );

    wrapper.instance().getResponsiveUIMultiple('md');

    var event2 = {
      preventDefault: function() {},
      stopPropagation: function() {},
      touches: ['a', 'b'],
      targetTouches: [{pageX:2}, {}],
      clientX: 45,
      target: {
        className: 'padding',
        getBoundingClientRect: function() {
          return {left: 33};
        }
      },
      type: 'mousedown',
      nativeEvent: {}
    };
    wrapper.instance().handleScrubberBarMouseDown(event2);

    var event1 = {
      preventDefault: function() {},
      touches: ['a', 'b'],
      targetTouches: [{pageX:2}, {}],
      clientX: 45,
      target: {
        className: 'oo-playhead',
        getBoundingClientRect: function() {
          return {left: 33};
        }
      },
      type: 'mouseup',
      nativeEvent: {}
    };
    wrapper.instance().handlePlayheadMouseDown(event1);
    wrapper.instance().handlePlayheadMouseDown(event2);
    wrapper.instance().handlePlayheadMouseUp(event2);

    var event3 = {
      preventDefault: function() {},
      touches: ['a', 'b'],
      targetTouches: [{pageX:2}, {}],
      clientX: 45,
      target: {
        className: 'playhead',
        getBoundingClientRect: function() {
          return {left: 33};
        }
      },
      type: 'touchstart'
    };
    wrapper.instance().handleScrubberBarMouseDown(event3);

    var event4 = {
      preventDefault: function() {},
      touches: ['a', 'b'],
      clientX: 45
    };
    wrapper.instance().handlePlayheadMouseMove(event4);
    wrapper.instance().handleScrubberBarMouseMove(event4);
    wrapper.instance().handleScrubberBarMouseLeave(event4);
  });

  it('tests a scrubber bar componentWillUnmount', function() {
    var mockController = {
      state: {
        isMobile: true
      },
      startHideControlBarTimer: function() {},
      seek: function() {},
      endSeeking: function() {}
    };

    var node = document.createElement('div');
    var wrapper = Enzyme.mount(
      <ScrubberBar
        controlBarVisible={true}
        seeking={true}
        duration={8}
        controller={mockController}
        skinConfig={skinConfig} />, node
    );

    Enzyme.mount(
      <ScrubberBar
        controlBarVisible={false}
        seeking={false}
        controller={mockController}
        skinConfig={skinConfig} />, node
    );

    ReactDOM.unmountComponentAtNode(node);
    wrapper.instance().handlePlayheadMouseUp({
      preventDefault: function() {},
      stopPropagation: function() {}
    });
  });

});
