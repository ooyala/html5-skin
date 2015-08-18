/********************************************************************
  MORE OPTIONS PANEL
*********************************************************************/
/**
* @class MoreOptionsPanel
* @constructor
*/

var MoreOptionsPanel = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
  },
  componentDidMount: function () {
    // Fade-in & bottom-up animation
    MoreOptionsScreenStyle.buttonListStyle.bottom = "50%";
    MoreOptionsScreenStyle.buttonListStyle.opacity = "1";

    if (Utils.isSafari()){
      MoreOptionsScreenStyle.buttonListStyle.display = "-webkit-flex";
    }
    else {
      MoreOptionsScreenStyle.buttonListStyle.display = "flex";
    }
  },

  closeMoreOptionsScreen: function(evt) {
    if (evt.type !== 'touchend' && this.isMobile){
      //do nothing to prevent double firing of events
      //from touchend and click on mobile devices
    }
    else {
      this.props.controller.closeMoreOptionsScreen();
    }
  },

  handleShareClick: function(evt) {
    if (evt.type !== 'touchend' && this.isMobile){
      //do nothing to prevent double firing of events
      //from touchend and click on mobile devices
    }
    else {
      this.props.controller.toggleShareScreen();
    }
  },

  handleDiscoveryClick: function(evt) {
    if (evt.type !== 'touchend' && this.isMobile){
      //do nothing to prevent double firing of events
      //from touchend and click on mobile devices
    }
    else {
      this.props.controller.toggleDiscoveryScreen();
    }
  },

  handleClosedCaptionClick: function(evt) {
    if (evt.type !== 'touchend' && this.isMobile){
      //do nothing to prevent double firing of events
      //from touchend and click on mobile devices
    }
    else {
      this.props.controller.toggleClosedCaptionScreen();
    }
  },

  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  buildMoreOptionsButtonList: function() {
    var fullscreenClass = (this.props.fullscreen) ?
      this.props.skinConfig.icons.compress.fontStyleClass : this.props.skinConfig.icons.expand.fontStyleClass;

    var optionsItemsTemplates = {
      "discovery": <div className="discovery" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick} onTouchEnd={this.handleDiscoveryClick}>
        <span className={this.props.skinConfig.icons.discovery.fontStyleClass}></span></div>,
    
      "quality": <div className="quality" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={this.props.skinConfig.icons.quality.fontStyleClass}></span></div>,
      
      "closedCaption": <div className="closedCaption" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleClosedCaptionClick} onTouchEnd={this.handleClosedCaptionClick}> 
        <span className={this.props.skinConfig.icons.cc.fontStyleClass}></span></div>,
      
      "share": <div className="share" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleShareClick} onTouchEnd={this.handleShareClick}>
        <span className={this.props.skinConfig.icons.share.fontStyleClass}></span></div>,
      
      "fullscreen": <div className="fullscreen" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleFullscreenClick} onTouchEnd={this.handleFullscreenClick}>
        <span className={fullscreenClass}></span></div>,

      "settings": <div className="settings" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        <span className={this.props.skinConfig.icons.setting.fontStyleClass}></span></div>,
    };

    var moreOptionsItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;
    var collapsedResult = Utils.collapse(this.props.controlBarWidth, defaultItems);
    var collapsedMoreOptionsItems = collapsedResult.overflow;
    for (i = 0; i < collapsedMoreOptionsItems.length; i++) {
      if (typeof optionsItemsTemplates[collapsedMoreOptionsItems[i].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.ccOptions.availableLanguages && (collapsedMoreOptionsItems[i].name === "closedCaption")){
        continue;
      }
      moreOptionsItems.push(optionsItemsTemplates[collapsedMoreOptionsItems[i].name]);
    }
    return moreOptionsItems;
  },

  render: function() {
    var moreOptionsItems = this.buildMoreOptionsButtonList();
    return (
      <div style={MoreOptionsScreenStyle.panelStyle}>
        <div onMouseOver={this.highlight} onMouseOut={this.removeHighlight} 
          onClick={this.closeMoreOptionsScreen} onTouchEnd={this.closeMoreOptionsScreen} style={MoreOptionsScreenStyle.closeButtonStyle}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </div>
        <div style={MoreOptionsScreenStyle.buttonListStyle}>
          {moreOptionsItems}
        </div>
      </div>
    );
  }
});