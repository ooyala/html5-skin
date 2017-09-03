var React = require('react');
var ReactDOM = require('react-dom');
var ClassNames = require('classnames');
var Slider = require('./slider');
var CONSTANTS = require('../constants/constants');

var VolumeControls = React.createClass({

  handleVolumeClick: function(event) {
    event.preventDefault();
    var newVolume = parseFloat(event.target.dataset.volume);
    this.props.controller.setVolume(newVolume);
  },

  handleVolumeSliderChange: function(event) {
    var newVolume = parseFloat(event.target.value);
    this.props.controller.setVolume(newVolume);
  },

  handleVolumeSliderKeyDown: function(evt) {
    switch (evt.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        evt.preventDefault();
        this.props.controller.changeVolumeBy(10, true);
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        evt.preventDefault();
        this.props.controller.changeVolumeBy(10, false);
        break;
      case CONSTANTS.KEY_VALUES.HOME:
        evt.preventDefault();
        this.props.controller.changeVolumeBy(100, false);
        break;
      case CONSTANTS.KEY_VALUES.END:
        evt.preventDefault();
        this.props.controller.changeVolumeBy(100, true);
        break;
      default:
        break;
    }
  },

  /**
   * Some browsers give focus to buttons after click, which leaves
   * them highlighted. This overrides the browser's default behavior.
   *
   * @param {event} evt The mouse up event object
   */
  blurOnMouseUp: function (event) {
    if (event.currentTarget && event.currentTarget.blur) {
      event.currentTarget.blur();
    }
  },

  getVolumePercent: function() {
    return (this.props.controller.state.volumeState.volume * 100).toFixed(0);
  },

  getAriaValueText: function() {
    return this.getVolumePercent() + CONSTANTS.ARIA_LABELS.VOLUME_PERCENT;
  },

  renderVolumeBars: function() {
    var volumeBars = [];

    for (var i = 0; i < 10; i++) {
      // Create each volume tick separately
      var turnedOn = this.props.controller.state.volumeState.volume >= (i + 1) / 10;
      var volumeClass = ClassNames({
        'oo-volume-bar': true,
        'oo-on': turnedOn
      });
      var barStyle = {
        backgroundColor: this.props.skinConfig.controlBar.volumeControl.color ? this.props.skinConfig.controlBar.volumeControl.color : this.props.skinConfig.general.accentColor
      };

      volumeBars.push(
        <a data-volume={(i + 1) / 10}
          className={volumeClass}
          key={i}
          style={barStyle}
          onClick={this.handleVolumeClick}
          aria-hidden="true">
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
        data-focus-id="volumeControls"
        tabIndex="0"
        onMouseUp={this.blurOnMouseUp}
        onKeyDown={this.handleVolumeSliderKeyDown}>
        {volumeBars}
      </span>
    );
  },

  renderVolumeSlider: function() {
    var volumePercent = this.getVolumePercent();
    var ariaValueText = this.getAriaValueText();

    return (
      <div
        className="oo-volume-slider"
        role="slider"
        aria-label={CONSTANTS.ARIA_LABELS.VOLUME_SLIDER}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={volumePercent}
        aria-valuetext={ariaValueText}
        data-focus-id="volumeSlider"
        tabIndex="0"
        onMouseUp={this.blurOnMouseUp}
        onKeyDown={this.handleVolumeSliderKeyDown}>
        <Slider
          value={parseFloat(this.props.controller.state.volumeState.volume)}
          className="oo-slider oo-slider-volume"
          itemRef="volumeSlider"
          role="presentation"
          minValue="0"
          maxValue="1"
          step="0.1"
          onChange={this.handleVolumeSliderChange} />
      </div>
    );
  },

  render: function () {
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
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool.isRequired,
      volumeState: React.PropTypes.shape({
        volumeSliderVisible: React.PropTypes.bool.isRequired,
        volume: React.PropTypes.number.isRequired
      })
    }),
    setVolume: React.PropTypes.func.isRequired
  }),
  skinConfig: React.PropTypes.shape({
    general: React.PropTypes.shape({
      accentColor: React.PropTypes.string
    }),
    controlBar: React.PropTypes.shape({
      volumeControl: React.PropTypes.shape({
        color: React.PropTypes.string
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
