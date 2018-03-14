var React = require('react');
var BaseElement = require('./listItem');

var listWithChoice = React.createClass({
  handleSelect: function (id) {
    this.props.handleSelect(id);
  },

  render: function () {
    var list = this.props.list.map(function (element, index) {
      return <BaseElement handleSelect={this.handleSelect} key={index} {...element}/>;
    }.bind(this));

    return (
      <div className="oo-list-with-choice">
        <div className="list-header">{this.props.header}</div>
        <div className="list-body">{list}</div>
      </div>
    );
  }
});

listWithChoice.defaultProps = {
  header: '',
  list: [{
    name: '',
    id: '',
    selected: false
  }]
};

module.exports = listWithChoice;