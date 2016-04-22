jest.dontMock('../../js/views/videoQualityScreen');
jest.dontMock('../../js/components/closeButton');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
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
    var closeBtn = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-close-btn');
    TestUtils.Simulate.click(closeBtn);
  });
});