jest.dontMock('../../js/components/spinner');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Spinner = require('../../js/components/spinner');

describe('Spinner', function () {
  it('tests spinner', function () {

    //Render spinner into DOM
    var DOM = TestUtils.renderIntoDocument(<Spinner />);
  });
});