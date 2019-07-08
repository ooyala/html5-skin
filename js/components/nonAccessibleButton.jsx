import React from 'react';
import PropTypes from 'prop-types';

// ControlButton uses refs which can't be used with stateless components
/* eslint-disable react/prefer-stateless-function */

/**
 * Template component that is used for buttons that don't have accessibility enabled.
 * The component is picked at runtime by ControlButton depending on the props that
 * were passed to it.
 * @param {Object} props Component's props
 * @returns {Component} React component
 */
class NonAccessibleButton extends React.Component {
  render() {
    const {
      style,
      className,
      ariaHidden,
      onMouseEnter,
      onMouseLeave,
      onClick,
      children,
    } = this.props;
    return (
      <a // eslint-disable-line
        style={style}
        className={className}
        aria-hidden={ariaHidden}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
}

NonAccessibleButton.defaultProps = {
  style: {},
  className: '',
  ariaHidden: false,
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  onClick: () => {},
  children: [],
};

NonAccessibleButton.propTypes = {
  style: PropTypes.shape({}),
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

module.exports = NonAccessibleButton;
