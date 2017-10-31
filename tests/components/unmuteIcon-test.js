jest.dontMock('../../js/components/unmuteIcon');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var UnmuteIcon = require('../../js/components/unmuteIcon');
var CONSTANTS = require('../../js/constants/constants');
var skinConfig = require('../../config/skin.json');
var sinon = require('sinon');

describe('UnmuteIcon', function () {
  var mockController = null;

  beforeEach(function() {
    mockController = {
      state: {
        volumeState: {
          muted: true,
          mutingForAutoplay: true,
          unmuteIconCollapsed: false
        }
      }
    };
  });

  it('creates an expanded UnmuteIcon', function () {
    var DOM = TestUtils.renderIntoDocument(
      <UnmuteIcon
        controller={mockController}
        skinConfig={skinConfig}
      />);

    var expanded = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-expanded');
    var unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(expanded).toEqual(unmuteIcon);
  });

  it('creates a collapsed UnmuteIcon', function () {
    mockController.state.volumeState.unmuteIconCollapsed = true;
    var DOM = TestUtils.renderIntoDocument(
      <UnmuteIcon
        controller={mockController}
        skinConfig={skinConfig}
      />);

    var expandeds = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-expanded');
    expect(expandeds.length).toBe(0);
    var unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(unmuteIcon).toBeTruthy();
  });

  it('collapses an expanded UnmuteIcon', function () {
    jest.useFakeTimers();
    var DOM = TestUtils.renderIntoDocument(
      <UnmuteIcon
        controller={mockController}
        skinConfig={skinConfig}
      />);

    var expanded = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-expanded');
    var unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(expanded).toEqual(unmuteIcon);

    jest.runAllTimers();
    var expandeds = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-expanded');
    expect(expandeds.length).toBe(0);
    unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(unmuteIcon).toBeTruthy();
  });

  it('handles clicks on collapsed unmute icon', function () {
    mockController.state.volumeState.unmuteIconCollapsed = true;
    mockController.handleMuteClick = function() {};
    var spy = sinon.spy(mockController, "handleMuteClick");
    var DOM = TestUtils.renderIntoDocument(
      <UnmuteIcon
        controller={mockController}
        skinConfig={skinConfig}
      />);
    var unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(spy.callCount).toBe(0);

    TestUtils.Simulate.click(unmuteIcon);
    expect(spy.callCount).toBe(1);
    spy.restore();
  });

  it('handles clicks on expanded unmute icon', function () {
    mockController.handleMuteClick = function() {};
    var spy = sinon.spy(mockController, "handleMuteClick");
    var DOM = TestUtils.renderIntoDocument(
      <UnmuteIcon
        controller={mockController}
        skinConfig={skinConfig}
      />);
    var unmuteIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-unmute');
    expect(spy.callCount).toBe(0);

    TestUtils.Simulate.click(unmuteIcon);
    expect(spy.callCount).toBe(1);
    spy.restore();
  });

});