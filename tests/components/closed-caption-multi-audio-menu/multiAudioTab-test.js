jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('underscore');
jest.dontMock('iso-639-3');

var _ = require('underscore');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var iso639 = require('iso-639-3');

var CONSTANTS = require('../../../js/constants/constants');
var helpers = require('../../../js/components/closed-caption-multi-audio-menu/helpers');

var MultiAudioTab = require('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

describe('MultiAudioTab component', function() {
  var selectedId = null;
  var currentAudioId;

  var props = {}, 
      DOM;

  beforeEach(function() {
    props = {
      audioTracksList: [
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
      ],
      skinConfig: {},

      handleSelect: function(id) {
        selectedId = id;
      }
    };

    DOM = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
  });

  it('should be rendered', function() {
    var component = TestUtils.findRenderedComponentWithType(DOM, MultiAudioTab);

    expect(component).toBeTruthy();
  });

  it('should render Tab component', function() {
    var component = TestUtils.findRenderedComponentWithType(DOM, MultiAudioTab);
    var tab = TestUtils.findRenderedComponentWithType(DOM, Tab);

    expect(tab).toBeTruthy();
  });

  it('should render list of languages', function() {
    var items = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-cc-ma-menu__element');
    expect(items.length).toBe(2);
  });
});
