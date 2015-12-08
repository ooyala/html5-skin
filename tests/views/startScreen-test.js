jest.dontMock('../../js/views/startScreen');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var StartScreen = require('../../js/views/startScreen');

describe('StartScreen', function () {
  it('test start screen', function () {

    // Render start screen into DOM
    var DOM = TestUtils.renderIntoDocument(<StartScreen />);

    //test play
    var playBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'state-screen-selectable');
    TestUtils.Simulate.click(playBtn);
  });
});