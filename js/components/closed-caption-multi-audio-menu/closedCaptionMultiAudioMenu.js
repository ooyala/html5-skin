var React = require('react');
var classnames = require('classnames');
var CONSTANTS = require('../../constants/constants');
var Tab = require('./tab');
var MultiAudioTab = require('./multiAudioTab');

var ClosedCaptionMultiAudioMenu = React.createClass({
  /**
   *
   * @param languageList {Array} - list of available languages
   * @param language {String} - the selected language
   * @returns {Array<{id: String, label: String, enabled: Boolean}>} an array of languages info objects
   * @private
   */
  getClosedCaptions: function(languageList, language) {
    var closedCaptionList = [];
    if (Array.isArray(languageList)) {
      for (var index = 0; index < languageList.length; index++) {
        var isSelectedCc = languageList[index] === language;
        var cc = {
          id: languageList[index],
          label: languageList[index],
          enabled: isSelectedCc
        };
        closedCaptionList.push(cc);
      }
    }
    return closedCaptionList;
  },

  /**
   * when clicking on an item from an cc list, set the corresponding cc value
   * @param id {string} - id of clicked element
   */
  handleClosedCaptionClick: function(id) {
    if (this.props.controller && typeof this.props.controller.onClosedCaptionChange === 'function') {
      this.props.controller.onClosedCaptionChange('language', id);
    }
  },

  /**
   * when clicking on an item from an audio list, set the corresponding audio value
   * @param id {string} - id of clicked element
   */
  handleMultiAudioClick: function(id) {
    if (this.props.controller && typeof this.props.controller.setCurrentAudio === 'function') {
      this.props.controller.setCurrentAudio(id);
    }
  },

  render: function() {
    var multiAudioCol = null;
    var closedCaptionsCol = null;
    if (
      this.props.controller &&
      this.props.controller.state &&
      this.props.controller.state.multiAudio &&
      this.props.controller.state.multiAudio.tracks &&
      this.props.controller.state.multiAudio.tracks.length > 0
    ) {
      multiAudioCol = (
        <MultiAudioTab
          handleClick={this.handleMultiAudioClick}
          skinConfig={this.props.skinConfig}
          audioTracksList={this.props.controller.state.multiAudio.tracks}
        />
      );
    }
    if (
      this.props.controller &&
      this.props.controller.state &&
      this.props.controller.state.closedCaptionOptions &&
      this.props.controller.state.closedCaptionOptions.availableLanguages &&
      this.props.controller.state.closedCaptionOptions.availableLanguages.languages &&
      this.props.controller.state.closedCaptionOptions.availableLanguages.languages.length > 0
    ) {
      var closedCaptionList = this.getClosedCaptions(
        this.props.controller.state.closedCaptionOptions.availableLanguages.languages,
        this.props.controller.state.closedCaptionOptions.language
      );
      closedCaptionsCol = (
        <Tab
          tabClassName="oo-hidden"
          handleClick={this.handleClosedCaptionClick}
          skinConfig={this.props.skinConfig}
          itemsList={closedCaptionList}
          header={CONSTANTS.SKIN_TEXT.SUBTITLES}
        />
      );
    }

    return (
      <div className={classnames('oo-cc-ma-menu', this.props.menuClassName)}>
        {multiAudioCol}
        {closedCaptionsCol}
      </div>
    );
  }
});

ClosedCaptionMultiAudioMenu.propTypes = {
  menuClassName: React.PropTypes.string,
  skinConfig: React.PropTypes.object,
  controller: React.PropTypes.shape({
    setCurrentAudio: React.PropTypes.func,
    onClosedCaptionChange: React.PropTypes.func,
    state: React.PropTypes.shape({
      closedCaptionOptions: React.PropTypes.object,
      multiAudio: React.PropTypes.shape({
        tracks: React.PropTypes.array
      })
    })
  })
};

module.exports = ClosedCaptionMultiAudioMenu;
