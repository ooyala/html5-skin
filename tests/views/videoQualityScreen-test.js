jest.dontMock('../../js/views/videoQualityScreen');
jest.dontMock('../../js/components/closeButton');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var VideoQualityScreen = require('../../js/views/videoQualityScreen');

describe('VideoQualityScreen', function () {
  it('test bitrate selection screen', function () {

    var mockSkinConfig = {
      icons: {
        quality: {
          fontStyleClass: "quality"
        },
        dismiss: {
          fontStyleClass: "dismiss"
        }
      }
    };

    // Render video quality screen into DOM
    var DOM = TestUtils.renderIntoDocument(<VideoQualityScreen skinConfig={mockSkinConfig}/>);

    //test close btn
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'closeBtn');
    TestUtils.Simulate.click(closeBtn);
  });
});