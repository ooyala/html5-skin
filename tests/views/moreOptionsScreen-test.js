jest.dontMock('../../js/views/moreOptionsScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/mixins/resizeMixin');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var MoreOptionsScreen = require('../../js/views/moreOptionsScreen');

describe('MoreOptionsScreen', function () {
  it('test more options screen', function () {

    // Render more options screen into DOM
    var DOM = TestUtils.renderIntoDocument(<MoreOptionsScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'closeBtn');
    TestUtils.Simulate.click(closeBtn);
  });
});