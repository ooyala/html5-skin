var React = require('react'),
    ClassNames = require('classnames');

var Spinner = React.createClass({
  render: function() {
    var spinnerScreen = ClassNames({
      'oo-spinner-screen': true,
      'oo-spinner-background': this.props.loadingScreen
    });

    return (
      <div className={spinnerScreen}>
        <div className="oo-spinner-wrapper">
          <img src={this.props.loadingImage} className="oo-spinner" />
        </div>
      </div>
    );
  }
});
module.exports = Spinner;