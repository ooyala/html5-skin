const React = require('react');
const classnames = require('classnames');
const _ = require('underscore');

const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Utils = require('../utils');

const CONSTANTS = require('../../constants/constants');
const Tab = require('./tab');
const MultiAudioTab = require('./multiAudioTab');

const ClosedCaptionMultiAudioMenu = createReactClass({
  /**
   *
   * @param {Array} languageList - list of available languages
   * @param {String} language - the selected language
   * @returns {Array<{id: String, label: String, enabled: Boolean}>} an array of languages info objects
   * @private
   */
  getClosedCaptions(languageList, language) {
    const closedCaptionList = [];
    if (Array.isArray(languageList)) {
      for (let index = 0; index < languageList.length; index++) {
        const isSelectedCc = languageList[index] === language;
        const cc = {
          id: languageList[index],
          label: languageList[index],
          enabled: isSelectedCc,
        };
        closedCaptionList.push(cc);
      }
    }
    return closedCaptionList;
  },

  /**
   * when clicking on an item from an cc list, set the corresponding cc value
   * @param {string} id - id of clicked element
   */
  handleClosedCaptionClick(id) {
    if (this.props.controller && typeof this.props.controller.onClosedCaptionChange === 'function') {
      this.props.controller.onClosedCaptionChange('language', id);
    }
  },

  /**
   * when clicking on an item from an audio list, set the corresponding audio value
   * @param {string} id - id of clicked element
   */
  handleMultiAudioClick(id) {
    if (
      this.props.controller
      && typeof this.props.controller.setCurrentAudio === 'function'
      && this.props.controller.state
      && this.props.controller.state.multiAudio
      && this.props.controller.state.multiAudio.tracks
    ) {
      const tracks = this.props.controller.state.multiAudio.tracks;

      // find selected track in a list of available tracks
      const selectedAudioTrack = _.find(tracks, track => track.id === id);
      this.props.controller.setCurrentAudio(selectedAudioTrack);
    }
    if (this.props.togglePopoverAction && typeof this.props.togglePopoverAction === 'function') {
      this.props.togglePopoverAction({
        restoreToggleButtonFocus: true,
      });
    }
  },

  render() {
    let multiAudioCol = null;
    let closedCaptionsCol = null;
    if (
      this.props.controller
      && this.props.controller.state
      && this.props.controller.state.multiAudio
      && this.props.controller.state.multiAudio.tracks
      && this.props.controller.state.multiAudio.tracks.length > 0
    ) {
      multiAudioCol = (
        <MultiAudioTab
          header={Utils.getLocalizedString(
            this.props.language,
            CONSTANTS.SKIN_TEXT.AUDIO,
            this.props.localizableStrings
          )}
          handleClick={this.handleMultiAudioClick}
          skinConfig={this.props.skinConfig}
          audioTracksList={this.props.controller.state.multiAudio.tracks}
          language={this.props.language}
          languageList={this.props.controller.languageList}
          localizableStrings={this.props.localizableStrings}
        />
      );
    }
    if (
      this.props.controller
      && this.props.controller.state
      && this.props.controller.state.closedCaptionOptions
      && this.props.controller.state.closedCaptionOptions.availableLanguages
      && this.props.controller.state.closedCaptionOptions.availableLanguages.languages
      && this.props.controller.state.closedCaptionOptions.availableLanguages.languages.length > 0
    ) {
      const closedCaptionList = this.getClosedCaptions(
        this.props.controller.state.closedCaptionOptions.availableLanguages.languages,
        this.props.controller.state.closedCaptionOptions.language
      );
      closedCaptionsCol = (
        <Tab
          tabClassName="oo-hidden"
          handleClick={this.handleClosedCaptionClick}
          skinConfig={this.props.skinConfig}
          itemsList={closedCaptionList}
          header={Utils.getLocalizedString(
            this.props.language,
            CONSTANTS.SKIN_TEXT.SUBTITLES,
            this.props.localizableStrings
          )}
        />
      );
    }

    return (
      <div className={classnames('oo-cc-ma-menu', this.props.menuClassName)}>
        {multiAudioCol}
        {closedCaptionsCol}
      </div>
    );
  },
});

ClosedCaptionMultiAudioMenu.propTypes = {
  menuClassName: PropTypes.string,
  skinConfig: PropTypes.object,
  togglePopoverAction: PropTypes.func,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
  controller: PropTypes.shape({
    setCurrentAudio: PropTypes.func,
    onClosedCaptionChange: PropTypes.func,
    state: PropTypes.shape({
      closedCaptionOptions: PropTypes.object,
      multiAudio: PropTypes.shape({
        tracks: PropTypes.array,
      }),
    }),
    languageList: PropTypes.array,
  }),
};

module.exports = ClosedCaptionMultiAudioMenu;
