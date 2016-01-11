jest.dontMock('../../js/views/closedCaptionScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/mixins/resizeMixin');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var ClosedCaptionScreen = require('../../js/views/closedCaptionScreen');

describe('DiscoveryScreen', function () {
  it('test discovery screen', function () {

    // Render share screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'closeBtn');
    TestUtils.Simulate.click(closeBtn);
  });
});