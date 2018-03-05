var React = require('react');

var BaseElement = React.createClass({
  render: function () {
    return (
      <div >
        <span>{this.props.selected}</span>
      </div>
    )
  }
});

module.exports = BaseElement;