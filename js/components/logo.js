var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var Logo = createReactClass({
  render: function() {
    var content = this.props.clickUrl ? (
      <a href={this.props.clickUrl} target={this.props.target}>
        <img width={this.props.width} height={this.props.height} src={this.props.imageUrl} />
      </a>
    ) : (
      // if no link just show img
      <img width={this.props.width} height={this.props.height} src={this.props.imageUrl} />
    );

    return (
      <div className="oo-logo oo-control-bar-item" style={this.props.style}>
        {content}
      </div>
    );
  }
});

Logo.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  clickUrl: PropTypes.string,
  target: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object
};

Logo.defaultProps = {
  imageUrl: '/assets/images/ooyala.png',
  clickUrl: '',
  target: '_blank',
  width: null,
  height: null,
  style: {}
};

module.exports = Logo;
