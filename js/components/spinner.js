const React = require('react');
const createReactClass = require('create-react-class');

const Spinner = createReactClass({
  render() {
    return (
      <div className="oo-spinner-screen">
        <div className="oo-spinner-wrapper">
          <img src={this.props.loadingImage} className="oo-spinner" />
        </div>
      </div>
    );
  },
});
module.exports = Spinner;
