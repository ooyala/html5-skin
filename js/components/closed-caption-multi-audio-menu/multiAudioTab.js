let React = require('react');

let Tab = require('./tab');
let helpers = require('./helpers');
let CONSTANTS = require('../../constants/constants');
let Utils = require('../utils');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let SPECIAL_LANGUAGES_MAP = {};
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNDEFINED_LANGUAGE] = CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.NO_LINGUISTIC_CONTENT] = CONSTANTS.SKIN_TEXT.NO_LINGUISTIC_CONTENT;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNCODED_LANGUAGES] = CONSTANTS.SKIN_TEXT.UNCODED_LANGUAGES;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.MULTIPLE_LANGUAGES] = CONSTANTS.SKIN_TEXT.MULTIPLE_LANGUAGES;

let MultiAudioTab = createReactClass({
  render: function() {
    // transform tracks to human readable format
    let readableTracksList = this.props.audioTracksList.map(
      function(audioTrack) {
        let displayLanguage = '';
        let isSpecialLanguage = helpers.isSpecialLanguage(audioTrack.lang, SPECIAL_LANGUAGES_MAP);
        if (isSpecialLanguage) {
          displayLanguage = helpers.getLocalizedSpecialLanguage(
            audioTrack.lang,
            this.props.language,
            this.props.localizableStrings,
            SPECIAL_LANGUAGES_MAP
          );
        } else {
          displayLanguage = helpers.getDisplayLanguage(this.props.languageList, audioTrack.lang);
        }

        let displayLabel = helpers.getDisplayLabel(audioTrack);

        let languageElement = {
          enabled: audioTrack.enabled,
          language: displayLanguage,
          label: displayLabel,
          id: audioTrack.id,
          lang: audioTrack.lang,
        };

        return languageElement;
      }.bind(this)
    );

    let noLanguageText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE,
      this.props.localizableStrings
    );
    let transformedTracksList = helpers.transformTracksList(readableTracksList, noLanguageText);

    let uniqueTracksList = helpers.getUniqueTracks(transformedTracksList);

    return (
      <Tab
        handleClick={this.props.handleClick}
        skinConfig={this.props.skinConfig}
        itemsList={uniqueTracksList}
        header={this.props.header}
      />
    );
  },
});

MultiAudioTab.propTypes = {
  header: PropTypes.string.isRequired,
  audioTracksList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      lang: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
    })
  ).isRequired,
  skinConfig: PropTypes.object,

  handleClick: PropTypes.func,
  language: PropTypes.string,
  languageList: PropTypes.array,
  localizableStrings: PropTypes.object,
};

module.exports = MultiAudioTab;
