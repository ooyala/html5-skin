jest.dontMock('../../../js/components/multi-audio/multiAudioPopover');
jest.dontMock('../../../js/components/closeButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var MultiAudioPopover = require('../../../js/components/multi-audio/multiAudioPopover');
var CONSTANTS = require('../../../js/constants/constants');

describe('MultiAudioPopover', function () {
  var props;
  var currentAudioId;

  beforeEach(function() {
    currentAudioId = "";
    props = {
      togglePopoverAction: function() {},
      multiAudioOptions: {
        enabled: false
      },
      skinConfig: {
        buttons: {
          desktopContent: [{"name":"multiAudio", "location": "controlBar", "whenDoesNotFit":"keep", "minWidth":45 }]
        }
      },
      controller: {
        state: {
          focusedControl: null,
          multiAudioOptions: {},
          multiAudio: {"tracks": [{id: "0", enabled: false}, {id: "1", enabled: true}]}
        },
        toggleScreen: function() {},
        setCurrentAudio: function(id) {
          currentAudioId = id;
        }
      }
    };
  });

  it('should render a MultiAudioPopover', function () {
    var DOM = TestUtils.renderIntoDocument(<MultiAudioPopover {...props}/>);
  });

  it('should call setCurrentAudio', function () {
    var DOM = TestUtils.renderIntoDocument(<MultiAudioPopover {...props}/>);
    var audio = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-multiaudio-element');
    TestUtils.Simulate.click(audio[0]);
    expect(currentAudioId).toBe("0");
  });

});
