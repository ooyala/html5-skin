jest
.dontMock('../../js/views/pauseScreen')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/higher-order/accessibleMenu')
.dontMock('../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('../../js/components/utils')
.dontMock('classnames');

var React = require('react');
var sinon = require('sinon');
var TestUtils = require('react-addons-test-utils');
var PauseScreen = require('../../js/views/pauseScreen');
var ClassNames = require('classnames');

describe('PauseScreen', function() {
  var mockController, mockContentTree, mockSkinConfig;

  beforeEach(function() {
    mockController = {
      state: {
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      addBlur: function() {}
    };
    mockContentTree = {
      title: 'title'
    };
    mockSkinConfig = {
      startScreen:{
        titleFont: {
          color: 'white'
        },
        descriptionFont: {
          color: 'white'
        }
      },
      pauseScreen: {
        infoPanelPosition: 'topLeft',
        pauseIconPosition: 'center',
        PauseIconStyle: {
          color: 'white',
          opacity: '1'
        },
        showPauseIcon: true
      },
      icons: {
        pause: {
          fontStyleClass: 'pause'
        }
      }
    };
  });

  it('creates an PauseScreen', function() {
    var clicked = false;

    mockController.togglePlayPause = function() {
      clicked = true;
    };

    var handleVrPlayerClick = function() {};
    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
      />
    );

    var pauseIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-action-icon-pause');
    TestUtils.Simulate.click(pauseIcon);
    expect(clicked).toBe(true);
  });

  it('does show the fade underlay when there is a title', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = true;
    mockContentTree.title = 'Video title';
    var handleVrPlayerClick = function() {};
    var DOM = TestUtils.renderIntoDocument(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
      />
    );

    var underlay = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-fading-underlay');
    expect(spy.callCount).toBe(1);
    spy.restore();
  });

  it('does show the fade underlay when there is a description', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showDescription = true;
    mockContentTree.description = 'Video description';
    var handleVrPlayerClick = function() {};
    var DOM = TestUtils.renderIntoDocument(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
      />
    );

    var underlay = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-fading-underlay');
    // render gets called more than once due to a descriptino text state change when component is mounted
    expect(spy.callCount).toNotBe(0);
    spy.restore();
  });

  it('does not show the fade underlay when we do not show a title or description', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = false;
    mockSkinConfig.pauseScreen.showDescription = false;
    var handleVrPlayerClick = function() {};
    var DOM = TestUtils.renderIntoDocument(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
      />
    );

    var underlays = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-fading-underlay');
    expect(underlays.length).toBe(0);
    expect(spy.callCount).toBe(0);
    spy.restore();
  });

  it('does not show the fade underlay when there is no description and no title', function() {
    var spy = sinon.spy(mockController, 'addBlur');
    mockSkinConfig.pauseScreen.showTitle = true;
    mockSkinConfig.pauseScreen.showDescription = true;
    delete mockContentTree.title;
    delete mockContentTree.description;
    var handleVrPlayerClick = function() {};
    var DOM = TestUtils.renderIntoDocument(
      <PauseScreen
        skinConfig={mockSkinConfig}
        controller={mockController}
        contentTree={mockContentTree}
        handleVrPlayerClick={handleVrPlayerClick}
        closedCaptionOptions={{cueText: 'sample text'}}
      />
    );

    var underlays = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-fading-underlay');
    expect(underlays.length).toBe(0);
    expect(spy.callCount).toBe(0);
    spy.restore();
  });
});
