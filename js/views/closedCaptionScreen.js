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

var ClosedCaptionScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: true,
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
  },

  closeClosedCaptionPanel: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleClosedCaptionScreen();
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
      <div style={{height: "100%", width: "100%"}}>
        <ClosedCaptionPanel {...this.props} ccOptions = {this.props.ccOptions} clientWidth = {this.state.clientWidth} clientHeight = {this.state.clientHeight}/>
        <ScrubberBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.clientWidth}/>
        <ControlBar {...this.props} controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.clientWidth}
          playerState={this.state.playerState}/>

        <div className="close" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.closeClosedCaptionPanel} style={InlineStyle.closedCaptionScreenStyles.closeButtonStyle}
          onTouchEnd={this.closeClosedCaptionPanel}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </div>
      </div>
    );
  }
});
module.exports = ClosedCaptionScreen;
