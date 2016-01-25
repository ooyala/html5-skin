var React = require('react');

var ComponentWidthMixin = {
  getInitialState: function() {
      return {
        componentWidth: null
      };
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.onResize);
    this.setState({
      componentWidth: React.findDOMNode(this).getBoundingClientRect().width
    });
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.onResize);
  },

  onResize: function() {
    this.setState({
      componentWidth: React.findDOMNode(this).getBoundingClientRect().width
    });
  }
};
module.exports = ComponentWidthMixin;