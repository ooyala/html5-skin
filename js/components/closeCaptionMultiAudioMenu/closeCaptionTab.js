var React = require('react');
var BaseTab = require('./baseTab');

var CloseCaptionTab = React.createClass({
  componentWillMount: function () {
    this.header = 'Subtitles';
    this.list = [];
    this.updateList(this.props);
  },

  componentWillUpdate: function (nextProps, nextState) {
    this.updateList(nextProps);
  },

  updateList: function (props) {
    var isSelected;
    if(props && props.list){
      props.list.forEach(function (el, index) {
        isSelected = el === props.selected ? true : false;

        this.list[index] = {
          selected: isSelected,
          name: el,
          id: el
        };
      }.bind(this));
    }
  },

  handleSelect: function (id) {
    console.warn('multiAudioTab handleSelect id', id);

    this.props.handleSelect(id);
  },

  render: function () {
    return <BaseTab handleSelect={this.handleSelect} header={this.header} list={this.list}/>;
  }
});

module.exports = CloseCaptionTab;