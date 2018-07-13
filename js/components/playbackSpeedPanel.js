const React = require('react');
const ScrollArea = require('react-scrollbar/dist/no-css');
const AccessibleMenu = require('./higher-order/accessibleMenu');
const AccessibleButton = require('./accessibleButton');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');
const MACROS = require('../constants/macros');

class PlaybackSpeedPanel extends React.Component {

  constructor(props) {
    super(props);
    this.onSpeedOptionClick = this.onSpeedOptionClick.bind(this);
  }

  onSpeedOptionClick(speed) {
    const { controller, onClose } = this.props;
    controller.setPlaybackSpeed(speed);

    if (typeof onClose === 'function') {
      onClose({ restoreToggleButtonFocus: true });
    }
  }

  getPlaybackSpeedOptions() {
    const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
    return playbackSpeedOptions;
  }

  /**
   *
   * @private
   * @param {Number} speedOption
   * @param {String} selectedValue
   * @param {String} accentColor
   * @return {Component}
   */
  getMenuItemForOption(speedOption, selectedValue, accentColor) {
    const isSelected = speedOption === selectedValue;

    const buttonClassName = classNames('oo-quality-btn', {
      'oo-selected': isSelected
    });
    const buttonStyle = {
      color: isSelected ? accentColor : null
    };

    let buttonLabel;
    if (speedOption === CONSTANTS.UI.DEFAULT_PLAYBACK_SPEED) {
      buttonLabel = CONSTANTS.SKIN_TEXT.NORMAL_SPEED;
    } else {
      buttonLabel = `${speedOption}x`;
    }

    return (
      <li key={speedOption} role="presentation">
        <AccessibleButton
          className={buttonClassName}
          style={buttonStyle}
          focusId={CONSTANTS.FOCUS_IDS.PLAYBACK_SPEED + speedOption}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          ariaLabel={CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED.replace(MACROS.RATE, speedOption)}
          ariaChecked={isSelected}
          onClick={this.onSpeedOptionClick.bind(this, speedOption)}>
          {buttonLabel}
        </AccessibleButton>
      </li>
    );
  }

  render() {
    const { isPopover, controller, skinConfig } = this.props;
    const playbackSpeedOptions = this.getPlaybackSpeedOptions();

    const selectedValue = Utils.getPropertyValue(
      controller,
      'state.playbackSpeedOptions.currentSpeed',
      CONSTANTS.UI.DEFAULT_PLAYBACK_SPEED
    );
    const accentColor = Utils.getPropertyValue(
      skinConfig,
      'general.accentColor',
      null
    );
    const className = classNames('oo-playback-speed-panel', {
      'oo-quality-popover': isPopover,
      'oo-content-panel oo-quality-panel': !isPopover
    });

    return (
      <div className={className}>

        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? CONSTANTS.UI.POPOVER_SCROLL_RATE : 1}>

          {isPopover &&
            <div className="oo-menu-title">{CONSTANTS.SKIN_TEXT.PLAYBACK_SPEED}</div>
          }

          <ul role="menu">
            {playbackSpeedOptions.map(speedOption =>
              this.getMenuItemForOption(speedOption, selectedValue, accentColor)
            )}
          </ul>

        </ScrollArea>

      </div>
    );
  }
};

PlaybackSpeedPanel.propTypes = {
  isPopover: PropTypes.bool,
  controller: PropTypes.shape({
    state: PropTypes.shape({
      playbackSpeedOptions: PropTypes.shape({
        currentSpeed: PropTypes.number.isRequired
      })
    }),
    setPlaybackSpeed: PropTypes.func.isRequired
  }),
  onClose: PropTypes.func
};

module.exports = AccessibleMenu(PlaybackSpeedPanel);
