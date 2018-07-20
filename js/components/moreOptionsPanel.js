/** ******************************************************************
 MORE OPTIONS PANEL
 *********************************************************************/
/**
 * @class MoreOptionsPanel
 * @constructor
 */
var React = require('react');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');
var ClassNames = require('classnames');
var AnimateMixin = require('../mixins/animateMixin');
var Icon = require('../components/icon');
var ControlButton = require('./controlButton');
var PlaybackSpeedButton = require('./playbackSpeedButton');
var createReactClass = require('create-react-class');

var MoreOptionsPanel = createReactClass({
  mixins: [AnimateMixin],

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleQualityClick: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  },

  handleDiscoveryClick: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleClosedCaptionClick: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
  },

  handleMultiAudioClick: function() {
    if (this.props.controller && typeof this.props.controller.toggleScreen === 'function') {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN);
    }
  },

  /**
   * Opens the Playback Speed menu in screen mode when the playback speed button is clicked.   
   * @private
   */
  handlePlaybackSpeedClick: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN);
  },

  buildMoreOptionsButtonList: function() {
    var commonButtonProps = {
      language: this.props.language,
      localizableStrings: this.props.localizableStrings,
      responsiveView: this.props.responsiveView,
      skinConfig: this.props.skinConfig,
      controller: this.props.controller,
      style: {
        fontSize: this.props.skinConfig.moreOptionsScreen.iconSize + 'px',
      },
      getTooltipAlignment: function(key) {
        return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      }
    };

    var optionsItemsTemplates = {};
    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.QUALITY] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
        className="oo-quality"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
        ariaHidden={true}
        icon="quality"
        onClick={this.handleQualityClick}>
      </ControlButton>
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
        className="oo-discovery"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
        ariaHidden={true}
        icon="discovery"
        onClick={this.handleDiscoveryClick}>
      </ControlButton>
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
        className="oo-multiaudio"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
        ariaHidden={true}
        icon="audioAndCC"
        onClick={this.handleMultiAudioClick}>
      </ControlButton>
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
        className="oo-closed-caption"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
        ariaHidden={true}
        icon="cc"
        onClick={this.handleClosedCaptionClick}>
      </ControlButton>
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED] = (
      <PlaybackSpeedButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
        focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
        ariaHidden={true}
        onClick={this.handlePlaybackSpeedClick}>
      </PlaybackSpeedButton>
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.SHARE] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
        className="oo-share"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
        ariaHidden={true}
        icon="share"
        onClick={this.handleShareClick}>
      </ControlButton>
    );

    var items = this.props.controller.state.moreOptionsItems;
    var moreOptionsItems = [];

    for (var i = 0; i < items.length; i++) {
      moreOptionsItems.push(optionsItemsTemplates[items[i].name]);
    }

    return moreOptionsItems;
  },

  render: function() {
    var moreOptionsItemsClass = ClassNames({
      'oo-more-options-items': true,
      'oo-animate-more-options': this.state.animate
    });

    var moreOptionsItems = this.buildMoreOptionsButtonList();

    return (
      <div className="oo-content-panel oo-more-options-panel">
        <div className={moreOptionsItemsClass}>{moreOptionsItems}</div>
      </div>
    );
  }
});

MoreOptionsPanel.defaultProps = {
  skinConfig: {
    moreOptionsScreen: {
      iconStyle: {
        active: {
          color: '#FFF',
          opacity: 1
        },
        inactive: {
          color: '#FFF',
          opacity: 0.6
        }
      }
    }
  }
};

module.exports = MoreOptionsPanel;
