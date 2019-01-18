import React from 'react';
import ClassNames from 'classnames';
import CloseButton from './closeButton';
import CONSTANTS from '../constants/constants';

/**
 * The overlay with advertising
 */
class AdOverlay extends React.Component {
  closeOverlay = () => {
    const { controller } = this.props;
    controller.closeNonlinearAd();
    controller.onSkipAdClicked();
  }

  handleOverlayClick = () => {
    const { controller } = this.props;
    controller.onAdsClicked(CONSTANTS.AD_CLICK_SOURCE.OVERLAY);
  }

  overlayLoaded = () => {
    const {
      controller,
      showOverlay,
      overlay,
    } = this.props;
    if (overlay && showOverlay) {
      controller.onAdOverlayLoaded();
    }
  }

  render() {
    const {
      showOverlay,
      overlay,
      showOverlayCloseButton,
    } = this.props;
    const adOverlayClass = ClassNames({
      'oo-ad-overlay': true,
      'oo-hidden': !overlay && showOverlay,
    });
    const closeButtonClass = ClassNames({
      'oo-ad-overlay-close-button': true,
      'oo-hidden': !showOverlayCloseButton,
    });

    return (
      <div className={adOverlayClass}>
        <a // eslint-disable-line
          onClick={this.handleOverlayClick}
          role="button"
        >
          <img src={overlay} className="oo-ad-overlay-image" onLoad={this.overlayLoaded} alt="Overlay" />
        </a>
        <CloseButton
          {...this.props}
          cssClass={closeButtonClass}
          closeAction={this.closeOverlay}
          className="oo-ad-overlay-close-button-icon"
          ref="adOverlayCloseButton" // eslint-disable-line
        />
      </div>
    );
  }
}
module.exports = AdOverlay;
