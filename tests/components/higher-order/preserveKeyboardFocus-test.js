jest
.dontMock('../../../js/components/accessibleButton')
.dontMock('../../../js/components/higher-order/preserveKeyboardFocus')
.dontMock('../../../js/constants/constants');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var AccessibleMenu = require('../../../js/components/higher-order/accessibleMenu');
var AccessibleButton = require('../../../js/components/accessibleButton');
var preserveKeyboardFocus = require('../../../js/components/higher-order/preserveKeyboardFocus');
var CONSTANTS = require('../../../js/constants/constants');

describe('preserveKeyboardFocus', function() {
  let node, props, menuItems, wrapper, component, renderedMenuItems;

  class DummyComponent extends React.Component {
    render() {
      return (
        <div>{this.props.children}</div>
      );
    }
  }

  const renderComponent = () => {
    let EnhancedComponent = preserveKeyboardFocus(DummyComponent);
    wrapper = Enzyme.mount(
      <EnhancedComponent {...props}>
        {menuItems}
      </EnhancedComponent>
    , node);
    component = wrapper.find(EnhancedComponent);
    renderedMenuItems = wrapper.find(AccessibleButton);
  };

  beforeEach(function() {
    node = document.createElement('div');
    props = {
      playerState: CONSTANTS.STATE.PLAYING,
      controller: {
        state: {
          focusedControl: null
        },
        startHideControlBarTimer: () => {}
      }
    };
    menuItems = [
      <AccessibleButton key="A" ariaLabel="A" focusId="itemA">A</AccessibleButton>,
      <AccessibleButton key="B" ariaLabel="B" focusId="itemB">B</AccessibleButton>
    ];
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

});
