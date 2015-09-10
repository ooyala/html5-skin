jest.dontMock('../js/skin');

describe('Skin', function () {
  it('renders video player screens', function () {
    var React = require('react/addons');
    var Skin = require('../js/skin');
    var TestUtils = React.addons.TestUtils;

    // Render share panel in document
    var skin = TestUtils.renderIntoDocument(
      <Skin />
    );

  });
});