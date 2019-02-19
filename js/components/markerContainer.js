import React, { Component } from 'react';
import PropTypes from 'prop-types';

class markerContainer extends Component {
  constructor(props) {
    super(props);

  }

  // componentWillMount() {

  // }

  // componentDidMount() {

  // }

  // componentWillReceiveProps(nextProps) {

  // }

  // shouldComponentUpdate(nextProps, nextState) {

  // }

  // componentWillUpdate(nextProps, nextState) {

  // }

  // componentDidUpdate(prevProps, prevState) {

  // }

  // componentWillUnmount() {

  // }

  render() {
    // const MarkerText = function(props) {
    //   return (<div style={props.style} className="oo-marker-bubble oo-marker-text">
    //     <p className="oo-text-truncate">{props.marker.text || "Here's the label tooooo long"}</p>
    //   </div>)
    // }
    console.log('[marker-icon]', this.props.markers);
    return (
      <div id="markerContainer">
        {/* {this.props.markers} */}
      </div>
    );
  }
}

markerContainer.propTypes = {

};

export default markerContainer;