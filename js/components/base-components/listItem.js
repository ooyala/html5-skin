var React = require('react');

var listItem = React.createClass({

  handleSelect: function () {
    this.props.handleSelect(this.props.id);
  },

  render: function () {
    var classes = {
      listItem: 'list-item',
      icon: 'icon',
      text: 'text'
    };

    if (this.props.selected) {
      for (var key in classes){
        classes[key] = classes[key] + ' select';
      }
    }

    return (
      <div onClick={this.handleSelect} className={classes.listItem}>
        <span className={classes.icon}> X </span>
        <span className={classes.text}>{this.props.name}</span>
      </div>
    )
  }
});

listItem.defaultProps = {
  selected: false,
  name: "",
  id: ""
};

module.exports = listItem;