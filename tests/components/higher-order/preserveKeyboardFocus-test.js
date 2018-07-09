jest
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('../../../js/constants/constants');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const AccessibleButton = require('../../../js/components/accessibleButton');
const preserveKeyboardFocus = require('../../../js/components/higher-order/preserveKeyboardFocus');
const CONSTANTS = require('../../../js/constants/constants');

describe('preserveKeyboardFocus', function() {
  let props, menuItems, wrapper, component, renderedMenuItems;

  class DummyComponent extends React.Component {
    render() {
      return (
        <div>{this.props.children}</div>
      );
    }
  }

  const renderComponent = () => {
    const EnhancedComponent = preserveKeyboardFocus(DummyComponent);
    wrapper = Enzyme.mount(
      <EnhancedComponent {...props}>
        {menuItems}
      </EnhancedComponent>
    );
    component = wrapper.find(EnhancedComponent);
    renderedMenuItems = wrapper.find(AccessibleButton);
  };

  beforeEach(function() {
    props = {
      playerState: CONSTANTS.STATE.PLAYING,
      controller: {
        state: {
          focusedControl: null
        },
        setFocusedControl: (focusedControl) => {
          props.controller.state.focusedControl = focusedControl;
        },
        startHideControlBarTimer: () => {}
      }
    };
    menuItems = [
      <AccessibleButton key="A" ariaLabel="A" focusId="itemA">A</AccessibleButton>,
      <AccessibleButton key="B" ariaLabel="B" focusId="itemB">B</AccessibleButton>
    ];
    if (document.activeElement) {
      document.activeElement.blur();
    }
  });

  it('should render a PreserveKeyboardFocus component', function() {
    renderComponent();
    expect(component).toBeTruthy();
    expect(renderedMenuItems.length).toBe(2);
  });

  it('should restore focused component on mount', function() {
    const focusedBtnId = 'itemB';
    props.controller.state.focusedControl = focusedBtnId;
    renderComponent();
    const selector = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}="${focusedBtnId}"]`;
    const expectedFocusedBtn = renderedMenuItems.find(selector);
    expect(document.activeElement).toBe(expectedFocusedBtn.getDOMNode());
  });

  it('should not alter focus when focusedControl is not set', function() {
    props.controller.state.focusedControl = null;
    expect(document.activeElement).toBe(document.body);
    renderComponent();
    expect(document.activeElement).toBe(document.body);
  });

  it('should store the focus id of a newly focused element', function() {
    const focusedBtnId = 'itemA';
    props.controller.state.focusedControl = null;
    renderComponent();
    expect(document.activeElement).toBe(document.body);
    const selector = `[${CONSTANTS.KEYBD_FOCUS_ID_ATTR}="${focusedBtnId}"]`;
    const btnToFocus = renderedMenuItems.find(selector).getDOMNode();
    component.instance().onFocus({ target: btnToFocus });
    expect(props.controller.state.focusedControl).toBe(focusedBtnId);
  });

  it('should clear the focus id state on blur', function() {
    const focusedBtnId = 'itemA';
    props.controller.state.focusedControl = focusedBtnId;
    renderComponent();
    expect(props.controller.state.focusedControl).toBe(focusedBtnId);
    component.instance().onBlur();
    expect(props.controller.state.focusedControl).toBeNull();
  });

  it('should call startHideControlBarTimer() when focus is restored and player is playing', function() {
    const focusedBtnId = 'itemA';
    props.controller.state.focusedControl = focusedBtnId;
    const spy = jest.spyOn(props.controller, 'startHideControlBarTimer');
    expect(spy.mock.calls.length).toBe(0);
    renderComponent();
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls.length).toBe(1);
    spy.mockRestore();
  });

});
