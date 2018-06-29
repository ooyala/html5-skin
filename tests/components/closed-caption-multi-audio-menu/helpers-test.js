jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('../../../js/constants/languages');
jest.dontMock('../../../js/components/utils');
jest.dontMock('underscore');

var React = require('react');
var _ = require('underscore');
var Enzyme = require('enzyme');

var LANGUAGE_CONSTANTS = require('../../../js/constants/languages');
var helpers = require('../../../js/components/closed-caption-multi-audio-menu/helpers');

describe('closed caption & multi-audio helpers', function() {
  describe('getDisplayLanguage function', function() {
    it('should return empty string when can\'t be matched', function() {
      expect(helpers.getDisplayLanguage()).toEqual('');
      expect(helpers.getDisplayLanguage([], 2)).toEqual('');
      expect(helpers.getDisplayLanguage([], 'w00t')).toEqual('');
      expect(helpers.getDisplayLanguage([], 'und')).toEqual('');
      expect(helpers.getDisplayLanguage([], null)).toEqual('');
    });

    it('should return matched english equivalent', function() {
      expect(helpers.getDisplayLanguage(LANGUAGE_CONSTANTS, 'eng')).toEqual('English');
      expect(helpers.getDisplayLanguage(LANGUAGE_CONSTANTS, 'en')).toEqual('English');
      expect(helpers.getDisplayLanguage(LANGUAGE_CONSTANTS, 'ger')).toEqual('Deutsch');
      expect(helpers.getDisplayLanguage(LANGUAGE_CONSTANTS, 'deu')).toEqual('Deutsch');
    });
  });

  describe('getDisplayLabel function', function() {
    it('should return label when label is present', function() {
      expect(helpers.getDisplayLabel({ label: 'sas' })).toEqual('sas');
    });

    it('should return empty string when label is not present', function() {
      expect(helpers.getDisplayLabel({})).toEqual('');
      expect(helpers.getDisplayLabel(null)).toEqual('');
      expect(helpers.getDisplayLabel()).toEqual('');
      expect(helpers.getDisplayLabel(1)).toEqual('');
    });

    it('should return empty string when label and lang are equal', function() {
      var audioTrack = {
        label: 'eng',
        lang: 'eng'
      };

      expect(helpers.getDisplayLabel(audioTrack)).toEqual('');
    });
  });

  describe('getDisplayTitle function', function() {
    it('should return title from language and label', function() {
      expect(helpers.getDisplayTitle({language: 'English', label: 'with Commentary'})).toEqual('English with Commentary');
    });

    it('should return title from just language', function() {
      expect(helpers.getDisplayTitle({language: 'English', label: ''})).toEqual('English');
      expect(helpers.getDisplayTitle({language: 'English', label: null})).toEqual('English');
      expect(helpers.getDisplayTitle({language: 'English', label: undefined})).toEqual('English');
    });

    it('should return title from just label', function() {
      expect(helpers.getDisplayTitle({language: '', label: 'with Commentary'})).toEqual('with Commentary');
      expect(helpers.getDisplayTitle({language: null, label: 'with Commentary'})).toEqual('with Commentary');
      expect(helpers.getDisplayTitle({language: undefined, label: 'with Commentary'})).toEqual('with Commentary');
      expect(helpers.getDisplayTitle({language: undefined, label: 'with Commentary'})).toEqual('with Commentary');
    });

    it('should return value for noLanguageText if none of params are provided', function() {
      expect(helpers.getDisplayTitle({language: '', label: ''})).toEqual('Undefined language');
      expect(helpers.getDisplayTitle({language: null, label: null})).toEqual('Undefined language');
      expect(helpers.getDisplayTitle({language: undefined, label: undefined})).toEqual('Undefined language');
      expect(helpers.getDisplayTitle({})).toEqual('Undefined language');
      expect(helpers.getDisplayTitle({language: '', label: '', noLanguageText: 'Unknown track'})).toEqual('Unknown track');
    });

    it('should return Undefined language or label if langCode is und', function() {
      expect(helpers.getDisplayTitle({language: 'Undefined language', label: 'Test label', langCode: 'und'})).toEqual('Test label');
      expect(helpers.getDisplayTitle({language: 'Undefined language', label: '', langCode: 'und'})).toEqual('Undefined language');
    });
  });

  describe('getLocalizedSpecialLanguage function', function() {
    var localizableStrings = {
      en: {
        'Undefined language': 'Undefined language',
        'No linguistic content': 'No linguistic content'
      },
      es: {
        'Undefined language': 'Lenguaje indefinido',
        'No linguistic content': 'Contenido no lingüístico'
      }
    };
    var languageMap = {
      'mis': 'Uncoded languages',
      'und': 'Undefined language',
      'mul': 'Multiple languages',
      'zxx': 'No linguistic content'
    };
    it('should returns correct values', function() {
      expect(helpers.getLocalizedSpecialLanguage('zxx', 'en', localizableStrings, languageMap))
        .toEqual('No linguistic content');
      expect(helpers.getLocalizedSpecialLanguage('zxx', 'es', localizableStrings, languageMap))
        .toEqual('Contenido no lingüístico');
      expect(helpers.getLocalizedSpecialLanguage('mul', 'en', localizableStrings, languageMap))
        .toEqual('Multiple languages');
      expect(helpers.getLocalizedSpecialLanguage('und', 'en', localizableStrings, languageMap))
        .toEqual('Undefined language');
      expect(helpers.getLocalizedSpecialLanguage('mis', 'en', localizableStrings, languageMap))
        .toEqual('Uncoded languages');
      expect(helpers.getLocalizedSpecialLanguage('other-one', 'en', localizableStrings)).toEqual('');
      expect(helpers.getLocalizedSpecialLanguage('other-one', 'en', '', languageMap)).toEqual('');
      expect(helpers.getLocalizedSpecialLanguage('other-one', 'en')).toEqual('');
      expect(helpers.getLocalizedSpecialLanguage('other-one', 'en', null)).toEqual('');
      expect(helpers.getLocalizedSpecialLanguage('other-one', null, languageMap)).toEqual('');
      expect(helpers.getLocalizedSpecialLanguage(undefined, null, '', '')).toEqual('');
    });
  });

  describe('isSpecialLanguage function', function() {
    var languageMap = {
      'mis': 'Uncoded languages',
      'und': 'Undefined language',
      'mul': 'Multiple languages',
      'zxx': 'No linguistic content'
    };
    it('should returns correct values', function() {
      expect(helpers.isSpecialLanguage('zxx', languageMap)).toBe(true);
      expect(helpers.isSpecialLanguage('mis', languageMap)).toBe(true);
      expect(helpers.isSpecialLanguage('mul', languageMap)).toBe(true);
      expect(helpers.isSpecialLanguage('und', languageMap)).toBe(true);
      expect(helpers.isSpecialLanguage('other-one', languageMap)).toBe(false);
      expect(helpers.isSpecialLanguage()).toBe(false);
    });
  });

  describe('transform tracks list function', function() {
    it('should return tracks list without labels if tracks are distinct', function() {
      var tracksList = [
        { id: 1, language: 'English', label: 'discard this', enabled: true },
        { id: 2, language: 'German', label: 'discard this', enabled: false },
        { id: 3, language: 'Spanish', label: 'discard this', enabled: false },
        { id: 4, language: 'Russian', label: 'discard this', enabled: false }
      ];

      var expectedTracksList = [
        { id: 1, label: 'English', enabled: true },
        { id: 2, label: 'German', enabled: false },
        { id: 3, label: 'Spanish', enabled: false },
        { id: 4, label: 'Russian', enabled: false }
      ];

      var transformedTracksList = helpers.transformTracksList(tracksList);

      expect(transformedTracksList).toEqual(expectedTracksList);
    });

    it('should return tracks list with labels if tracks are not distinct', function() {
      var tracksList = [
        { id: 1, language: 'English', label: 'discard this', enabled: true },
        { id: 2, language: 'English', label: 'discard this', enabled: false },
        { id: 3, language: 'Spanish', label: 'discard this', enabled: false },
        { id: 4, language: 'Spanish', label: 'discard this', enabled: false }
      ];

      var expectedTracksList = [
        { id: 1, label: 'English discard this', enabled: true },
        { id: 2, label: 'English discard this', enabled: false },
        { id: 3, label: 'Spanish discard this', enabled: false },
        { id: 4, label: 'Spanish discard this', enabled: false }
      ];

      var transformedTracksList = helpers.transformTracksList(tracksList);

      expect(transformedTracksList).toEqual(expectedTracksList);
    });

    it('should return tracks list with labels it tracks are not distinct and contain undefined language', 
      function() {
        var tracksList = [
          { id: 1, language: 'English', label: 'discard this', enabled: true },
          { id: 2, language: 'Spanish', label: 'discard this', enabled: false },
          { id: 3, language: '', label: 'discard this', enabled: false },
          { id: 4, language: '', label: 'discard this', enabled: false }
        ];

        var expectedTracksList = [
          { id: 1, label: 'English', enabled: true },
          { id: 2, label: 'Spanish', enabled: false },
          { id: 3, label: 'discard this', enabled: false },
          { id: 4, label: 'discard this', enabled: false }
        ];

        var transformedTracksList = helpers.transformTracksList(tracksList);

        expect(transformedTracksList).toEqual(expectedTracksList);
      }
    );

    it('should return tracks list with labels it tracks are not distinct and contain undefined language', 
      function() {
        var tracksList = [
          { id: 1, language: 'English', label: 'discard this', enabled: true },
          { id: 2, language: 'Spanish', label: 'discard this', enabled: false },
          { id: 3, language: '', label: '', enabled: false },
          { id: 4, language: '', label: '', enabled: false }
        ];

        var expectedTracksList = [
          { id: 1, label: 'English', enabled: true },
          { id: 2, label: 'Spanish', enabled: false },
          { id: 3, label: 'Undefined language', enabled: false },
          { id: 4, label: 'Undefined language', enabled: false }
        ];

        var transformedTracksList = helpers.transformTracksList(tracksList);

        expect(transformedTracksList).toEqual(expectedTracksList);
      }
    );
    
    it('should return tracks list with labels it tracks are not distinct and contain undefined language', 
      function() {
        var tracksList = [
          { id: 1, language: 'English', label: 'discard this', enabled: true },
          { id: 2, language: 'Spanish', label: 'discard this', enabled: false },
          { id: 3, language: '', label: 'discard this', enabled: false },
          { id: 4, language: '', label: '', enabled: false }
        ];

        var expectedTracksList = [
          { id: 1, label: 'English', enabled: true },
          { id: 2, label: 'Spanish', enabled: false },
          { id: 3, label: 'discard this', enabled: false },
          { id: 4, label: 'Undefined language', enabled: false }
        ];

        var transformedTracksList = helpers.transformTracksList(tracksList);

        expect(transformedTracksList).toEqual(expectedTracksList);
      }
    );

    it('should return tracks list with labels it tracks are not distinct and contain undefined language', 
      function() {
        var tracksList = [
          { id: 1, language: 'English', label: 'discard this', enabled: true },
          { id: 2, language: 'Spanish', label: 'discard this', enabled: false },
          { id: 3, language: '', label: 'discard this', enabled: false },
          { id: 4, language: '', label: '', enabled: false },
          { id: 4, language: '', label: '', enabled: false },
        ];

        var expectedTracksList = [
          { id: 1, label: 'English', enabled: true },
          { id: 2, label: 'Spanish', enabled: false },
          { id: 3, label: 'discard this', enabled: false },
          { id: 4, label: 'Undefined language', enabled: false },
          { id: 4, label: 'Undefined language', enabled: false }
        ];

        var transformedTracksList = helpers.transformTracksList(tracksList);

        expect(transformedTracksList).toEqual(expectedTracksList);
      }
    );
  });

  describe('getUniqueTracks function', function() {
    it('should return tracks with unique names', function() {
      var tracks = [
        {
          label: 'und',
          id: 1,
          enabled: false
        },
        {
          label: 'und',
          id: 2,
          enabled: false
        },
        {
          label: 'eng',
          id: 3,
          enabled: false
        },
        {
          label: 'eng',
          id: 4,
          enabled: false
        },
        {
          label: 'ger',
          id: 5,
          enabled: false
        }
      ];

      var expectedTracks = [
        {
          label: 'und',
          id: 1,
          enabled: false
        },
        {
          label: 'und 1',
          id: 2,
          enabled: false
        },
        {
          label: 'eng',
          id: 3,
          enabled: false
        },
        {
          label: 'eng 1',
          id: 4,
          enabled: false
        },
        {
          label: 'ger',
          id: 5,
          enabled: false
        }
      ];

      expect(helpers.getUniqueTracks(tracks)).toEqual(expectedTracks);
    });

    it('should return not modify tracks with unique names', function() {
      var tracks = [
        {
          label: 'English',
          id: 1,
          enabled: false
        },
        {
          label: 'German',
          id: 2,
          enabled: true
        }
      ];

      expect(helpers.getUniqueTracks(tracks)).toEqual(tracks);
    });

    it('should return empty array when provided faulty data', function() {
      expect(helpers.getUniqueTracks()).toEqual([]);
      expect(helpers.getUniqueTracks(null)).toEqual([]);
      expect(helpers.getUniqueTracks(undefined)).toEqual([]);
      expect(helpers.getUniqueTracks(1)).toEqual([]);
      expect(helpers.getUniqueTracks('123456')).toEqual([]);
    });
  });
});
