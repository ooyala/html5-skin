jest.dontMock('../../js/components/controlBar')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('../../config/en.json')
    .dontMock('../../config/es.json')
    .dontMock('../../config/zh.json');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
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
      authorization: {},
      controller: mockController,
      skinConfig: skinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
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
        closedCaptionOptions: {}
      },
      toggleFullscreen: function() {
        fullscreenToggled = true;
      }
    };

    var fullscreenSkinConfig = Utils.clone(skinConfig);
    fullscreenSkinConfig.buttons.desktopContent = [{"name":"fullscreen", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: fullscreenSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    expect(fullscreenToggled).toBe(false);
    var fullscreenButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'fullscreen');
    TestUtils.Simulate.click(fullscreenButton.getDOMNode());
    expect(fullscreenToggled).toBe(true);
  });

  it('renders one button', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [{"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 }];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'controlBarItem');
    expect(buttons.length).toBe(1);
  });

  it('renders multiple buttons', function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
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
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={1200}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'controlBarItem');
    expect(buttons.length).toBe(4);
  });

  it('to mute on click and change volume', function() {
    var muteClicked = false;
    var newVolume = -1;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
      },
      handleMuteClick: function() {muteClicked = true;},
      setVolume: function(volume) {newVolume = volume;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"volume", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":105 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var volumeButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'volume').getDOMNode().firstChild;
    TestUtils.Simulate.click(volumeButton);
    expect(muteClicked).toBe(true);
    var volumeBars = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'volumeBar');
    //JEST doesn't support dataset at the time of writing
    TestUtils.Simulate.click(volumeBars[5].getDOMNode(), {target: {dataset: {volume: 5}}});
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
        closedCaptionOptions: {}
      },
      togglePlayPause: function() {playClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":105 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var playButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'playPause').getDOMNode().firstChild;
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
        closedCaptionOptions: {}
      },
      toggleShareScreen: function() {shareClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"share", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var shareButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'share').getDOMNode().firstChild;
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
        closedCaptionOptions: {}
      },
      toggleDiscoveryScreen: function() {discoveryClicked = true;}
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"discovery", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var discoveryButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'discovery').getDOMNode().firstChild;
    TestUtils.Simulate.click(discoveryButton);
    expect(discoveryClicked).toBe(true);
  });

  it('shows/hides closed caption button if captions available', function() {
    var discoveryClicked = false;
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"closedCaption", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'closedCaption');
    expect(ccButtons.length).toBe(0);

    var ccClicked = false;
    mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true}
      },
      toggleClosedCaptionScreen: function() {ccClicked = true;}
    };

    mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var ccButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'closedCaption');
    expect(ccButtons.length).toBe(1);

    var ccButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'closedCaption').getDOMNode().firstChild;
    TestUtils.Simulate.click(ccButton);
    expect(ccClicked).toBe(true);
  });

  it("shows/hides the more options button appropriately", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"moreOptions", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'moreOptions');
    expect(optionsButton.length).toBe(0);
    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'controlBarItem');
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
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    optionsButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'moreOptions');
    expect(optionsButton.length).toBe(1);
    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'playPause');
    expect(buttons.length).toBeLessThan(5);
  });

  it("handles bad button input", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
      }
    };

    var oneButtonSkinConfig = Utils.clone(skinConfig);
    oneButtonSkinConfig.buttons.desktopContent = [
      {"name":"playPause", "location":"controlBar", "whenDoesNotFit":"keep", "minWidth":35 },
      {"name":"doesNotExist", "location":"controlBar", "whenDoesNotFit":"moveToMoreOptions", "minWidth":35 }
    ];

    var mockProps = {
      authorization: {},
      controller: mockController,
      skinConfig: oneButtonSkinConfig
    };

    var DOM = TestUtils.renderIntoDocument(
      <ControlBar {...mockProps} controlBarVisible={true}
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'controlBarItem');
    expect(buttons.length).toBe(1);
  });

  it("shows/hides the live indicator appropriately", function() {
    var mockController = {
      state: {
        isMobile: false,
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {}
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
        controlBarWidth={500}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'live');
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
        controlBarWidth={100}
        playerState={CONSTANTS.STATE.PLAYING}
        authorization={mockProps.authorization} />
    );

    buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'live');
    expect(buttons.length).toBe(0);
  });

});

