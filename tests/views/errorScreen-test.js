jest.dontMock('../../src/js/views/errorScreen');
jest.dontMock('../../src/js/mixins/accessibilityMixin');
jest.dontMock('../../src/js/components/utils');
jest.dontMock('../../src/js/constants/constants');
jest.dontMock('../../src/js/mixins/accessibilityMixin');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ErrorScreen = require('../../src/js/views/errorScreen');

describe('ErrorScreen', function () {
  it('test error screen with valid error code', function () {
    var errorCode = {
      code: "network"
    };
    // Render error screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ErrorScreen errorCode={errorCode} />);
  });

  it('test error screen with invalid error code', function () {
    var errorCode = {
      code: "404"
    };
    // Render error screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ErrorScreen errorCode={errorCode} />);
  });
});