var React = require('react')

var CloseButton = React.createClass({
  propTypes: {
    closeAction: React.PropTypes.func,
    fontStyleClass: React.PropTypes.string
  },

  render: function() {
    return (
        <button className="closeBtn" onClick={this.props.closeAction}>
          <span className={this.props.fontStyleClass}></span>
        </button>
    );
  }
});
module.exports = CloseButton;