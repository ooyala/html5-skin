jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('../../../js/constants/languages');
jest.dontMock('underscore');

var React = require('react');
var _ = require('underscore');
var TestUtils = require('react-addons-test-utils');

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
      expect(helpers.getDisplayTitle('English', 'with Commentary')).toEqual('English with Commentary');
    });

    it('should return title from just language', function() {
      expect(helpers.getDisplayTitle('English', '')).toEqual('English');
      expect(helpers.getDisplayTitle('English', null)).toEqual('English');
      expect(helpers.getDisplayTitle('English', undefined)).toEqual('English');
    });

    it('should return title from just label', function() {
      expect(helpers.getDisplayTitle('', 'with Commentary')).toEqual('with Commentary');
      expect(helpers.getDisplayTitle(null, 'with Commentary')).toEqual('with Commentary');
      expect(helpers.getDisplayTitle(undefined, 'with Commentary')).toEqual('with Commentary');
      expect(helpers.getDisplayTitle(undefined, 'with Commentary')).toEqual('with Commentary');
    });

    it('should return value for noLanguageText if none of params are provided', function() {
      expect(helpers.getDisplayTitle('', '')).toEqual('Undefined language');
      expect(helpers.getDisplayTitle(null, null)).toEqual('Undefined language');
      expect(helpers.getDisplayTitle(undefined, undefined)).toEqual('Undefined language');
      expect(helpers.getDisplayTitle()).toEqual('Undefined language');
      expect(helpers.getDisplayTitle('', '', 'Unknown track')).toEqual('Unknown track');
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
