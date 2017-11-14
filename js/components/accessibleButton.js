var React = require('react');
var ClassNames = require('classnames');
var Utils = require('./utils');

var AccessibleButton = React.createClass({

  render: function() {
    var focusId = this.props.focusId ? this.props.focusId : Math.random().toString(36).substr(2, 10);

    return (
      <button
        type="button"
        style={this.props.style}
        className={ClassNames(this.props.className, 'oo-focusable-btn')}
        tabIndex="0"
        data-focus-id={focusId}
        aria-label={this.props.ariaLabel}
        aria-checked={this.props.ariaChecked}
        aria-haspopup={this.props.ariaHasPopup}
        aria-expanded={this.props.ariaExpanded}
        role={this.props.role}
        onMouseUp={Utils.blurOnMouseUp}
        onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }

});

AccessibleButton.propTypes = {
  style: React.PropTypes.object,
  className: React.PropTypes.string,
  focusId: React.PropTypes.string,
  ariaLabel: React.PropTypes.string.isRequired,
  ariaChecked: React.PropTypes.bool,
  ariaHasPopup: React.PropTypes.bool,
  ariaExpanded: React.PropTypes.bool,
  role: React.PropTypes.string,
  onClick: React.PropTypes.func
};

AccessibleButton.defaultProps = {
  ariaChecked: null,
  ariaHasPopup: null,
  ariaExpanded: null,
  role: null,
};

module.exports = AccessibleButton;
