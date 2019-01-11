import React from 'react';
import PropTypes from 'prop-types';

/**
 * The selection container element
 * @param {Object} props – Props object
 * @returns {Object} React VDOM element
 */
const SelectionContainer = (props) => {
  const {
    title, ariaLabel, role, children, className, selectionText,
  } = props;
  return (
    <div className={`oo-selection-container${className ? ` ${className}` : ''}`}>
      <div className="oo-selection-inner-wrapper">
        <div className="oo-selection-container-title">
          {title}
:
          {' '}
          <span className="oo-selection-container-selection-text">{selectionText}</span>
        </div>
        <div
          className="oo-selection-items-container"
          aria-label={ariaLabel}
          role={role}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

SelectionContainer.propTypes = {
  className: PropTypes.string,
  selectionText: PropTypes.string,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
};

SelectionContainer.defaultProps = {
  className: '',
  selectionText: '',
  title: '',
  ariaLabel: '',
  role: '',
};

module.exports = SelectionContainer;
