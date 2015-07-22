/********************************************************************
  MORE OPTIONS PANEL
*********************************************************************/
/**
* @class MoreOptionsPanel
* @constructor
*/

var MoreOptionsPanel = React.createClass({
  componentDidMount: function () {
    // Fade-in & bottom-up animation
    MoreOptionsScreenStyle.buttonListStyle.bottom = "50%";
    MoreOptionsScreenStyle.buttonListStyle.opacity = "1";
  },

  closeMoreOptionsScreen: function() {
    this.props.controller.closeMoreOptionsScreen();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleDiscoveryClick: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleClosedCaptionClick: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  buildMoreOptionsButtonList: function() {
    var fullscreenClass = (this.props.fullscreen) ?
      "icon icon-resize-small" : "icon icon-resize-large";

    var optionsItemsTemplates = {
      "discovery": <div className="discovery" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick}>
        <span className="icon icon-topmenu-discovery"></span></div>,
      
      "bitrateSelector": <div className="bitrateSelector" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className="icon icon-topmenu-quality"></span></div>,
      
      "closedCaption": <div className="closedCaption" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleClosedCaptionClick}> 
        <span className="icon icon-topmenu-cc"></span></div>,
      
      "share": <div className="share" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleShareClick}>
        <span className="icon icon-topmenu-share"></span></div>,
      
      "fullscreen": <div className="fullscreen" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick}>
        <span className={fullscreenClass}></span></div>,

      "settings": <div className="settings" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className="icon-topmenu-settings"></span></div>,
    };

    var moreOptionsItems = [];
    var moreOptionsButtons = this.props.skinConfig.moreOptions.buttons;
    for (i = 0; i < moreOptionsButtons.length; i++) {
      if (typeof optionsItemsTemplates[moreOptionsButtons[i]] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.ccOptions.availableLanguages && (moreOptionsButtons[i] === "closedCaption")){
        continue;
      }
      moreOptionsItems.push(optionsItemsTemplates[moreOptionsButtons[i]]);
    }
    return moreOptionsItems;
  },

  render: function() {
    var moreOptionsItems = this.buildMoreOptionsButtonList();
    return (
      <div style={MoreOptionsScreenStyle.panelStyle}>
        <div onMouseOver={this.highlight} onMouseOut={this.removeHighlight} 
          onClick={this.closeMoreOptionsScreen} style={MoreOptionsScreenStyle.closeButtonStyle}>
          <span className="icon icon-close"></span>
        </div>
        <div style={MoreOptionsScreenStyle.buttonListStyle}>
          {moreOptionsItems}
        </div>
      </div>
    );
  }
});