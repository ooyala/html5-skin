const React = require('react');
const classNames = require('classnames');
const AccessibleButton = require('./accessibleButton');
const Icon = require('./icon');
const Tooltip = require('./tooltip');
const Utils = require('./utils');
const PropTypes = require('prop-types');
const CONSTANTS = require('../constants/constants');

/**
 * Template component that is used for buttons that don't have accessibility enabled.
 * The component is picked at runtime by ControlButton depending on the props that
 * were passed to it.
 * @param {Object} props Component's props
 * @return {Component} React component
 */
class NonAccessibleButton extends React.Component {
  render() {
    return (
      <a
        style={this.props.style}
        className={this.props.className}
        aria-hidden={this.props.ariaHidden}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onClick={this.props.onClick}>
        {this.props.children}
      </a>
    );
  };
}

/**
 * Component used for action buttons within the skin. Currently used for both control
 * bar and skip buttons. Implements common functionality for these buttons which includes
 * icons, highlighting, tooltips and accessibility.
 */
class ControlButton extends React.Component {

  constructor(props) {
    super(props);
    this.storeRef = this.storeRef.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.getTooltipAlignment = this.getTooltipAlignment.bind(this);
  }

  /**
   * Stores a ref to this component's main element or component.
   * @private
   * @param {*} buttonRef Either a reference to an AccessibleButton or a DOM element,
   * depending on the component that was rendered
   */
  storeRef(buttonRef) {
    this.buttonRef = buttonRef;
    // Pass ref on to parent, if subscribed
    if (typeof this.props.onRef === 'function') {
      this.props.onRef(this.buttonRef);
    }
  }

  /**
   * Chooses a component (either AccessibleButton or NonAccessibleButton) to use
   * as base for the ControlButton depending on whether or not accessibility is
   * enabled for this particular instance. Accessibility is enabled by default
   * unless the ariaHidden prop is set to false explicitly.
   * @private
   * @return {Component} An AccessibleButton or NonAccessibleButton component, depending on the case
   */
  getButtonComponent() {
    let Component;

    if (this.props.ariaHidden === true) {
      Component = NonAccessibleButton;
    } else {
      Component = AccessibleButton;
    }
    return Component;
  }

  /**
   * Extracts the default styles for the button icon from the skin.json.
   * @private
   * @return {Object} An object with color and opacity properties which represent the default style of the button
   */
  getIconStyles() {
    const iconStyles = {
      color: Utils.getPropertyValue(this.props.skinConfig, 'controlBar.iconStyle.inactive.color'),
      opacity: Utils.getPropertyValue(this.props.skinConfig, 'controlBar.iconStyle.inactive.opacity')
    };
    return iconStyles;
  }

  /**
   * Applies the highlighted styles to the button icon on hover.
   * TODO
   * This was moved over from ControlBar but the original implementation sets the
   * styles directly on the rendered element, which is an anti-pattern in React.
   * Eventually we should update this in order to accomplish the same with setState().
   * @private
   * @param {Event} event The mouseenter event object that triggered the action
   */
  highlight(event) {
    if (
      event.currentTarget.disabled ||
      this.props.controller.state.isMobile
    ) {
      return;
    }
    const iconElement = Utils.getEventIconElement(event);

    if (iconElement) {
      const highlightOpacity = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.active.opacity',
        1
      );
      const accentColor = Utils.getPropertyValue(
        this.props.skinConfig,
        'general.accentColor'
      );
      const highlightColor = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.active.color',
        accentColor
      );
      Utils.highlight(iconElement, highlightOpacity, highlightColor);
    }
  }

  /**
   * Restores the default button styles after hover ends.
   * @private
   * @param {Event} event The mouseleave event object that triggered the action
   */
  removeHighlight(event) {
    const iconElement = Utils.getEventIconElement(event);

    if (iconElement) {
      const baseOpacity = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.inactive.opacity'
      );
      const baseColor = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.inactive.color'
      );
      Utils.removeHighlight(iconElement, baseOpacity, baseColor);
    }
  }

  /**
   * Extracts the responsive UI multiplier value from the skin config depending on the
   * responsive view that is currently active.
   * @private
   * @return {Number} The numeric value of the UI multiplier that matches the current responsive view.
   */
  getResponsiveUiMultiplier() {
    const responsiveView = this.props.responsiveView;
    const breakpoints = Utils.getPropertyValue(this.props.skinConfig, 'responsive.breakpoints', {});
    const responsiveUiMultiplier = (breakpoints[responsiveView] || {}).multiplier || 1;
    return responsiveUiMultiplier;
  }

  /**
   * Determines whether or not tooltips are enabled considering the current
   * platform and skin configuration.
   * @private
   * @return {Boolean} True if tooltips are enabled, false otherwise
   */
  areTooltipsEnabled() {
    let enabled = false;

    if (!this.props.controller.state.isMobile) {
      enabled = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.tooltips.enabled',
        false
      );
    }
    return enabled;
  }

  /**
   * Determines the vertical offset value to use for tooltips depending on the
   * props that were passed to this component.
   * @private
   * @return {Number} A numerical value representing the vertical offset at which tooltips will be rendered
   */
  getTooltipVerticalOffset() {
    let tooltipVerticalOffset;
    // Use tooltipVerticalOffset if provided, otherwise use control bar height as default
    if (typeof this.props.tooltipVerticalOffset !== 'undefined') {
      tooltipVerticalOffset = this.props.tooltipVerticalOffset;
    } else {
      tooltipVerticalOffset = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.height',
        0
      );
    }
    return tooltipVerticalOffset;
  }

  /**
   * Either executes a callback passed by the parent that determines the tooltip
   * alignment or returns the default tooltip alignment value.
   * @private
   * @param {type} key An id (usually the focusId prop) that identifies the button whose tooltip alignment we want to determine
   * @return {string} A value from CONSTANTS.TOOLTIP_ALIGNMENT which represents the tooltip alignment
   */
  getTooltipAlignment(key) {
    if (typeof this.props.getTooltipAlignment === 'function') {
      return this.props.getTooltipAlignment(key);
    } else {
      return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
    }
  }

  /**
   * Handler for the mouseenter event.
   * @private
   * @param {Event} The mouseenter event object
   */
  onMouseEnter(event) {
    this.highlight(event);

    if (typeof this.props.onMouseOver === 'function') {
      this.props.onMouseOver(event);
    }
  }

  /**
   * Handler for the mouseleave event.
   * @private
   * @param {Event} The mouseleave event object
   */
  onMouseLeave(event) {
    this.removeHighlight(event);

    if (typeof this.props.onMouseOut === 'function') {
      this.props.onMouseOut(event);
    }
  }

  render() {
    const Component = this.getButtonComponent();
    const className = classNames('oo-control-bar-item', this.props.className);
    const iconStyles = this.getIconStyles();
    const areTooltipsEnabled = this.areTooltipsEnabled();

    let responsiveUiMultiplier, tooltipVerticalOffset;

    if (areTooltipsEnabled && this.props.tooltip) {
      responsiveUiMultiplier = this.getResponsiveUiMultiplier();
      tooltipVerticalOffset = this.getTooltipVerticalOffset();
    }

    return (
      <Component
        {...this.props}
        ref={this.storeRef}
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>

        <Icon
          icon={this.props.icon}
          skinConfig={this.props.skinConfig}
          style={iconStyles} />

        {this.props.tooltip &&
          <Tooltip
            enabled={areTooltipsEnabled}
            text={this.props.tooltip}
            parentKey={this.props.focusId}
            responsivenessMultiplier={responsiveUiMultiplier}
            bottom={responsiveUiMultiplier * tooltipVerticalOffset}
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            getAlignment={this.getTooltipAlignment}/>
        }

        {this.props.children}

      </Component>
    );
  }
}

ControlButton.propTypes = {
  focusId: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
  tooltip: PropTypes.string,
  tooltipVerticalOffset: PropTypes.number,
  language: PropTypes.string,
  localizableStrings: PropTypes.object,
  responsiveView: PropTypes.string.isRequired,
  getTooltipAlignment: PropTypes.func,
  onRef: PropTypes.func,
  onClick: PropTypes.func,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string.isRequired
    }),
    responsive: PropTypes.shape({
      breakpoints: PropTypes.object
    }),
    controlBar: PropTypes.shape({
      height: PropTypes.number.isRequired,
      iconStyle: PropTypes.shape({
        active: PropTypes.shape({
          color: PropTypes.string.isRequired,
          opacity: PropTypes.number.isRequired
        }),
        inactive: PropTypes.shape({
          color: PropTypes.string.isRequired,
          opacity: PropTypes.number.isRequired
        })
      }),
      tooltips: PropTypes.shape({
        enabled: PropTypes.bool
      })
    })
  }),
  controller: PropTypes.shape({
    state: PropTypes.shape({
      isMobile: PropTypes.bool.isRequired
    })
  })
};

module.exports = ControlButton;
