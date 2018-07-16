const React = require('react');
const MenuPanel = require('./menuPanel');
const PropTypes = require('prop-types');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');
const MACROS = require('../constants/macros');

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
   * Maps playback speed options to menu item objects that contain the label, aria
   * labe, etc., that will be displayed by the menu panel
   * @private
   * @return {Array} An array of menu items with the existing playback speed options
   */
  getMenuItems() {
    const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    const menuItems = playbackSpeedOptions.map(option => {
      let itemLabel;

      if (option === CONSTANTS.UI.DEFAULT_PLAYBACK_SPEED) {
        itemLabel = CONSTANTS.SKIN_TEXT.NORMAL_SPEED;
      } else {
        itemLabel = `${option}x`;
      }

      const menuItem = {
        value: option,
        label: itemLabel,
        ariaLabel: CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED.replace(MACROS.RATE, option)
      };
      return menuItem;
    });
    return menuItems;
  }

  render() {
    const menuItems = this.getMenuItems();
    const { isPopover, controller, skinConfig, onClose } = this.props;

    const selectedValue = Utils.getPropertyValue(
      controller,
      'state.playbackSpeedOptions.currentSpeed',
      CONSTANTS.UI.DEFAULT_PLAYBACK_SPEED
    );

    return (
      <MenuPanel
        className="oo-playback-speed-panel"
        title={isPopover ? CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED : ''}
        selectedValue={selectedValue}
        isPopover={isPopover}
        skinConfig={skinConfig}
        menuItems={menuItems}
        onMenuItemClick={this.onMenuItemClick}
        onClose={onClose} />
    );
  }
};

PlaybackSpeedPanel.propTypes = {
  isPopover: PropTypes.bool,
  onClose: PropTypes.func,
  controller: PropTypes.shape({
    state: PropTypes.shape({
      playbackSpeedOptions: PropTypes.shape({
        currentSpeed: PropTypes.number.isRequired
      })
    }),
    setPlaybackSpeed: PropTypes.func.isRequired
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string
    }),
  })
};

module.exports = PlaybackSpeedPanel;
