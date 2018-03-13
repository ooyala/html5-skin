var React = require('react');
// var CONSTANTS = require('../../constants/constants');
// var Utils = require('../utils');
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
      closeCaptions: this.closeCaptions
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

  handleSelectCC: function (id) {
    this.closeCaptions.selected = id;
    this.setState({
      closeCaptions: this.closeCaptions
    });
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
  },

  render: function () {
    var styleMenu = {
      display: 'block',
      width: '100%',
      height: '100%'
    };

    var styleColumnLeft = {
      display: 'block',
      width: '50%',
      top: 0,
      float: 'left',
      height: '100%'
    };

    var styleColumnRight = {
      display: 'block',
      width: '50%',
      float: 'right',
      top: 0,
      height: '100%'
    };
    console.log('call render state.closeCaptions', this.state.closeCaptions);

    return (
      <div style={styleMenu}>
        <div style={styleColumnLeft}>
          <CloseCaptionTab handleSelect={this.handleSelectCC} {...this.state.closeCaptions}/>
        </div>
        <div style={styleColumnRight}>
          <MultiAudioTab handleSelect={this.handleSelectMA} {...this.state.multiAudio}/>
        </div>
      </div>
    );
  }
});

module.exports = CloseCaptionMultiAudioMenu;