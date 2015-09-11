jest.dontMock('../../js/views/shareScreen');

describe('ShareScreen', function () {
  it('displays social screen', function () {
    var React = require('react/addons');
    var ShareScreen = require('../../js/views/shareScreen');
    var TestUtils = React.addons.TestUtils;

    // Render share panel in document
    var shareScreen = TestUtils.renderIntoDocument(
      <ShareScreen />
    );

  });
});