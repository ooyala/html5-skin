var React = require('react'),
    ClassNames = require('classnames'),
    MACROS = require('../constants/macros'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils');

var Slider = React.createClass({

  componentDidMount: function() {
    this.handleSliderColoring(this.props);

    if (this.isIeFixRequired()) {
      this.valueObserver = this.setUpValueObserver(this.refs[this.props.itemRef]);
    }
  },

  componentWillUnmount: function() {
    if (this.valueObserver && typeof this.valueObserver.disconnect === 'function') {
      this.valueObserver.disconnect();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value != this.props.value) {
      this.handleSliderColoring(nextProps);
    }
  },

  handleSliderColoring: function(props) {
    if (!Utils.isEdge()) {
      var input = this.refs[this.props.itemRef];
      var style = window.getComputedStyle(input, null);

      var colorBeforeThumb = style.getPropertyValue('border-left-color');
      var colorAfterThumb = style.getPropertyValue('border-right-color');

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
    if (!event.target) {
      return;
    }
    var value = Utils.ensureNumber(event.target.value, 0);
    // These browsers might return a super small fractional number instead of 0
    // in some cases, this is a workaround for that.
    if (Utils.isIE() || Utils.isEdge()) {
      value = Utils.toFixedNumber(value, 2);
    }

    if (event.type === 'change' && !Utils.isIE()) {
      this.props.onChange(value);
      this.handleSliderColoring(this.props);
    } else if (Utils.isIE()) {
      this.props.onChange(value);
    }
  },

  /**
   * Determines whether a workaround is required for the IE11 issue in which
   * change event doesn't fire when controlling slider with keyboard.
   * @private
   * @return {Boolean} True if the fix is required, false otherwise
   */
  isIeFixRequired: function() {
    return Utils.isIE();
  },

  /**
   * Sets up a MutationObserver that monitors changes to the input's value attribute.
   * This is needed as a workaround for an IE11 issue in which the change event is
   * not triggered when controlling the input with the arrow keys.
   * @private
   * @param {Node} target The html element which we want to observe.
   * @return {MutationObserver} The new mutation observer instance that was set up or undefined if setup failed.
   */
  setUpValueObserver: function(target) {
    if (!target || !window.MutationObserver) {
      return;
    }
    var observer = new MutationObserver(this.triggerOnChangeForIe);
    var observerConfig = {
      attributes: true,
      attributeFilter: ['value']
    };
    observer.observe(target, observerConfig);
    return observer;
  },

  /**
   * Workaround for IE11. This is call by the mutation observer when a change to
   * the value attribute is detected. We execute the this.props.onChange callback when this
   * happens in order to let React update the UI.
   * @private
   */
  triggerOnChangeForIe: function() {
    var domElement = this.refs[this.props.itemRef];

    if (domElement) {
      // Note that we use the attribute's value, rather than the element's value
      // property, which seems to have the wrong value some times.
      var newValue = Utils.ensureNumber(domElement.getAttribute('value'), 0);
      this.props.onChange(newValue);
    }
  },

  onMouseDown: function() {
    this.dragging = true;
  },

  onMouseUp: function(event) {
    this.dragging = false;
    Utils.blurOnMouseUp(event);
  },

  onMouseMove: function(event) {
    // Avoid showing the keyboard focus outline when dragging the slider with the mouse
    if (this.dragging) {
      Utils.blurOnMouseUp(event);
    }
    // IE11 doesn't update the value by itself when dragging the slider
    // with the mouse
    if (this.isIeFixRequired()) {
      this.changeValue(event);
    }
  },

  /**
   * Simulates keyboard interaction for IE11 which doesn't properly support it.
   * @private
   * @param {Event} event The keydown event object.
   */
  onKeyDown: function(event) {
    var value;

    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        value = this.getNextSliderValue(true);
        event.target.setAttribute('value', value);
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        value = this.getNextSliderValue(false);
        event.target.setAttribute('value', value);
        break;
      case CONSTANTS.KEY_VALUES.HOME:
        event.target.setAttribute('value', Utils.ensureNumber(this.props.minValue, this.props.value));
        break;
      case CONSTANTS.KEY_VALUES.END:
        event.target.setAttribute('value', Utils.ensureNumber(this.props.maxValue, this.props.value));
        break;
      default:
        break;
    }
  },

  /**
   * Gets the 'next' value on the slider as determined by the configured values of min,
   * max and step, as well as the current value. The forward parameter determines whether
   * to get the next value to the right or to the left of the current value.
   * This is needed as a workaround for an IE11 issue and should only be used for this purpose.
   * @private
   * @param {Boolean} forward If true gets the value to the right of the current value or the one to the left otherwise.
   * @return {Number} The next value to the left or right of the current value.
   */
  getNextSliderValue: function(forward) {
    var value = 0;
    var sign = forward ? 1 : -1;
    var delta = Utils.ensureNumber(this.props.value) + (Utils.ensureNumber(this.props.step, 1) * sign);
    var min = Utils.ensureNumber(this.props.minValue, -Infinity);
    var max = Utils.ensureNumber(this.props.maxValue, Infinity);
    value = Utils.constrainToRange(delta, min, max);
    value = Utils.toFixedNumber(value, 2);
    return value;
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
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onChange={this.changeValue}
        onClick={this.changeValue}
        onMouseMove={this.onMouseMove}
        onKeyDown={this.isIeFixRequired() ? this.onKeyDown : null}/>
    );
  }
});

Slider.propTypes = {
  value: React.PropTypes.number,
  minValue: React.PropTypes.number,
  maxValue: React.PropTypes.number,
  step: React.PropTypes.number,
  onChange: React.PropTypes.func,
  ariaLabel: React.PropTypes.string,
  usePercentageForAria: React.PropTypes.bool,
  settingName: React.PropTypes.string,
  className: React.PropTypes.string,
  itemRef: React.PropTypes.string
};

Slider.defaultProps = Object.create({}, {
  focusId: {
    enumerable: true,
    get: function() {
      return Math.random().toString(36).substr(2, 10);
    }
  }
});

Slider.defaultProps.usePercentageForAria = false;

module.exports = Slider;
