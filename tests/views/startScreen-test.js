jest.dontMock('../../js/views/startScreen')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var StartScreen = require('../../js/views/startScreen');
var skinConfig = require('../../config/skin.json');

describe('StartScreen', function() {
  var mockController, mockProps;

  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false,
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
        },
        contentTree: {
          promo_image: 'image.png',
          description: 'description',
          title: 'title'
        }
      },
      cancelTimer: function() {},
      hideVolumeSliderBar: function() {},
      toggleMute: function() {},
      startHideControlBarTimer: function() {},
      setVolume: function() {}
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
    var wrapper = Enzyme.mount(<StartScreen />);

    // test play
    var playBtn = wrapper.find('.oo-state-screen-selectable');
    playBtn.simulate('click');
  });

  it('should render action icon when player is not initializing', function() {
    var wrapper = Enzyme.mount(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={false} />
    );
    var actionIcon = wrapper.find('.oo-action-icon');
    expect(actionIcon).toBeDefined();
  });

  it('should NOT render action icon when player is initializing', function() {
    var wrapper = Enzyme.mount(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={true} />
    );
    var actionIcons = wrapper.find('.oo-action-icon');
    expect(actionIcons.length).toBe(0);
  });

  it('should render info panel when player is not initializing', function() {
    var wrapper = Enzyme.mount(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={false} />
    );
    var infoPanel = wrapper.find('.oo-state-screen-info');
    expect(infoPanel).toBeDefined();
    var titleLabel = wrapper.find('.oo-state-screen-title').getDOMNode();
    var descriptionLabel = wrapper.find('.oo-state-screen-description').getDOMNode();
    expect(titleLabel.innerHTML).toEqual(mockController.state.contentTree.title);
    expect(descriptionLabel.innerHTML).toEqual(mockController.state.contentTree.description);
  });

  it('should NOT render info panel when player is initializing', function() {
    var wrapper = Enzyme.mount(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={true} />
    );
    var infoPanels = wrapper.find('.oo-state-screen-info');
    expect(infoPanels.length).toBe(0);
  });

  it('should react to title and description skin.json changes', function() {
    mockProps.skinConfig.startScreen.showTitle = false;
    mockProps.skinConfig.startScreen.showDescription = false;

    var wrapper = Enzyme.mount(
      <StartScreen
        {...mockProps}
        contentTree={mockController.state.contentTree}
        isInitializing={false} />
    );
    var infoPanel = wrapper.find('.oo-state-screen-info');
    expect(infoPanel).toBeDefined();
    var titleLabels = wrapper.find('.oo-state-screen-title');
    var descriptionLabels = wrapper.find('.oo-state-screen-description');
    expect(titleLabels.length).toBe(0);
    expect(descriptionLabels.length).toEqual(0);
  });

});
