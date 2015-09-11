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

  closeDiscoveryPanel: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleDiscoveryScreen();
    }
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
