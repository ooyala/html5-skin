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

  var props = {};
  var DOM;

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
    var tab = TestUtils.findRenderedComponentWithType(DOM, Tab);

    expect(tab).toBeTruthy();
  });

  it('should render list of languages', function() {
    var items = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-cc-ma-menu__element');
    expect(items.length).toBe(2);
  });

  describe('when language list contains distinct languages', function() {
    it('should render correct language list', function() {
      props.audioTracksList = [
        { id: '1', lang: 'en', label: 'we' }, 
        { id: '1', lang: 'ger', label: 'wes ' }, 
        { id: '1', lang: 'spa', label: 'weweq' }, 
        { id: '1', lang: 'fra', label: 'weqwfa' }, 
      ];
  
      var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
  
      var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
  
      var itemsTextContent = [].map.call(items, function(item) {
        return item.textContent;
      });

      expect(itemsTextContent).toEqual([ 'English', 'German', 'Spanish', 'French' ]);
    });
  });

  describe('when language list contains duplicate valid Language codes (not "und") with Name attribute', 
    function() {

      describe('and labels are distinct', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: 'we' }, 
            { id: '1', lang: 'en', label: 'wes' }, 
            { id: '1', lang: 'spa', label: 'we' }, 
            { id: '1', lang: 'spa', label: 'wes' }, 
          ];
      
          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      
          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
      
          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });
  
          expect(itemsTextContent).toEqual([ 'English we', 'English wes', 'Spanish we', 'Spanish wes' ]);
        });
      });

      describe('and labels duplicate', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: 'we' }, 
            { id: '1', lang: 'en', label: 'we' }, 
            { id: '1', lang: 'spa', label: 'we' }, 
            { id: '1', lang: 'spa', label: 'we' }, 
          ];
      
          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      
          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
      
          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });
  
          expect(itemsTextContent).toEqual([ 'English we', 'English we 1', 'Spanish we', 'Spanish we 1' ]);
        });
      });
      
      describe('and there\'s no label', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: '' }, 
            { id: '1', lang: 'en', label: '' }, 
            { id: '1', lang: 'spa', label: '' }, 
            { id: '1', lang: 'spa', label: '' }, 
          ];
      
          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      
          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
      
          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });
  
          expect(itemsTextContent).toEqual([ 'English', 'English 1', 'Spanish', 'Spanish 1' ]);
        });
      });
    }
  );

  describe('when language list contains duplicate "und" language code with Name attribute', 
    function() {

      describe('and labels are distinct', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'eng', label: 'we' }, 
            { id: '1', lang: 'ger', label: 'wes' }, 
            { id: '1', lang: 'und', label: 'NAME' }, 
            { id: '1', lang: 'und', label: 'NAME NAME' }, 
          ];
      
          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      
          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
      
          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });
  
          expect(itemsTextContent).toEqual([ 'English', 'German', 'NAME', 'NAME NAME' ]);
        });
      });

      describe('and labels duplicate', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'eng', label: 'we' }, 
            { id: '1', lang: 'ger', label: 'wes' }, 
            { id: '1', lang: 'und', label: 'NAME' }, 
            { id: '1', lang: 'und', label: 'NAME' }, 
          ];
      
          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      
          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
      
          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });
  
          expect(itemsTextContent).toEqual([ 'English', 'German', 'NAME', 'NAME 1' ]);
        });
      });
      
      describe('and there\'s no label', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'und', label: '' }, 
            { id: '1', lang: 'und', label: '' }, 
            { id: '1', lang: 'und', label: '' }, 
            { id: '1', lang: 'und', label: '' }, 
          ];
      
          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
      
          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');
      
          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });
  
          expect(itemsTextContent).toEqual(
            [ 'Undefined language', 'Undefined language 1', 'Undefined language 2', 'Undefined language 3' ]
          );
        });
      });
    }
  );

});
