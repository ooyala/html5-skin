var React = require('react');
var BaseTab = require('./baseTab');

var MultiAudioTab = React.createClass({
  getInitialState: function () {
    var list = [];
    console.log('MultiAudioTab props', this.props);

    this.props.list.forEach(function (el) {
      list.push({
        selected: el.enabled,
        name: el.label,
        id: el.id
      });
    });

    console.log('list', list);
    return {
      list: list
    };
  },



  render: function () {
    console.log('this.state', this.state);
    return <BaseTab {...this.state}/>;
  }
});

module.exports = MultiAudioTab;