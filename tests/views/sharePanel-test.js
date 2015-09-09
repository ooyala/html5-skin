jest.dontMock('../../js/components/sharePanel');

describe('SharePanel', function () {
  it('displays social screen after click', function () {
    var React = require('react/addons');
    var SharePanel = require('../../js/components/sharePanel');
    var TestUtils = React.addons.TestUtils;

    // Render share panel in document
    var sharePanel = TestUtils.renderIntoDocument(
      <SharePanel />
    );

  });
});