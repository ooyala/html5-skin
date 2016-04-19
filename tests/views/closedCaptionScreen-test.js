jest.dontMock('../../js/views/closedCaptionScreen')
    .dontMock('../../js/components/closeButton')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/mixins/accessibilityMixin')
    .dontMock('../../js/mixins/resizeMixin');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ClosedCaptionScreen = require('../../js/views/closedCaptionScreen');

describe('ClosedCaptionScreen', function () {
  it('test closed caption screen', function () {

    // Render closed caption screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-btn');
    TestUtils.Simulate.click(closeBtn);
  });
});