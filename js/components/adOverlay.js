/** ******************************************************************
  AD OVERLAY
******************************************************************** */
const React = require('react');

const ClassNames = require('classnames');

const createReactClass = require('create-react-class');
const CloseButton = require('./closeButton');

const CONSTANTS = require('../constants/constants');

const AdOverlay = createReactClass({
  closeOverlay() {
    this.props.controller.closeNonlinearAd();
    this.props.controller.onSkipAdClicked();
  },

  handleOverlayClick() {
    this.props.controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.OVERLAY);
  },

  overlayLoaded() {
    if (this.props.overlay && this.props.showOverlay) {
      this.props.controller.onAdOverlayLoaded();
    }
  },

  render() {
    const adOverlayClass = ClassNames({
      'oo-ad-overlay': true,
      'oo-hidden': !this.props.overlay && this.props.showOverlay,
    });
    const closeButtonClass = ClassNames({
      'oo-ad-overlay-close-button': true,
      'oo-hidden': !this.props.showOverlayCloseButton,
    });

    return (
      <div className={adOverlayClass}>
        <a onClick={this.handleOverlayClick}>
          <img src={this.props.overlay} className="oo-ad-overlay-image" onLoad={this.overlayLoaded} />
        </a>
        <CloseButton
          {...this.props}
          cssClass={closeButtonClass}
          closeAction={this.closeOverlay}
          className="oo-ad-overlay-close-button-icon"
          ref="adOverlayCloseButton"
        />
      </div>
    );
  },
});
module.exports = AdOverlay;
