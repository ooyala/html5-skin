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

  createMarkup: function() {
    return {__html: this.props.contentTitle};
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
      <div className="oo-discovery-image-wrapper-style">
        <div className="oo-discovery-wrapper">
          <a onClick={this.props.onClickAction}>
            <div className="oo-image-style" style={thumbnailStyle}></div>
          </a>
          {this.props.children}
        </div>
        <div className={this.props.contentTitleClassName} dangerouslySetInnerHTML={this.createMarkup()}></div>
      </div>
    );
  }
});
module.exports = DiscoverItem;