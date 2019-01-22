import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import Icon from './icon';
import CONSTANTS from '../constants/constants';

/**
 * Presentational component that handles the rendering of the menu items that
 * are used by the MenuPanel component. Also handles styling of selected items
 * and click logic
 * @returns {Object} React template
 */
const MenuPanelItem = ({
  itemValue,
  itemLabel,
  ariaLabel,
  buttonClassName,
  isSelected,
  focusId,
  accentColor,
  skinConfig,
  onClick,
}) => {
  const itemClassName = classNames('oo-menu-panel-item', {
    'oo-selected': isSelected,
  });
  const itemButtonClassName = classNames('oo-menu-btn', buttonClassName, {
    'oo-selected': isSelected,
  });
  const buttonStyle = {
    color: isSelected ? accentColor : null,
  };

  return (
    <li
      className={itemClassName}
      role={CONSTANTS.ARIA_ROLES.PRESENTATION}
    >
      <AccessibleButton
        className={itemButtonClassName}
        style={buttonStyle}
        focusId={focusId}
        role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
        ariaLabel={ariaLabel}
        ariaChecked={isSelected}
        onClick={() => onClick(itemValue)}
      >

        {isSelected
          && (
          <Icon
            skinConfig={skinConfig}
            icon="selected"
          />
          )
        }

        <span className="oo-menu-btn-label">{itemLabel}</span>

      </AccessibleButton>
    </li>
  );
};

MenuPanelItem.propTypes = {
  itemValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  itemLabel: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  buttonClassName: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  focusId: PropTypes.string.isRequired,
  accentColor: PropTypes.string,
  skinConfig: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
};

MenuPanelItem.defaultProps = {
  buttonClassName: '',
  accentColor: '',
};

module.exports = MenuPanelItem;
