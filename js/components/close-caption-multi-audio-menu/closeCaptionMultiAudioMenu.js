var React = require('react');
var CloseCaptionTab = require('./closeCaptionTab');
var MultiAudioTab = require('./multiAudioTab');

var CloseCaptionMultiAudioMenu = React.createClass({

  getInitialState: function () {
    this.multiAudio = {};
    this.closeCaptions = {};

    if(this.props.controller && this.props.controller.state) {
      this.multiAudio = this._getMultiAudio();
      this.closeCaptions = this._getClosedCaptions();
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
    var menuClass = "oo-cc-ma-menu";
    var columnLeftClass = "oo-column-left";
    var columnRightClass = "oo-column-right";
    var separatorClass = "oo-separator";

    if(this.state.multiAudio.list.length === 0){
      columnLeftClass = columnLeftClass + " hidden";
      separatorClass = separatorClass + " hidden";
      columnRightClass = columnRightClass + " full";
    }

    if(this.state.closeCaptions.list.length === 0) {
      columnRightClass = columnRightClass + " hidden";
      separatorClass = separatorClass + " hidden";
      columnLeftClass = columnLeftClass + " full"
    }

    return (
      <div className={menuClass}>
        <div className={columnLeftClass}>
          <MultiAudioTab
            handleSelect={this.handleSelectMA}
            skinConfig={this.state.skinConfig}
            multiAudio={this.state.multiAudio}
          />
        </div>
        <div className={separatorClass}></div>
        <div className={columnRightClass}>
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