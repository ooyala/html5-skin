var React = require('react');
var ReactDOM = require('react-dom');
var ClassNames = require('classnames');
var Slider = require('./slider');
var Utils = require('./utils');
var MACROS = require('../constants/macros');
var CONSTANTS = require('../constants/constants');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var VolumeControls = createReactClass({
  volumeChange: function(vol) {
    var newVol = Utils.ensureNumber(vol, 1);
    this.props.controller.setVolume(newVol);
    // unmute when volume is changed when muted
    if (newVol !== 0) {
      this.props.controller.toggleMute(false, true);
    }
  },

  handleVolumeClick: function(event) {
    var clickedBarVolume = Utils.getPropertyValue(event, 'currentTarget.dataset.volume');
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
  },

  handleVolumeSliderChange: function(value) {
    var newVolume = parseFloat(value);
    this.volumeChange(newVolume);
  },

  handleVolumeCtrlsKeyDown: function(evt) {
    switch (evt.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        evt.preventDefault();
        this.props.controller.accessibilityControls.changeVolumeBy(
          CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA,
          true
        );
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        evt.preventDefault();
        this.props.controller.accessibilityControls.changeVolumeBy(
          CONSTANTS.A11Y_CTRLS.VOLUME_CHANGE_DELTA,
          false
        );
        break;
      case CONSTANTS.KEY_VALUES.HOME:
        evt.preventDefault();
        this.props.controller.accessibilityControls.changeVolumeBy(100, false);
        break;
      case CONSTANTS.KEY_VALUES.END:
        evt.preventDefault();
        this.props.controller.accessibilityControls.changeVolumeBy(100, true);
        break;
      default:
        break;
    }
  },

  handleVolumeCtrlsMouseDown: function(event) {
    // Prevent focus highlight from flashing when clicking on
    // the volume controls since the CSS workaround doesn't work on IE.
    if (Utils.isIE()) {
      event.preventDefault();
    }
  },

  /**
   * Converts the current player volume value to a percentage.
   *
   * @returns {String} A string that represents the volume as a percentage from 0 to 100.
   */
  getVolumePercent: function() {
    return (this.props.controller.state.volumeState.volume * 100).toFixed(0);
  },

  /**
   * Converts the current volume value to a screen reader friendly format.
   *
   * @returns {String} The current volume in a screen reader friendly format (i.e. 20% volume).
   */
  getAriaValueText: function() {
    return CONSTANTS.ARIA_LABELS.VOLUME_PERCENT.replace(MACROS.VOLUME, this.getVolumePercent());
  },

  /**
   * Builds the volume bar controls that are shown on desktop.
   * @returns {ReactElement} - volumeBar react element
   */
  renderVolumeBars: function() {
    var volumeBars = [];

    for (var i = 0; i < 10; i++) {
      // Create each volume tick separately
      var barVolume = (i + 1) / 10;
      var turnedOn =
        this.props.controller.state.volumeState.volume >= barVolume &&
        !this.props.controller.state.volumeState.muted;
      var volumeClass = ClassNames({
        'oo-volume-bar': true,
        'oo-on': turnedOn
      });
      var barStyle = {
        backgroundColor: this.props.skinConfig.controlBar.volumeControl.color
          ? this.props.skinConfig.controlBar.volumeControl.color
          : this.props.skinConfig.general.accentColor
      };

      volumeBars.push(
        <a
          data-volume={barVolume}
          className={volumeClass}
          key={i}
          style={barStyle}
          onClick={this.handleVolumeClick}
          aria-hidden="true"
        >
          <span className="oo-click-extender" />
        </a>
      );
    }

    var volumePercent = this.getVolumePercent();
    var ariaValueText = this.getAriaValueText();

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
  },

  /**
   * Renders the volume slider that is shown on mobile web.
   * @returns {React.Element} volume slider element
   */
  renderVolumeSlider: function() {
    var volume = this.props.controller.state.volumeState.muted
      ? 0
      : parseFloat(this.props.controller.state.volumeState.volume);
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
          usePercentageForAria={true}
          ariaLabel={CONSTANTS.ARIA_LABELS.VOLUME_SLIDER}
          settingName={CONSTANTS.ARIA_LABELS.VOLUME_SLIDER}
          focusId={CONSTANTS.FOCUS_IDS.VOLUME_SLIDER}
          onChange={this.handleVolumeSliderChange}
        />
      </div>
    );
  },

  render: function() {
    if (this.props.controller.state.isMobile) {
      if (this.props.controller.state.volumeState.volumeSliderVisible) {
        return this.renderVolumeSlider();
      } else {
        return null;
      }
    } else {
      return this.renderVolumeBars();
    }
  }
});

VolumeControls.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      isMobile: PropTypes.bool.isRequired,
      volumeState: PropTypes.shape({
        volumeSliderVisible: PropTypes.bool.isRequired,
        volume: PropTypes.number.isRequired,
        muted: PropTypes.bool.isRequired
      })
    }),
    setVolume: PropTypes.func.isRequired
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string
    }),
    controlBar: PropTypes.shape({
      volumeControl: PropTypes.shape({
        color: PropTypes.string
      })
    })
  })
};

VolumeControls.defaultProps = {
  skinConfig: {
    general: {
      accentColor: '#448aff'
    },
    controlBar: {
      volumeControl: {
        color: '#448aff'
      }
    }
  }
};

module.exports = VolumeControls;
