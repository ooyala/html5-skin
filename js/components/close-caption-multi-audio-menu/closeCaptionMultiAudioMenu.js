var React = require('react');
var CloseCaptionTab = require('./closeCaptionTab');
var MultiAudioTab = require('./multiAudioTab');

var CloseCaptionMultiAudioMenu = React.createClass({

  getInitialState: function () {
    this.multiAudio = {};
    this.closeCaptions = {};

    if(this.props.controller && this.props.controller.state) {
      this.multiAudio = this._getMultiAudio();
      this.closeCaptions = this._getCloseCaptions();
    }

    return {
      multiAudio: this.multiAudio,
      closeCaptions: this.closeCaptions,
      skinConfig: this.props.skinConfig
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
  _getClosedCaptions: function () {
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

  handleSelectCC: function (id) {
    this.closeCaptions.selected = id;
    this.setState({
      closeCaptions: this.closeCaptions
    });

    if (this.props.controller && this.props.controller.onClosedCaptionChange) {
      this.props.controller.onClosedCaptionChange('language', id);
    }
  },

  handleSelectMA: function (id) {
    var selectedElement = null;

    this.multiAudio.list.forEach(function (el) {
      if (el.id === id) {
        el.enabled = true;
        selectedElement = el;
      } else {
        el.enabled = false;
      }
    });
    this.multiAudio.selected = selectedElement;

    this.setState({
      multiAudio: this.multiAudio
    });

    if (this.props.controller && this.props.controller.setCurrentAudio) {
      this.props.controller.setCurrentAudio(id);
    }
  },

  render: function () {
    return (
      <div className="oo-cc-ma-menu">
        <div className="oo-column-left">
          <MultiAudioTab
            handleSelect={this.handleSelectMA}
            skinConfig={this.state.skinConfig}
            multiAudio={this.state.multiAudio}
          />
        </div>
        <div className="oo-separator"></div>
        <div className="oo-column-right">
          <CloseCaptionTab
            handleSelect={this.handleSelectCC}
            skinConfig={this.state.skinConfig}
            closeCaptions={this.state.closeCaptions}
          />
        </div>
      </div>
    );
  }
});

module.exports = CloseCaptionMultiAudioMenu;