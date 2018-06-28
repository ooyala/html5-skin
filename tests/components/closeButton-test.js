jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var CloseButton = require('../../js/components/closeButton');
var CONSTANTS = require('../../js/constants/constants');
var $ = require('jquery');

describe('CloseButton', function() {

  it('creates a CloseButton', function() {
    Enzyme.mount(<CloseButton />);
  });

  it('should render ARIA label on button', function() {
    var wrapper = Enzyme.mount(<CloseButton />);
    var closeButton = wrapper.getDOMNode();
    expect(closeButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.CLOSE);
  });

  it('should render role on button', function() {
    var wrapper = Enzyme.mount(<CloseButton cssClass="oo-close-button-2" role="customRole"/>);
    var closeButton = wrapper.getDOMNode();
    expect(closeButton.getAttribute('role')).toBe('customRole');
    expect($(closeButton).hasClass('oo-close-button-2')).toBe(true);
  });

});
