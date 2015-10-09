/********************************************************************
  MORE OPTIONS SCREEN
*********************************************************************/
/**
* The screen used while the more options menu is showing.
*
* @class MoreOptionsScreen
* @constructor
*/
var React = require('react'),
    MoreOptionsPanel = require('../components/moreOptionsPanel'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    CONSTANTS = require('../constants/constants');

var MoreOptionsScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  render: function() {
    return (
      <div className="MoreOptionsScreen" style={{height: "100%", width: "100%"}}>

        <MoreOptionsPanel {...this.props}
          controlBarWidth={this.state.controlBarWidth}/>

      </div>
    );
  }
});
module.exports = MoreOptionsScreen;
