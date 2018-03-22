var React = require("react");
var classnames = require("classnames");

var ListItem = React.createClass({
  handleSelect: function() {
    this.props.handleSelect(this.props.id);
  },

  render: function() {
    var classes = {
      listItem: "oo-list-item",
      icon: "icon",
      text: "text"
    };

    if (this.props.selected) {
      for (var key in classes) {
        classes[key] = classes[key] + " select";
      }
    }

    return (
      <div
        onClick={this.handleSelect}
        className={classes.listItem}
      >
        <span className={classes.icon}> X </span>
        <span className={classes.text}>{this.props.name}</span>
      </div>
    );
  }
});

ListItem.propTypes = {
  selected: React.PropTypes.bool,
  name: React.PropTypes.string,
  id: React.PropTypes.string,
  skinConfig: React.PropTypes.shape({
    responsive: React.PropTypes.shape({
      breakpoints: React.PropTypes.shape({
        xs: React.PropTypes.shape({
          id: React.PropTypes.string
        }),
        sm: React.PropTypes.shape({
          id: React.PropTypes.string
        }),
        md: React.PropTypes.shape({
          id: React.PropTypes.string
        }),
        lg: React.PropTypes.shape({
          id: React.PropTypes.string
        })
      })
    })
  }),
  responsiveView: React.PropTypes.string
};

ListItem.defaultProps = {
  selected: false,
  name: "",
  id: "",
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: { id: "xs" },
        sm: { id: "sm" },
        md: { id: "md" },
        lg: { id: "lg" }
      }
    }
  },
  responsiveView: "md"
};

module.exports = ListItem;
