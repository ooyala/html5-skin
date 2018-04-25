var React = require('react');

var Tab = require('./tab');
var helpers = require('./helpers');
var CONSTANTS = require('../../constants/constants');
var LANGUAGE_LIST = require('../../constants/languages');

var MultiAudioTab = React.createClass({
  render: function() {
    // transform tracks to human readable format
    var readableTracksList = this.props.audioTracksList.map(
      function(audioTrack) {
        var displayLanguage = helpers.getDisplayLanguage(LANGUAGE_LIST, audioTrack.lang);
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

    var transformedTracksList = helpers.transformTracksList(readableTracksList);

    var uniqueTracksList = helpers.getUniqueTracks(transformedTracksList);
    
    return (
      <Tab
        handleClick={this.props.handleClick}
        skinConfig={this.props.skinConfig}
        itemsList={uniqueTracksList}
        header={CONSTANTS.SKIN_TEXT.AUDIO}
      />
    );
  }
});

MultiAudioTab.propTypes = {
  audioTracksList: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      lang: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      enabled: React.PropTypes.bool.isRequired
    })
  ).isRequired,
  skinConfig: React.PropTypes.object,

  handleClick: React.PropTypes.func
};

module.exports = MultiAudioTab;
