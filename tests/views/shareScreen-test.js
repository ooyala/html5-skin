jest.dontMock('../../js/views/shareScreen');

var React = require('react/addons');
var ShareScreen = require('../../js/views/shareScreen');
var TestUtils = React.addons.TestUtils;

describe('ShareScreen', function () {
  it('displays social screen', function () {

    // Render share panel in document
    var shareScreen = TestUtils.renderIntoDocument(
      <ShareScreen />
    );
  });
});