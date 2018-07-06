jest
.dontMock('../../js/components/controlButton')
.dontMock('../../js/components/accessibleButton')
.dontMock('../../js/components/tooltip')
.dontMock('../../js/components/icon')
.dontMock('../../js/components/utils')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const ControlButton = require('../../js/components/controlButton');
const AccessibleButton = require('../../js/components/accessibleButton');
const Tooltip = require('../../js/components/tooltip');
const Icon = require('../../js/components/icon');
const CONSTANTS = require('../../js/constants/constants');

describe('ControlButton', function() {
  let wrapper, component, props;

  const renderComponent = () => {
    wrapper = Enzyme.mount(<ControlButton {...props} />);
    component = wrapper.instance();
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      ariaLabel: 'ariaLabel',
      focusId: 'focusId',
      className: null,
      icon: 'playPause',
      tooltip: null,
      tooltipVerticalOffset: null,
      language: 'en',
      localizableStrings: {},
      responsiveView: '',
      getTooltipAlignment: () => {},
      onRef: () => {},
      onClick: () => {},
      skinConfig: {
        general: {
          accentColor: '#0000ff'
        },
        responsive: {
          breakpoints: {}
        },
        controlBar: {
          height: 50,
          iconStyle: {
            active: {
              color: '#fff',
              opacity: 1
            },
            inactive: {
              color: '#fff',
              opacity: 1
            }
          },
          tooltips: {
            enabled: false
          }
        }
      },
      controller: {
        state: {
          isMobile: false
        }
      }
    };
  });

  it('should render a ControlButton', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should use an AccessibleButton when ariaHidden is not set', function() {
    delete props.ariaHidden;
    renderComponent();
    expect(component).toBeTruthy();
    expect(wrapper.find(AccessibleButton).length).toBe(1);
  });

  it('should use an anchor tag when ariaHidden is set to true', function() {
    props.ariaHidden = true;
    renderComponent();
    expect(component).toBeTruthy();
    expect(wrapper.find(AccessibleButton).length).toBe(0);
    expect(wrapper.find('a.oo-control-bar-item').length).toBe(1);
  });

  it('should have the oo-control-bar-item class by default', function() {
    renderComponent();
    expect(wrapper.find(AccessibleButton).props().className).toBe('oo-control-bar-item');
  });

  it('should pass AccessibleButton ref to parent component', function() {
    let buttonRef;
    props.onRef = (ref) => {
      buttonRef = ref;
    };
    renderComponent();
    expect(buttonRef).toBeTruthy();
    expect(buttonRef.wasTriggeredWithKeyboard).toBeTruthy();
  });

  it('should render the icon that matches the icon id passed in props', function() {
    props.icon = 'play';
    renderComponent();
    const icon = wrapper.find(Icon);
    expect(icon.length).toBe(1);
    expect(icon.props().icon).toBe(props.icon);
  });

  it('should set the appropriate icon styles from skin config', function() {
    props.icon = 'play';
    props.skinConfig.icons = { play: { fontStyleClass: 'oo-icon oo-play' } };
    props.skinConfig.controlBar.iconStyle.inactive.color = 'blue';
    props.skinConfig.controlBar.iconStyle.inactive.opacity = 0.5;
    renderComponent();
    const icon = wrapper.find(Icon);
    expect(icon.props().style).toEqual(props.skinConfig.controlBar.iconStyle.inactive);
  });

  it('should apply/remove icon highlight styles on mouse enter/leave', function() {
    props.icon = 'play';
    props.skinConfig.icons = { play: { fontStyleClass: 'oo-icon oo-play' } };
    props.skinConfig.controlBar.iconStyle.active.color = 'red';
    props.skinConfig.controlBar.iconStyle.active.opacity = 0.8;
    props.skinConfig.controlBar.iconStyle.inactive.color = 'blue';
    props.skinConfig.controlBar.iconStyle.inactive.opacity = 0.5;
    renderComponent();
    const iconElement = wrapper.find(Icon).getDOMNode();
    const button = wrapper.find(AccessibleButton);
    const buttonElement = button.getDOMNode();
    expect(iconElement.style.color).toBe(props.skinConfig.controlBar.iconStyle.inactive.color);
    expect(Number(iconElement.style.opacity)).toBe(props.skinConfig.controlBar.iconStyle.inactive.opacity);
    button.simulate('mouseEnter', { currentarget: buttonElement });
    expect(iconElement.style.color).toBe(props.skinConfig.controlBar.iconStyle.active.color);
    expect(Number(iconElement.style.opacity)).toBe(props.skinConfig.controlBar.iconStyle.active.opacity);
    button.simulate('mouseLeave', { currentarget: buttonElement });
    expect(iconElement.style.color).toBe(props.skinConfig.controlBar.iconStyle.inactive.color);
    expect(Number(iconElement.style.opacity)).toBe(props.skinConfig.controlBar.iconStyle.inactive.opacity);
  });

  it('should extract and return the right responsive UI multiplier from the skin config', function() {
    props.responsiveView = 'lg';
    props.skinConfig.responsive = {
      breakpoints: {
        xs: { id: "xs", name: "oo-xsmall", maxWidth: 559, multiplier: 0.7 },
        sm: { id: "sm", name: "oo-small", minWidth: 560, maxWidth: 839, multiplier: 1 },
        md: { id: "md", name: "oo-medium", minWidth: 840, maxWidth: 1279, multiplier: 1 },
        lg: { id: "lg", name: "oo-large", minWidth: 1280, multiplier: 1.2 }
      }
    };
    renderComponent();
    expect(wrapper.instance().getResponsiveUiMultiplier()).toBe(1.2);
    props.responsiveView = 'xs';
    renderComponent();
    expect(wrapper.instance().getResponsiveUiMultiplier()).toBe(0.7);
  });

  it('should correctly determine whether tooltips are enabled', function() {
    props.skinConfig.controlBar.tooltips.enabled = true;
    props.controller.state.isMobile = false;
    renderComponent();
    expect(wrapper.instance().areTooltipsEnabled()).toBe(true);
    props.skinConfig.controlBar.tooltips.enabled = true;
    props.controller.state.isMobile = true;
    renderComponent();
    expect(wrapper.instance().areTooltipsEnabled()).toBe(false);
    props.skinConfig.controlBar.tooltips.enabled = false;
    props.controller.state.isMobile = false;
    renderComponent();
    expect(wrapper.instance().areTooltipsEnabled()).toBe(false);
  });

  it('should fallback to control bar height when tooltipVerticalOffset is not passed', function() {
    props.tooltipVerticalOffset = 10;
    renderComponent();
    expect(wrapper.instance().getTooltipVerticalOffset()).toBe(10);
    delete props.tooltipVerticalOffset;
    props.skinConfig.controlBar.height = 50;
    renderComponent();
    expect(wrapper.instance().getTooltipVerticalOffset()).toBe(50);
  });

  it('should get tooltip alignment from passed function or fall back to default', function() {
    props.getTooltipAlignment = null;
    renderComponent();
    expect(wrapper.instance().getTooltipAlignment()).toBe(CONSTANTS.TOOLTIP_ALIGNMENT.CENTER);
    props.getTooltipAlignment = () => 'custom';
    renderComponent();
    expect(wrapper.instance().getTooltipAlignment()).toBe('custom');
  });

  it('should render a tooltip when tooltip prop is passed and tooltips are enabled', function() {
    props.tooltip = 'w00t';
    props.skinConfig.controlBar.tooltips.enabled = true;
    props.controller.state.isMobile = false;
    renderComponent();
    expect(wrapper.find(Tooltip).length).toBe(1);
    expect(wrapper.find(Tooltip).props().text).toBe(props.tooltip);
    props.tooltip = null;
    renderComponent();
    expect(wrapper.find(Tooltip).length).toBe(0);
  });

});
