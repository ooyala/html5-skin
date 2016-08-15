jest.dontMock('../../src/js/views/contentScreen');
jest.dontMock('../../src/js/components/closeButton');
jest.dontMock('../../src/js/mixins/accessibilityMixin');
jest.dontMock('../../src/js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ContentScreen = require('../../src/js/views/contentScreen');

describe('ContentScreen', function () {
  it('test content screen', function () {

    // Render content screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ContentScreen />);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    TestUtils.Simulate.click(closeBtn);
  });
});