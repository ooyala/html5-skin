var React = require('react');
var BaseElement = require('./baseElement');

var BaseTab = React.createClass({
  render: function () {
    var list = this.props.list.map(function (element, index) {
      return <BaseElement key={index} {...element}/>;
    });

    var styleHeader = {
      'fontSize': '16px',
      'fontWeight': 'bold',
      'textAlign': 'left',
      'color': '#ffffff',
      'borderStyle': 'none none solid none',
      'borderWidth': '1px',
      'borderColor': '#000'
    };

    var styleList = {
      'fontSize': '13px',
      'fontWeight': 'normal',
      'textAlign': 'left',
      'color': '#ffffff',
      'borderStyle': 'none solid none none',
      'borderWidth': '1px',
      'borderColor': '#000',
      height: '100%'
  };

    return (
      <div style={{height: '100%'}}>
        <div style={styleHeader}>{this.props.header}</div>
        <div style={styleList}>{list}</div>
      </div>
    );
  }
});

BaseTab.defaultProps = {
  header: '',
  list: [{
    name: '',
    id: '',
    selected: false
  }]
};

module.exports = BaseTab;