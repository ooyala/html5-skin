var React = require('react');

var Tab = require('./tab');
var helpers = require('./helpers');
var CONSTANTS = require('../../constants/constants');
var LANGUAGE_LIST = require('../../constants/languages');
var Utils = require('../utils');

var SPECIAL_LANGUAGES_MAP = {};
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNDEFINED_LANGUAGE] = CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.NO_LINGUISTIC_CONTENT] = CONSTANTS.SKIN_TEXT.NO_LINGUISTIC_CONTENT;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.UNCODED_LANGUAGES] = CONSTANTS.SKIN_TEXT.UNCODED_LANGUAGES;
SPECIAL_LANGUAGES_MAP[CONSTANTS.LANGUAGE.MULTIPLE_LANGUAGES] = CONSTANTS.SKIN_TEXT.MULTIPLE_LANGUAGES;

var MultiAudioTab = React.createClass({
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
          displayLanguage = helpers.getDisplayLanguage(LANGUAGE_LIST, audioTrack.lang);
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
  header: React.PropTypes.string.isRequired,
  audioTracksList: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      lang: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      enabled: React.PropTypes.bool.isRequired
    })
  ).isRequired,
  skinConfig: React.PropTypes.object,

  handleClick: React.PropTypes.func,
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object
};

module.exports = MultiAudioTab;
