var React = require('react');
var classNames = require('classnames');
var AccessibleButton = require('./accessibleButton');
var Icon = require('./icon');

var Toolbar = React.createClass({

  onSkipBack: function() {
    if (
      this.props.controls &&
      typeof this.props.controls.seekBy === 'function'
    ) {
      this.props.controls.seekBy(30, false, true);
    }
  },

  onSkipForward: function() {
    if (
      this.props.controls &&
      typeof this.props.controls.seekBy === 'function'
    ) {
      this.props.controls.seekBy(30, true, true);
    }
  },

  getIconStyles: function() {
    var iconStyles = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity
    };
    return iconStyles;
  },

  render: function() {
    var iconStyles = this.getIconStyles();

    var className = classNames('oo-toolbar', {
      'oo-inactive': this.props.inactive
    });

    return (
      <div className={className}>

        <AccessibleButton
          className="oo-control-bar-item">
          <Icon {...this.props} icon="nextVideo" style={iconStyles} />
        </AccessibleButton>

        <AccessibleButton
          className="oo-control-bar-item oo-center-button"
          onClick={this.onSkipBack}>
          <Icon {...this.props} icon="replay" style={iconStyles} />
          <span className="oo-btn-counter">30</span>
        </AccessibleButton>

        <AccessibleButton
          className="oo-control-bar-item oo-center-button"
          onClick={this.onSkipForward}>
          <Icon {...this.props} icon="replay" style={iconStyles} />
          <span className="oo-btn-counter">30</span>
        </AccessibleButton>

        <AccessibleButton
          className="oo-control-bar-item"
          onClick={this.onClick}>
          <Icon {...this.props} icon="nextVideo" style={iconStyles} />
        </AccessibleButton>

      </div>
    );
  }

});

module.exports = Toolbar;
