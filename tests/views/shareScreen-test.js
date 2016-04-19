jest.dontMock('../../js/views/shareScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/mixins/accessibilityMixin');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ShareScreen = require('../../js/views/shareScreen');

describe('ShareScreen', function () {
  it('test share screen', function () {

    // Render share screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ShareScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-btn');
    TestUtils.Simulate.click(closeBtn);
  });
});