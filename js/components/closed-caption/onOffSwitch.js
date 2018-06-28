var React = require('react'),
    Utils = require('./../utils'),
    AccessibleButton = require('../accessibleButton'),
    CONSTANTS = require('../../constants/constants'),
    ClassNames = require('classnames');
var createReactClass = require('create-react-class');

var OnOffSwitch = createReactClass({
  handleOnOffSwitch: function() {
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render: function() {
    var switchThumbClassName = ClassNames({
      'oo-switch-thumb': true,
      'oo-switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'oo-switch-thumb-off': !this.props.closedCaptionOptions.enabled
    });
    var switchBodyClassName = ClassNames({
      'oo-switch-body': true,
      'oo-switch-body-off': !this.props.closedCaptionOptions.enabled
    });
    var onCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-on': true,
      'oo-switch-captions-active': this.props.closedCaptionOptions.enabled
    });
    var offCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-off': true,
      'oo-switch-captions-active': !this.props.closedCaptionOptions.enabled
    });
    var ccOnStyle = {
      backgroundColor:
        this.props.closedCaptionOptions.enabled && this.props.skinConfig.general.accentColor
          ? this.props.skinConfig.general.accentColor
          : null
    };
    var offString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.OFF,
      this.props.localizableStrings
    );
    var onString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.ON,
      this.props.localizableStrings
    );

    return (
      <div className="oo-switch-container">
        <span className={offCaptionClassName}>{offString}</span>
        <div className="oo-switch-element">
          <span className={switchBodyClassName} style={ccOnStyle} />
          <span className={switchThumbClassName} />
        </div>
        <span className={onCaptionClassName}>{onString}</span>
        <AccessibleButton
          className="oo-switch-container-selectable"
          ariaLabel={this.props.ariaLabel}
          ariaChecked={this.props.closedCaptionOptions.enabled}
          role={this.props.role || CONSTANTS.ARIA_ROLES.CHECKBOX}
          onClick={this.handleOnOffSwitch}
        />
      </div>
    );
  }
});

module.exports = OnOffSwitch;
