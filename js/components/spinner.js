var React = require('react');

var Spinner = React.createClass({
  render: function() {
    return (
      <div className="spinner-screen">
        <div className="spinner-wrapper">
          <img src={this.props.loadingImage} className="spinner" />
        </div>
      </div>
    );
  }
});
module.exports = Spinner;