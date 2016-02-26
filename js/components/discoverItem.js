var React = require('react');

var DiscoverItem = React.createClass({
  getInitialState: function() {
    return {
      imgError: false
    };
  },

  componentWillMount: function() {
    var img = new Image();
    img.src = this.props.src;

    // check if error occurs while loading img
    img.onerror = function() {
      this.setState({
        imgError: true
      });
    }.bind(this);
  },

  render: function() {
    // handle img error, return null
    if (this.state.imgError) {
      return null;
    }

    var thumbnailStyle = {
      backgroundImage: "url('" + this.props.src + "')"
    };

    return (
      <div className="discoveryImageWrapperStyle">
        <a onClick={this.props.onClickAction}>
          <div className="imageStyle" style={thumbnailStyle}></div>
          <div className={this.props.contentTitleClassName}>{this.props.contentTitle}</div>
        </a>
        {this.props.children}
      </div>
    );
  }
});
module.exports = DiscoverItem;