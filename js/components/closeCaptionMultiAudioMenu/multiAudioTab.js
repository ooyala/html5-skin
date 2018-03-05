var React = require('react');
var BaseTab = require('./baseTab');

var MultiAudioTab = React.createClass({
  getInitialState: function () {
    console.log('props', this.props);
    return {};
  },

  render: function () {
    return <BaseTab {...this.state}/>;
  }
});

module.exports = MultiAudioTab;