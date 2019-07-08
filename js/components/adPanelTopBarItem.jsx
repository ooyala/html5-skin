import React from 'react';
import PropTypes from 'prop-types';

/**
 * One item in ad panel component
 */

const AdPanelTopBarItem = ({
  itemClassName,
  onButtonClick,
  onButtonKeyUp,
  children,
}) => {
  if (!onButtonClick) {
    return (
      <div
        className={itemClassName}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={itemClassName}
      onClick={onButtonClick}
      onKeyUp={onButtonKeyUp}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};

AdPanelTopBarItem.propTypes = {
  itemClassName: PropTypes.string,
  onButtonClick: PropTypes.func,
  onButtonKeyUp: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

AdPanelTopBarItem.defaultProps = {
  itemClassName: '',
  onButtonClick: null,
  onButtonKeyUp: () => {},
  children: [],
};

module.exports = AdPanelTopBarItem;
