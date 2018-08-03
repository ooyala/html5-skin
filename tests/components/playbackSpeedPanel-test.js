jest
.dontMock('../../js/components/playbackSpeedPanel')
.dontMock('../../js/components/menuPanel')
.dontMock('../../js/components/menuPanelItem')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('../../js/constants/macros')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const PlaybackSpeedPanel = require('../../js/components/playbackSpeedPanel');
const MenuPanel = require('../../js/components/menuPanel');
const MenuPanelItem = require('../../js/components/menuPanelItem');
const AccessibleButton = require('../../js/components/accessibleButton');
const CONSTANTS = require('../../js/constants/constants');
const MACROS = require('../../js/constants/macros');

describe('PlaybackSpeedPanel', function() {
  let wrapper, component, props;

  const renderComponent = () => {
    wrapper = Enzyme.mount(
      <PlaybackSpeedPanel {...props}></PlaybackSpeedPanel>
    );
    component = wrapper.instance();
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      isPopover: false,
      language: 'en',
      localizableStrings: {},
      onClose: () => {},
      controller: {
        state: {
          playbackSpeedOptions: {
            currentSpeed: 1
          }
        },
        setPlaybackSpeed: () => {}
      },
      skinConfig: {
        general: {
          accentColor: '0000ff'
        },
        playbackSpeed: {
          options: [ 0.5, 0.75, 1, 1.25, 1.5, 2 ]
        }
      }
    };
  });

  it('should render a PlaybackSpeedPanel', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should call controller\'s setPlaybackSpeed method when an item is clicked', function() {
    let clickedSpeed;
    props.controller.setPlaybackSpeed = (itemValue) => clickedSpeed = itemValue;
    renderComponent();

    wrapper.find(MenuPanelItem).forEach(menuItem => {
      menuItem.find(AccessibleButton).simulate('click');
      expect(clickedSpeed).toBeDefined();
      expect(clickedSpeed).toBe(menuItem.props().itemValue);
    });
  });

  it('should generate a menu item for each playback speed option', function() {
    props.skinConfig.playbackSpeed.options = [ 0.5, 0.75, 1, 1.25, 1.5, 2 ];
    renderComponent();
    const options = props.skinConfig.playbackSpeed.options;
    const menuItems = wrapper.find(MenuPanel).props().menuItems;

    for (let [index, option] of options.entries()) {
      if (option === CONSTANTS.PLAYBACK_SPEED.DEFAULT_VALUE) {
        expect(menuItems[index]).toEqual({
          value: option,
          label: CONSTANTS.SKIN_TEXT.NORMAL_SPEED,
          ariaLabel: CONSTANTS.ARIA_LABELS.NORMAL_SPEED
        });
      } else {
        expect(menuItems[index]).toEqual({
          value: option,
          label: `${option}x`,
          ariaLabel: CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED.replace(MACROS.RATE, option)
        });
      }
    }

  });

  it('should pass current speed as selected value', function() {
    props.controller.state.playbackSpeedOptions.currentSpeed = 2;
    renderComponent();
    expect(wrapper.find(MenuPanel).props().selectedValue).toBe(
      props.controller.state.playbackSpeedOptions.currentSpeed
    );
  });

  it('should render a title on popover mode', function() {
    props.isPopover = false;
    renderComponent();
    expect(wrapper.find(MenuPanel).props().title).toBeFalsy();
    props.isPopover = true;
    renderComponent();
    expect(wrapper.find(MenuPanel).props().title).toBe(CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED);
  });

  it('should sanitize playback speed options and render items in ascending order', function() {
    props.skinConfig.playbackSpeed.options = [ 0.25, 2, 0.5, 1, 0.50, 1, 1, 1, 1.5, 2, 3, 0.5000, 0.75, 99, null ];
    renderComponent();
    const itemValues = wrapper.find(MenuPanel).props().menuItems.map(
      menuItem => menuItem.value
    );
    expect(itemValues).not.toEqual(props.skinConfig.playbackSpeed.options);
    expect(itemValues).toEqual([ 0.5, 0.75, 1, 1.5, 2 ]);
  });

});
