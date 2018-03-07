var React = require('react');
var BaseTab = require('./baseTab');

var MultiAudioTab = React.createClass({
  componentWillMount: function () {
    this.list = [];
    this.updateList(this.props);
  },

  componentWillUpdate: function (nextProps, nextState) {
    this.updateList(nextProps);
  },

  updateList: function (props) {
    if(props && props.list){
      props.list.forEach(function (el, index) {
        this.list[index] = {
          selected: el.enabled,
          name: el.label,
          id: el.id
        };
      }.bind(this));
    }
  },

  render: function () {
    return <BaseTab list={this.list}/>;
  }
});

module.exports = MultiAudioTab;