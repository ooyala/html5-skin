import React from 'react';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import Icon from './icon';
import CONSTANTS from '../constants/constants';

class CloseButton extends React.Component { // eslint-disable-line
  render() {
    const {
      className,
      cssClass,
      role,
      closeAction,
    } = this.props;
    return (
      <AccessibleButton
        className={cssClass}
        focusId={`${CONSTANTS.FOCUS_IDS.CLOSE}-${Date.now()}`}
        ariaLabel={CONSTANTS.ARIA_LABELS.CLOSE}
        role={role}
        onClick={closeAction}
      >
        <Icon {...this.props} icon="dismiss" className={className} />
      </AccessibleButton>
    );
  }
}

CloseButton.propTypes = {
  closeAction: PropTypes.func,
  fontStyleClass: PropTypes.string,
  cssClass: PropTypes.string,
};

CloseButton.defaultProps = {
  closeAction: () => {},
  fontStyleClass: '',
  cssClass: 'oo-close-button',
};

module.exports = CloseButton;
