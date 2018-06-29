var React = require('react'),
    AccessibleButton = require('./accessibleButton'),
    Icon = require('../components/icon'),
    CONSTANTS = require('../constants/constants');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var CloseButton = createReactClass({
  render: function() {
    return (
      <AccessibleButton
        className={this.props.cssClass}
        focusId={CONSTANTS.FOCUS_IDS.CLOSE + '-' + Date.now()}
        ariaLabel={CONSTANTS.ARIA_LABELS.CLOSE}
        role={this.props.role}
        onClick={this.props.closeAction}
      >
        <Icon {...this.props} icon="dismiss" className={this.props.className} />
      </AccessibleButton>
    );
  }
});

CloseButton.propTypes = {
  closeAction: PropTypes.func,
  fontStyleClass: PropTypes.string,
  cssClass: PropTypes.string
};

CloseButton.defaultProps = {
  cssClass: 'oo-close-button'
};

module.exports = CloseButton;
