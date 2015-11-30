/********************************************************************
  AD OVERLAY
*********************************************************************/
var React = require('react'),
  InlineStyle = require('../styles/inlineStyle');
  Utils = require('../components/utils'),
  CONSTANTS = require('../constants/constants');

var AdOverlay = React.createClass({
  closeOverlay: function(event) {
    if (event.type == 'touchend' || !this.props.controller.state.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.hideNonlinearAd();
      this.props.controller.onSkipAdClicked();
    }
  },

  handleOverlayClick: function(event) {
    if (event.type == 'touchend' || !this.props.controller.state.isMobile){
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.OVERLAY);
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
    var overlayStyle = InlineStyle.adOverlayStyle.style;
    var overlayImageStyle = InlineStyle.adOverlayStyle.overlayImageStyle;
    var closeButtonStyle = InlineStyle.adOverlayStyle.closeButtonStyle;
    var closeButtonIconStyle = InlineStyle.adOverlayStyle.closeButtonIconStyle;

    var scrubberPaddingHeight = parseInt(CONSTANTS.UI.defaultScrubberBarPaddingHeight);
    var scrubberBarHeight = parseInt(CONSTANTS.UI.defaultScrubberBarHeight);
    var controlBarHeight = InlineStyle.controlBarStyle.controlBarSetting.height;

    if(this.props.overlay && this.props.showOverlay) {
      overlayStyle.display = "inline-block";
      overlayStyle.bottom = this.props.controlBarVisible ? controlBarHeight : scrubberPaddingHeight/2;
      if(this.props.showOverlayCloseButton) {
        closeButtonStyle.display = "inline";
      }
      else {
        closeButtonStyle.display = "none";
      }
    }
    else {
      overlayStyle.display = "none";
    }
    return (
      <div className="adOverlay" style={overlayStyle} onMouseUp={this.handleOverlayClick}
          onTouchEnd={this.handleOverlayClick}>
        <img src={this.props.overlay} style={overlayImageStyle}></img>
        <div className="adOverlayCloseButton" style={closeButtonStyle} onMouseUp={this.closeOverlay}
          onTouchEnd={this.closeOverlay}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass} onMouseOver={this.highlight}
            onMouseOut={this.removeHighlight} style={closeButtonIconStyle}>
          </span>
        </div>
      </div>
    );
  }
});
module.exports = AdOverlay;