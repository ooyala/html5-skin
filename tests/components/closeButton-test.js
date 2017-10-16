jest.dontMock('../../js/components/closeButton');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var CloseButton = require('../../js/components/closeButton');
var CONSTANTS = require('../../js/constants/constants');

describe('CloseButton', function () {

  it('creates a CloseButton', function () {
    var DOM = TestUtils.renderIntoDocument(
      <CloseButton/>);
  });

  it('should render ARIA label on button', function() {
    var DOM = TestUtils.renderIntoDocument(<CloseButton cssClass="oo-close-button"/>);
    var closeButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    expect(closeButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CLOSE);
  });

});
