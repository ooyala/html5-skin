/********************************************************************
  CLOSED CAPTION SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionScreen
* @constructor
*/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    ClosedCaptionPanel = require('../components/closedCaptionPanel'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    CONSTANTS = require('../constants/constants');
    Utils = require('../components/utils');

var ClosedCaptionScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      clientWidth: null,
      clientHeight: null
    };
  },

  handleResize: function(e) {
    this.setState({clientWidth: this.getDOMNode().clientWidth, clientHeight: this.getDOMNode().clientHeight});
  },

  componentDidMount: function () {
    this.setState({
      clientWidth: this.getDOMNode().clientWidth,
      clientHeight: this.getDOMNode().clientHeight
    });
    window.addEventListener('resize', this.handleResize);
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    window.removeEventListener('resize', this.handleResize);
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  closeClosedCaptionPanel: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.toggleClosedCaptionScreen();
    }
  },

  highlight: function(evt) {
    Utils.highlight(evt.target);
  },

  removeHighlight: function(evt) {
    var opacity = "0.6";
    Utils.removeHighlight(evt.target, opacity);
  },


  render: function() {
    return (
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props} closedCaptionOptions = {this.props.closedCaptionOptions} clientWidth = {this.state.clientWidth} clientHeight = {this.state.clientHeight}/>

        <div className="close" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.closeClosedCaptionPanel} style={InlineStyle.closedCaptionScreenStyles.closeButtonStyle}
          onTouchEnd={this.closeClosedCaptionPanel}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass} style={InlineStyle.defaultScreenStyle.closeButtonStyle}></span>
        </div>
      </div>
    );
  }
});
module.exports = ClosedCaptionScreen;
