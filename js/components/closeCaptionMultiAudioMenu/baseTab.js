var React = require('react');
var BaseElement = require('./baseElement');

var BaseTab = React.createClass({
  render: function () {
    this.props.list.forEach(function (element) {
      return <BaseElement {...element}/>
    });
  }
});

module.exports = BaseTab;