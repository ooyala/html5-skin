let CONSTANTS = require('../../constants/constants');
let Utils = require('../utils');
let _ = require('underscore');

/**
 * Gets display label by checking
 * roles - e.g. nullable field from DASH manifest
 * and labels - e.g. non-nullable field from HSL manifest
 * @function getDisplayLabel
 * @param {Object} audioTrack - AudioTrack object
 * @returns {String} displayLabel - readable display label
 */
function getDisplayLabel(audioTrack) {
  let displayLabel = '';

  if (audioTrack && audioTrack.label) {
    // special case for DASH where label is per default equal to lang
    let isLabelNeeded = audioTrack.lang !== audioTrack.label;

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
  let displayLanguage = '';
  if (
    !!Utils.isValidString(languageCode) &&
    languagesList &&
    _.isArray(languagesList) &&
    languagesList.length
  ) {
    let matchingLanguage = _.find(languagesList, function(language) {
      return (
        language['2T'] === languageCode ||
        language['1'] === languageCode ||
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
 * @param {Object} trackParam - AudioTrack params
 * @param {String} trackParam.language - language string attribute
 * @param {String} trackParam.label - label string attribute
 * @param {String} trackParam.langCode - code of the language
 * @param {String} trackParam.noLanguageText - label for a case when
 * we do not have values for language and label of an audioTrack
 * @returns {String} displayTitle - human readable display title
 */
function getDisplayTitle(trackParam) {
  // set default function params
  let displayLanguage = trackParam.language || '';
  let displayLabel = trackParam.label || '';
  let noLanguageText = trackParam.noLanguageText || CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
  let langCode = trackParam.langCode;

  if (!displayLanguage.length && !displayLabel.length) {
    return noLanguageText;
  } else if (displayLanguage.length && !displayLabel.length) {
    return displayLanguage;
  } else if (!displayLanguage.length && displayLabel.length) {
    return displayLabel;
  } else {
    if (langCode === CONSTANTS.LANGUAGE.UNDEFINED_LANGUAGE) {
      displayLanguage = '';
    }
    return displayLanguage.concat(' ', displayLabel).trim();
  }
}

/**
 * If language in audioTrack is special we need to use localized value if it is possible.
 * We can localize the value using audio code.
 * @param {String} langCode - code of the language
 * @param {String} userLanguage - language which user would like to use
 * @param {Object} localizableStrings - mapping of string keys to localized values
 * @param {Object} languageMap - object with codes of special languages as keys
 * and labels for the codes as values
 * @returns {String} localized special audio track name or original name or empty string
 */
function getLocalizedSpecialLanguage(langCode, userLanguage, localizableStrings, languageMap) {
  let phrase = languageMap ? languageMap[langCode] : '';
  let localizedLanguage = Utils.getLocalizedString(
    userLanguage,
    phrase,
    localizableStrings
  );
  localizedLanguage = localizedLanguage || (phrase || '');
  return localizedLanguage;
}

/**
 *
 * Check if a language code is one of keys from a special language map
 * @param {String} langCode - code of an audio language
 * @param {Object} languageMap - object with codes of special languages as keys
 * and labels for the codes as values
 * @returns {boolean} - true if language code is one of specials, false otherwise
 */
function isSpecialLanguage(langCode, languageMap) {
  let isSpecialLanguage = languageMap ? !!languageMap[langCode] : false;
  return isSpecialLanguage;
}

/**
 * Transforms tracks list based on criteria
 * if all tracks are distinct - only use language attribute
 * if there are duplicates - append label to the language attribute
 * @param {Array} tracksList - list of all tracks
 * @param {String} noLanguageText - label for a case when
 * we do not have values for language and label of an audioTrack
 * @returns {Array} transformedTracksList - list of transformed tracks
 */
function transformTracksList(tracksList, noLanguageText) {
  let transformedTracksList = [];
  // first we group by language to know if we have distinct tracks
  if (tracksList && tracksList.length) {
    let groupedTracks = _.groupBy(tracksList, 'language');
    let groupedKeys = _.keys(groupedTracks);

    // if all languages are distinct - discard labels
    if (groupedKeys.length === tracksList.length) {
      transformedTracksList = tracksList.map(function(audioTrack) {
        let trackDisplayTitle = getDisplayTitle({
          language: audioTrack.language,
          langCode: audioTrack.lang,
          noLanguageText: noLanguageText,
        });
        let transformedTrack = {
          id: audioTrack.id,
          label: trackDisplayTitle,
          enabled: audioTrack.enabled,
        };

        return transformedTrack;
      });
    } else {
      let uniqueTracks = groupedKeys.map(function(key) {
        // if there are multiple tracks with the same language code
        if (groupedTracks[key].length > 1) {
          // get each list of duplicating tracks
          return groupedTracks[key].map(function(audioTrack) {
            // get display title based on language and label
            let trackDisplayTitle = getDisplayTitle({
              language: audioTrack.language,
              label: audioTrack.label,
              langCode: audioTrack.lang,
              noLanguageText: noLanguageText,
            });

            let transformedTrack = {
              enabled: audioTrack.enabled,
              label: trackDisplayTitle,
              id: audioTrack.id,
            };

            return transformedTrack;
          });
        } else {
          // this track is distinct
          let audioTrack = _.head(groupedTracks[key]);
          let trackDisplayTitle = getDisplayTitle({
            language: audioTrack.language,
            langCode: audioTrack.lang,
            noLanguageText: noLanguageText,
          });
          let transformedTrack = {
            enabled: audioTrack.enabled,
            label: trackDisplayTitle,
            id: audioTrack.id,
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
  let uniqueTracksList = [];

  if (audioTracksList && audioTracksList.length && Array.isArray(audioTracksList)) {
    let groupedTracks = _.groupBy(audioTracksList, 'label');
    let uniqueKeys = _.keys(groupedTracks);

    // if all keys are unique - return non-modified tracks
    if (uniqueKeys.length === audioTracksList.length) {
      uniqueTracksList = audioTracksList;
    } else {
      /*
      * after grouping we get an object where key is name of the track
      * and value is tracks with the same name so we need to iterate over keys
      * and flatten it afterwards
      */
      let uniqueTracks = uniqueKeys.map(function(key) {
        if (groupedTracks[key].length > 1) {
          return groupedTracks[key].map(function(audioTrack, index) {
            // modify zero-based index of array to get user-friendly index
            let trackIndex = index ? ' ' + index : '';
            let audioTrackLabel = audioTrack.label.concat(trackIndex);
            // add track index
            let uniqueTrack = {
              enabled: audioTrack.enabled,
              label: audioTrackLabel,
              id: audioTrack.id,
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
  getUniqueTracks: getUniqueTracks,
  getLocalizedSpecialLanguage: getLocalizedSpecialLanguage,
  isSpecialLanguage: isSpecialLanguage,
};
