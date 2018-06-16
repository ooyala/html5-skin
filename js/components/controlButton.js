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
    if (
      event.currentTarget.disabled ||
      this.props.controller.state.isMobile
    ) {
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
      enabled = Utils.getPropertyValue(
        this.props.skinConfig,
        'controlBar.tooltips.enabled',
        false
      );
    }
    return enabled;
  },

  /**
   *
   * @private
   * @return {Number}
   */
  getTooltipVerticalOffset: function() {
    var tooltipVerticalOffset;

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
  },

  /**
   *
   * @private
   * @param {type} key
   * @return {string}
   */
  getTooltipAlignment: function(key) {
    if (typeof this.props.getTooltipAlignment === 'function') {
      return this.props.getTooltipAlignment(key);
    } else {
      return CONSTANTS.TOOLTIP_ALIGNMENT.CENTER;
    }
  },

  /**
   *
   * @private
   * @param {Event} event
   */
  onMouseOver: function(event) {
    this.highlight(event);

    if (typeof this.props.onMouseOver === 'function') {
      this.props.onMouseOver(event);
    }
  },

  /**
   *
   * @private
   * @param {Event} event
   */
  onMouseOut: function(event) {
    this.removeHighlight(event);

    if (typeof this.props.onMouseOut === 'function') {
      this.props.onMouseOut(event);
    }
  },

  render: function() {
    var className = classNames('oo-control-bar-item', this.props.className);
    var iconStyles = this.getIconStyles();
    var areTooltipsEnabled = this.areTooltipsEnabled();

    if (areTooltipsEnabled && this.props.tooltip) {
      var responsiveUiMultiple = this.getResponsiveUiMultiple();
      var tooltipVerticalOffset = this.getTooltipVerticalOffset();
    }

    return (
      <AccessibleButton
        {...this.props}
        className={className}
        focusId={this.props.focusId}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>

        <Icon
          icon={this.props.icon}
          skinConfig={this.props.skinConfig}
          style={iconStyles} />

        {this.props.tooltip &&
          <Tooltip
            enabled={areTooltipsEnabled}
            text={this.props.tooltip}
            parentKey={this.props.focusId}
            responsivenessMultiplier={responsiveUiMultiple}
            bottom={responsiveUiMultiple * tooltipVerticalOffset}
            language={this.props.language}
            localizableStrings={this.props.localizableStrings}
            getAlignment={this.getTooltipAlignment}/>
        }

        {this.props.children}

      </AccessibleButton>
    );
  }
});

ControlButton.propTypes = {
  focusId: React.PropTypes.string,
  className: React.PropTypes.string,
  icon: React.PropTypes.string,
  tooltip: React.PropTypes.string,
  tooltipVerticalOffset: React.PropTypes.number,
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object,
  responsiveView: React.PropTypes.string.isRequired,
  getTooltipAlignment: React.PropTypes.func,
  onClick: React.PropTypes.func,
  skinConfig: React.PropTypes.shape({
    general: React.PropTypes.shape({
      accentColor: React.PropTypes.string.isRequired
    }),
    responsive: React.PropTypes.shape({
      breakpoints: React.PropTypes.object
    }),
    controlBar: React.PropTypes.shape({
      height: React.PropTypes.number.isRequired,
      iconStyle: React.PropTypes.shape({
        active: React.PropTypes.shape({
          color: React.PropTypes.string.isRequired,
          opacity: React.PropTypes.number.isRequired
        }),
        inactive: React.PropTypes.shape({
          color: React.PropTypes.string.isRequired,
          opacity: React.PropTypes.number.isRequired
        })
      }),
      tooltips: React.PropTypes.shape({
        enabled: React.PropTypes.bool
      })
    })
  }),
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool.isRequired
    })
  })
};

module.exports = ControlButton;
