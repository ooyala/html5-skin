jest.dontMock('../../js/components/spinner');

var React = require('react');
var Enzyme = require('enzyme');
var Spinner = require('../../js/components/spinner');

describe('Spinner', function() {
  it('tests spinner', function() {

    // Render spinner into DOM
    var wrapper = Enzyme.mount(<Spinner />);
  });
});