/********************************************************************
  AD OVERLAY
*********************************************************************/
var React = require('react'),
  InlineStyle = require('../styles/inlineStyle');

var AdOverlay = React.createClass({
  closeOverlay: function(event) {
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE
    this.props.controller.hideNonlinearAd();
    this.props.controller.onSkipAdClicked();
  },

  render: function() {
    var overlayStyle = InlineStyle.adOverlayStyle.style;
    var overlayImageStyle = InlineStyle.adOverlayStyle.overlayImageStyle;
    var closeButtonStyle = InlineStyle.adOverlayStyle.closeButtonStyle;

    var scrubberPaddingHeight = parseInt(InlineStyle.scrubberBarStyle.scrubberBarPadding.height);
    var scrubberBarHeight = parseInt(InlineStyle.scrubberBarStyle.scrubberBarSetting.height);
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
      <div className="adOverlay" style={overlayStyle}>
        <img src={this.props.overlay} style={overlayImageStyle}></img>
        <div className="adOverlayCloseButton" style={closeButtonStyle} onClick={this.closeOverlay}
          onMouseUp={this.closeOverlay} onTouchEnd={this.closeOverlay}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass}></span>
        </div>
      </div>
    );
  }
});
module.exports = AdOverlay;