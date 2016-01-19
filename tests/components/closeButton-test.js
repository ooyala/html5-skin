jest.dontMock('../../js/components/closeButton');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var CloseButton = require('../../js/components/closeButton');

describe('CloseButton', function () {
  it('creates a CloseButton', function () {
    var DOM = TestUtils.renderIntoDocument(
      <CloseButton/>);
  });
});