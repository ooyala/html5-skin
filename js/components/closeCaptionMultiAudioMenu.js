var React = require('react');
var CONSTANTS = require('../constants/constants');
var Utils = require('./utils');

var CloseCaptionMultiAudioMenu = React.createClass({

  getInitialState: function () {
    console.warn('getInitialState props', this.props);

    var multiAudio = {};
    var closeCaptions = {};

    if(this.props.controller && this.props.controller.state) {
      multiAudio = this._getMultiAudio();
      closeCaptions = this._getCloseCaptions();
    }

    console.warn("multiAudio", multiAudio);
    console.warn("closeCaptions", closeCaptions);

    return {
      multiAudio: multiAudio,
      closeCaptions: closeCaptions
    }
  },

  /**
   * Getting a list of available audio tracks
   * @return {object} - list of available audio tracks and selected track
   * @private
   */
  _getMultiAudio: function () {
    var multiAudio = {
      list: [],
      selected: null
    };

    if(!!this.props.controller.state.multiAudio) {
      if(Array.isArray(this.props.controller.state.multiAudio.tracks)) {
        multiAudio.list = this.props.controller.state.multiAudio.tracks;
        multiAudio.selected = _.find(this.props.controller.state.multiAudio.tracks, function (track) {
          return track.enabled === true;
        });
      }
    }

    return multiAudio;
  },

  /**
   * Getting the list of available languages for subtitles
   * @return {object} list of available languages for subtitles and selected language
   * @private
   */
  _getCloseCaptions: function () {
    var closeCaptions = {
      list: [],
      selected: null
    };

    if (this.props.controller.state.closedCaptionOptions) {
      if (this.props.controller.state.closedCaptionOptions.availableLanguages &&
        this.props.controller.state.closedCaptionOptions.availableLanguages.languages &&
        Array.isArray(this.props.controller.state.closedCaptionOptions.availableLanguages.languages)) {
        closeCaptions.list = this.props.controller.state.closedCaptionOptions.availableLanguages.languages;
      }

      if (this.props.controller.state.closedCaptionOptions.language) {
        closeCaptions.selected = this.props.controller.state.closedCaptionOptions.language;
      }
    }

    return closeCaptions;
  },

  render: function () {
    console.warn('render state', this.state);
    return null;
  }
});

module.exports = CloseCaptionMultiAudioMenu;