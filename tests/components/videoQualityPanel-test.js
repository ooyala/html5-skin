jest.dontMock('../../js/components/videoQualityPanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var CONSTANTS = require('../../js/constants/constants');
var VideoQualityPanel = require('../../js/components/videoQualityPanel');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');

// start unit test
describe('VideoQualityPanel', function () {
  var selectedBitrate = null;

  var mockController = {
    state: {
      isMobile: false,
      volumeState: {
        volume: 1
      },
      closedCaptionOptions: {availableLanguages: true}
    },
    sendVideoQualityChangeEvent: function(selectedData){
      selectedBitrate = selectedData;
    }
  };

  var availableBitrates = [{"id":"720p 1500kbps", "bitrate":1558322, "label": "720p"}, {"id":"480p 500kbps", "bitrate":520929, "label": "480p"}, {"id":"360p 358kbps", "bitrate":358157, "label": "360p"}, {"id":"240p 258kbps", "bitrate":258157, "label": "240p"}, {"id":"144p 144kbps", "bitrate":144157, "label": "144p"}]
  var mockProps = {
    controller: mockController,
    videoQualityOptions: {
      availableBitrates: availableBitrates,
      selectedBitrate: null
    }
  };

  it('creates video quality panel', function () {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn');
    expect(bitrateItems.length).toBe(6);

    for (i=1; i<bitrateItems.length; i++){
      var itemText = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn')[i].getDOMNode().textContent;
      expect(itemText).toEqual(availableBitrates[i-1].label);
    }
  });

  it('selects item from video quality panel', function () {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].getDOMNode().textContent).toBe('Auto');

    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn');
    expect(bitrateItems.length).toBe(6);

    for (i=1; i<bitrateItems.length; i++){
      var newBitrate = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn')[i];
      TestUtils.Simulate.click(newBitrate);
      expect(selectedBitrate.id).toBe(availableBitrates[i-1].id);
    }
  });

  it('checks selected item is still there', function () {
    var mockProps = {
      controller: mockController,
      videoQualityOptions: {
        availableBitrates: availableBitrates,
        selectedBitrate: availableBitrates[0]
      }
    }
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].getDOMNode().textContent).toBe(availableBitrates[0].label);
  });
});