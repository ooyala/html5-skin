const React = require('react');
const ControlButton = require('./controlButton');
const classNames = require('classnames');
const PropTypes = require('prop-types');
const Utils = require('./utils');
const CONSTANTS = require('../constants/constants');
const MACROS = require('../constants/macros');

class PlaybackSpeedButton extends React.Component {
  render() {
    const currentSpeed = Utils.getPropertyValue(
      this.props.controller,
      'state.advancedPlaybackOptions.currentSpeed',
      1
    );
    const ariaLabel = CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED.replace(MACROS.RATE, currentSpeed);

    return (
      <ControlButton
        {...this.props}
        className={classNames('oo-playback-speed', this.props.className)}
        ariaLabel={ariaLabel}>
        <span class="oo-current-speed oo-icon">{currentSpeed}x</span>
        {this.props.children}
      </ControlButton>
    );
  }
}

PlaybackSpeedButton.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      advancedPlaybackOptions: PropTypes.shape({
        currentSpeed: PropTypes.number.isRequired
      })
    })
  })
};

module.exports = PlaybackSpeedButton;
