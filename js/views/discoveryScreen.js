/********************************************************************
  DISCOVERY SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class DiscoveryScreen
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    DiscoveryPanel = require('../components/discoveryPanel'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    CONSTANTS = require('../constants/constants');

var DiscoveryScreen = React.createClass({
  getInitialState: function() {
    return null;
  },

  componentDidMount: function () {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  closeDiscoveryPanel: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleDiscoveryScreen();
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
    var promoStyle = InlineStyle.discoveryScreenStyle.promoStyle;
    if(this.props.playerState === CONSTANTS.STATE.END) {
      promoStyle.visibility = "visible";
    }
    else {
      promoStyle.visibility = "hidden";
    }
    promoStyle.backgroundImage = "url('" + this.props.contentTree.promo_image + "')";
    return (
      <div className="discoveryScreen" style={{height: "100%", width: "100%"}}>
        <div style={InlineStyle.discoveryScreenStyle.promoStyle}></div>
        <DiscoveryPanel
          {...this.props}
          discoveryData={this.props.discoveryData} />
        <div className="close" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}
            onClick={this.closeDiscoveryPanel} style={InlineStyle.discoveryScreenStyle.closeButtonStyle}
            onTouchEnd={this.closeDiscoveryPanel}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </div>

      </div>
    );
  }
});
module.exports = DiscoveryScreen;
