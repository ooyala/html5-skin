/********************************************************************
 MORE OPTIONS PANEL
 *********************************************************************/
/**
 * @class MoreOptionsPanel
 * @constructor
 */
var React = require('react'),
    Utils = require('./utils'),
    CONSTANTS = require('../constants/constants'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon');

var MoreOptionsPanel = React.createClass({
  getInitialState: function() {
    return {
      animate: false
    };
  },

  componentDidMount: function () {
    this.setState({
      animate: true
    });
  },

  handleShareClick: function () {
    this.props.controller.toggleShareScreen();
  },

  handleQualityClick: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  },

  handleDiscoveryClick: function () {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleClosedCaptionClick: function () {
    this.props.controller.toggleClosedCaptionScreen();
  },

  highlight: function (evt) {
    var color = this.props.skinConfig.moreOptionsScreen.iconStyle.active.color;
    var opacity = this.props.skinConfig.moreOptionsScreen.iconStyle.active.opacity;
    Utils.highlight(evt.target, opacity, color);
  },

  removeHighlight: function (evt) {
    var color = this.props.skinConfig.moreOptionsScreen.iconStyle.inactive.color;
    var opacity = this.props.skinConfig.moreOptionsScreen.iconStyle.inactive.opacity;
    Utils.removeHighlight(evt.target, opacity, color);
  },

  buildMoreOptionsButtonList: function () {
    var fullscreenClass = (this.props.fullscreen) ?
      this.props.skinConfig.icons.compress.fontStyleClass : this.props.skinConfig.icons.expand.fontStyleClass;
    var iconSetting = this.props.skinConfig.moreOptionsScreen.iconStyle.inactive;

    var optionsItemsTemplates = {
      "quality": <button className="quality controlBarItem" onClick={this.handleQualityClick} key="quality">
        <Icon {...this.props} icon="quality"
         onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "discovery": <button className="discovery controlBarItem" onClick={this.handleDiscoveryClick} key="discovery">
        <Icon {...this.props} icon="discovery"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "closedCaption": <button className="closedCaption controlBarItem" onClick={this.handleClosedCaptionClick} key="closedCaption">
        <Icon {...this.props} icon="cc"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "share": <button className="share controlBarItem" onClick={this.handleShareClick} key="share">
        <Icon {...this.props} icon="share"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "settings": <div className="settings" key="settings">
        <Icon {...this.props} icon="setting"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </div>
    };

    var moreOptionsItems = [];
    var defaultItems = this.props.controller.state.isPlayingAd ? this.props.skinConfig.buttons.desktopAd : this.props.skinConfig.buttons.desktopContent;

    //if mobile and not showing the slider or the icon, extra space can be added to control bar width:
    var volumeItem = null;
    for (var j = 0; j < defaultItems.length; j++) {
      if (defaultItems[j].name == "volume") {
        volumeItem = defaultItems[j];
        break;
      }
    }
    var extraSpaceVolumeSlider = (((volumeItem && this.isMobile && !this.props.controller.state.volumeState.volumeSliderVisible) || volumeItem && Utils.isIos()) ? parseInt(volumeItem.minWidth) : 0);

    //if no hours, add extra space to control bar width:
    var hours = parseInt(this.props.duration / 3600, 10);
    var extraSpaceDuration = (hours > 0) ? 0 : 45;

    var responsiveUIMultiple = this.props.responsiveView == this.props.skinConfig.responsive.breakpoints.sm.name ?
      this.props.skinConfig.responsive.breakpoints.sm.multiplier :
      this.props.skinConfig.responsive.breakpoints.md.multiplier;
    var controlBarLeftRightPadding = responsiveUIMultiple * CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING * 2;

    var collapsedResult = Utils.collapse(this.props.controlBarWidth + extraSpaceDuration + extraSpaceVolumeSlider - controlBarLeftRightPadding, defaultItems, responsiveUIMultiple);
    var collapsedMoreOptionsItems = collapsedResult.overflow;
    for (var i = 0; i < collapsedMoreOptionsItems.length; i++) {
      if (typeof optionsItemsTemplates[collapsedMoreOptionsItems[i].name] === "undefined") {
        continue;
      }

      //do not show CC button if no CC available
      if (!this.props.controller.state.closedCaptionOptions.availableLanguages && (collapsedMoreOptionsItems[i].name === "closedCaption")) {
        continue;
      }

      //do not show discovery button if no related videos available
      if (!this.props.controller.state.discoveryData && (collapsedMoreOptionsItems[i].name === "discovery")){
        continue;
      }

      //do not show quality button if no bitrates available
      if (!this.props.controller.state.videoQualityOptions.availableBitrates && (collapsedMoreOptionsItems[i].name === "quality")){
        continue;
      }
      moreOptionsItems.push(optionsItemsTemplates[collapsedMoreOptionsItems[i].name]);
    }
    return moreOptionsItems;
  },

  render: function () {
    var moreOptionsItemsClass = ClassNames({
      'moreOptionsItems': true,
      'animate-more-options': this.state.animate
    });

    //inline style for config/skin.json elements only
    var buttonStyle = {
      fontSize: this.props.skinConfig.moreOptionsScreen.iconSize + "px",
      color: this.props.skinConfig.moreOptionsScreen.color
    };

    var moreOptionsItems = this.buildMoreOptionsButtonList();

    return (
      <div>
        <div className="moreOptionsPanel">
          <div className={moreOptionsItemsClass} style={buttonStyle}>
            {moreOptionsItems}
          </div>
        </div>
      </div>
    );
  }
});
module.exports = MoreOptionsPanel;