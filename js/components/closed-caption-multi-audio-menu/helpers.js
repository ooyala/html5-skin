var CONSTANTS = require('../../constants/constants');
var _ = require('underscore');


/**
 * Gets display label by checking
 * roles - e.g. nullable field from DASH manifest
 * and labels - e.g. non-nullable field from HSL manifest
 * @function getDisplayLabel
 * @param {Object} audioTrack - AudioTrack object
 * @returns {String} displayLabel - readable display label
 */
function getDisplayLabel(audioTrack) {
  var displayLabel = '';

  if (audioTrack && audioTrack.label) {
    // special case for DASH where label is per default equal to lang
    var isLabelNeeded = audioTrack.lang !== audioTrack.label;

    if (isLabelNeeded) {
      displayLabel = audioTrack.label;
    }
  }

  return displayLabel;
}

/**
 * Gets user friendly language name in local language
 * @function getDisplayLanguage
 * @param {Array.<{Object}>} languagesList - list of languages with regional names and codes
 * @param {String} languageCode - ISO-639 language code
 * @returns {String} displayLanguage - localized language
 */
function getDisplayLanguage(languagesList, languageCode) {
  var displayLanguage = '';
  if (typeof languageCode !== 'undefined' &&
    languagesList &&
    _.isArray(languagesList) &&
    languagesList.length) {
    var matchingLanguage =  _.find(languagesList, function(language) {
      return (
        language['1'] === languageCode ||
        language['2'] === languageCode ||
        language['2T'] === languageCode ||
        language['2B'] === languageCode ||
        language['3'] === languageCode
      );
    });
    if (matchingLanguage) {
      displayLanguage = matchingLanguage.local;
    }
  }
  return displayLanguage;
}

/**
 * Gets display title based on language and label
 * @param {String} language - language string attribute
 * @param {String} label - label string attribute
 * @returns {String} displayTitle - human readable display title
 */
function getDisplayTitle(language, label) {
  // set default function params
  var displayLanguage = language || '';
  var displayLabel = label || '';

  if (!displayLanguage.length && !displayLabel.length) {
    return CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
  } else if (displayLanguage.length && !displayLabel.length) {
    return displayLanguage;
  } else if (!displayLanguage.length && displayLabel.length) {
    return displayLabel;
  } else {
    return displayLanguage.concat(' ', displayLabel);
  }
}

/**
 * Transforms tracks list based on criteria
 * if all tracks are distinct - only use language attribute
 * if there are duplicates - append label to the language attribute
 * @param {Array} tracksList - list of all tracks
 * @returns {Array} transformedTracksList - list of transformed tracks
 */
function transformTracksList(tracksList) {
  var transformedTracksList = [];
  // first we group by language to know if we have distinct tracks
  if (tracksList && tracksList.length) {
    var groupedTracks = _.groupBy(tracksList, 'language');
    var groupedKeys = _.keys(groupedTracks);

    // if all languages are distinct - discard labels
    if (groupedKeys.length === tracksList.length) {
      transformedTracksList = tracksList.map(function(audioTrack) {
        var trackDisplayTitle = getDisplayTitle(audioTrack.language);
        var transformedTrack = {
          id: audioTrack.id,
          label: trackDisplayTitle,
          enabled: audioTrack.enabled
        };

        return transformedTrack;
      });
    } else {
      var uniqueTracks = groupedKeys.map(function(key) {
        // if there are multiple tracks with the same language code
        if (groupedTracks[key].length > 1) {
          // get each list of duplicating tracks
          return groupedTracks[key].map(function(audioTrack) {
            // get display title based on language and label
            var trackDisplayTitle = getDisplayTitle(audioTrack.language, audioTrack.label);
            
            var transformedTrack = {
              enabled: audioTrack.enabled,
              label: trackDisplayTitle,
              id: audioTrack.id
            };

            return transformedTrack;
          });
        } else {
          // this track is distinct
          var audioTrack = _.head(groupedTracks[key]);
          var trackDisplayTitle = getDisplayTitle(audioTrack.language);
          var transformedTrack = {
            enabled: audioTrack.enabled,
            label: trackDisplayTitle,
            id: audioTrack.id
          };

          return transformedTrack;
        }
      });

      transformedTracksList = _.flatten(uniqueTracks);
    }
  }

  return transformedTracksList;
}

/**
 * Get unique tracks by name
 * @param {Array<{ label: String, enabled: Boolean, id: String }>} audioTracksList - all available tracks
 * @returns {Array<{ label: String, enabled: Boolean, id: String }>} uniqueTracksList
 */
function getUniqueTracks(audioTracksList) {
  var uniqueTracksList = [];

  if (audioTracksList && audioTracksList.length && Array.isArray(audioTracksList)) {
    var groupedTracks = _.groupBy(audioTracksList, 'label');
    var uniqueKeys = _.keys(groupedTracks);

    // if all keys are unique - return non-modified tracks
    if (uniqueKeys.length === audioTracksList.length) {
      uniqueTracksList = audioTracksList;
    } else {
      /* 
      * after grouping we get an object where key is name of the track 
      * and value is tracks with the same name so we need to iterate over keys
      * and flatten it afterwards
      */
      var uniqueTracks = uniqueKeys.map(function(key) {
        if (groupedTracks[key].length > 1) {
          return groupedTracks[key].map(function(audioTrack, index) {
            // modify zero-based index of array to get user-friendly index
            var trackIndex = index ? ' ' + index : '';
            var audioTrackLabel = audioTrack.label.concat(trackIndex);
            // add track index
            var uniqueTrack = {
              enabled: audioTrack.enabled,
              label: audioTrackLabel,
              id: audioTrack.id
            };

            return uniqueTrack;
          });
        } else {
          return _.head(groupedTracks[key]);
        }
      });

      uniqueTracksList = _.flatten(uniqueTracks);
    }
  }

  return uniqueTracksList;
}

module.exports = {
  getDisplayLabel: getDisplayLabel,
  getDisplayLanguage: getDisplayLanguage,
  getDisplayTitle: getDisplayTitle,
  transformTracksList: transformTracksList,
  getUniqueTracks: getUniqueTracks
};
