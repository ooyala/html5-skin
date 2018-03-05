var React = require('react');
var CONSTANTS = require('../constants/constants');
var Utils = require('./utils');

var CloseCaptionMultiAudioMenu = React.createClass({

  getInitialState: function () {
    console.warn('getInitialState props', this.props);

    var multiAudioList = [];
    var closeCaptionsList = [];
    // if (this.props.controller &&
    //   this.props.controller.state &&
    //   !!this.props.controller.state.multiAudio &&
    //   Array.isArray(this.props.controller.state.multiAudio.tracks) ) {
    //   multiAudio = this.props.controller.state.multiAudio.tracks;
    // }

    // if(this.props.closedCaptionOptions &&
    //   this.props.closedCaptionOptions.availableLanguages &&
    //   this.props.closedCaptionOptions.availableLanguages.languages &&
    //   Array.isArray(this.props.closedCaptionOptions.availableLanguages.languages)
    // ) {
    //   closeCaptions = this.props.closedCaptionOptions.availableLanguages.languages;
    // }

    // var this.props.closedCaptionOptions.availableLanguages.locale


    if(this.props.controller && this.props.controller.state) {
      multiAudioList = this._getMultiAudioList();
      closeCaptionsList = this._getCloseCaptionsList();
    }

    console.warn("multiAudioList", multiAudioList);
    console.warn("closeCaptionsList", closeCaptionsList);

    return {
      multiAudioList: multiAudioList,
      closeCaptionsList: closeCaptionsList
    }
  },

  /**
   * Getting a list of available audio tracks
   * @return {Array} - list of available audio tracks
   * @private
   */
  _getMultiAudioList: function () {
    var multiAudioList = [];
    if(!!this.props.controller.state.multiAudio &&
      Array.isArray(this.props.controller.state.multiAudio.tracks)) {
      multiAudioList = this.props.controller.state.multiAudio.tracks;
    }

    return multiAudioList;
  },

  /**
   * Getting the list of available languages for subtitles
   * @return {Array} list of available languages for subtitles
   * @private
   */
  _getCloseCaptionsList: function () {
    var closeCaptionsList = [];
    if(this.props.controller.state.closedCaptionOptions &&
      this.props.controller.state.closedCaptionOptions.availableLanguages &&
      this.props.controller.state.closedCaptionOptions.availableLanguages.languages &&
      Array.isArray(this.props.controller.state.closedCaptionOptions.availableLanguages.languages)
    ) {
      closeCaptionsList = this.props.controller.state.closedCaptionOptions.availableLanguages.languages;
    }

    return closeCaptionsList;
  },

  render: function () {
    console.warn('render props', this.props);
    return null;
  }
});

module.exports = CloseCaptionMultiAudioMenu;