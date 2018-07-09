var React = require('react');

var Tab = require('./tab');
var helpers = require('./helpers');
var CONSTANTS = require('../../constants/constants');
var Utils = require('../utils');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var SPECIAL_LANGUAGES_MAP = {};
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNDEFINED_LANGUAGE] = CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.NO_LINGUISTIC_CONTENT] = CONSTANTS.SKIN_TEXT.NO_LINGUISTIC_CONTENT;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNCODED_LANGUAGES] = CONSTANTS.SKIN_TEXT.UNCODED_LANGUAGES;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.MULTIPLE_LANGUAGES] = CONSTANTS.SKIN_TEXT.MULTIPLE_LANGUAGES;

var MultiAudioTab = createReactClass({
  render: function() {
    // transform tracks to human readable format
    var readableTracksList = this.props.audioTracksList.map(
      function(audioTrack) {
        var displayLanguage = '';
        var isSpecialLanguage = helpers.isSpecialLanguage(audioTrack.lang, SPECIAL_LANGUAGES_MAP);
        if (isSpecialLanguage) {
          displayLanguage = helpers.getLocalizedSpecialLanguage(
            audioTrack.lang,
            this.props.language,
            this.props.localizableStrings,
            SPECIAL_LANGUAGES_MAP
          );
        } else {
          displayLanguage = helpers.getDisplayLanguage(OO.LANGUAGE_LIST, audioTrack.lang);
        }

        var displayLabel = helpers.getDisplayLabel(audioTrack);

        var languageElement = {
          enabled: audioTrack.enabled,
          language: displayLanguage,
          label: displayLabel,
          id: audioTrack.id,
          lang: audioTrack.lang
        };

        return languageElement;
      }.bind(this)
    );

    var noLanguageText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE,
      this.props.localizableStrings
    );
    var transformedTracksList = helpers.transformTracksList(readableTracksList, noLanguageText);

    var uniqueTracksList = helpers.getUniqueTracks(transformedTracksList);

    return (
      <Tab
        handleClick={this.props.handleClick}
        skinConfig={this.props.skinConfig}
        itemsList={uniqueTracksList}
        header={this.props.header}
      />
    );
  }
});

MultiAudioTab.propTypes = {
  header: PropTypes.string.isRequired,
  audioTracksList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      lang: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  skinConfig: PropTypes.object,

  handleClick: PropTypes.func,
  language: PropTypes.string,
  localizableStrings: PropTypes.object
};

module.exports = MultiAudioTab;
