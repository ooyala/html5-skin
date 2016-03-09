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
      "adOverlay": true,
      "controlBarVisible": this.props.overlay && this.props.showOverlay && this.props.controlBarVisible,
      "controlBarInvisible": this.props.overlay && this.props.showOverlay && !this.props.controlBarVisible,
      "hidden": !this.props.overlay && this.props.showOverlay
    });
    var closeButtonClass = ClassNames({
      "adOverlayCloseButton": true,
      "hidden": !this.props.showOverlayCloseButton
    });

    return (
      <div className={adOverlayClass}>
        <a onClick={this.handleOverlayClick}>
          <img src={this.props.overlay} className="adOverlayImage" onLoad={this.overlayLoaded} />
        </a>
        <CloseButton cssClass={closeButtonClass}
          closeAction={this.closeOverlay}
          fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass + " adOverlayCloseButtonIcon"}
          fontString={this.props.skinConfig.icons.dismiss.fontString}
          fontFamilyName={this.props.skinConfig.icons.dismiss.fontFamilyName}
          ref="adOverlayCloseButton" />
      </div>
    );
  }
});
module.exports = AdOverlay;
