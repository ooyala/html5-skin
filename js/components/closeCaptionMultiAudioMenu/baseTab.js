var React = require('react');
var BaseElement = require('./baseElement');

var BaseTab = React.createClass({
  render: function () {
    if(this.props.list) {
      this.props.list.map(function (element, index) {
        console.warn('element', element);
        return <BaseElement key={index} {...element}/>
      });
    }
  }
});

module.exports = BaseTab;