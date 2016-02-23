jest.dontMock('../../js/views/closedCaptionScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/mixins/resizeMixin');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ClosedCaptionScreen = require('../../js/views/closedCaptionScreen');

describe('ClosedCaptionScreen', function () {
  it('test closed caption screen', function () {

    // Render closed caption screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'closeBtn');
    TestUtils.Simulate.click(closeBtn);
  });
});