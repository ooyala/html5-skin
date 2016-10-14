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

  handleOverlayClick: function() {
    this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.OVERLAY);
  },

  overlayLoaded: function() {
    if (this.props.overlay && this.props.showOverlay){
      this.props.controller.onAdOverlayLoaded();
    }
  },

  render: function() {
    var adOverlayClass = ClassNames({
      "oo-ad-overlay": !this.props.overlayIsPauseAd,
      "oo-ad-overlay-pause-ad": this.props.overlayIsPauseAd, 
      "oo-hidden": !this.props.overlay && this.props.showOverlay
    });
    var closeButtonClass = ClassNames({
      "oo-ad-overlay-close-button": true,
      "oo-hidden": !this.props.showOverlayCloseButton
    });

    var overlayImageClass = ClassNames({
      "oo-ad-overlay-image": !this.props.overlayIsPauseAd,
      "oo-ad-overlay-image-pause-ad": this.props.overlayIsPauseAd
    });

    return (
      <div className={adOverlayClass}>
        <a onClick={this.handleOverlayClick}>
          <img src={this.props.overlay} className={overlayImageClass} onLoad={this.overlayLoaded} />
        </a>
        <CloseButton {...this.props}
          cssClass={closeButtonClass}
          closeAction={this.closeOverlay}
          className={"oo-ad-overlay-close-button-icon"}
          ref="adOverlayCloseButton" />
      </div>
    );
  }
});
module.exports = AdOverlay;