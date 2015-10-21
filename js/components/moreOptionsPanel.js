/********************************************************************
  MORE OPTIONS PANEL
*********************************************************************/
/**
* @class MoreOptionsPanel
* @constructor
*/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('./utils');

var MoreOptionsPanel = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
  },
  componentDidMount: function () {
    // Fade-in & bottom-up animation
    InlineStyle.MoreOptionsScreenStyle.buttonListStyle.bottom = "50%";
    InlineStyle.MoreOptionsScreenStyle.buttonListStyle.opacity = "1";

    if (Utils.isSafari()){
      InlineStyle.MoreOptionsScreenStyle.buttonListStyle.display = "-webkit-flex";
    }
    else {
      InlineStyle.MoreOptionsScreenStyle.buttonListStyle.display = "flex";
    }

    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  componentWillUnmount: function () {
    InlineStyle.MoreOptionsScreenStyle.buttonListStyle.bottom = "0";
    this.props.controller.state.accessibilityControlsEnabled = true;
  },

  closeMoreOptionsScreen: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.closeMoreOptionsScreen();
    }
  },

  handleShareClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleShareScreen();
    }
  },

  handleDiscoveryClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleDiscoveryScreen();
    }
  },

  handleClosedCaptionClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleClosedCaptionScreen();
    }
  },

  highlight: function(evt) {
    Utils.highlight(evt.target);
  },

  removeHighlight: function(evt) {
    var opacity = this.props.skinConfig.controlBar.iconStyle.opacity;
    Utils.removeHighlight(evt.target, opacity);
  },

  dismissButtonHighlight: function(evt) {
    Utils.highlight(evt.target);
  },

  removeDismissButtonHighlight: function(evt) {
    var opacity = "0.6";
    Utils.removeHighlight(evt.target, opacity);
  },

  buildMoreOptionsButtonList: function() {
    var fullscreenClass = (this.props.fullscreen) ?
      this.props.skinConfig.icons.compress.fontStyleClass : this.props.skinConfig.icons.expand.fontStyleClass;

    InlineStyle.MoreOptionsScreenStyle.buttonStyle.fontSize = this.props.skinConfig.moreOptionsScreen.iconSize+"px";
    var iconSetting = Utils.extend(InlineStyle.MoreOptionsScreenStyle.iconStyle, this.props.skinConfig.moreOptionsScreen.iconStyle);
    var optionsItemsTemplates = {
      "discovery": <div className="discovery" style={InlineStyle.MoreOptionsScreenStyle.buttonStyle}
        onClick={this.handleDiscoveryClick} onTouchEnd={this.handleDiscoveryClick}>
        <span className={this.props.skinConfig.icons.discovery.fontStyleClass}
          style={iconSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span></div>,

      "quality": <div className="quality" style={InlineStyle.MoreOptionsScreenStyle.buttonStyle}>
        <span className={this.props.skinConfig.icons.quality.fontStyleClass}
          style={iconSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span></div>,

      "closedCaption": <div className="closedCaption" style={InlineStyle.MoreOptionsScreenStyle.buttonStyle} onClick={this.handleClosedCaptionClick} onTouchEnd={this.handleClosedCaptionClick}>
        <span className={this.props.skinConfig.icons.cc.fontStyleClass}
          style={iconSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span></div>,

      "share": <div className="share" style={InlineStyle.MoreOptionsScreenStyle.buttonStyle}
        onClick={this.handleShareClick} onTouchEnd={this.handleShareClick}>
        <span className={this.props.skinConfig.icons.share.fontStyleClass}
          style={iconSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span></div>,

      "fullscreen": <div className="fullscreen" style={InlineStyle.MoreOptionsScreenStyle.buttonStyle}
        onClick={this.handleFullscreenClick} onTouchEnd={this.handleFullscreenClick}>
        <span className={fullscreenClass}
          style={iconSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span></div>,

      "settings": <div className="settings" style={InlineStyle.MoreOptionsScreenStyle.buttonStyle}>
        <span className={this.props.skinConfig.icons.setting.fontStyleClass}
          style={iconSetting} onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
        </span></div>,
    };

    var moreOptionsItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;

    //if mobile and not showing the slider or the icon, extra space can be added to control bar width:
    var extraSpaceVolumeSlider = ((this.isMobile && !this.props.controller.state.volumeState.volumeSliderVisible) ? parseInt(InlineStyle.volumeSliderStyle.volumeBarSetting.width) : 0);
    var extraSpaceVolumeIcon = ((Utils.isIos())?
                                parseInt(InlineStyle.controlBarStyle.controlBarItemSetting.fontSize)+
                                parseInt(InlineStyle.controlBarStyle.controlBarItemSetting.paddingLeft)+
                                parseInt(InlineStyle.controlBarStyle.controlBarItemSetting.paddingRight)
                                :0);

    //if no hours, add extra space to control bar width:
    var hours = parseInt(this.props.duration / 3600, 10);
    var extraSpaceDuration = (hours > 0) ? 0 : 45;

   var controlBarLeftRightPadding = parseFloat(InlineStyle.controlBarStyle.controlBarItemsWrapper.paddingLeft)+parseFloat(InlineStyle.controlBarStyle.controlBarItemsWrapper.paddingRight);

    var collapsedResult = Utils.collapse(this.props.controlBarWidth+extraSpaceDuration+extraSpaceVolumeSlider+extraSpaceVolumeIcon-controlBarLeftRightPadding, defaultItems);
    var collapsedMoreOptionsItems = collapsedResult.overflow;
    for (i = 0; i < collapsedMoreOptionsItems.length; i++) {
      if (typeof optionsItemsTemplates[collapsedMoreOptionsItems[i].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.closedCaptionOptions.availableLanguages && (collapsedMoreOptionsItems[i].name === "closedCaption")){
        continue;
      }
      moreOptionsItems.push(optionsItemsTemplates[collapsedMoreOptionsItems[i].name]);
    }
    return moreOptionsItems;
  },

  render: function() {
    var moreOptionsItems = this.buildMoreOptionsButtonList();
    return (
      <div>
        <div className="moreOptionsPanel" style={InlineStyle.MoreOptionsScreenStyle.panelStyle}>
          <div className="moreOptionsItems" style={InlineStyle.MoreOptionsScreenStyle.buttonListStyle}>
            {moreOptionsItems}
          </div>
        </div>
        <div onClick={this.closeMoreOptionsScreen} onTouchEnd={this.closeMoreOptionsScreen} style={InlineStyle.MoreOptionsScreenStyle.closeButtonStyle}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass} onMouseOver={this.dismissButtonHighlight}
            onMouseOut={this.removeDismissButtonHighlight} style={InlineStyle.defaultScreenStyle.closeButtonStyle}>
          </span>
        </div>
      </div>
    );
  }
});
module.exports = MoreOptionsPanel;
