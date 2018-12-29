const React = require('react');

const ClassNames = require('classnames');
const createReactClass = require('create-react-class');
const Utils = require('./../utils');

const AccessibleButton = require('../accessibleButton');

const CONSTANTS = require('../../constants/constants');


const OnOffSwitch = createReactClass({
  handleOnOffSwitch() {
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render() {
    const switchThumbClassName = ClassNames({
      'oo-switch-thumb': true,
      'oo-switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'oo-switch-thumb-off': !this.props.closedCaptionOptions.enabled,
    });
    const switchBodyClassName = ClassNames({
      'oo-switch-body': true,
      'oo-switch-body-off': !this.props.closedCaptionOptions.enabled,
    });
    const onCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-on': true,
      'oo-switch-captions-active': this.props.closedCaptionOptions.enabled,
    });
    const offCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-off': true,
      'oo-switch-captions-active': !this.props.closedCaptionOptions.enabled,
    });
    const ccOnStyle = {
      backgroundColor:
        this.props.closedCaptionOptions.enabled && this.props.skinConfig.general.accentColor
          ? this.props.skinConfig.general.accentColor
          : null,
    };
    const offString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.OFF,
      this.props.localizableStrings
    );
    const onString = Utils.getLocalizedString(
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
