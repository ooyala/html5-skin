import React from 'react';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import Icon from './icon';
import CONSTANTS from '../constants/constants';

const CloseButton = ({
  className,
  cssClass,
  role,
  closeAction,
  skinConfig,
  style,
}) => (
  <AccessibleButton
    className={cssClass}
    focusId={`${CONSTANTS.FOCUS_IDS.CLOSE}-${Date.now()}`}
    ariaLabel={CONSTANTS.ARIA_LABELS.CLOSE}
    role={role}
    onClick={closeAction}
  >
    <Icon
      icon="dismiss"
      className={className}
      skinConfig={skinConfig}
      style={style}
    />
  </AccessibleButton>
);

CloseButton.propTypes = {
  className: PropTypes.string,
  cssClass: PropTypes.string,
  role: PropTypes.string,
  style: PropTypes.shape({}),
  skinConfig: PropTypes.shape({}).isRequired,
  closeAction: PropTypes.func,
};

CloseButton.defaultProps = {
  className: '',
  cssClass: 'oo-close-button',
  role: '',
  style: {},
  closeAction: () => {},
};

module.exports = CloseButton;
