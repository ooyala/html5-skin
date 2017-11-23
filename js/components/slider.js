var React = require('react'),
    ClassNames = require('classnames'),
    MACROS = require('../constants/macros'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils');

var Slider = React.createClass({

  componentDidMount: function() {
    this.handleSliderColoring(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value != this.props.value) {
      this.handleSliderColoring(nextProps);
    }
  },

  handleSliderColoring: function(props){
    if (!Utils.isEdge()){
      var input = this.refs[this.props.itemRef];
      var style = window.getComputedStyle(input, null);

      var colorBeforeThumb = style.getPropertyValue("border-left-color");
      var colorAfterThumb = style.getPropertyValue("border-right-color");

      var value = (props.value - props.minValue)/(props.maxValue - props.minValue);
      input.style.backgroundImage = [
        '-webkit-gradient(',
          'linear, ',
          'left top, ',
          'right top, ',
          'color-stop(' + value + ', '+ colorBeforeThumb + '), ',
          'color-stop(' + value + ', '+ colorAfterThumb + ')',
        ')'
      ].join('');
    }
  },

  changeValue: function(event) {
    if (event.type == 'change' && !Utils.isIE()){
      this.props.onChange(event);
      this.handleSliderColoring(this.props);
    }
    else if (Utils.isIE()) {
      this.props.onChange(event);
    }
  },

  /**
   * Uses the slider settings to generate the values for the different aria attributes
   * associated with sliders. Will format values as a percentage if this.props.usePercentageForAria
   * is set to true.
   * @private
   * @return {Object} An object with the following properties: valueMin, valueMax, valueNow, valueText.
   */
  getAriaValues: function() {
    var aria = {};

    if (this.props.usePercentageForAria) {
      aria.valueMin = 0;
      aria.valueMax = 100;
      aria.valueNow = Utils.ensureNumber(this.props.value, 0) * 100 / Utils.ensureNumber(this.props.maxValue, 1);
      aria.valueText = CONSTANTS.ARIA_LABELS.SLIDER_VALUE_TEXT;
      aria.valueText = aria.valueText.replace(MACROS.PERCENT, aria.valueNow).replace(MACROS.SETTING, this.props.settingName);
    } else {
      aria.valueMin = this.props.minValue;
      aria.valueMax = this.props.maxValue;
      aria.valueNow = this.props.value;
      aria.valueText = aria.valueNow + ' ' + this.props.settingName;
    }
    return aria;
  },

  render: function() {
    var aria = this.getAriaValues();

    return (
      <input
        type="range"
        ref={this.props.itemRef}
        className={ClassNames('oo-slider', this.props.className)}
        min={this.props.minValue}
        max={this.props.maxValue}
        value={this.props.value}
        step={this.props.step}
        data-focus-id={this.props.focusId}
        tabIndex="0"
        aria-label={this.props.ariaLabel}
        aria-valuemin={aria.valueMin}
        aria-valuemax={aria.valueMax}
        aria-valuenow={aria.valueNow}
        aria-valuetext={aria.valueText}
        role={CONSTANTS.ARIA_ROLES.SLIDER}
        onMouseUp={Utils.blurOnMouseUp}
        onChange={this.changeValue}
        onClick={this.changeValue}/>
    );
  }
});

Slider.defaultProps = {
  focusId: Math.random().toString(36).substr(2, 10),
  usePercentageForAria: false,
};

module.exports = Slider;
