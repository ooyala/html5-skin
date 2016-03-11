var React = require('react');

var CloseButton = React.createClass({
  render: function() {
    return (
        <button className={this.props.cssClass} onClick={this.props.closeAction}>
          <span className={this.props.fontStyleClass}></span>
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
  cssClass: 'closeBtn'
};

module.exports = CloseButton;