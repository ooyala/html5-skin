/** ******************************************************************
 MORE OPTIONS PANEL
 ******************************************************************** */
/**
 * @class MoreOptionsPanel
 * @constructor
 */
const React = require('react');
const ClassNames = require('classnames');
const createReactClass = require('create-react-class');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');
const AnimateMixin = require('../mixins/animateMixin');
const Icon = require('../components/icon');
const ControlButton = require('./controlButton');
const PlaybackSpeedButton = require('./playbackSpeedButton');

const MoreOptionsPanel = createReactClass({
  mixins: [AnimateMixin],

  handleShareClick() {
    this.props.controller.toggleShareScreen();
  },

  handleQualityClick() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  },

  handleDiscoveryClick() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleClosedCaptionClick() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
  },

  handleMultiAudioClick() {
    if (this.props.controller && typeof this.props.controller.toggleScreen === 'function') {
      this.props.controller.toggleScreen(CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN);
    }
  },

  /**
   * Opens the Playback Speed menu in screen mode when the playback speed button is clicked.
   * @private
   */
  handlePlaybackSpeedClick() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN);
  },

  buildMoreOptionsButtonList() {
    const commonButtonProps = {
      language: this.props.language,
      localizableStrings: this.props.localizableStrings,
      responsiveView: this.props.responsiveView,
      skinConfig: this.props.skinConfig,
      controller: this.props.controller,
      style: {
        fontSize: `${this.props.skinConfig.moreOptionsScreen.iconSize}px`,
      },
      getTooltipAlignment(key) {
        return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      },
    };

    const optionsItemsTemplates = {};
    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.QUALITY] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
        className="oo-quality"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
        ariaHidden
        icon="quality"
        onClick={this.handleQualityClick}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
        className="oo-discovery"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.DISCOVERY}
        ariaHidden
        icon="discovery"
        onClick={this.handleDiscoveryClick}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
        className="oo-multiaudio"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
        ariaHidden
        icon="audioAndCC"
        onClick={this.handleMultiAudioClick}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
        className="oo-closed-caption"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
        ariaHidden
        icon="cc"
        onClick={this.handleClosedCaptionClick}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED] = (
      <PlaybackSpeedButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
        focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
        ariaHidden
        onClick={this.handlePlaybackSpeedClick}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.SHARE] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
        className="oo-share"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.SHARE}
        ariaHidden
        icon="share"
        onClick={this.handleShareClick}
      />
    );

    const items = this.props.controller.state.moreOptionsItems;
    const moreOptionsItems = [];

    for (let i = 0; i < items.length; i++) {
      moreOptionsItems.push(optionsItemsTemplates[items[i].name]);
    }

    return moreOptionsItems;
  },

  render() {
    const moreOptionsItemsClass = ClassNames({
      'oo-more-options-items': true,
      'oo-animate-more-options': this.state.animate,
    });

    const moreOptionsItems = this.buildMoreOptionsButtonList();

    return (
      <div className="oo-content-panel oo-more-options-panel">
        <div className={moreOptionsItemsClass}>{moreOptionsItems}</div>
      </div>
    );
  },
});

MoreOptionsPanel.defaultProps = {
  skinConfig: {
    moreOptionsScreen: {
      iconStyle: {
        active: {
          color: '#FFF',
          opacity: 1,
        },
        inactive: {
          color: '#FFF',
          opacity: 0.6,
        },
      },
    },
  },
};

module.exports = MoreOptionsPanel;
