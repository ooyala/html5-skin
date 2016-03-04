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
        <button className={this.props.cssClass} onClick={this.props.closeAction}>
          <Icon iconClass={this.props.fontStyleClass}
            iconStyle={{fontFamily: this.props.fontFamilyName}}
            iconString={this.props.fontString}/>
        </button>
    );
  }
});
module.exports = CloseButton;