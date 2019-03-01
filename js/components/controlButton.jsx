import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import NonAccessibleButton from './nonAccessibleButton';
import Icon from './icon';
import Tooltip from './tooltip';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

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
    this.getButtonComponent = this.getButtonComponent.bind(this);
    this.getTooltipAlignment = this.getTooltipAlignment.bind(this);
    this.getTooltipVerticalOffset = this.getTooltipVerticalOffset.bind(this);
    this.getResponsiveUiMultiplier = this.getResponsiveUiMultiplier.bind(this);
    this.getIconStyles = this.getIconStyles.bind(this);
    this.highlight = this.highlight.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
    this.areTooltipsEnabled = this.areTooltipsEnabled.bind(this);
  }

  /**
   * Handler for the mouseenter event.
   * @private
   * @param {Event} event mouseenter event object
   */
  onMouseEnter(event) {
    this.highlight(event);
    const { onMouseOver } = this.props;
    if (typeof onMouseOver === 'function') {
      onMouseOver(event);
    }
  }

  /**
   * Handler for the mouseleave event.
   * @private
   * @param {Event} event mouseleave event object
   */
  onMouseLeave(event) {
    this.removeHighlight(event);
    const { onMouseOut } = this.props;
    if (typeof onMouseOut === 'function') {
      onMouseOut(event);
    }
  }

  /**
   * Chooses a component (either AccessibleButton or NonAccessibleButton) to use
   * as base for the ControlButton depending on whether or not accessibility is
   * enabled for this particular instance. Accessibility is enabled by default
   * unless the ariaHidden prop is set to false explicitly.
   * @private
   * @returns {Component} An AccessibleButton or NonAccessibleButton component, depending on the case
   */
  getButtonComponent() {
    const { ariaHidden } = this.props;
    return ariaHidden === true ? NonAccessibleButton : AccessibleButton;
  }

  /**
   * Either executes a callback passed by the parent that determines the tooltip
   * alignment or returns the default tooltip alignment value.
   * @private
   * @param {type} key An id (usually the focusId prop) that identifies the button whose tooltip alignment we want to determine
   * @returns {string} A value from CONSTANTS.TOOLTIP_ALIGNMENT which represents the tooltip alignment
   */
  getTooltipAlignment(key) {
    const { getTooltipAlignment } = this.props;
    if (typeof getTooltipAlignment === 'function') {
      return getTooltipAlignment(key);
    }
    return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
  }

  /**
   * Determines the vertical offset value to use for tooltips depending on the
   * props that were passed to this component.
   * @private
   * @returns {Number} A numerical value representing the vertical offset at which tooltips will be rendered
   */
  getTooltipVerticalOffset() {
    const { tooltipVerticalOffset, skinConfig } = this.props;
    return typeof tooltipVerticalOffset !== 'undefined'
      ? tooltipVerticalOffset
      : Utils.getPropertyValue(skinConfig, 'controlBar.height', 0);
  }

  /**
   * Extracts the responsive UI multiplier value from the skin config depending on the
   * responsive view that is currently active.
   * @private
   * @returns {Number} The numeric value of the UI multiplier that matches the current responsive view.
   */
  getResponsiveUiMultiplier() {
    const { responsiveView, skinConfig } = this.props;
    const breakpoints = Utils.getPropertyValue(skinConfig, 'responsive.breakpoints', {});
    const responsiveUiMultiplier = (breakpoints[responsiveView] || {}).multiplier || 1;
    return responsiveUiMultiplier;
  }

  /**
   * Extracts the default styles for the button icon from the skin.json.
   * @private
   * @returns {Object} An object with color and opacity properties which represent the default style of the button
   */
  getIconStyles() {
    const { skinConfig } = this.props;
    const iconStyles = {
      color: Utils.getPropertyValue(skinConfig, 'controlBar.iconStyle.inactive.color'),
      opacity: Utils.getPropertyValue(skinConfig, 'controlBar.iconStyle.inactive.opacity'),
    };
    return iconStyles;
  }

  /**
   * Stores a ref to this component's main element or component.
   * @private
   * @param {*} buttonRef Either a reference to an AccessibleButton or a DOM element,
   * depending on the component that was rendered
   */
  storeRef(buttonRef) {
    this.buttonRef = buttonRef;
    const { onRef } = this.props;
    // Pass ref on to parent, if subscribed
    if (typeof onRef === 'function') {
      onRef(this.buttonRef);
    }
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
    const { controller, skinConfig } = this.props;
    if (
      event.currentTarget.disabled
      || controller.state.isMobile
    ) {
      return;
    }
    const iconElement = Utils.getEventIconElement(event);

    if (iconElement) {
      const highlightOpacity = Utils.getPropertyValue(
        skinConfig,
        'controlBar.iconStyle.active.opacity',
        1
      );
      const accentColor = Utils.getPropertyValue(
        skinConfig,
        'general.accentColor'
      );
      const highlightColor = Utils.getPropertyValue(
        skinConfig,
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
    const { skinConfig } = this.props;
    if (iconElement) {
      const baseOpacity = Utils.getPropertyValue(
        skinConfig,
        'controlBar.iconStyle.inactive.opacity'
      );
      const baseColor = Utils.getPropertyValue(
        skinConfig,
        'controlBar.iconStyle.inactive.color'
      );
      Utils.removeHighlight(iconElement, baseOpacity, baseColor);
    }
  }

  /**
   * Determines whether or not tooltips are enabled considering the current
   * platform and skin configuration.
   * @private
   * @returns {Boolean} True if tooltips are enabled, false otherwise
   */
  areTooltipsEnabled() {
    let enabled = false;
    const { controller, skinConfig } = this.props;
    if (!controller.state.isMobile) {
      enabled = Utils.getPropertyValue(
        skinConfig,
        'controlBar.tooltips.enabled',
        false
      );
    }
    return enabled;
  }

  render() {
    const {
      children,
      className,
      focusId,
      tooltip,
      icon,
      language,
      skinConfig,
      localizableStrings,
    } = this.props;
    const Component = this.getButtonComponent();
    const fullClassName = classNames('oo-control-bar-item', className);
    const iconStyles = this.getIconStyles();
    const areTooltipsEnabled = this.areTooltipsEnabled();

    let responsiveUiMultiplier;
    let tooltipVerticalOffset;

    if (areTooltipsEnabled && tooltip) {
      responsiveUiMultiplier = this.getResponsiveUiMultiplier();
      tooltipVerticalOffset = this.getTooltipVerticalOffset();
    }

    return (
      <Component
        {...this.props}
        ref={this.storeRef}
        className={fullClassName}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >

        {icon
          && (
          <Icon
            icon={icon}
            skinConfig={skinConfig}
            style={iconStyles}
          />
          )
        }

        {children}

        {tooltip
          && (
          <Tooltip
            enabled={areTooltipsEnabled}
            text={tooltip}
            parentKey={focusId}
            responsivenessMultiplier={responsiveUiMultiplier}
            bottom={responsiveUiMultiplier * tooltipVerticalOffset}
            language={language}
            localizableStrings={localizableStrings}
            getAlignment={this.getTooltipAlignment}
          />
          )
        }

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
  localizableStrings: PropTypes.shape({}),
  responsiveView: PropTypes.string.isRequired,
  getTooltipAlignment: PropTypes.func,
  onRef: PropTypes.func,
  onClick: PropTypes.func,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string.isRequired,
    }),
    responsive: PropTypes.shape({
      breakpoints: PropTypes.object,
    }),
    controlBar: PropTypes.shape({
      height: PropTypes.number.isRequired,
      iconStyle: PropTypes.shape({
        active: PropTypes.shape({
          color: PropTypes.string.isRequired,
          opacity: PropTypes.number.isRequired,
        }),
        inactive: PropTypes.shape({
          color: PropTypes.string.isRequired,
          opacity: PropTypes.number.isRequired,
        }),
      }),
      tooltips: PropTypes.shape({
        enabled: PropTypes.bool,
      }),
    }),
  }).isRequired,
  controller: PropTypes.shape({
    state: PropTypes.shape({
      isMobile: PropTypes.bool.isRequired,
    }),
  }).isRequired,
};

ControlButton.defaultProps = {
  focusId: '',
  className: '',
  icon: '',
  tooltip: '',
  tooltipVerticalOffset: undefined,
  language: 'en',
  localizableStrings: {},
  getTooltipAlignment: () => {},
  onRef: () => {},
  onClick: () => {},
};

module.exports = ControlButton;
