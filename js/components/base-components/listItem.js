var React = require('react');
var Icon = require('../icon');
var classnames = require('classnames');

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
        {/*<Icon skinConfig={this.props.skinConfig} icon="selectedIcon" className={classes.icon} />*/}

        <span className={classes.text}>{this.props.name}</span>
      </div>
    )
  }
});

listItem.defaultProps = {
  selected: false,
  name: "",
  id: "",
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: { id: 'xs' },
        sm: { id: 'sm' },
        md: { id: 'md' },
        lg: { id: 'lg' }
      }
    }
  },
  responsiveView: 'md'
};

module.exports = listItem;