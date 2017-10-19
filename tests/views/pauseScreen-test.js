jest.dontMock('../../js/views/pauseScreen')
    .dontMock('../../js/components/icon')
    .dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var PauseScreen = require('../../js/views/pauseScreen');
var skinConfig = require('../../config/skin.json');
var ClassNames = require('classnames');

describe('PauseScreen', function () {
  it('creates an PauseScreen', function () {
    var clicked = false;
    var mockController = {
      state: {
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: false
        }
      },
      togglePlayPause: function(){clicked = true}
    };
    var mockContentTree = {
      title: "title"
    };

    var handleVrPlayerClick = function() {};
    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(
      <PauseScreen
        skinConfig={skinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: "sample text"}}
      />
    );

    var pauseIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-action-icon-pause');
    TestUtils.Simulate.click(pauseIcon);
    expect(clicked).toBe(true);
  });

  it('should display unmute icon when handling muted autoplay', function () {
    var mockController = {
      state: {
        autoplayed: true,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: true,
          mutedBeforePlayback: true,
          hasUnmuted: false
        }
      }
    };

    var mockContentTree = {
      title: "title"
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PauseScreen  skinConfig={skinConfig}
                                                         controller={mockController}
                                                         contentTree={mockContentTree}
                                                         closedCaptionOptions={closedCaptionOptions} />);
    var unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(unmuteIcon).toBeTruthy();
  });

  it('should not display unmute icon when not autoplaying', function () {
    var mockController = {
      state: {
        autoplayed: false,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: true,
          mutedBeforePlayback: true,
          hasUnmuted: false
        }
      }
    };

    var mockContentTree = {
      title: "title"
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PauseScreen  skinConfig={skinConfig}
                                                         controller={mockController}
                                                         contentTree={mockContentTree}
                                                         closedCaptionOptions={closedCaptionOptions} />);
    var unmuteIcons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-unmute');
    expect(unmuteIcons.length).toBe(0);
  });

  it('should not display unmute icon when not muted before playback', function () {
    var mockController = {
      state: {
        autoplayed: true,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: true,
          mutedBeforePlayback: false,
          hasUnmuted: false
        }
      }
    };

    var mockContentTree = {
      title: "title"
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PauseScreen  skinConfig={skinConfig}
                                                         controller={mockController}
                                                         contentTree={mockContentTree}
                                                         closedCaptionOptions={closedCaptionOptions} />);
    var unmuteIcons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-unmute');
    expect(unmuteIcons.length).toBe(0);
  });

  it('should not display unmute icon when not muted', function () {
    var mockController = {
      state: {
        autoplayed: true,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: false,
          mutedBeforePlayback: true,
          hasUnmuted: false
        }
      }
    };

    var mockContentTree = {
      title: "title"
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PauseScreen  skinConfig={skinConfig}
                                                         controller={mockController}
                                                         contentTree={mockContentTree}
                                                         closedCaptionOptions={closedCaptionOptions} />);
    var unmuteIcons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-unmute');
    expect(unmuteIcons.length).toBe(0);
  });

  it('should not display unmute icon when unmuted at any point', function () {
    var mockController = {
      state: {
        autoplayed: true,
        upNextInfo: {
          showing: false
        },
        volumeState: {
          muted: true,
          mutedBeforePlayback: true,
          hasUnmuted: true
        }
      }
    };

    var mockContentTree = {
      title: "title"
    };

    var closedCaptionOptions = {
      cueText: "cue text"
    };

    var DOM = TestUtils.renderIntoDocument(<PauseScreen  skinConfig={skinConfig}
                                                         controller={mockController}
                                                         contentTree={mockContentTree}
                                                         closedCaptionOptions={closedCaptionOptions} />);
    var unmuteIcons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-unmute');
    expect(unmuteIcons.length).toBe(0);
  });

});