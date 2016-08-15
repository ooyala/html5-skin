var React = require('react');

var Popover = React.createClass({

  render: function() {
    return (
      <div className="oo-popover">
        {this.props.children}
      </div>
    );
  }
});

module.exports = Popover;