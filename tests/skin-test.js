jest.dontMock('../js/skin');

var React = require('react/addons');
var Skin = require('../js/skin');
var TestUtils = React.addons.TestUtils;

describe('Skin', function () {
  it('renders video player screens', function () {

    // Render share panel in document
    var skin = TestUtils.renderIntoDocument(
      <Skin />
    );
  });
});