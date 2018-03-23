jest.dontMock('../../../js/components/close-caption-multi-audio-menu/multiAudioTab');
jest.dontMock('../../../js/components/close-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/components/close-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('underscore');
jest.dontMock('iso-639-3');

var _ = require('underscore');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var iso639 = require('iso-639-3');

var CONSTANTS = require('../../../js/constants/constants');
var helpers = require('../../../js/components/close-caption-multi-audio-menu/helpers');

var MultiAudioTab = require('../../../js/components/close-caption-multi-audio-menu/multiAudioTab');
var Tab = require('../../../js/components/close-caption-multi-audio-menu/tab');

describe('MultiAudioTab', function() {
  var props;
  var currentAudioId;

  describe('MultiAudioTab component', function() {
    var selectedId = null;

    var props = {
      list: [
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

    it('should be rendered', function() {
      var DOM = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      var component = TestUtils.findRenderedComponentWithType(DOM, MultiAudioTab);

      expect(component).toBeTruthy();
    });

    it('should render Tab component', function() {
      var tree = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      var component = TestUtils.findRenderedComponentWithType(tree, MultiAudioTab);
      var tab = TestUtils.findRenderedComponentWithType(tree, Tab);

      expect(tab).toBeTruthy();
    });

    it('should render list of languages', function() {
      var tree = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      var items = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'oo-cc-ma-menu__element');
      expect(items.length).toBe(2);
    });
  });
});
