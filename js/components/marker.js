const React = require('react');
const PropTypes = require('prop-types');

/**
 * This component represents an element that handles the rendering 
 * of an individual marker.
 */
class Marker extends React.Component {

  constructor(props) {
    super(props);
    this.style = this.props.style;
  }
  
  shouldComponentUpdate(nextProps) {
    if (this.style.left !== nextProps.style.left || this.style.width !== nextProps.style.width || this.style.backgroundColor !== nextProps.style.backgroundColor) {
      this.style = nextProps.style;
      return true;
    }
    return false;
  }

  render() {
    return (
      <div style={this.style} className="oo-marker"></div>
    );
  }
}

Marker.propTypes = {
  style: PropTypes.object
};

Marker.defaultProps = {
  style: []
};

module.exports = Marker;