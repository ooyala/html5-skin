jest
.dontMock('../../js/components/playbackSpeedButton')
.dontMock('../../js/components/controlButton')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const PlaybackSpeedButton = require('../../js/components/playbackSpeedButton');
const ControlButton = require('../../js/components/controlButton');
const CONSTANTS = require('../../js/constants/constants');

describe('PlaybackSpeedButton', function() {
  let wrapper, component, props;

  const renderComponent = (children) => {
    wrapper = Enzyme.mount(
      <PlaybackSpeedButton {...props}>
        {children}
      </PlaybackSpeedButton>
    );
    component = wrapper.instance();
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      className: '',
      responsiveView: 'md',
      controller: {
        state: {
          isMobile: false,
          playbackSpeedOptions: {
            currentSpeed: 1
          }
        }
      }
    };
  });

  it('should render a PlaybackSpeedButton', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should render className', function() {
    props.className = 'myClass';
    renderComponent();
    expect(wrapper.find('.oo-playback-speed').hostNodes().hasClass(props.className)).toBe(true);
  });

  it('should render label based on playback speed', function() {
    props.controller.state.playbackSpeedOptions.currentSpeed = 1;
    renderComponent();
    expect(wrapper.find('.oo-current-speed.oo-icon').getDOMNode().textContent).toBe('1x');
    props.controller.state.playbackSpeedOptions.currentSpeed = .750;
    renderComponent();
    expect(wrapper.find('.oo-current-speed.oo-icon').getDOMNode().textContent).toBe('0.75x');
    props.controller.state.playbackSpeedOptions.currentSpeed = 2;
    renderComponent();
    expect(wrapper.find('.oo-current-speed.oo-icon').getDOMNode().textContent).toBe('2x');
  });

  it('should render pre-defined aria label', function() {
    renderComponent();
    expect(wrapper.find(ControlButton).props().ariaLabel).toBe(CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED_OPTION);
  });

  it('should render children', function() {
    renderComponent(<div className="child"></div>);
    expect(wrapper.find('.child').length).toBe(1);
  });

});
