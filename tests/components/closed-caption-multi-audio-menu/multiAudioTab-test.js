jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('underscore');
jest.dontMock('../../../js/components/utils');

var React = require('react');
var Enzyme = require('enzyme');

var MultiAudioTab = require('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');

const LANGUAGE_LIST = [{
  '1': 'en',
  '3': 'eng',
  'name': 'English',
  '2B': 'eng',
  '2T': '',
  'local': 'English'
},{
  '1': 'de',
  '3': 'deu',
  'name': 'German',
  '2B': 'ger',
  '2T': 'deu',
  'local': 'Deutsch'
}, {
  '1': 'es',
  '3': 'spa',
  'name': 'Spanish',
  '2B': 'spa',
  '2T': '',
  'local': 'Español'
}, {
  '1': 'fr',
  '3': 'fra',
  'name': 'French',
  '2B': 'fre',
  '2T': 'fra',
  'local': 'Français'
}];

describe('MultiAudioTab component', function() {
  var selectedId = null;

  var props = {};
  var wrapper;
  var language = 'en';
  var localizableStrings = {
    'en': {
      'No linguistic content' : 'No linguistic content',
      'Undefined language' : 'Undefined language'
    },
    'es': {
      'No linguistic content' : 'Contenido no lingüístico',
      'Undefined language' : 'Lenguaje indefinido'
    }
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
      },

      languageList: LANGUAGE_LIST
    };

    wrapper = Enzyme.mount(<MultiAudioTab {...props} header=""/>);
  });

  it('should be rendered', function() {
    var component = wrapper.find(MultiAudioTab);

    expect(component).toBeTruthy();
  });

  it('should render Tab component', function() {
    var tab = wrapper.find(Tab);

    expect(tab).toBeTruthy();
  });

  it('should render list of languages', function() {
    var items = wrapper.find('.oo-cc-ma-menu__element');
    expect(items.length).toBe(2);
  });

  describe('when language list contains distinct languages', function() {
    it('should render correct language list', function() {
      props.audioTracksList = [
        { id: '1', lang: 'en', label: 'we', enabled: false },
        { id: '2', lang: 'ger', label: 'wes ', enabled: false },
        { id: '3', lang: 'spa', label: 'weweq', enabled: false },
        { id: '4', lang: 'fra', label: 'weqwfa', enabled: false }
      ];

      var multiAudioTab = Enzyme.mount(<MultiAudioTab {...props} header=""/>);

      var items = multiAudioTab.find('.oo-cc-ma-menu__element');

      var itemsTextContent = [];
      for(var i = 0; i < items.length; i++) {
        var item = items.at(i).getDOMNode();
        itemsTextContent.push(item.textContent);
      }

      expect(itemsTextContent).toEqual([ 'English', 'Deutsch', 'Español', 'Français' ]);
    });
  });

  describe('when language list contains duplicate valid Language codes (not "und") with Name attribute',
    function() {
      describe('and labels are distinct', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: 'we', enabled: false },
            { id: '2', lang: 'en', label: 'wes', enabled: false },
            { id: '3', lang: 'spa', label: 'we', enabled: false },
            { id: '4', lang: 'spa', label: 'wes', enabled: false }
          ];

          var multiAudioTab = Enzyme.mount(<MultiAudioTab {...props} header=""/>);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual([ 'English we', 'English wes', 'Español we', 'Español wes' ]);
        });
      });

      describe('and labels duplicate', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: 'we', enabled: false },
            { id: '2', lang: 'en', label: 'we', enabled: false },
            { id: '3', lang: 'spa', label: 'we', enabled: false },
            { id: '4', lang: 'spa', label: 'we', enabled: false }
          ];

          var multiAudioTab = Enzyme.mount(<MultiAudioTab {...props} header=""/>);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual([ 'English we', 'English we 1', 'Español we', 'Español we 1' ]);
        });
      });

      describe('and there\'s no label', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: '', enabled: false },
            { id: '2', lang: 'en', label: '', enabled: false },
            { id: '3', lang: 'spa', label: '', enabled: false },
            { id: '4', lang: 'spa', label: '', enabled: false }
          ];

          var multiAudioTab = Enzyme.mount(<MultiAudioTab {...props} header=""/>);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual([ 'English', 'English 1', 'Español', 'Español 1' ]);
        });
      });

      describe('and there\'s zxx as a lang', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'en', label: '', enabled: false },
            { id: '2', lang: 'spa', label: '', enabled: false },
            { id: '3', lang: 'zxx', label: '', enabled: false }
          ];
          var NO_LINGUISTIC_CONTENT = 'No linguistic content';
          var language = 'es';

          var multiAudioTab = Enzyme.mount(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
              header=""
            />);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

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
            { id: '1', lang: 'eng', label: 'we', enabled: false },
            { id: '2', lang: 'ger', label: 'wes', enabled: false },
            { id: '3', lang: 'und', label: 'NAME', enabled: false },
            { id: '4', lang: 'und', label: 'NAME NAME', enabled: false }
          ];

          var multiAudioTab = Enzyme.mount(<MultiAudioTab {...props} header=""/>);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual([ 'English', 'Deutsch', 'NAME', 'NAME NAME' ]);
        });
      });

      describe('and labels duplicate', function() {
        it('should render correct language list', function() {
          props.audioTracksList = [
            { id: '1', lang: 'eng', label: 'we', enabled: false },
            { id: '2', lang: 'ger', label: 'wes', enabled: false },
            { id: '3', lang: 'und', label: 'NAME', enabled: false },
            { id: '4', lang: 'und', label: 'NAME', enabled: false }
          ];

          var multiAudioTab = Enzyme.mount(<MultiAudioTab {...props} header=""/>);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual([ 'English', 'Deutsch', 'NAME', 'NAME 1' ]);
        });
      });

      describe('and there\'s no label', function() {

        var undAudioTracksList = [
          { id: '1', lang: 'und', label: '', enabled: false },
          { id: '2', lang: 'und', label: '', enabled: false },
          { id: '3', lang: 'und', label: '', enabled: false },
          { id: '4', lang: 'und', label: '', enabled: false }
        ];

        it('should render correct language list when user language is en', function() {
          props.audioTracksList = undAudioTracksList;

          var multiAudioTab = Enzyme.mount(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
              header=""
            />);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual(
            [ 'Undefined language', 'Undefined language 1', 'Undefined language 2', 'Undefined language 3' ]
          );
        });

        it('should render correct language list when user language is unknown', function() {
          props.audioTracksList = undAudioTracksList;
          var language = undefined;
          var multiAudioTab = Enzyme.mount(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
              header=""
            />);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual(
            [ 'Undefined language', 'Undefined language 1', 'Undefined language 2', 'Undefined language 3' ]
          );
        });

        it('should render correct language list when user language is es', function() {
          props.audioTracksList = undAudioTracksList;
          var language='es';
          var multiAudioTab = Enzyme.mount(
            <MultiAudioTab
              {...props}
              language={language}
              localizableStrings={localizableStrings}
              header=""
            />);

          var items = multiAudioTab.find('.oo-cc-ma-menu__element');

          var itemsTextContent = [];
          for(var i = 0; i < items.length; i++) {
            var item = items.at(i).getDOMNode();
            itemsTextContent.push(item.textContent);
          }

          expect(itemsTextContent).toEqual(
            ['Lenguaje indefinido', 'Lenguaje indefinido 1', 'Lenguaje indefinido 2', 'Lenguaje indefinido 3']
          );
        });
      });
    }
  );

});
