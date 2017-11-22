var React = require('react');
var CONSTANTS = require('../../constants/constants');

var SelectionContainer = React.createClass({
  render: function() {
    return(
      <div className={"oo-selection-container" + (this.props.className ? " " + this.props.className : "")}>
        <div className="oo-selection-inner-wrapper">
          <div className="oo-selection-container-title">
            {this.props.title}: <span className="oo-selection-container-selection-text">{this.props.selectionText}</span>
          </div>
          <div className="oo-selection-items-container" role={CONSTANTS.ARIA_ROLES.MENU}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SelectionContainer;
