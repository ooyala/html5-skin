jest.dontMock('../../js/views/moreOptionsScreen')
    .dontMock('../../js/components/closeButton')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/mixins/accessibilityMixin')
    .dontMock('../../js/mixins/resizeMixin');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var MoreOptionsScreen = require('../../js/views/moreOptionsScreen');

describe('MoreOptionsScreen', function () {
  it('test more options screen', function () {

    // Render more options screen into DOM
    var DOM = TestUtils.renderIntoDocument(<MoreOptionsScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-btn');
    TestUtils.Simulate.click(closeBtn);
  });
});