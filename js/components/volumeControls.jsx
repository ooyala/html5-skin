import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Slider from './slider';
import Utils from './utils';
import MACROS from '../constants/macros';
import CONSTANTS from '../constants/constants';

/**
 * Implements the volume controls component
 */
class VolumeControls extends React.Component {
  /**
   * Proceed the volume change
   * @param {number} vol - volume
   */
  volumeChange = (vol) => {
    const { controller } = this.props;
    const newVol = Utils.ensureNumber(vol, 1);
    controller.setVolume(newVol);
    // unmute when volume is changed when muted
    if (newVol !== 0) {
      controller.toggleMute(false, true);
    }
  }

  /**
   * Handle click on the volume icon
   * @param {Object} event - the event object
   */
  handleVolumeClick = (event) => {
    let clickedBarVolume = Utils.getPropertyValue(event, 'currentTarget.dataset.volume');
    // For unit tests, since Jest doesn't currently support dataset and it also doesn't
    // allow overriding currentTarget. The right property to use here is currentTarget.
    // Note that currentTarget should never be null IRL.
    if (typeof clickedBarVolume === 'undefined') {
      clickedBarVolume = Utils.getPropertyValue(event, 'target.dataset.volume');
    }

    if (typeof clickedBarVolume !== 'undefined') {
      event.preventDefault();
      this.volumeChange(clickedBarVolume);
    }
  }

  /**
   * Handle click on the volume slider
   * @param {number} value - the volume equivalent
   */
  handleVolumeSliderChange = (value) => {
    const newVolume = parseFloat(value);
    this.volumeChange(newVolume);
  }

  /**
   * Handle keyboard press on the volume control
   * @param {Object} event - the event object
   */
  handleVolumeCtrlsKeyDown = (event) => {
    const { controller } = this.props;
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        event.preventDefault();
        controller.accessibilityControls.changeVolumeBy(
          CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA,
          true
        );
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        event.preventDefault();
        controller.accessibilityControls.changeVolumeBy(
          CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA,
          false
        );
        break;
      case CONSTANTS.KEY_VALUES.HOME:
        event.preventDefault();
        controller.accessibilityControls.changeVolumeBy(100, false);
        break;
      case CONSTANTS.KEY_VALUES.END:
        event.preventDefault();
        controller.accessibilityControls.changeVolumeBy(100, true);
        break;
      default:
        break;
    }
  }

  /**
   * Handle 1st phase of a mouse click on the volume control
   * @param {Object} event - the event object
   */
  handleVolumeCtrlsMouseDown = (event) => {
    // Prevent focus highlight from flashing when clicking on
    // the volume controls since the CSS workaround doesn't work on IE.
    if (Utils.isIE()) {
      event.preventDefault();
    }
  }

  /**
   * Converts the current player volume value to a percentage.
   * @returns {String} A string that represents the volume as a percentage from 0 to 100.
   */
  getVolumePercent = () => {
    const { controller } = this.props;
    return (controller.state.volumeState.volume * 100).toFixed(0);
  }

  /**
   * Converts the current volume value to a screen reader friendly format.
   * @returns {String} The current volume in a screen reader friendly format (i.e. 20% volume).
   */
  getAriaValueText = () => {
    const { controller } = this.props;
    if (controller.state.volumeState.muted) {
      return CONSTANTS.ARIA_LABELS.MUTED;
    }
    return CONSTANTS.ARIA_LABELS.VOLUME_PERCENT.replace(MACROS.VOLUME, this.getVolumePercent());
  }

  /**
   * Builds the volume bar controls that are shown on desktop.
   * @returns {ReactElement} - volumeBar react element
   */
  renderVolumeBars = () => {
    const { controller, skinConfig } = this.props;
    const volumeBars = [...Array(10).keys()].map((tick) => {
      // Create each volume tick separately
      const barVolume = (tick + 1) / 10;
      const turnedOn = controller.state.volumeState.volume >= barVolume
        && !controller.state.volumeState.muted;
      const volumeClass = ClassNames({
        'oo-volume-bar': true,
        'oo-on': turnedOn,
      });
      const barStyle = {
        backgroundColor: skinConfig.controlBar.volumeControl.color
          ? skinConfig.controlBar.volumeControl.color
          : skinConfig.general.accentColor,
      };

      return (
        <a // eslint-disable-line
          data-volume={barVolume}
          className={volumeClass}
          key={tick}
          style={barStyle}
          onClick={this.handleVolumeClick}
          aria-hidden="true"
        >
          <span className="oo-click-extender" />
        </a>
      );
    });

    const volumePercent = this.getVolumePercent();
    const ariaValueText = this.getAriaValueText();

    return (
      <span
        className="oo-volume-controls"
        role="slider"
        aria-label={CONSTANTS.ARIA_LABELS.VOLUME_SLIDER}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={volumePercent}
        aria-valuetext={ariaValueText}
        data-focus-id={CONSTANTS.FOCUS_IDS.VOLUME_CONTROLS}
        tabIndex="0"
        onMouseDown={this.handleVolumeCtrlsMouseDown}
        onMouseUp={Utils.blurOnMouseUp}
        onKeyDown={this.handleVolumeCtrlsKeyDown}
      >
        {volumeBars}
      </span>
    );
  }

  /**
   * Renders the volume slider that is shown on mobile web.
   * @returns {React.Element} volume slider element
   */
  renderVolumeSlider = () => {
    const { controller } = this.props;
    const volume = controller.state.volumeState.muted
      ? 0
      : parseFloat(controller.state.volumeState.volume);
    return (
      <div className="oo-volume-slider">
        <Slider
          value={volume}
          className="oo-slider-volume"
          itemRef="volumeSlider"
          role="presentation"
          minValue={0}
          maxValue={1}
          step={0.1}
          usePercentageForAria
          ariaLabel={CONSTANTS.ARIA_LABELS.VOLUME_SLIDER}
          settingName={CONSTANTS.ARIA_LABELS.VOLUME_SLIDER}
          focusId={CONSTANTS.FOCUS_IDS.VOLUME_SLIDER}
          onChange={this.handleVolumeSliderChange}
        />
      </div>
    );
  }

  render() {
    const { controller } = this.props;
    if (controller.state.audioOnly) {
      return this.renderVolumeSlider();
    }
    if (controller.state.isMobile) {
      if (controller.state.volumeState.volumeSliderVisible) {
        return this.renderVolumeSlider();
      }
      return null;
    }
    return this.renderVolumeBars();
  }
}

VolumeControls.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      audioOnly: PropTypes.bool,
      isMobile: PropTypes.bool.isRequired,
      volumeState: PropTypes.shape({
        volumeSliderVisible: PropTypes.bool.isRequired,
        volume: PropTypes.number.isRequired,
        muted: PropTypes.bool.isRequired,
      }),
    }),
    setVolume: PropTypes.func.isRequired,
  }).isRequired,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
    controlBar: PropTypes.shape({
      volumeControl: PropTypes.shape({
        color: PropTypes.string,
      }),
    }),
  }),
};

VolumeControls.defaultProps = {
  skinConfig: {
    general: {
      accentColor: '#448aff',
    },
    controlBar: {
      volumeControl: {
        color: '#448aff',
      },
    },
  },
};

module.exports = VolumeControls;
