var React = require('react');
var createReactClass = require('create-react-class');

var Spinner = createReactClass({
  render: function() {
    return (
      <div className="oo-spinner-screen">
        <div className="oo-spinner-wrapper">
          <img src={this.props.loadingImage} className="oo-spinner" />
        </div>
      </div>
    );
  }
});
module.exports = Spinner;
