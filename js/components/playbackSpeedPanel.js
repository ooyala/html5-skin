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
    this.props.controller.setPlaybackSpeed(speed);

    this.props.onClose({
      restoreToggleButtonFocus: true
    });
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
      buttonLabel = 'Normal';
    } else {
      buttonLabel =`${speedOption}x`;
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
    const playbackSpeedOptions = this.getPlaybackSpeedOptions();

    const selectedValue = Utils.getPropertyValue(
      this.props.controller,
      'state.playbackSpeedOptions.currentSpeed',
      CONSTANTS.UI.DEFAULT_PLAYBACK_SPEED
    );
    const accentColor = Utils.getPropertyValue(
      this.props.skinConfig,
      'general.accentColor',
      null
    );

    return (
      <div className="oo-quality-popover oo-playback-speed-panel">

        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? CONSTANTS.UI.POPOVER_SCROLL_RATE : 1}>

          <div className="oo-menu-title">Speed</div>

          <ul role="menu">
            {playbackSpeedOptions.map(speedOption => (
              this.getMenuItemForOption(speedOption, selectedValue, accentColor)
            ))}
          </ul>

        </ScrollArea>

      </div>
    );
  }
};

PlaybackSpeedPanel.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      playbackSpeedOptions: PropTypes.shape({
        currentSpeed: PropTypes.number.isRequired
      })
    }),
    setPlaybackSpeed: PropTypes.func.isRequired
  })
};

module.exports = AccessibleMenu(PlaybackSpeedPanel);
