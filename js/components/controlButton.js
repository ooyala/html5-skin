var React = require('react');
var classNames = require('classnames');
var AccessibleButton = require('./accessibleButton');
var Icon = require('./icon');
var Tooltip = require('./tooltip');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');

var ControlButton = React.createClass({

  /**
   *
   * @private
   * @return {object}
   */
  getIconStyles: function() {
    var iconStyles = {
      color: Utils.getPropertyValue(this.props.skinConfig, 'controlBar.iconStyle.inactive.color'),
      opacity: Utils.getPropertyValue(this.props.skinConfig, 'controlBar.iconStyle.inactive.opacity')
    };
    return iconStyles;
  },

  /**
   *
   * @private
   * @param {event} event
   */
  highlight: function(event) {
    if (this.props.controller.state.isMobile) {
      return;
    }
    var iconElement = Utils.getEventIconElement(event);

    if (iconElement) {
      var highlightOpacity = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.active.opacity',
        1
      );
      var accentColor = Utils.getPropertyValue(
        this.props.skinConfig,
        'general.accentColor'
      );
      var highlightColor = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.active.color',
        accentColor
      );
      Utils.highlight(iconElement, highlightOpacity, highlightColor);
    }
  },

  /**
   *
   * @private
   * @param {event} event
   */
  removeHighlight: function(event) {
    var iconElement = Utils.getEventIconElement(event);

    if (iconElement) {
      var baseOpacity = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.inactive.opacity'
      );
      var baseColor = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.iconStyle.inactive.color'
      );
      Utils.removeHighlight(iconElement, baseOpacity, baseColor);
    }
  },

  /**
   *
   * @private
   * @return {number}
   */
  getResponsiveUiMultiple: function() {
    var responsiveView = this.props.responsiveView;
    var breakpoints = Utils.getPropertyValue(this.props.skinConfig, 'responsive.breakpoints', {});
    var responsiveUiMultiple = (breakpoints[responsiveView] || {}).multiplier || 1;
    return responsiveUiMultiple;
  },

  /**
   *
   * @private
   * @return {boolean}
   */
  areTooltipsEnabled: function() {
    var enabled = false;

    if (!this.props.controller.state.isMobile) {
      enabled = Utils.getPropertyValue(this.props.skinConfig, 'controlBar.tooltips.enabled', false);
    }
    return enabled;
  },

  /**
   * WIP
   * @private
   * @return {type}  description
   */
  getTooltipConfig: function() {
    var responsiveUiMultiple = this.getResponsiveUiMultiple();

    var tooltipConfig = {
      enabled: this.areTooltipsEnabled(),
      responsivenessMultiplier: responsiveUiMultiple,
      bottom: responsiveUiMultiple * this.props.skinConfig.controlBar.height,
      language: this.props.language,
      localizableStrings: this.props.localizableStrings,
      getAlignment: function(key) {
        return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
      }
    };
    return tooltipConfig;
  },

  onMouseOver: function(event) {
    this.highlight(event);

    if (typeof this.props.onMouseOver === 'function') {
      this.props.onMouseOver(event);
    }
  },

  onMouseOut: function(event) {
    this.removeHighlight(event);

    if (typeof this.props.onMouseOut === 'function') {
      this.props.onMouseOut(event);
    }
  },

  render: function() {
    var className = classNames('oo-control-bar-item', this.props.className);
    var iconStyles = this.getIconStyles();
    var tooltipConfig = this.getTooltipConfig();

    return (
      <AccessibleButton
        {...this.props}
        className={className}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>

        <Icon
          icon={this.props.icon}
          skinConfig={this.props.skinConfig}
          style={iconStyles} />

        {this.props.tooltip &&
          <Tooltip
            {...tooltipConfig}
            parentKey="temp"
            text={this.props.tooltip} />
        }

        {this.props.children}

      </AccessibleButton>
    );
  }
});

ControlButton.propTypes = {
  className: React.PropTypes.string,
  icon: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object,
  responsiveView: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func,
  skinConfig: React.PropTypes.object.isRequired,
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool.isRequired
    })
  })
};

module.exports = ControlButton;
