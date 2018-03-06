var React = require('react');
var BaseElement = require('./baseElement');

var BaseTab = React.createClass({
  render: function () {
    console.log('BaseTab this.props', this.props);
    try {
      if(this.props.list.length === 0){
        return null;
      }

      if(this.props.list) {
        this.props.list.map(function (element, index) {
          return <BaseElement key={index} {...element}/>;
        });
      }
    } catch (err){
      console.log('err', err);
    }

  }
});

BaseTab.defaultProps = {
  list: []
};

module.exports = BaseTab;