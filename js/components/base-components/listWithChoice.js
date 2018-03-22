var React = require("react");
var BaseElement = require("./listItem");

var listWithChoice = React.createClass({
  render: function() {
    var list = this.props.list.map(
      function(element, index) {
        return (
          <BaseElement
            skinConfig={this.props.skinConfig}
            handleSelect={this.props.handleSelect}
            key={index}
            {...element}
          />
        );
      }.bind(this)
    );

    return (
      <div className="oo-list-with-choice">
        <div className="oo-list-header">{this.props.header}</div>
        <div className="oo-list-body">{list}</div>
      </div>
    );
  }
});

listWithChoice.defaultProps = {
  header: "",
  list: [
    {
      name: "",
      id: "",
      selected: false
    }
  ],
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

module.exports = listWithChoice;
