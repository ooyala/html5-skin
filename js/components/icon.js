var React = require('react');


var Icon = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return  (nextProps.iconClass != this.props.iconClass ||
            nextProps.iconString != this.props.iconString ||
            JSON.stringify(nextProps.iconStyle) != JSON.stringify(this.props.iconStyle))
  },

  render: function() {
    return (
      <span className={this.props.iconClass}
        style={this.props.iconStyle}
        onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut}
        onClick={this.props.onClick}>
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