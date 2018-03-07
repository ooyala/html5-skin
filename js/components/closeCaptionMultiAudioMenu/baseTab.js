var React = require('react');
var BaseElement = require('./baseElement');

var BaseTab = React.createClass({
  render: function () {
    var list = this.props.list.map(function (element, index) {
      return <BaseElement key={index} {...element}/>;
    });

    return <span>{list}</span>;
  }
});

BaseTab.defaultProps = {
  list: [{
    name: '',
    id: '',
    selected: false
  }]
};

module.exports = BaseTab;