/********************************************************************
  AD OVERLAY
*********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    CloseButton = require('./closeButton'),
    CONSTANTS = require('../constants/constants');

var AdOverlay = React.createClass({
  closeOverlay: function() {
      this.props.controller.closeNonlinearAd();
     this.props.controller.onSkipAdClicked();
  },

  handleOverlayClick: function(event) {
    if (event.type == 'touchend' || !this.props.controller.state.isMobile){
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.OVERLAY);
    }
  },

  render: function() {
    var adOverlayClass = ClassNames({
      "adOverlay": true,
      "controlBarVisible": this.props.overlay && this.props.showOverlay && this.props.controlBarVisible,
      "controlBarInvisible": this.props.overlay && this.props.showOverlay && !this.props.controlBarVisible,
      "hidden": !this.props.overlay && this.props.showOverlay
    });
    var closeButtonClass = ClassNames({
      "adOverlayCloseButton": true,
      "hidden": this.props.showOverlayCloseButton
    });

    return (
      <div className={adOverlayClass} onMouseUp={this.handleOverlayClick} onTouchEnd={this.handleOverlayClick}>
        <img src={this.props.overlay} className="adOverlayImage"></img>

        <CloseButton cssClass={closeButtonClass}
                     closeAction={this.closeOverlay}
                     fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass + " adOverlayCloseButtonIcon"}
                     ref="adOverlayCloseButton" />
      </div>
    );
  }
});
module.exports = AdOverlay;
