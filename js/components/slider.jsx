import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import MACROS from '../constants/macros';
import CONSTANTS from '../constants/constants';
import Utils from './utils';

/**
 * Represents slider component
 */
class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
    };
  }

  componentDidMount() {
    this.handleSliderColoring(this.props);

    if (Utils.isIE()) {
      this.valueObserver = this.setupValueObserver(this.refs[this.props.itemRef]); // eslint-disable-line
    }
  }

  /**
   * Fire slider coloring if value changed
   * @param {Object} nextProps - the next props object
   */
  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.handleSliderColoring(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.valueObserver && typeof this.valueObserver.disconnect === 'function') {
      this.valueObserver.disconnect();
    }
  }

  /**
   * Uses the slider settings to generate the values for the different aria attributes
   * associated with sliders. Will format values as a percentage if this.props.usePercentageForAria
   * is set to true.
   * @private
   * @returns {Object} An object with the following properties: valueMin, valueMax, valueNow, valueText.
   */
  getAriaValues = () => {
    const aria = {};
    const {
      maxValue,
      minValue,
      settingName,
      usePercentageForAria,
      value,
    } = this.props;
    if (usePercentageForAria) {
      aria.valueMin = 0;
      aria.valueMax = 100;
      aria.valueNow = Utils.ensureNumber(value, 0) * 100 / Utils.ensureNumber(maxValue, 1);
      aria.valueText = CONSTANTS.ARIA_LABELS.SLIDER_VALUE_TEXT;
      aria.valueText = aria.valueText
        .replace(MACROS.PERCENT, aria.valueNow)
        .replace(MACROS.SETTING, settingName);
    } else {
      aria.valueMin = minValue;
      aria.valueMax = maxValue;
      aria.valueNow = value;
      aria.valueText = `${aria.valueNow} ${settingName}`;
    }
    return aria;
  }

  /**
   * Gets the 'next' value on the slider as determined by the configured values of min,
   * max and step, as well as the current value. The forward parameter determines whether
   * to get the next value to the right or to the left of the current value.
   * This is needed as a workaround for an IE11 issue and should only be used for this purpose.
   * @private
   * @param {Boolean} forward If true gets the value to the right of the current value or the one to the left otherwise.
   * @returns {Number} The next value to the left or right of the current value.
   */
  getNextSliderValue = (forward) => {
    const sign = forward ? 1 : -1;
    const {
      minValue,
      maxValue,
      value,
      step,
    } = this.props;
    const delta = Utils.ensureNumber(value) + Utils.ensureNumber(step, 1) * sign;
    const min = Utils.ensureNumber(minValue, -Infinity);
    const max = Utils.ensureNumber(maxValue, Infinity);
    const result = Utils.toFixedNumber(Utils.constrainToRange(delta, min, max), 2);
    return result;
  }

  /**
   * Sets up a MutationObserver that monitors changes to the input's value attribute.
   * This is needed as a workaround for an IE11 issue in which the change event is
   * not triggered when controlling the input with the arrow keys.
   * @private
   * @param {Node} target The html element which we want to observe.
   * @returns {MutationObserver} The new mutation observer instance that was set up or undefined if setup failed.
   */
  setupValueObserver = (target) => {
    if (!target || !window.MutationObserver) {
      return null;
    }
    const observer = new window.MutationObserver(this.triggerOnChangeForIe);
    const observerConfig = {
      attributes: true,
      attributeFilter: ['value'],
    };
    observer.observe(target, observerConfig);
    return observer;
  }

  /**
   * Handle coloring of the slider
   * @param {Object} props - the props object
   */
  handleSliderColoring = (props) => {
    if (Utils.isEdge()) {
      return;
    }
    const input = this.refs[this.props.itemRef]; // eslint-disable-line
    const style = window.getComputedStyle(input, null);

    const colorBeforeThumb = style.getPropertyValue('border-left-color');
    const colorAfterThumb = style.getPropertyValue('border-right-color');

    const value = (props.value - props.minValue) / (props.maxValue - props.minValue);
    input.style.backgroundImage = [
      '-webkit-gradient(',
      'linear, ',
      'left top, ',
      'right top, ',
      `color-stop(${value}, ${colorBeforeThumb}), `,
      `color-stop(${value}, ${colorAfterThumb})`,
      ')',
    ].join('');
  }

  /**
   * change the value
   * @param {Object} event - the event object
   */
  changeValue = (event) => {
    if (!event.target) {
      return;
    }
    let value = Utils.ensureNumber(event.target.value, 0);
    // These browsers might return a super small fractional number instead of 0
    // in some cases, this is a workaround for that.
    if (Utils.isIE() || Utils.isEdge()) {
      value = Utils.toFixedNumber(value, 2);
    }

    const { onChange } = this.props;
    if (event.type === 'change' && !Utils.isIE()) {
      onChange(value);
      this.handleSliderColoring(this.props);
    } else if (Utils.isIE()) {
      onChange(value);
    }
  }

  /**
   * Workaround for IE11. This is call by the mutation observer when a change to
   * the value attribute is detected. We execute the this.props.onChange callback when this
   * happens in order to let React update the UI.
   * @private
   */
  triggerOnChangeForIe = () => {
    const domElement = this.refs[this.props.itemRef]; // eslint-disable-line
    const { onChange } = this.props;

    if (domElement) {
      // Note that we use the attribute's value, rather than the element's value
      // property, which seems to have the wrong value some times.
      const newValue = Utils.ensureNumber(domElement.getAttribute('value'), 0);
      onChange(newValue);
    }
  }

  onMouseDown = () => {
    this.setState({
      isDragging: true,
    });
  }

  /**
   * handle mouse up event
   * @param {Object} event - the event object
   */
  onMouseUp = (event) => {
    Utils.blurOnMouseUp(event);

    this.setState({
      isDragging: false,
    });
  }

  /**
   * IE11 doesn't update the value by itself when dragging the slider with the mouse
   * @param {Object} event - the event object
   */
  onMouseMove = (event) => {
    if (Utils.isIE()) {
      this.changeValue(event);
    }
  }

  /**
   * Simulates keyboard interaction for IE11 which doesn't properly support it.
   * @private
   * @param {Event} event The keydown event object.
   */
  onKeyDown = (event) => {
    const { minValue, maxValue, value } = this.props;
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        event.target.setAttribute('value', this.getNextSliderValue(true));
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        event.target.setAttribute('value', this.getNextSliderValue(false));
        break;
      case CONSTANTS.KEY_VALUES.HOME:
        event.target.setAttribute('value', Utils.ensureNumber(minValue, value));
        break;
      case CONSTANTS.KEY_VALUES.END:
        event.target.setAttribute('value', Utils.ensureNumber(maxValue, value));
        break;
      default:
        break;
    }
  }

  render() {
    const aria = this.getAriaValues();
    const {
      ariaLabel,
      className,
      focusId,
      itemRef,
      minValue,
      maxValue,
      step,
      value,
    } = this.props;
    const { isDragging } = this.state;
    const finalClassName = ClassNames('oo-slider', className, {
      'oo-dragging': isDragging,
    });

    return (
      <input
        type="range"
        ref={itemRef}
        className={finalClassName}
        min={minValue}
        max={maxValue}
        value={value}
        step={step}
        data-focus-id={focusId}
        tabIndex="0"
        aria-label={ariaLabel}
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
        onKeyDown={Utils.isIE() ? this.onKeyDown : null}
      />
    );
  }
}

Slider.propTypes = {
  focusId: PropTypes.string,
  value: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func,
  ariaLabel: PropTypes.string,
  usePercentageForAria: PropTypes.bool,
  settingName: PropTypes.string,
  className: PropTypes.string,
  itemRef: PropTypes.string,
};

const radix = 36;
const len = 10;
Slider.defaultProps = {
  ariaLabel: '',
  className: '',
  focusId: Math.random().toString(radix).substr(2, len),
  itemRef: '',
  minValue: 0,
  maxValue: 15,
  onChange: () => {},
  settingName: '',
  step: 1,
  usePercentageForAria: false,
  value: 0,
};

module.exports = Slider;
