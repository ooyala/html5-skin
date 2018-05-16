jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('../../../js/constants/languages');
jest.dontMock('underscore');
jest.dontMock('../../../js/components/utils');

var React = require('react');
var TestUtils = require('react-addons-test-utils');

var MultiAudioTab = require('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

describe('MultiAudioTab component', function() {
  var selectedId = null;

  var props = {};
  var DOM;
  var language = 'en';
  var localizableStrings = {
    'en': {
      'No linguistic content' : 'No linguistic content',
      'Undefined language' : 'Undefined language'
    },
    'es': {
      'No linguistic content' : 'Contenido no lingüístico',
      'Undefined language' : 'Lenguaje indefinido'
    },
  };

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
        { id: '2', lang: 'ger', label: 'wes ' },
        { id: '3', lang: 'spa', label: 'weweq' },
        { id: '4', lang: 'fra', label: 'weqwfa' },
      ];
  
      var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);
  
      var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

      var itemsTextContent = [].map.call(items, function(item) {
        return item.textContent;
      });

      expect(itemsTextContent).toEqual([ 'English', 'Deutsch', 'Español', 'Français' ]);
    });
  });

  describe('when language list contains duplicate valid Language codes (not "und") with Name attribute',
    function() {
      describe('and labels are distinct', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: 'we' },
            { id: '2', lang: 'en', label: 'wes' },
            { id: '3', lang: 'spa', label: 'we' },
            { id: '4', lang: 'spa', label: 'wes' },
          ];

          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual([ 'English we', 'English wes', 'Español we', 'Español wes' ]);
        });
      });

      describe('and labels duplicate', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: 'we' },
            { id: '2', lang: 'en', label: 'we' },
            { id: '3', lang: 'spa', label: 'we' },
            { id: '4', lang: 'spa', label: 'we' },
          ];

          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual([ 'English we', 'English we 1', 'Español we', 'Español we 1' ]);
        });
      });

      describe('and there\'s no label', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: '' },
            { id: '2', lang: 'en', label: '' },
            { id: '3', lang: 'spa', label: '' },
            { id: '4', lang: 'spa', label: '' },
          ];

          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual([ 'English', 'English 1', 'Español', 'Español 1' ]);
        });
      });

      describe('and there\'s zxx as a lang', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: '' },
            { id: '2', lang: 'spa', label: '' },
            { id: '3', lang: 'zxx', label: '' },
          ];
          var NO_LINGUISTIC_CONTENT = 'No linguistic content';
          var language = 'es';

          var multiAudioTab = TestUtils.renderIntoDocument(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
            />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual(
            [ 'English', 'Español', localizableStrings[language][NO_LINGUISTIC_CONTENT] ]
          );
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
            { id: '2', lang: 'ger', label: 'wes' },
            { id: '3', lang: 'und', label: 'NAME' },
            { id: '4', lang: 'und', label: 'NAME NAME' },
          ];

          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual([ 'English', 'Deutsch', 'NAME', 'NAME NAME' ]);
        });
      });

      describe('and labels duplicate', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'eng', label: 'we' },
            { id: '2', lang: 'ger', label: 'wes' },
            { id: '3', lang: 'und', label: 'NAME' },
            { id: '4', lang: 'und', label: 'NAME' },
          ];

          var multiAudioTab = TestUtils.renderIntoDocument(<MultiAudioTab {...props} />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual([ 'English', 'Deutsch', 'NAME', 'NAME 1' ]);
        });
      });

      describe('and there\'s no label', function() {

        var undAudioTracksList = [
          { id: '1', lang: 'und', label: '' },
          { id: '2', lang: 'und', label: '' },
          { id: '3', lang: 'und', label: '' },
          { id: '4', lang: 'und', label: '' },
        ];

        it('should render correct language list when user language is en', function() {
          props.audioTracksList = undAudioTracksList;

          var multiAudioTab = TestUtils.renderIntoDocument(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
            />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual(
            [ 'Undefined language', 'Undefined language 1', 'Undefined language 2', 'Undefined language 3' ]
          );
        });

        it('should render correct language list when user language is unknown', function() {
          props.audioTracksList = undAudioTracksList;
          var language = undefined;
          var multiAudioTab = TestUtils.renderIntoDocument(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
            />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual(
            [ 'Undefined language', 'Undefined language 1', 'Undefined language 2', 'Undefined language 3' ]
          );
        });

        it('should render correct language list when user language is es', function() {
          props.audioTracksList = undAudioTracksList;
          var language='es';
          var multiAudioTab = TestUtils.renderIntoDocument(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
            />);

          var items = TestUtils.scryRenderedDOMComponentsWithClass(multiAudioTab, 'oo-cc-ma-menu__element');

          var itemsTextContent = [].map.call(items, function(item) {
            return item.textContent;
          });

          expect(itemsTextContent).toEqual(
            ['Lenguaje indefinido', 'Lenguaje indefinido 1', 'Lenguaje indefinido 2', 'Lenguaje indefinido 3']
          );
        });
      });
    }
  );

});
