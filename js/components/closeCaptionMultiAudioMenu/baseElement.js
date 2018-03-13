var React = require('react');

var BaseElement = React.createClass({

  render: function () {
    var styleCell = {
      'padding': '9px',
      backgroundColor:'rgba(0, 0, 0, 0)'
      // opacity: 0
    };

    var styleIcon = {
      fontSize: '14px',
      color: '#448aff',
      width: '14px',
      visibility: 'hidden'
    };

    var styleBackground = {
      zIndex: -1,
      width: '100%',
      height: '100%',
      backgroundColor: '#000'
    };

    if (this.props.selected) {
      styleCell.backgroundColor ='rgba(0, 0, 0, 0.2)';
      styleIcon.visibility = 'visible';
    }

    var styleText = {
      width: '100px',
      paddingLeft: '31px'
    };

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