var React = require('react'),
    Icon = require('../components/icon'),
    Utils = require('./utils'),
    CONSTANTS = require('../constants/constants');

var CloseButton = React.createClass({
  render: function() {
    return (
      <button
        className={this.props.cssClass}
        onClick={this.props.closeAction}
        onMouseUp={Utils.blurOnMouseUp}
        data-focus-id={'close-' + Date.now()}
        tabIndex="0"
        aria-label={CONSTANTS.ARIA_LABELS.CLOSE}>
        <Icon
          {...this.props}
          icon="dismiss"
          className={this.props.className}/>
      </button>
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
