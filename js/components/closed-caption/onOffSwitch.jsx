import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from '../utils';
import AccessibleButton from '../accessibleButton';
import CONSTANTS from '../../constants/constants';

/**
 * On/Off switcher element
 * @param {Object} props – React props object
 * @returns {Object} React VDOM element
 */
const OnOffSwitch = (props) => {
  const {
    closedCaptionOptions,
    skinConfig,
    language,
    localizableStrings,
    ariaLabel,
    role,
    controller,
  } = props;
  const switchThumbClassName = ClassNames({
    'oo-switch-thumb': true,
    'oo-switch-thumb-on': closedCaptionOptions.enabled,
    'oo-switch-thumb-off': !closedCaptionOptions.enabled,
  });
  const switchBodyClassName = ClassNames({
    'oo-switch-body': true,
    'oo-switch-body-off': !closedCaptionOptions.enabled,
  });
  const onCaptionClassName = ClassNames({
    'oo-switch-captions oo-switch-captions-on': true,
    'oo-switch-captions-active': closedCaptionOptions.enabled,
  });
  const offCaptionClassName = ClassNames({
    'oo-switch-captions oo-switch-captions-off': true,
    'oo-switch-captions-active': !closedCaptionOptions.enabled,
  });
  const ccOnStyle = {
    backgroundColor:
      closedCaptionOptions.enabled && skinConfig.general.accentColor
        ? skinConfig.general.accentColor
        : null,
  };
  const offString = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.OFF,
    localizableStrings
  );
  const onString = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.ON,
    localizableStrings
  );

  const handleOnOffSwitch = () => controller.toggleClosedCaptionEnabled();

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
        ariaLabel={ariaLabel}
        ariaChecked={closedCaptionOptions.enabled}
        role={role || CONSTANTS.ARIA_ROLES.CHECKBOX}
        onClick={handleOnOffSwitch}
      />
    </div>
  );
};

OnOffSwitch.propTypes = {
  closedCaptionOptions: PropTypes.shape({
    enabled: PropTypes.bool,
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({ accentColor: PropTypes.string }),
  }),
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  controller: PropTypes.shape({
    toggleClosedCaptionEnabled: PropTypes.func,
  }).isRequired,
};

OnOffSwitch.defaultProps = {
  closedCaptionOptions: {},
  skinConfig: {},
  language: 'en',
  localizableStrings: {},
  ariaLabel: '',
  role: '',
};

module.exports = OnOffSwitch;
