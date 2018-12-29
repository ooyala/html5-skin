/** ******************************************************************
 SHARE PANEL
 ******************************************************************** */
/**
 * Panel component for Share Screen.
 *
 * @class SharePanel
 * @constructor
 */
const React = require('react');

const ClassNames = require('classnames');

const createReactClass = require('create-react-class');
const _ = require('underscore');
const Utils = require('./utils');

const CONSTANTS = require('../constants/constants');

const SharePanel = createReactClass({
  tabs: { SHARE: 'social', EMBED: 'embed' },

  getInitialState() {
    const shareContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.shareContent');
    const socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
    let activeTab = shareContent ? shareContent[0] : null;

    // If no social buttons are specified, default to the first tab
    // that isn't the 'social' tab, since it will be hidden
    if (shareContent && !socialContent.length) {
      for (let i = 0; i < shareContent.length; i++) {
        if (shareContent[i] !== 'social') {
          activeTab = shareContent[i];
          break;
        }
      }
    }

    return {
      activeTab,
      hasError: false,
    };
  },

  getActivePanel() {
    if (this.state.activeTab === this.tabs.SHARE) {
      const socialContent = _.uniq(
        Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', [])
      );

      const shareButtons = [];
      socialContent.forEach(function(shareButton) {
        switch (shareButton) {
          case 'twitter':
            shareButtons.push(<a key="twitter" className="oo-twitter" onClick={this.handleTwitterClick} />);
            break;
          case 'facebook':
            shareButtons.push(<a key="facebook" className="oo-facebook" onClick={this.handleFacebookClick} />);
            break;
          case 'google+':
            shareButtons.push(<a key="google+" className="oo-google-plus" onClick={this.handleGPlusClick} />);
            break;
          case 'email':
            shareButtons.push(<a key="email" className="oo-email-share" onClick={this.handleEmailClick} />);
            break;
          default:
            break;
        }
      }, this);

      return <div className="oo-share-tab-panel">{shareButtons}</div>;
    } if (this.state.activeTab === this.tabs.EMBED) {
      try {
        var iframeURL = this.props.skinConfig.shareScreen.embed.source
          .replace('<ASSET_ID>', this.props.assetId)
          .replace('<PLAYER_ID>', this.props.playerParam.playerBrandingId)
          .replace('<PUBLISHER_ID>', this.props.playerParam.pcode);
      } catch (err) {
        iframeURL = '';
      }

      return (
        <div className="oo-share-tab-panel">
          <textarea className="oo-form-control oo-embed-form" rows="3" value={iframeURL} readOnly />
        </div>
      );
    }
  },

  handleEmailClick(event) {
    event.preventDefault();
    const emailBody = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.EMAIL_BODY,
      this.props.localizableStrings
    );
    let mailToUrl = 'mailto:';
    mailToUrl += `?subject=${encodeURIComponent(this.props.contentTree.title)}`;
    mailToUrl += `&body=${encodeURIComponent(emailBody + location.href)}`;
    // location.href = mailToUrl; //same window
    // TODO: Add html5-common to html5-skin?
    if (OO.isIos && OO.isSafari) {
      document.location = mailToUrl;
    } else {
      const emailWindow = window.open(mailToUrl, 'email', 'height=315,width=780'); // new window
      setTimeout(() => {
        try {
          // If we can't access href, a web client has taken over and this will throw
          // an exception, preventing the window from being closed.
          const test = emailWindow.location.href;
          emailWindow.close();
        } catch (e) {
          console.log('email send error - ', e);
        }
        // Generous 2 second timeout to give the window time to redirect if it's going to a web client
      }, 2000);
    }
  },

  handleFacebookClick() {
    let facebookUrl = 'http://www.facebook.com/sharer.php';
    facebookUrl += `?u=${encodeURIComponent(location.href)}`;
    window.open(facebookUrl, 'facebook window', 'height=315,width=780');
  },

  handleGPlusClick() {
    let gPlusUrl = 'https://plus.google.com/share';
    gPlusUrl += `?url=${encodeURIComponent(location.href)}`;
    window.open(
      gPlusUrl,
      'google+ window',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
    );
  },

  handleTwitterClick() {
    let twitterUrl = 'https://twitter.com/intent/tweet';
    twitterUrl += `?text=${encodeURIComponent(`${this.props.contentTree.title}: `)}`;
    twitterUrl += `&url=${encodeURIComponent(location.href)}`;
    window.open(twitterUrl, 'twitter window', 'height=300,width=750');
  },

  showPanel(panelToShow) {
    this.setState({ activeTab: panelToShow });
  },

  render() {
    const shareContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.shareContent');
    const socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
    if (!shareContent) return null;

    let showEmbedTab = false;
    let showShareTab = false;

    for (let i = 0; i < shareContent.length; i++) {
      if (shareContent[i] === this.tabs.EMBED) showEmbedTab = true;
      if (shareContent[i] === this.tabs.SHARE && socialContent.length) showShareTab = true;
    }

    const shareTab = ClassNames({
      'oo-share-tab': true,
      'oo-active': this.state.activeTab === this.tabs.SHARE,
      'oo-hidden': !showShareTab,
    });
    const embedTab = ClassNames({
      'oo-embed-tab': true,
      'oo-active': this.state.activeTab === this.tabs.EMBED,
      'oo-hidden': !showEmbedTab,
    });

    const shareString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.SHARE,
      this.props.localizableStrings
    );

    const embedString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.EMBED,
      this.props.localizableStrings
    );

    return (
      <div className="oo-content-panel oo-share-panel">
        <div className="oo-tab-row">
          <a className={shareTab} onClick={this.showPanel.bind(this, this.tabs.SHARE)}>
            {shareString}
          </a>
          <a className={embedTab} onClick={this.showPanel.bind(this, this.tabs.EMBED)}>
            {embedString}
          </a>
        </div>
        {this.getActivePanel()}
      </div>
    );
  },
});

SharePanel.defaultProps = {
  contentTree: {
    title: '',
  },
};

module.exports = SharePanel;
