let React = require('react');
let CONSTANTS = require('../../constants/constants');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let SelectionContainer = createReactClass({
  render: function() {
    return (
      <div className={'oo-selection-container' + (this.props.className ? ' ' + this.props.className : '')}>
        <div className="oo-selection-inner-wrapper">
          <div className="oo-selection-container-title">
            {this.props.title}:{' '}
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
