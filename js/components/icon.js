var React = require('react');

var Icon = React.createClass({
  render: function() {
    return (
      <span className={this.props.iconClass}
        style={this.props.iconStyle}>
        {this.props.iconString}
      </span>
    );
  },
  proptypes: {
    iconClass: React.PropTypes.string,
    iconString: React.PropTypes.string,
    iconStyle: React.PropTypes.object
  }

});
module.exports = Icon;