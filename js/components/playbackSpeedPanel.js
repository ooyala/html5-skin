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

  render() {
    const playbackSpeedOptions = this.getPlaybackSpeedOptions();

    return (
      <div className="oo-quality-popover oo-playback-speed-panel">

        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? CONSTANTS.UI.POPOVER_SCROLL_RATE : 1}
          horizontal={!this.props.popover}>

          <ul role="menu">
            {playbackSpeedOptions.map(speedOption => (
              <li key={speedOption} role="presentation">
                <AccessibleButton
                  className="oo-quality-btn"
                  style={{}}
                  focusId={CONSTANTS.FOCUS_IDS.PLAYBACK_SPEED + speedOption}
                  role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
                  ariaLabel={CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED.replace(MACROS.RATE, speedOption)}
                  ariaChecked={false}
                  onClick={this.onSpeedOptionClick.bind(this, speedOption)}>
                  {speedOption}x
                </AccessibleButton>
              </li>
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

module.exports = PlaybackSpeedPanel;
