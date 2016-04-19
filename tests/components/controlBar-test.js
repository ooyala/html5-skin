jest.dontMock('../../js/components/controlBar')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var CONSTANTS = require('../../js/constants/constants');
var ControlBar = require('../../js/components/controlBar');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');

// start unit test
describe('ControlBar', function () {
  it('creates a control bar', function () {

    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        }
      }
    };

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: skinConfig,
      duration: 30
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
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
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleFullscreen: function() {
        fullscreenToggled = true;
      }
    };

    var fullscreenSkinConfig = Utils.clone(skinConfig);
    fullscreenSkinConfig.buttons.desktopContent = [{"name":"fullscreen", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: fullscreenSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    expect(fullscreenToggled).toBe(false);
    var fullscreenButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-fullscreen');
    TestUtils.Simulate.click(fullscreenButton);
    expect(fullscreenToggled).toBe(true);
  });

  it('renders one button', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
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
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"share", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"fullscreen", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={1200}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
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
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      handleMuteClick: function() {muteClicked = true;},
      setVolume: function(volume) {newVolume = volume;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":105 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var volumeButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-volume').firstChild;
    TestUtils.Simulate.click(volumeButton);
    expect(muteClicked).toBe(true);
    var volumeBars = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-volume-bar');
    //JEST doesn't support dataset at the time of writing
    TestUtils.Simulate.click(volumeBars[5], {target: {dataset: {volume: 5}}});
    expect(newVolume).toBeGreaterThan(-1);
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
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      togglePlayPause: function() {playClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":105 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var playButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-play-pause').firstChild;
    TestUtils.Simulate.click(playButton);
    expect(playClicked).toBe(true);
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
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleShareScreen: function() {shareClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"share", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var shareButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-share').firstChild;
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
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true
      },
      toggleDiscoveryScreen: function() {discoveryClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.END}
        authorization={mockProps.authorization} />
    );

    var discoveryButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-discovery').firstChild;
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
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"closedCaption", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-closed-caption');
    expect(ccButtons.length).toBe(0);

    var ccClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        videoQualityOptions: {
          availableBitrates: null
        }
      },
      toggleClosedCaptionScreen: function() {ccClicked = true;}
    };

    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var ccButtons2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-closed-caption');
    expect(ccButtons2.length).toBe(1);

    var ccButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-closed-caption').firstChild;
    TestUtils.Simulate.click(ccButton);
    expect(ccClicked).toBe(true);
  });

  it('shows/hides discovery button if discovery available', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: false
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var discoveryButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-discovery');
    expect(discoveryButtons.length).toBe(0);

    var discoveryClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        },
        discoveryData: true
      },
      toggleDiscoveryScreen: function() {discoveryClicked = true;}
    };

    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var discoveryButtons2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-discovery');
    expect(discoveryButtons2.length).toBe(1);

    var discoveryButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-discovery').firstChild;
    TestUtils.Simulate.click(discoveryButton);
    expect(discoveryClicked).toBe(true);
  });

  it("shows/hides the more options button appropriately", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-more-options');
    expect(optionsButton.length).toBe(0);
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
    expect(buttons.length).toBe(1);

    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }
    ];

    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-more-options');
    expect(optionsButton.length).toBe(1);
    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-play-pause');
    expect(buttons.length).toBeLessThan(5);
  });

  it("handles more options click", function() {
    var moreOptionsClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
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
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }
    ];
    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var optionsButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-more-options');
    expect(optionsButton).not.toBe(null);
    TestUtils.Simulate.click(optionsButton);
    expect(moreOptionsClicked).toBe(true);
  });

  it("handles bad button input", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"doesNotExist", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-control-bar-item');
    expect(buttons.length).toBe(1);
  });

  it("shows/hides the live indicator appropriately", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"live", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: true}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-live');
    expect(buttons.length).toBe(1);

    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"live", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }
    ];

    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-live');
    expect(buttons.length).toBe(0);
  });

  it('highlights volume on mouseover', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":100 }];
    oneButtonSkinConfig.controlBar.iconStyle.inactive.opacity = 0;
    oneButtonSkinConfig.controlBar.iconStyle.active.opacity = 1;
    oneButtonSkinConfig.controlBar.iconStyle.active.color = "red";
    oneButtonSkinConfig.controlBar.iconStyle.inactive.color = "blue";

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        authorization={mockProps.authorization} />
    );

    expect(ReactDOM.findDOMNode(DOM.refs.volumeIcon).style.opacity).toBe("0");
    expect(ReactDOM.findDOMNode(DOM.refs.volumeIcon).style.color).toBe("blue");
    TestUtils.Simulate.mouseOver(ReactDOM.findDOMNode(DOM.refs.volumeIcon));
    expect(ReactDOM.findDOMNode(DOM.refs.volumeIcon).style.opacity).toBe("1");
    expect(ReactDOM.findDOMNode(DOM.refs.volumeIcon).style.color).toBe("red");
    TestUtils.Simulate.mouseOut(ReactDOM.findDOMNode(DOM.refs.volumeIcon));
    expect(ReactDOM.findDOMNode(DOM.refs.volumeIcon).style.opacity).toBe("0");
    expect(ReactDOM.findDOMNode(DOM.refs.volumeIcon).style.color).toBe("blue");
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
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":100 }];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        authorization={mockProps.authorization} />
    );
    var slider = TestUtils.findRenderedDOMComponentWithClass(DOM, "oo-volume-slider");
    expect(slider).not.toBe(null);
  });

  it('hides the volume on iOS', function() {
    window.navigator.platform = "iPhone";
    var mockController = {
      state: {
        isMobile: true,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":100 }];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PAUSED}
        authorization={mockProps.authorization} />
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
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"quality", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var qualityButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons.length).toBe(0);

    var qualityClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true},
        videoQualityOptions: {
          availableBitrates: true
        }
      },
      toggleScreen: function() {qualityClicked = true;},
      toggleQualityPopover: function() {qualityClicked = true;}
    };

    //xsmall
    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.xs.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var qualityButtons2 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons2.length).toBe(1);

    qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);

    //medium
    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.md.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var qualityButtons3 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons3.length).toBe(1);

    var qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);

    //large
    mockProps = {
      authorization: {streams: [{is_live_stream: false}]},
      controller: mockController,
      skinConfig: oneButtonSkinConfig,
      responsiveView: skinConfig.responsive.breakpoints.lg.id
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var qualityButtons4 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality');
    expect(qualityButtons4.length).toBe(1);

    qualityButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality').firstChild;
    TestUtils.Simulate.click(qualityButton);
    expect(qualityClicked).toBe(true);
  });

  it("renders nonclickable watermark", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"watermark", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":130 }
    ];
    oneButtonSkinConfig.controlBar.watermark.clickUrl = false;

    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var watermark = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-watermark');
    var nonClickableWatermark = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-non-clickable-watermark');
    expect(nonClickableWatermark).not.toBe(null);
  });

  it("renders clickable watermark", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {},
        videoQualityOptions: {
          availableBitrates: null
        }
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"watermark", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":130 }
    ];
    oneButtonSkinConfig.controlBar.watermark.clickUrl = true;

    var mockProps = {
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        componentWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var nonClickableWatermark = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-non-clickable-watermark');
    expect(nonClickableWatermark.length).toBe(0);

    var watermark = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-watermark');
    TestUtils.Simulate.click(watermark);
  });
});