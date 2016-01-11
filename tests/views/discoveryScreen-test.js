jest.dontMock('../../js/views/discoveryScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var DiscoveryScreen = require('../../js/views/discoveryScreen');

describe('DiscoveryScreen', function () {
  it('test discovery screen', function () {

    // Render discovery screen into DOM
    var DOM = TestUtils.renderIntoDocument(<DiscoveryScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'closeBtn');
    TestUtils.Simulate.click(closeBtn);
  });
});