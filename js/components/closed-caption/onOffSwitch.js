let React = require('react');

let Utils = require('./../utils');

let AccessibleButton = require('../accessibleButton');

let CONSTANTS = require('../../constants/constants');

let ClassNames = require('classnames');
let createReactClass = require('create-react-class');

let OnOffSwitch = createReactClass({
  handleOnOffSwitch: function() {
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render: function() {
    let switchThumbClassName = ClassNames({
      'oo-switch-thumb': true,
      'oo-switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'oo-switch-thumb-off': !this.props.closedCaptionOptions.enabled,
    });
    let switchBodyClassName = ClassNames({
      'oo-switch-body': true,
      'oo-switch-body-off': !this.props.closedCaptionOptions.enabled,
    });
    let onCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-on': true,
      'oo-switch-captions-active': this.props.closedCaptionOptions.enabled,
    });
    let offCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-off': true,
      'oo-switch-captions-active': !this.props.closedCaptionOptions.enabled,
    });
    let ccOnStyle = {
      backgroundColor:
        this.props.closedCaptionOptions.enabled && this.props.skinConfig.general.accentColor
          ? this.props.skinConfig.general.accentColor
          : null,
    };
    let offString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.OFF,
      this.props.localizableStrings
    );
    let onString = Utils.getLocalizedString(
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
  },
});

module.exports = OnOffSwitch;
