jest.dontMock('../../../js/components/closed-caption/closedCaptionPopover');
jest.dontMock('../../../js/components/closed-caption/onOffSwitch');
jest.dontMock('../../../js/components/closeButton');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var ClosedCaptionPopover = require('../../../js/components/closed-caption/closedCaptionPopover');
var CONSTANTS = require('../../../js/constants/constants');

describe('ClosedCaptionPopover', function() {
  var props;

  beforeEach(function() {
    props = {
      language: 'en',
      localizableStrings: [],
      togglePopoverAction: function() {},
      closedCaptionOptions: {
        enabled: false
      },
      skinConfig: {
        general: {
          accentColor: '#fff'
        }
      },
      controller: {
        state: {
          focusedControl: null,
          closedCaptionOptions: {
            autoFocus: false
          }
        },
        toggleScreen: function() {},
      }
    };
  });

  it('should render a ClosedCaptionPopover', function() {
    var wrapper = Enzyme.mount(<ClosedCaptionPopover {...props}/>);
  });

  it('should render ARIA attributes on "More Captions" button', function() {
    var wrapper = Enzyme.mount(<ClosedCaptionPopover {...props}/>);
    var moreCaptionsBtn = wrapper.find('.oo-more-captions').hostNodes();
    expect(moreCaptionsBtn.getDOMNode().getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS);
    expect(moreCaptionsBtn.getDOMNode().getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM);
  });

  it('should set closed caption options autofocus to true when triggered with keyboard', function() {
    var wrapper = Enzyme.mount(<ClosedCaptionPopover {...props}/>);
    var moreCaptionsBtn = wrapper.find('.oo-more-captions').hostNodes();
    expect(wrapper.instance().composedComponent.props.controller.state.closedCaptionOptions.autoFocus).toBe(false);
    moreCaptionsBtn.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.SPACE });
    moreCaptionsBtn.simulate('click');
    expect(wrapper.instance().composedComponent.props.controller.state.closedCaptionOptions.autoFocus).toBe(true);
  });

  it('should preemptively set the control bar CC button as the focused control when opening CC menu with keyboard', function() {
    var wrapper = Enzyme.mount(<ClosedCaptionPopover {...props}/>);
    var moreCaptionsBtn = wrapper.find('.oo-more-captions').hostNodes();
    expect(wrapper.instance().composedComponent.props.controller.state.focusedControl).toBeNull();
    moreCaptionsBtn.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.SPACE });
    moreCaptionsBtn.simulate('click');
    expect(wrapper.instance().composedComponent.props.controller.state.focusedControl).toBe(CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION);
  });

  describe('keyboard navigation', function() {
    var popover, popoverMenuItems, wrapper;

    var getMockKeydownEvent = function(target, keyCode) {
      return {
        _type: 'keydown',
        target: target,
        keyCode: keyCode,
        preventDefault: function() {}
      };
    };

    beforeEach(function() {
      wrapper = Enzyme.mount(<ClosedCaptionPopover {...props} />);
      popover = wrapper.find('.oo-popover-horizontal');
      popoverMenuItems = popover.getDOMNode().querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']');
    });

    afterEach(function() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    });

    //TODO: I couldn't find an easy way to simulate the keydown event with the proper event target,
      //so I'm calling onKeyDown manually for the below tests for now
    it('should focus on previous menu item when pressing UP or LEFT arrow keys', function() {
      var activeIndex = popoverMenuItems.length - 1;
      popoverMenuItems[activeIndex].focus();
      wrapper.instance().onKeyDown({
        keyCode: CONSTANTS.KEYCODES.UP_ARROW_KEY,
        target: document.activeElement,
        preventDefault: function() {}
      });
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex - 1]);
      wrapper.instance().onKeyDown({
        keyCode: CONSTANTS.KEYCODES.LEFT_ARROW_KEY,
        target: document.activeElement,
        preventDefault: function() {}
      });
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex - 2]);
    });

    it('should focus on next menu item when pressing DOWN or RIGHT arrow keys', function() {
      var activeIndex = 0;
      popoverMenuItems[activeIndex].focus();
      wrapper.instance().onKeyDown({
        keyCode: CONSTANTS.KEYCODES.DOWN_ARROW_KEY,
        target: document.activeElement,
        preventDefault: function() {}
      });
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex + 1]);
      wrapper.instance().onKeyDown({
        keyCode: CONSTANTS.KEYCODES.RIGHT_ARROW_KEY,
        target: document.activeElement,
        preventDefault: function() {}
      });
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex + 2]);
    });

    it('should loop focus when navigating with arrow keys', function() {
      popoverMenuItems[0].focus();
      wrapper.instance().onKeyDown({
        keyCode: CONSTANTS.KEYCODES.UP_ARROW_KEY,
        target: document.activeElement,
        preventDefault: function() {}
      });
      expect(document.activeElement).toBe(popoverMenuItems[popoverMenuItems.length - 1]);
      wrapper.instance().onKeyDown({
        keyCode: CONSTANTS.KEYCODES.RIGHT_ARROW_KEY,
        target: document.activeElement,
        preventDefault: function() {}
      });
      expect(document.activeElement).toBe(popoverMenuItems[0]);
    });

  });

});
