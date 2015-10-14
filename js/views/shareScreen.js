/********************************************************************
  SHARING SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    SharePanel = require('../components/sharePanel'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    CONSTANTS = require('../constants/constants');

var ShareScreen = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      controlBarVisible: false
    };
  },

  closeSharePanel: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.closeScreen();
    }
  },

  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
    evt.target.style.WebkitFilter = "drop-shadow(0px 0px 3px rgba(255,255,255,0.8))";
    evt.target.style.filter = "drop-shadow(0px 0px 3px rgba(255,255,255,0.8))";
    evt.target.style.msFilter = "progid:DXImageTransform.Microsoft.Dropshadow(OffX=0, OffY=0, Color='#fff')";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
    evt.target.style.WebkitFilter = "";
    evt.target.style.filter = "";
    evt.target.style.msFilter = "";
  },

  render: function() {
    return (
      <div className="ShareScreen" style={{height: "100%", width: "100%"}}>
        <SharePanel {...this.props}/>
        <div className="close" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
          onClick={this.closeSharePanel} onTouchEnd={this.closeSharePanel} style={InlineStyle.shareScreenStyle.closeButton}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </div>
      </div>
    );
  }
});
module.exports = ShareScreen;
