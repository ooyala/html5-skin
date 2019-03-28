import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

/**
 * Panel component for Share Screen.
 */
class SharePanel extends React.Component {
  constructor(props) {
    super(props);
    const { skinConfig } = this.props;
    const shareContent = Utils.getPropertyValue(skinConfig, 'shareScreen.shareContent');
    const socialContent = Utils.getPropertyValue(skinConfig, 'shareScreen.socialContent', []);
    let activeTab = shareContent ? shareContent[0] : null;

    // If no social buttons are specified, default to the first tab
    // that isn't the 'social' tab, since it will be hidden
    if (shareContent && !socialContent.length) {
      for (let index = 0; index < shareContent.length; index += 1) {
        if (shareContent[index] !== 'social') {
          activeTab = shareContent[index];
          break;
        }
      }
    }
    this.tabs = { SHARE: 'social', EMBED: 'embed' };

    this.state = {
      activeTab,
    };
  }

  /**
   * Build and return active panel
   * @returns {Object} React Component
   */
  getActivePanel = () => {
    const { activeTab } = this.state;
    const { assetId, playerParam, skinConfig } = this.props;
    if (activeTab === this.tabs.SHARE) {
      const socialContent = [...new Set(
        Utils.getPropertyValue(skinConfig, 'shareScreen.socialContent', [])
      )];

      const shareButtons = [];
      socialContent.forEach((shareButton) => {
        switch (shareButton) {
          case 'twitter':
            shareButtons.push(<a key="twitter" className="oo-twitter" onClick={this.handleTwitterClick} />); // eslint-disable-line
            break;
          case 'facebook':
            shareButtons.push(<a key="facebook" className="oo-facebook" onClick={this.handleFacebookClick} />); // eslint-disable-line
            break;
          case 'google+':
            shareButtons.push(<a key="google+" className="oo-google-plus" onClick={this.handleGPlusClick} />); // eslint-disable-line
            break;
          case 'email':
            shareButtons.push(<a key="email" className="oo-email-share" onClick={this.handleEmailClick} />); // eslint-disable-line
            break;
          default:
            break;
        }
      }, this);

      return <div className="oo-share-tab-panel">{shareButtons}</div>;
    }
    let iframeURL;
    if (activeTab === this.tabs.EMBED) {
      try {
        iframeURL = skinConfig.shareScreen.embed.source
          .replace('<ASSET_ID>', assetId)
          .replace('<PLAYER_ID>', playerParam.playerBrandingId)
          .replace('<PUBLISHER_ID>', playerParam.pcode);
      } catch (err) {
        iframeURL = '';
      }

      return (
        <div className="oo-share-tab-panel">
          <textarea className="oo-form-control oo-embed-form" rows="3" value={iframeURL} readOnly />
        </div>
      );
    }
    return null;
  }

  /**
   * Handle a click on email icon
   * @param {Object} event – the event object
   */
  handleEmailClick = (event) => {
    const { contentTree, language, localizableStrings } = this.props;
    event.preventDefault();
    const emailBody = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.EMAIL_BODY,
      localizableStrings,
    );
    let mailToUrl = 'mailto:';
    mailToUrl += `?subject=${encodeURIComponent(contentTree.title)}`;
    mailToUrl += `&body=${encodeURIComponent(emailBody + window.location.href)}`;
    // location.href = mailToUrl; //same window
    // TODO: Add html5-common to html5-skin?
    if (OO.isIos && OO.isSafari) {
      document.location = mailToUrl;
    } else {
      const emailWindow = window.open(mailToUrl, 'email', 'height=315,width=780'); // new window
      const twoSeconds = 2000;
      setTimeout(() => {
        try {
          // If we can't access href, a web client has taken over and this will throw
          // an exception, preventing the window from being closed.
          const test = emailWindow.location.href; // eslint-disable-line
          emailWindow.close();
        } catch (error) {
          console.log('email send error - ', error); // eslint-disable-line no-console
        }
        // Generous 2 second timeout to give the window time to redirect if it's going to a web client
      }, twoSeconds);
    }
  }

  handleFacebookClick = () => {
    let facebookUrl = 'http://www.facebook.com/sharer.php';
    facebookUrl += `?u=${encodeURIComponent(window.location.href)}`;
    window.open(facebookUrl, 'facebook window', 'height=315,width=780');
  }

  handleGPlusClick = () => {
    let gPlusUrl = 'https://plus.google.com/share';
    gPlusUrl += `?url=${encodeURIComponent(window.location.href)}`;
    window.open(
      gPlusUrl,
      'google+ window',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
    );
  }

  handleTwitterClick = () => {
    let twitterUrl = 'https://twitter.com/intent/tweet';
    const { contentTree } = this.props;
    twitterUrl += `?text=${encodeURIComponent(`${contentTree.title}: `)}`;
    twitterUrl += `&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, 'twitter window', 'height=300,width=750');
  }

  /**
   * Show the specified panel
   * @param {string} panelToShow - panel to get shown
   */
  showPanel(panelToShow) {
    this.setState({ activeTab: panelToShow });
  }

  render() {
    const { language, localizableStrings, skinConfig } = this.props;
    const { activeTab } = this.state;
    const shareContent = Utils.getPropertyValue(skinConfig, 'shareScreen.shareContent');
    const socialContent = Utils.getPropertyValue(skinConfig, 'shareScreen.socialContent', []);
    if (!shareContent) return null;

    const showEmbedTab = !!shareContent.find(element => element === this.tabs.EMBED);
    const showShareTab = !!shareContent.find(element => element === this.tabs.SHARE && socialContent.length);


    const shareTab = ClassNames({
      'oo-share-tab': true,
      'oo-active': activeTab === this.tabs.SHARE,
      'oo-hidden': !showShareTab,
    });
    const embedTab = ClassNames({
      'oo-embed-tab': true,
      'oo-active': activeTab === this.tabs.EMBED,
      'oo-hidden': !showEmbedTab,
    });

    const shareString = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.SHARE,
      localizableStrings
    );

    const embedString = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.EMBED,
      localizableStrings
    );

    return (
      <div className="oo-content-panel oo-share-panel">
        <div className="oo-tab-row">
          <a // eslint-disable-line
            className={shareTab}
            onClick={this.showPanel.bind(this, this.tabs.SHARE)}
          >
            {shareString}
          </a>
          <a // eslint-disable-line
            className={embedTab}
            onClick={this.showPanel.bind(this, this.tabs.EMBED)}
          >
            {embedString}
          </a>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
}

SharePanel.propTypes = {
  assetId: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  playerParam: PropTypes.shape({}),
  skinConfig: PropTypes.shape({}),
  contentTree: PropTypes.shape({}),
};

SharePanel.defaultProps = {
  assetId: '',
  language: 'en',
  localizableStrings: {},
  playerParam: {},
  skinConfig: {},
  contentTree: {
    title: '',
  },
};

module.exports = SharePanel;
