var React = require('react');

var BaseElement = React.createClass({
  render: function () {
    var styleCell = {
      'padding': '9px'
    };

    var styleIcon = {
      fontSize: '14px',
      color: '#448aff',
      width: '14px',
      float: 'left'
    };

    var styleText = {
      float: 'right'
    }

    return (
      <div style={styleCell}>
        <div style={styleIcon}> Q </div>
        <div style={styleText}>{this.props.name}</div>
      </div>
    )
  }
});

BaseElement.defaultProps = {
  selected: false,
  name: "",
  id: ""
};

module.exports = BaseElement;