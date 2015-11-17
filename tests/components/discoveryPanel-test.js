jest.dontMock('../../js/components/discoveryPanel');

var React = require('react/addons');
var DiscoveryPanel = require('../../js/components/discoveryPanel');
var TestUtils = React.addons.TestUtils;

describe('DiscoveryPanel', function () {
  it('displays discovery panel in discovery screen', function () {

    // Render discovery panel into DOM
    var DOM = TestUtils.renderIntoDocument(
      <DiscoveryPanel />
    );
  });
});