jest.dontMock('../../src/js/components/closeButton');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var CloseButton = require('../../src/js/components/closeButton');

describe('CloseButton', function () {
  it('creates a CloseButton', function () {
    var DOM = TestUtils.renderIntoDocument(
      <CloseButton/>);
  });
});