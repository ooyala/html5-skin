jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/constants/languages');
jest.dontMock('underscore');

var _ = require('underscore');
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ClosedCaptionMultiAudioMenu = require(
  '../../../js/components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu'
);
var MultiAudioTab = require('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

describe('ClosedCaptionMultiAudioMenu component', function() {
  var selectedAudio = null;
  var selectedCaptionsId = null;
  var props = {};
  var DOM;

  beforeEach(function() {
    props = {
      menuClassName: undefined,
      skinConfig: {},
      controller: {
        setCurrentAudio: function(track) {
          selectedAudio = track;
        },
        onClosedCaptionChange: function(id) {
          selectedCaptionsId = id;
        },
        state: {
          closedCaptionOptions: {
            availableLanguages: {
              languages: ['en', 'de', 'fr']
            }
          },
          multiAudio: {
            tracks: [
              {
                enabled: true,
                label: '',
                lang: 'eng',
                id: '1'
              },
              {
                enabled: false,
                label: '',
                lang: 'deu',
                id: '2'
              }
            ]
          }
        }
      }
    };

    DOM = TestUtils.renderIntoDocument(<ClosedCaptionMultiAudioMenu {...props} />);
  });

  afterEach(function() {
    selectedAudio = null;
    selectedCaptionsId = null;
    props = {};
    DOM = null;
  });

  it('should be rendered', function() {
    var component = TestUtils.findRenderedComponentWithType(DOM, ClosedCaptionMultiAudioMenu);
    expect(component).toBeTruthy();
  });

  it('should render MultiAudioTab component', function() {
    var component = TestUtils.findRenderedComponentWithType(DOM, MultiAudioTab);

    expect(component).toBeTruthy();

    var tabComponent = TestUtils.scryRenderedComponentsWithType(DOM, Tab);

    var items = TestUtils.scryRenderedDOMComponentsWithClass(tabComponent[0], 'oo-cc-ma-menu__element');

    TestUtils.Simulate.click(items[0]);

    expect(selectedAudio).toEqual({
      enabled: true,
      label: '',
      lang: 'eng',
      id: '1'
    });
  });

  it('should also render Tab component when options are provided', function() {
    var tabComponent = TestUtils.scryRenderedComponentsWithType(DOM, Tab);

    var items = TestUtils.scryRenderedDOMComponentsWithClass(tabComponent[1], 'oo-cc-ma-menu__element');

    var amount = 3;
    expect(items.length).toBe(amount);
  });

  it('should not render neither tab not multiaudio when there\'s no data', function() {
    var emptyProps = {
      menuClassName: undefined,
      skinConfig: {},
      controller: {
        setCurrentAudio: function(audioTrack) {
          selectedAudio = audioTrack;
        },
        onClosedCaptionChange: function(id) {
          selectedCaptionsId = id;
        },
        state: {}
      }
    };

    var tree = TestUtils.renderIntoDocument(<ClosedCaptionMultiAudioMenu {...emptyProps} />);
    var components = TestUtils.scryRenderedComponentsWithType(tree, Tab);

    expect(components.length).toBe(0);
  });

  it('should not call any callbacks when handlers are not defined', function() {
    var emptyHandlers = {
      menuClassName: undefined,
      skinConfig: {},
      controller: {
        state: {
          closedCaptionOptions: {
            availableLanguages: {
              languages: ['en', 'fr']
            }
          }
        }
      }
    };

    var tree = TestUtils.renderIntoDocument(<ClosedCaptionMultiAudioMenu {...emptyHandlers} />);
    var component = TestUtils.findRenderedComponentWithType(tree, Tab);

    var items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'oo-cc-ma-menu__element');

    TestUtils.Simulate.click(items[0]);

    expect(selectedAudio).toEqual(null);
  });
});
