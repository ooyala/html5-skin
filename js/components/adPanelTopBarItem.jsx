import React from 'react';
import PropTypes from 'prop-types';

/**
 * One item in ad panel component
 */
class AdPanelTopBarItem extends React.Component { // eslint-disable-line
  render() {
    const { itemClassName, onButtonClicked, children } = this.props;
    return (
      <a // eslint-disable-line
        className={itemClassName}
        onClick={onButtonClicked}
      >
        {children}
      </a>
    );
  }
}

AdPanelTopBarItem.propTypes = {
  itemClassName: PropTypes.string,
  onButtonClicked: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

AdPanelTopBarItem.defaultProps = {
  itemClassName: '',
  onButtonClicked: () => {},
  children: [],
};

module.exports = AdPanelTopBarItem;
