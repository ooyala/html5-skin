var React = require('react');

var Tab = require('./tab');
var helpers = require('./helpers');
var CONSTANTS = require('../../constants/constants');
var LANGUAGE_LIST = require('../../constants/languages');
var Utils = require('../utils');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var MultiAudioTab = createReactClass({
  render: function() {
    // transform tracks to human readable format
    var readableTracksList = this.props.audioTracksList.map(
      function(audioTrack) {
        var displayLanguage = '';
        if (audioTrack.lang === CONSTANTS.LANGUAGE.NO_LINGUISTIC_CONTENT) {
          displayLanguage =  Utils.getLocalizedString(
            this.props.language,
            CONSTANTS.SKIN_TEXT.NO_LINGUISTIC_CONTENT,
            this.props.localizableStrings
          );
        } else {
          displayLanguage = helpers.getDisplayLanguage(LANGUAGE_LIST, audioTrack.lang);
        }
        var displayLabel = helpers.getDisplayLabel(audioTrack);

        var languageElement = {
          enabled: audioTrack.enabled,
          language: displayLanguage,
          label: displayLabel,
          id: audioTrack.id
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
