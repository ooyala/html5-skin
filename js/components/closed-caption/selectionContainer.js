const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const CONSTANTS = require('../../constants/constants');

const SelectionContainer = createReactClass({
  render() {
    return (
      <div className={`oo-selection-container${this.props.className ? ` ${this.props.className}` : ''}`}>
        <div className="oo-selection-inner-wrapper">
          <div className="oo-selection-container-title">
            {this.props.title}
:
            {' '}
            <span className="oo-selection-container-selection-text">{this.props.selectionText}</span>
          </div>
          <div
            className="oo-selection-items-container"
            aria-label={this.props.ariaLabel}
            role={this.props.role}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  },
});

SelectionContainer.propTypes = {
  className: PropTypes.string,
  selectionText: PropTypes.string,
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
};

module.exports = SelectionContainer;
