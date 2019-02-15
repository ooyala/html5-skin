import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ControlButton from './controlButton';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

/**
 * Playback speed button implementation
 */
class PlaybackSpeedButton extends React.Component { // eslint-disable-line
  render() {
    const { children, className, controller } = this.props;
    const currentSpeed = Utils.getPropertyValue(
      controller,
      'state.playbackSpeedOptions.currentSpeed',
      1
    );
    const ariaLabel = CONSTANTS.ARIA_LABELS.PLAYBACK_SPEED_OPTION;

    return (
      <ControlButton
        {...this.props}
        className={classNames('oo-playback-speed', className)}
        ariaLabel={ariaLabel}
      >
        <span className="oo-current-speed oo-icon">
          {currentSpeed}
x
        </span>
        {children}
      </ControlButton>
    );
  }
}

PlaybackSpeedButton.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      playbackSpeedOptions: PropTypes.shape({
        currentSpeed: PropTypes.number.isRequired,
      }),
    }),
  }).isRequired,
};

module.exports = PlaybackSpeedButton;
