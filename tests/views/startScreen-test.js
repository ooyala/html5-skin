jest.dontMock('../../js/views/startScreen')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var StartScreen = require('../../js/views/startScreen');
var skinConfig = require('../../config/skin.json');

describe('StartScreen', function() {
  var mockController, mockProps;

  beforeEach(function() {
    mockController = {
      state: {
        contentTree: {
          promo_image: 'image.png',
          description: 'description',
          title: 'title'
        }
      }
    };
    mockProps = {
      controller: mockController,
      skinConfig: JSON.parse(JSON.stringify(skinConfig))
    };
    mockProps.skinConfig.startScreen = {
      titleFont: {},
      descriptionFont: {},
      playIconStyle: {
        color: 'white'
      },
      infoPanelPosition: 'topLeft',
      playButtonPosition: 'center',
      showPlayButton: true,
      showPromo: true,
      showTitle: true,
      showDescription: true,
      promoImageSize: 'default'
    };
  });

  it('should render start screen', function() {
    // Render start screen into DOM
    var DOM = TestUtils.renderIntoDocument(<StartScreen />);

    // test play
    var playBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-selectable');
    TestUtils.Simulate.click(playBtn);
  });

  it('should render action icon when player is not initializing', function() {
    var DOM = TestUtils.renderIntoDocument(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={false} />
    );
    var actionIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-action-icon');
    expect(actionIcon).toBeDefined();
  });

  it('should NOT render action icon when player is initializing', function() {
    var DOM = TestUtils.renderIntoDocument(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={true} />
    );
    var actionIcons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-action-icon');
    expect(actionIcons.length).toBe(0);
  });

  it('should render info panel when player is not initializing', function() {
    var DOM = TestUtils.renderIntoDocument(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={false} />
    );
    var infoPanel = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-info');
    expect(infoPanel).toBeDefined();
    var titleLabel = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-title');
    var descriptionLabel = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-description');
    expect(titleLabel.innerHTML).toEqual(mockController.state.contentTree.title);
    expect(descriptionLabel.innerHTML).toEqual(mockController.state.contentTree.description);
  });

  it('should NOT render info panel when player is initializing', function() {
    var DOM = TestUtils.renderIntoDocument(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={true} />
    );
    var infoPanels = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-info');
    expect(infoPanels.length).toBe(0);
  });

  it('should react to title and description skin.json changes', function() {
    mockProps.skinConfig.startScreen.showTitle = false;
    mockProps.skinConfig.startScreen.showDescription = false;

    var DOM = TestUtils.renderIntoDocument(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={false} />
    );
    var infoPanel = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-state-screen-info');
    expect(infoPanel).toBeDefined();
    var titleLabels = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-title');
    var descriptionLabels = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-state-screen-description');
    expect(titleLabels.length).toBe(0);
    expect(descriptionLabels.length).toEqual(0);
  });

});
