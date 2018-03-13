var React = require('react');

var BaseElement = React.createClass({

  render: function () {
    var styleCell = {
      'padding': '9px',
    };

    var styleIcon = {
      fontSize: '14px',
      color: '#448aff',
      width: '14px',
      visibility: 'hidden'
    };

    if (this.props.selected) {
      styleIcon.visibility = 'visible';
    }

    var styleText = {
      width: '100px',
      paddingLeft: '31px'
    };

    console.warn('selected', this.props.selected);


    return (
      <div style={styleCell}>
        <span style={styleIcon}> Q </span>
        <span style={styleText}>{this.props.name}</span>
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