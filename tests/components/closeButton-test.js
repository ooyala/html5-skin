jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var CloseButton = require('../../js/components/closeButton');
var CONSTANTS = require('../../js/constants/constants');

describe('CloseButton', function() {

  it('creates a CloseButton', function() {
    var DOM = TestUtils.renderIntoDocument(
      <CloseButton/>);
  });

  it('should render ARIA label on button', function() {
    var DOM = TestUtils.renderIntoDocument(<CloseButton cssClass="oo-close-button"/>);
    var closeButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    expect(closeButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CLOSE);
  });

  it('should render role on button', function() {
    var DOM = TestUtils.renderIntoDocument(<CloseButton cssClass="oo-close-button" role="customRole"/>);
    var closeButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-button');
    expect(closeButton.getAttribute('role')).toBe('customRole');
  });

});
