var React = require('react');
var Utils = require('./utils');

var Icon = React.createClass({
  shouldComponentUpdate: function(nextProps) {
    var updateComponent = false;
    if (this.props && (this.props.icon !== nextProps.icon || this.props.className !== nextProps.className)) {
      updateComponent = true;
    }
    return updateComponent;
  },

  render: function() {
    var iconStyle = Utils.extend(
      { fontFamily: this.props.skinConfig.icons[this.props.icon].fontFamilyName },
      this.props.style
    );
    return (
      <span
        className={this.props.skinConfig.icons[this.props.icon].fontStyleClass + ' ' + this.props.className}
        style={iconStyle}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
        onClick={this.props.onClick}
      >
        {this.props.skinConfig.icons[this.props.icon].fontString}
      </span>
    );
  }
});

Icon.propTypes = {
  icon: React.PropTypes.string,
  skinConfig: React.PropTypes.object,
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

Icon.defaultProps = {
  icon: '',
  skinConfig: {},
  className: '',
  style: {}
};

module.exports = Icon;
