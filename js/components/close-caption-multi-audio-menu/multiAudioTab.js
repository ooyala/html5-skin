var React = require("react");
var BaseTab = require("../base-components/listWithChoice");
var iso639 = require("iso-639-3");
var LANGUAGE_CONSTANTS = require("../../constants/constants").LANGUAGE;
/**
 * get language name in english by 
 * checking if one of the standarts contains
 * language code
 * @param {string} languageCode
 * @returns {string} name 
 */
function getDisplayName(languageCode, roles) {
  // check if language can be defined by language code
  if (languageCode !== LANGUAGE_CONSTANTS.NOT_MATCHED) {
    var matchingLanguage = iso639
      .filter(function(language) {
        // Only search in still spoken languages
        return language.type === "living";
      })
      .find(function(language) {
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
    * just return language code
    */
    return matchingLanguage.name || languageCode;
  } else {
    var role = _.first(roles);

    return role.value;
  }
}

var MultiAudioTab = React.createClass({
  render: function() {
    var props = this.props;
    var list = [];

    if (props.multiAudio && props.multiAudio.list) {
       list = props.multiAudio.list.map(
        function(audioTrack, index) {
          
          var languageName = getDisplayName(audioTrack.lang, audioTrack.role);
          
          var languageElement = {
            selected: audioTrack.enabled,
            name: languageName,
            id: audioTrack.id
          }
          
          return languageElement;

        }.bind(this)
      );
    }

    return (
      <BaseTab
        handleSelect={this.props.handleSelect}
        skinConfig={this.props.skinConfig}
        header={"Audio"}
        list={list}
      />
    );
  }
});

module.exports = MultiAudioTab;
