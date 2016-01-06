/********************************************************************
  AD OVERLAY
*********************************************************************/
var React = require('react'),
  Utils = require('../components/utils'),
  ClassNames = require('classnames'),
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
    var overlayStyle = {};
    var scrubberPaddingHeight = parseInt(CONSTANTS.UI.defaultScrubberBarPaddingHeight);
    var scrubberBarHeight = parseInt(CONSTANTS.UI.defaultScrubberBarHeight);
    var controlBarHeight = parseInt(CONSTANTS.UI.defaultControlBarHeight);

    if(this.props.overlay && this.props.showOverlay) {
      overlayStyle.bottom = this.props.controlBarVisible ? controlBarHeight : scrubberPaddingHeight/2;
    }

    var adOverlayClass = ClassNames({
      "adOverlay": true,
      "hidden": !this.props.overlay && this.props.showOverlay
    });
    var closeButtonClass = ClassNames({
      "adOverlayCloseButton": true,
      "hidden": this.props.showOverlayCloseButton
    });

    return (
      <div className={adOverlayClass} style={overlayStyle} onMouseUp={this.handleOverlayClick}
          onTouchEnd={this.handleOverlayClick}>
        <img src={this.props.overlay} className="adOverlayImage"></img>
        <div className="adOverlayCloseButton" ref="adOverlayCloseButton" onMouseUp={this.closeOverlay} onTouchEnd={this.closeOverlay}>
          <span className={this.props.skinConfig.icons.dismiss.fontStyleClass + " adOverlayCloseButtonIcon"}
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
          </span>
        </div>
      </div>
    );
  }
});
module.exports = AdOverlay;