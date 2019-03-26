import React from 'react';
import ClassNames from 'classnames';
import CONSTANTS from '../constants/constants';
import ControlButton from './controlButton';
import PlaybackSpeedButton from './playbackSpeedButton';
import Autofocus from './utils/autofocus';

/**
 * More options panel
 */
class MoreOptionsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.autofocus = new Autofocus(props.controller.state, props.controller.toggleButtons);

    this.getToggleButtons = this.autofocus.getToggleButtons.bind(this);
    this.setToggleButtons = this.autofocus.setToggleButtons.bind(this);
    this.configureMenuAutofocus = this.autofocus.configureMenuAutofocus.bind(this);

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
  };

  handleShareClick = () => {
    const { controller } = this.props;
    controller.toggleShareScreen();
  };

  /**
   * Configure autofocus for accessibility and show current screen
   * @param {String} elementScreen screen to show
   * @param {String} menuElement - element to autofocus configure
   */
  handleMenuClick = (elementScreen, menuElement) => {
    const { controller } = this.props;
    if (!controller || typeof controller.toggleScreen !== 'function' || !elementScreen) {
      return;
    }
    this.configureMenuAutofocus(menuElement);
    controller.toggleScreen(elementScreen);
  };

  handleDiscoveryClick = () => {
    const { controller } = this.props;
    controller.toggleDiscoveryScreen();
  };

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
        onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY, menu)}
        className="oo-quality"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.QUALITY}
        ariaLabel={CONSTANTS.ARIA_LABELS.VIDEO_QUALITY}
        icon="quality"
        onClick={() => this.handleMenuClick(
          CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN,
          CONSTANTS.MENU_OPTIONS.VIDEO_QUALITY
        )}
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
        onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.MULTI_AUDIO, menu)}
        className="oo-multiaudio"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.AUDIO_AND_CC}
        ariaLabel={CONSTANTS.ARIA_LABELS.MULTI_AUDIO}
        icon="audioAndCC"
        onClick={() => this.handleMenuClick(
          CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN,
          CONSTANTS.MENU_OPTIONS.MULTI_AUDIO
        )}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION] = (
      <ControlButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
        onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS, menu)}
        className="oo-closed-caption"
        focusId={CONSTANTS.CONTROL_BAR_KEYS.CLOSED_CAPTION}
        ariaLabel={CONSTANTS.ARIA_LABELS.CLOSED_CAPTIONS}
        icon="cc"
        onClick={() => this.handleMenuClick(
          CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN,
          CONSTANTS.MENU_OPTIONS.CLOSED_CAPTIONS
        )}
      />
    );

    optionsItemsTemplates[CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED] = (
      <PlaybackSpeedButton
        {...commonButtonProps}
        key={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
        onRef={menu => this.setToggleButtons(CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED, menu)}
        focusId={CONSTANTS.CONTROL_BAR_KEYS.PLAYBACK_SPEED}
        ariaLabel={CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED}
        onClick={() => this.handleMenuClick(
          CONSTANTS.SCREEN.PLAYBACK_SPEED_SCREEN,
          CONSTANTS.MENU_OPTIONS.PLAYBACK_SPEED
        )}
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
  };

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
