jest
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/holdOnClick')
.dontMock('../../../js/constants/constants');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const AccessibleButton = require('../../../js/components/accessibleButton');
const holdOnClick = require('../../../js/components/higher-order/holdOnClick');
const CONSTANTS = require('../../../js/constants/constants');

describe('holdOnClick', function() {
  let props, wrapper, clickSpy;

  jest.useFakeTimers();

  class DummyComponent extends React.Component {
    render() {
      return (
        <AccessibleButton
          ariaLabel="test"
          onClick={this.props.onClick}>
          {this.props.children}
        </AccessibleButton>
      );
    }
  }

  const renderComponent = () => {
    const EnhancedComponent = holdOnClick(DummyComponent);
    wrapper = Enzyme.mount(
      <EnhancedComponent {...props}>Click Me</EnhancedComponent>
    );
  };

  beforeEach(function() {
    props = {
      onClick: () => {}
    };
    clickSpy = jest.spyOn(props, 'onClick');
  });

  afterEach(function() {
    clickSpy.mockRestore();
  });

  it('should render a HoldOnClick component', function() {
    renderComponent();
    expect(wrapper.length).toBe(1);
  });

  it('should call click on keydown and mousedown', function() {
    renderComponent();
    expect(clickSpy.mock.calls.length).toBe(0);
    wrapper.instance().onMouseDown();
    expect(clickSpy.mock.calls.length).toBe(1);
    wrapper.instance().onKeyDown({ key: CONSTANTS.KEY_VALUES.SPACE });
    expect(clickSpy.mock.calls.length).toBe(2);
  });

  it('should keep calling click handler periodically until mouse is released', function() {
    renderComponent();
    expect(clickSpy.mock.calls.length).toBe(0);
    wrapper.instance().onMouseDown();
    expect(clickSpy.mock.calls.length).toBe(1);
    // Will start calling handler after initial delay
    jest.advanceTimersByTime(500);
    expect(clickSpy.mock.calls.length).toBe(1);
    // Call count should increase every 100 milliseconds
    jest.advanceTimersByTime(100);
    expect(clickSpy.mock.calls.length).toBe(2);
    jest.advanceTimersByTime(100);
    expect(clickSpy.mock.calls.length).toBe(3);
    // Call count should stop increasing after mouse is released
    wrapper.instance().releaseClick();
    jest.advanceTimersByTime(100);
    expect(clickSpy.mock.calls.length).toBe(3);
  });

  it('should release click when component unmounts', function() {
    renderComponent();
    const spy = jest.spyOn(wrapper.instance(), 'releaseClick');
    expect(spy.mock.calls.length).toBe(0);
    wrapper.instance().componentWillUnmount();
    expect(spy.mock.calls.length).toBe(1);
    clickSpy.mockRestore();
  });

});
