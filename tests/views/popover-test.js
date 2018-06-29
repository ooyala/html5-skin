jest.dontMock('../../js/views/popover');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var Popover = require('../../js/views/popover');
var CONSTANTS = require('../../js/constants/constants');

describe('Popover', function() {

  function mountComponent(popoverClassName, closeActionEnabled, closeAction) {
    var wrapper = Enzyme.mount(
      <Popover
        popoverClassName={popoverClassName}
        closeActionEnabled={closeActionEnabled}
        closeAction={closeAction}>
        <div className="child-element" tabIndex="0"></div>
      </Popover>
    );
    return wrapper;
  }

  describe('keyboard navigation', function() {
    var eventMap, originalAddEventListener, closeActionCalled, closeAction, mockEscEvent;

    beforeEach(function() {
      eventMap = {};

      originalAddEventListener = document.addEventListener;
      document.addEventListener = function(event, cb) {
        eventMap[event] = cb;
      };

      closeActionCalled = false;
      closeAction = function() {
        closeActionCalled = true;
      };
      mockEscEvent = { keyCode: CONSTANTS.KEYCODES.ESCAPE_KEY, preventDefault: function() {} };
    });

    afterEach(function() {
      document.addEventListener = originalAddEventListener;
    });

    it('should execute close action when ESC key is pressed inside container', function() {
      var wrapper = mountComponent('class', true, closeAction);
      var popover = wrapper.getDOMNode();
      popover.contains = function() { return true; };
      eventMap.keydown(mockEscEvent);
      expect(closeActionCalled).toBe(true);
    });

    it('should NOT execute close action when ESC key is pressed and closeActionEnabled is false', function() {
      var wrapper = mountComponent('class', false, closeAction);
      var popover = wrapper.getDOMNode();
      popover.contains = function() { return true; };
      eventMap.keydown(mockEscEvent);
      expect(closeActionCalled).toBe(false);
    });

    it('should set restoreToggleButtonFocus param depending on whether keydown happened inside or outside container', function() {
      var restoreToggleButtonFocus;
      var customCloseAction = function(params) {
        restoreToggleButtonFocus = params.restoreToggleButtonFocus;
      };
      var wrapper = mountComponent('class', true, customCloseAction);
      var popover = wrapper.getDOMNode();
      popover.contains = function() { return true; };
      eventMap.keydown(mockEscEvent);
      expect(restoreToggleButtonFocus).toBe(true);
      popover.contains = function() { return false; };
      eventMap.keydown(mockEscEvent);
      expect(restoreToggleButtonFocus).toBe(false);
    });

  });

});
