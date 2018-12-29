const React = require('react');

const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const AccessibleButton = require('./accessibleButton');

const Icon = require('../components/icon');

const CONSTANTS = require('../constants/constants');

const CloseButton = createReactClass({
  render() {
    return (
      <AccessibleButton
        className={this.props.cssClass}
        focusId={`${CONSTANTS.FOCUS_IDS.CLOSE}-${Date.now()}`}
        ariaLabel={CONSTANTS.ARIA_LABELS.CLOSE}
        role={this.props.role}
        onClick={this.props.closeAction}
      >
        <Icon {...this.props} icon="dismiss" className={this.props.className} />
      </AccessibleButton>
    );
  },
});

CloseButton.propTypes = {
  closeAction: PropTypes.func,
  fontStyleClass: PropTypes.string,
  cssClass: PropTypes.string,
};

CloseButton.defaultProps = {
  cssClass: 'oo-close-button',
};

module.exports = CloseButton;
