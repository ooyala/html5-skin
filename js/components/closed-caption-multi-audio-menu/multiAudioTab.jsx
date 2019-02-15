import React from 'react';
import PropTypes from 'prop-types';
import Tab from './tab';
import helpers from './helpers';
import CONSTANTS from '../../constants/constants';
import Utils from '../utils';

const SPECIAL_LANGUAGES_MAP = {};
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNDEFINED_LANGUAGE] = CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.NO_LINGUISTIC_CONTENT] = CONSTANTS.SKIN_TEXT.NO_LINGUISTIC_CONTENT;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNCODED_LANGUAGES] = CONSTANTS.SKIN_TEXT.UNCODED_LANGUAGES;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.MULTIPLE_LANGUAGES] = CONSTANTS.SKIN_TEXT.MULTIPLE_LANGUAGES;

const MultiAudioTab = (props) => {
  const {
    audioTracksList,
    language,
    localizableStrings,
    handleClick,
    skinConfig,
    languageList,
    header,
  } = props;
  // transform tracks to human readable format
  const readableTracksList = audioTracksList.map(
    (audioTrack) => {
      let displayLanguage = '';
      const isSpecialLanguage = helpers.isSpecialLanguage(audioTrack.lang, SPECIAL_LANGUAGES_MAP);
      if (isSpecialLanguage) {
        displayLanguage = helpers.getLocalizedSpecialLanguage(
          audioTrack.lang,
          props.language,
          props.localizableStrings,
          SPECIAL_LANGUAGES_MAP
        );
      } else {
        displayLanguage = helpers.getDisplayLanguage(languageList, audioTrack.lang);
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
    language,
    CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE,
    localizableStrings
  );
  const transformedTracksList = helpers.transformTracksList(readableTracksList, noLanguageText);

  const uniqueTracksList = helpers.getUniqueTracks(transformedTracksList);

  return (
    <Tab
      handleClick={handleClick}
      skinConfig={skinConfig}
      itemsList={uniqueTracksList}
      header={header}
    />
  );
};

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
  skinConfig: PropTypes.shape({}),
  handleClick: PropTypes.func,
  language: PropTypes.string,
  languageList: PropTypes.arrayOf(PropTypes.shape({})),
  localizableStrings: PropTypes.shape({}),
};

MultiAudioTab.defaultProps = {
  skinConfig: {},
  language: '',
  handleClick: () => {},
  languageList: [],
  localizableStrings: {},
};

module.exports = MultiAudioTab;
