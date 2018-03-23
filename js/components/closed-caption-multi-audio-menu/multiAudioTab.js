var React = require('react');
var iso639 = require('iso-639-3');

var Tab = require('./tab');
var helpers = require('./helpers');
var CONSTANTS = require('../../constants/constants');

var MultiAudioTab = React.createClass({
  render: function() {
    var audioTracksList = this.props.list.map(
      function(audioTrack, index) {
        var displayLanguage = helpers.getDisplayLanguage(iso639, audioTrack.lang);
        var displayLabel = helpers.getDisplayLabel(audioTrack);

        var displayTitle = helpers.getDisplayTitle(displayLanguage, displayLabel);

        var languageElement = {
          enabled: audioTrack.enabled,
          label: displayTitle,
          id: audioTrack.id
        };

        return languageElement;
      }.bind(this)
    );

    var uniqueTracksList = helpers.getUniqueTracks(audioTracksList);

    return (
      <Tab
        handleClick={this.props.handleClick}
        skinConfig={this.props.skinConfig}
        list={uniqueTracksList}
        header={CONSTANTS.SKIN_TEXT.AUDIO}
      />
    );
  }
});

MultiAudioTab.propTypes = {
  list: React.PropTypes.arrayOf(
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
