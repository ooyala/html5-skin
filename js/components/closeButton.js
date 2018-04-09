var React = require('react'),
    AccessibleButton = require('./accessibleButton'),
    Icon = require('../components/icon'),
    CONSTANTS = require('../constants/constants');

var CloseButton = React.createClass({
  render: function() {
    return (
      <AccessibleButton
        className={this.props.cssClass}
        focusId={CONSTANTS.FOCUS_IDS.CLOSE + '-' + Date.now()}
        ariaLabel={CONSTANTS.ARIA_LABELS.CLOSE}
        role={this.props.role}
        onClick={this.props.closeAction}>
        <Icon
          {...this.props}
          icon="dismiss"
          className={this.props.className}/>
      </AccessibleButton>
    );
  }
});

CloseButton.propTypes = {
  closeAction: React.PropTypes.func,
  fontStyleClass: React.PropTypes.string,
  cssClass: React.PropTypes.string
};

CloseButton.defaultProps = {
  cssClass: 'oo-close-button'
};

module.exports = CloseButton;
