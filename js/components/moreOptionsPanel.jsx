import React from 'react';
import ClassNames from 'classnames';
import CONSTANTS from '../constants/constants';
import ControlButton from './controlButton';
import PlaybackSpeedButton from './playbackSpeedButton';

/**
 * More options panel
 */
class MoreOptionsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false,
    };
  }

  componentDidMount() {
    this.animateTimer = setTimeout(this.startAnimation, 1);
  }

  componentWillUnmount() {
    clearTimeout(this.animateTimer);
  }

  startAnimation = () => {
    this.setState({ animate: true });
  }

  handleShareClick = () => {
    const { controller } = this.props;
    controller.toggleShareScreen();
  }

  handleQualityClick = () => {
    const { controller } = this.props;
    controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  }

  handleDiscoveryClick = () => {
    const { controller } = this.props;
    controller.toggleDiscoveryScreen();
  }

  handleClosedCaptionClick = () => {
    const { controller } = this.props;
    controller.toggleScreen(CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN);
  }

  handleMultiAudioClick = () => {
    const { controller } = this.props;
    if (controller && typeof controller.toggleScreen === 'function') {
      controller.toggleScreen(CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN);
    }
  }

  /**
   * Opens the Playback Speed menu in screen mode when the playback speed button is clicked
   * @private
   */
  handlePlaybackSpeedClick = () => {
    const { controller } = this.props;
    controller.toggleScreen(CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN);
  }

  /**
   * Build list of items for more options panel
   * @returns {Object} map of items
   */
  buildMoreOptionsButtonList = () => {
    const {
      controller,
      language,
      localizableStrings,
      responsiveView,
      skinConfig,
    } = this.props;
    const commonButtonProps = {
      language,
      localizableStrings,
      responsiveView,
      skinConfig,
      controller,
      style: { fontSize: `${skinConfig.moreOptionsScreen.iconSize}px` },
      getTooltipAlignment: () => CONSTANTS.TOOLTIP_ALIGNMENT.CENTER,
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

    const items = controller.state.moreOptionsItems;
    const moreOptionsItems = items.map(item => optionsItemsTemplates[item.name]);
    return moreOptionsItems;
  }

  render() {
    const { animate } = this.state;
    const moreOptionsItemsClass = ClassNames({
      'oo-more-options-items': true,
      'oo-animate-more-options': animate,
    });

    const moreOptionsItems = this.buildMoreOptionsButtonList();

    return (
      <div className="oo-content-panel oo-more-options-panel">
        <div className={moreOptionsItemsClass}>{moreOptionsItems}</div>
      </div>
    );
  }
}

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
