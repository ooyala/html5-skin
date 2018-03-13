var React = require('react');

var BaseElement = React.createClass({

  handleSelect: function () {
    console.warn('BaseElement this', this);
    this.props.handleSelect(this.props.id);
  },

  render: function () {
    var styleCell = {
      'padding': '9px',
      backgroundColor:'rgba(0, 0, 0, 0)'
    };

    var styleIcon = {
      fontSize: '14px',
      color: '#448aff',
      width: '14px',
      visibility: 'hidden'
    };

    var styleText = {
      width: '100px',
      paddingLeft: '31px',
      fontWeight: 'normal',
      color: '#ffffff'

  };

    if (this.props.selected) {
      styleCell.backgroundColor ='rgba(0, 0, 0, 0.2)';
      styleIcon.visibility = 'visible';
      styleText.fontWeight = 'bold';
      styleText.color = '#448aff';
    }



    return (
      <div onClick={this.handleSelect} style={styleCell}>
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