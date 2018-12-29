const React = require('react');
const PropTypes = require('prop-types');
const MenuPanel = require('./menuPanel');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');
const MACROS = require('../constants/macros');

/**
 * Playback Speed options menu. This component is used for both the Popover and
 * Screen modes of the menu.
 */
class PlaybackSpeedPanel extends React.Component {
  constructor(props) {
    super(props);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
  }

  /**
   * Handles menu item clicks.
   * @private
   * @param {String} itemValue The value of the menu item that was clicked
   */
  onMenuItemClick(itemValue) {
    const { controller } = this.props;
    controller.setPlaybackSpeed(itemValue);
  }

  /**
   * Extracts and normalizes the configured speed options to use for the menu.
   * @private
   * @returns {Array} The array of sorted values to use for the menu items, constrained
   * to min and max values and truncated to 2 decimals
   */
  getPlaybackSpeedOptions() {
    // Only process speed options once per component mount
    if (!this.playbackSpeedOptions) {
      // Get configured values from skin
      this.playbackSpeedOptions = Utils.getPropertyValue(
        this.props.skinConfig,
        'playbackSpeed.options',
        CONSTANTS.PLAYBACK_SPEED.DEFAULT_OPTIONS
      );
      // Constrain to min and max values and ensure at most 2 decimals
      this.playbackSpeedOptions = this.playbackSpeedOptions.map(option => Utils.sanitizePlaybackSpeed(option));
      // Remove duplicates
      this.playbackSpeedOptions = Utils.dedupeArray(this.playbackSpeedOptions);
      // Sort in ascending order
      this.playbackSpeedOptions.sort((a, b) => a - b);
    }
    return this.playbackSpeedOptions;
  }

  /**
   * Maps playback speed options to menu item objects that contain the label, aria
   * labe, etc., that will be displayed by the menu panel
   * @private
   * @returns {Array} An array of menu items with the existing playback speed options
   */
  getMenuItems() {
    const { language, localizableStrings } = this.props;
    const playbackSpeedOptions = this.getPlaybackSpeedOptions();

    const menuItems = playbackSpeedOptions.map((option) => {
      let itemLabel;
      let ariaLabel;

      if (option === CONSTANTS.PLAYBACK_SPEED.DEFAULT_VALUE) {
        itemLabel = Utils.getLocalizedString(
          language,
          CONSTANTS.SKIN_TEXT.NORMAL_SPEED,
          localizableStrings
        );
        ariaLabel = CONSTANTS.ARIA_LABELS.NORMAL_SPEED;
      } else {
        itemLabel = `${option}x`;
        ariaLabel = CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED.replace(MACROS.RATE, option);
      }

      const menuItem = {
        value: option,
        label: itemLabel,
        ariaLabel,
      };
      return menuItem;
    });
    return menuItems;
  }

  render() {
    const menuItems = this.getMenuItems();
    const {
      isPopover,
      language,
      localizableStrings,
      controller,
      skinConfig,
      onClose,
    } = this.props;

    const selectedValue = Utils.getPropertyValue(
      controller,
      'state.playbackSpeedOptions.currentSpeed',
      CONSTANTS.UI.DEFAULT_PLAYBACK_SPEED
    );
    const title = Utils.getLocalizedString(
      language,
      isPopover ? CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED : '',
      localizableStrings
    );

    return (
      <MenuPanel
        className="oo-playback-speed-panel"
        title={title}
        selectedValue={selectedValue}
        isPopover={isPopover}
        skinConfig={skinConfig}
        menuItems={menuItems}
        onMenuItemClick={this.onMenuItemClick}
        onClose={onClose}
      />
    );
  }
}

PlaybackSpeedPanel.propTypes = {
  isPopover: PropTypes.bool,
  language: PropTypes.string.isRequired,
  localizableStrings: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  controller: PropTypes.shape({
    state: PropTypes.shape({
      playbackSpeedOptions: PropTypes.shape({
        currentSpeed: PropTypes.number.isRequired,
      }),
    }),
    setPlaybackSpeed: PropTypes.func.isRequired,
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
    playbackSpeed: PropTypes.shape({
      options: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  }),
};

module.exports = PlaybackSpeedPanel;
