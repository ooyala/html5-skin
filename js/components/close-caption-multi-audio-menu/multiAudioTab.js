var React = require('react');
var BaseTab = require('../base-components/listWithChoice');

var MultiAudioTab = React.createClass({
  componentWillMount: function () {
    this.header = "Audio";
    this.list = [];
    this.updateList(this.props);
  },

  componentWillUpdate: function (nextProps, nextState) {
    this.updateList(nextProps);
  },

  updateList: function (props) {
    if(props.multiAudio && props.multiAudio.list){
      props.multiAudio.list.forEach(function (el, index) {
        this.list[index] = {
          selected: el.enabled,
          name: el.label,
          id: el.id
        };
      }.bind(this));
    }
  },

  handleSelect: function (id) {
    this.props.handleSelect(id);
  },

  render: function () {
    return <BaseTab handleSelect={this.handleSelect} skinConfig={this.props.skinConfig} header={this.header} list={this.list}/>;
  }
});

module.exports = MultiAudioTab;