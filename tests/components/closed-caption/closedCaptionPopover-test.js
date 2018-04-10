jest.dontMock('../../../js/components/closed-caption/closedCaptionPopover');
jest.dontMock('../../../js/components/closed-caption/onOffSwitch');
jest.dontMock('../../../js/components/closeButton');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
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
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPopover {...props}/>);
  });

  it('should render ARIA attributes on "More Captions" button', function() {
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPopover {...props}/>);
    var moreCaptionsBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-more-captions');
    expect(moreCaptionsBtn.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS);
    expect(moreCaptionsBtn.getAttribute('role')).toBe(CONSTANTS.ARIA_ROLES.MENU_ITEM);
  });

  it('should set closed caption options autofocus to true when triggered with keyboard', function() {
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPopover {...props}/>);
    var moreCaptionsBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-more-captions');
    expect(props.controller.state.closedCaptionOptions.autoFocus).toBe(false);
    TestUtils.Simulate.keyDown(moreCaptionsBtn, { key: CONSTANTS.KEY_VALUES.SPACE });
    TestUtils.Simulate.click(moreCaptionsBtn);
    expect(props.controller.state.closedCaptionOptions.autoFocus).toBe(true);
  });

  it('should preemptively set the control bar CC button as the focused control when opening CC menu with keyboard', function() {
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPopover {...props}/>);
    var moreCaptionsBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-more-captions');
    expect(props.controller.state.focusedControl).toBeNull();
    TestUtils.Simulate.keyDown(moreCaptionsBtn, { key: CONSTANTS.KEY_VALUES.SPACE });
    TestUtils.Simulate.click(moreCaptionsBtn);
    expect(props.controller.state.focusedControl).toBe(CONSTANTS.FOCUS_IDS.CLOSED_CAPTIONS);
  });

  describe('keyboard navigation', function() {
    var popover, popoverMenuItems;

    var getMockKeydownEvent = function(target, keyCode) {
      return {
        _type: 'keydown',
        target: target,
        keyCode: keyCode,
        preventDefault: function() {}
      };
    };

    beforeEach(function() {
      var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPopover {...props} />);
      popover = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-popover-horizontal');
      popoverMenuItems = popover.querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']');
    });

    afterEach(function() {
      document.activeElement = null;
    });

    it('should focus on previous menu item when pressing UP or LEFT arrow keys', function() {
      var activeIndex = popoverMenuItems.length - 1;
      document.activeElement = popoverMenuItems[activeIndex];
      popover.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEYCODES.UP_ARROW_KEY));
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex - 1]);
      popover.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEYCODES.LEFT_ARROW_KEY));
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex - 2]);
    });

    it('should focus on next menu item when pressing DOWN or RIGHT arrow keys', function() {
      var activeIndex = 0;
      document.activeElement = popoverMenuItems[activeIndex];
      popover.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEYCODES.DOWN_ARROW_KEY));
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex + 1]);
      popover.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEYCODES.RIGHT_ARROW_KEY));
      expect(document.activeElement).toBe(popoverMenuItems[activeIndex + 2]);
    });

    it('should loop focus when navigating with arrow keys', function() {
      document.activeElement = popoverMenuItems[0];
      popover.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEYCODES.UP_ARROW_KEY));
      expect(document.activeElement).toBe(popoverMenuItems[popoverMenuItems.length - 1]);
      popover.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEYCODES.RIGHT_ARROW_KEY));
      expect(document.activeElement).toBe(popoverMenuItems[0]);
    });

  });

});
