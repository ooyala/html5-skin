const React = require('react');

const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Tab = require('./tab');
const helpers = require('./helpers');
const CONSTANTS = require('../../constants/constants');
const Utils = require('../utils');

const SPECIAL_LANGUAGES_MAP = {};
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNDEFINED_LANGUAGE] = CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.NO_LINGUISTIC_CONTENT] = CONSTANTS.SKIN_TEXT.NO_LINGUISTIC_CONTENT;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNCODED_LANGUAGES] = CONSTANTS.SKIN_TEXT.UNCODED_LANGUAGES;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.MULTIPLE_LANGUAGES] = CONSTANTS.SKIN_TEXT.MULTIPLE_LANGUAGES;

const MultiAudioTab = createReactClass({
  render() {
    // transform tracks to human readable format
    const readableTracksList = this.props.audioTracksList.map(
      (audioTrack) => {
        let displayLanguage = '';
        const isSpecialLanguage = helpers.isSpecialLanguage(audioTrack.lang, SPECIAL_LANGUAGES_MAP);
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

        const displayLabel = helpers.getDisplayLabel(audioTrack);

        const languageElement = {
          enabled: audioTrack.enabled,
          language: displayLanguage,
          label: displayLabel,
          id: audioTrack.id,
          lang: audioTrack.lang,
        };

        return languageElement;
      }
    );

    const noLanguageText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE,
      this.props.localizableStrings
    );
    const transformedTracksList = helpers.transformTracksList(readableTracksList, noLanguageText);

    const uniqueTracksList = helpers.getUniqueTracks(transformedTracksList);

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
