var React = require('react');

var Tab = require('./tab');
var helpers = require('./helpers');
var CONSTANTS = require('../../constants/constants');
var LANGUAGE_LIST = require('../../constants/languages');
var Utils = require('../utils');

var MultiAudioTab = React.createClass({
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
    console.log('BBB this.props.audioTracksList', this.props.audioTracksList);
    console.log('BBB readableTracksList', readableTracksList);
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
  localizableStrings: React.PropTypes.string
};

module.exports = MultiAudioTab;
