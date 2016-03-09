var React = require('react'),
    Icon = require('../components/icon');

var CloseButton = React.createClass({
  propTypes: {
    closeAction: React.PropTypes.func,
    fontStyleClass: React.PropTypes.string,
    cssClass: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      cssClass: 'closeBtn'
    }
  },

  render: function() {
    return (
        <button className={this.props.cssClass}
          onClick={this.props.closeAction}>
          <Icon {...this.props} icon="dismiss"
            className={this.props.className}/>
        </button>
    );
  }
});
module.exports = CloseButton;