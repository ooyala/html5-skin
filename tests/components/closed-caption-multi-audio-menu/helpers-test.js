jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/constants/constants');
jest.dontMock('underscore');
jest.dontMock('iso-639-3');

var React = require('react');
var _ = require('underscore');
var TestUtils = require('react-addons-test-utils');
var iso639 = require('iso-639-3');

var CONSTANTS = require('../../../js/constants/constants');
var helpers = require('../../../js/components/closed-caption-multi-audio-menu/helpers');

describe('closed caption & multi-audio helpers', function() {
  describe('getDisplayLanguage function', function() {
    it("should return empty string when can't be matched", function() {
      expect(helpers.getDisplayLanguage()).toEqual('');
      expect(helpers.getDisplayLanguage([], 2)).toEqual('');
      expect(helpers.getDisplayLanguage([], 'w00t')).toEqual('');
      expect(helpers.getDisplayLanguage([], 'und')).toEqual('');
      expect(helpers.getDisplayLanguage([], null)).toEqual('');
    });

    it('should return matched english equivalent', function() {
      expect(helpers.getDisplayLanguage(iso639, 'eng')).toEqual('English');
      expect(helpers.getDisplayLanguage(iso639, 'en')).toEqual('English');
      expect(helpers.getDisplayLanguage(iso639, 'ger')).toEqual('German');
      expect(helpers.getDisplayLanguage(iso639, 'deu')).toEqual('German');
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

    it('should return Undefined language if none of params are provided', function() {
      expect(helpers.getDisplayTitle('', '')).toEqual('Undefined language');
      expect(helpers.getDisplayTitle(null, null)).toEqual('Undefined language');
      expect(helpers.getDisplayTitle(undefined, undefined)).toEqual('Undefined language');
      expect(helpers.getDisplayTitle()).toEqual('Undefined language');
    });
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
          label: 'und 1',
          id: 1,
          enabled: false
        },
        {
          label: 'und 2',
          id: 2,
          enabled: false
        },
        {
          label: 'eng 1',
          id: 3,
          enabled: false
        },
        {
          label: 'eng 2',
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
