var React = require("react");
var ListWithChoice = require("../base-components/listWithChoice");
var iso639 = require("iso-639-3");
var CONSTANTS = require("../../constants/constants");
var _ = require("underscore");
/**
 * Gets display label by checking
 * roles - e.g. nullable field from DASH manifest
 * and labels - e.g. non-nullable field from HSL manifest
 * @function getDisplayLabel
 * @param {Object} audioTrack
 * @returns {String} displayLabel
 */
function getDisplayLabel(audioTrack) {
  var displayLabel = "";

  if (audioTrack && audioTrack.label) {
    // special case for DASH where label is per default equal to lang
    var isLabelNeeded = audioTrack.lang !== audioTrack.label;

    if (isLabelNeeded) {
      displayLabel = audioTrack.label;
    }
  }

  return displayLabel;
}

/**
 * Gets user friendly language name in English by
 * matching language code against one of the ISO-639 standarts
 * @function getDisplayLanguage
 * @param {String} languageCode
 * @returns {String} displayLanguage
 */
function getDisplayLanguage(languageList, languageCode) {
  var displayLanguage = "";
  /*
  * check if language is defined and it's name can be obtained by matching
  * against iso-639 standart
  */
  if (
    languageList &&
    languageList.length &&
    languageCode &&
    languageCode !== CONSTANTS.LANGUAGE.NOT_MATCHED
  ) {
    var livingLanguages = _.filter(languageList, function(language) {
      // Only search in still spoken languages
      return language.type === "living";
    });

    var matchingLanguage = _.find(livingLanguages, function(language) {
      // Find if one of the standarts contains language code
      return (
        language.iso6393 === languageCode ||
        language.iso6392B === languageCode ||
        language.iso6392T === languageCode ||
        language.iso6391 === languageCode
      );
    });
    /* 
    * if matching language is found - return its name, otherwise 
    * just return empty string
    */
    displayLanguage = matchingLanguage ? matchingLanguage.name : "";
  }

  return displayLanguage;
}

function getDisplayTitle(language, label) {
  var displayTitle = "";
  var displayLanguage = language || "";
  var displayLabel = label || "";

  if (!displayLanguage.length && !displayLabel.length) {
    return CONSTANTS.SKIN_TEXT.UNDEFINED_LANGUAGE;
  } else if (displayLanguage.length && !displayLabel.length) {
    return displayLanguage;
  } else if (!displayLanguage.length && displayLabel.length) {
    return displayLabel;
  } else {
    return displayLanguage.concat(" ", displayLabel);
  }

  return displayTitle;
}

var MultiAudioTab = React.createClass({
  render: function() {
    var list = [];

    if (this.props.multiAudio && this.props.multiAudio.list) {
      console.log(this.props.multiAudio.list);

      list = this.props.multiAudio.list.map(
        function(audioTrack, index) {
          var displayLanguage = getDisplayLanguage(iso639, audioTrack.lang);
          var displayLabel = getDisplayLabel(audioTrack);

          var displayTitle = getDisplayTitle(displayLanguage, displayLabel);

          var languageElement = {
            selected: audioTrack.enabled,
            name: displayTitle,
            id: audioTrack.id
          };

          return languageElement;
        }.bind(this)
      );
    }

    return (
      <ListWithChoice
        handleSelect={this.props.handleSelect}
        skinConfig={this.props.skinConfig}
        header={"Audio"}
        list={list}
      />
    );
  }
});

MultiAudioTab.propTypes = {
  multiAudio: React.PropTypes.shape({
    list: React.PropTypes.array
  }),
  skinConfig: React.PropTypes.object,

  handleSelect: React.PropTypes.func
};

module.exports = {
  MultiAudioTab: MultiAudioTab,
  getDisplayLabel: getDisplayLabel,
  getDisplayLanguage: getDisplayLanguage,
  getDisplayTitle: getDisplayTitle
};
