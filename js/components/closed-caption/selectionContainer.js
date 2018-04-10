var React = require('react');
var CONSTANTS = require('../../constants/constants');

var SelectionContainer = React.createClass({
  render: function() {
    return (
      <div className={'oo-selection-container' + (this.props.className ? ' ' + this.props.className : '')}>
        <div className="oo-selection-inner-wrapper">
          <div className="oo-selection-container-title">
            {this.props.title}: <span className="oo-selection-container-selection-text">{this.props.selectionText}</span>
          </div>
          <div
            className="oo-selection-items-container"
            aria-label={this.props.ariaLabel}
            role={this.props.role}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

SelectionContainer.propTypes = {
  className: React.PropTypes.string,
  selectionText: React.PropTypes.string,
  title: React.PropTypes.string,
  ariaLabel: React.PropTypes.string,
  role: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.element
  ]).isRequired
};

module.exports = SelectionContainer;
