var React = require('react')

var CloseButton = React.createClass({
  propTypes: {
    controller: React.PropTypes.shape({
      closeScreen: React.PropTypes.func
    })
  },

  close: function(evt) {
    this.props.controller.closeScreen();
  },

  render: function() {
    return (
        <button className="close" onClick={this.close}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </button>
    );
  }
});
module.exports = CloseButton;