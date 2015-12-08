var React = require('react');

var Spinner = React.createClass({
  render: function() {
    return (
      <div className="spinner-screen">
        <div className="spinner-wrapper">
          <img src="assets/images/loading.png" className="spinner" />
        </div>
      </div>
    );
  }
});
module.exports = Spinner;