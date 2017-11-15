/********************************************************************
 SHARE PANEL
 *********************************************************************/
/**
 * Panel component for Share Screen.
 *
 * @class SharePanel
 * @constructor
 */
var React = require('react'),
    ClassNames = require('classnames'),
    Utils = require('./utils'),
    CONSTANTS = require('../constants/constants');

var SharePanel = React.createClass({
  tabs: {SHARE: "social", EMBED: "embed"},

  getInitialState: function() {
    var shareContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.shareContent');
    var socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
    var activeTab = shareContent ? shareContent[0] : null;

    // If no social buttons are specified, default to the first tab
    // that isn't the 'social' tab, since it will be hidden
    if (shareContent && !socialContent.length) {
      for (var i = 0; i < shareContent.length; i++) {
        if (shareContent[i] !== 'social') {
          activeTab = shareContent[i];
          break;
        }
      }
    }

    return {
      activeTab: activeTab,
      hasError: false
    };
  },

  getActivePanel: function() {
    if (this.state.activeTab === this.tabs.SHARE) {
      var titleString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SHARE_CALL_TO_ACTION, this.props.localizableStrings);
      var socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
      var shareButtons = [];
      socialContent.forEach(function(shareButton) {
        switch (shareButton) {
          case "twitter":
            shareButtons.push(<a className="oo-twitter" onClick={this.handleTwitterClick}></a>);
            break;
          case "facebook":
            shareButtons.push(<a className="oo-facebook" onClick={this.handleFacebookClick}></a>);
            break;
          case "google+":
            shareButtons.push(<a className="oo-google-plus" onClick={this.handleGPlusClick}></a>);
            break;
          case "email":
            shareButtons.push(<a className="oo-email-share" onClick={this.handleEmailClick}></a>);
            break;
        }
      }, this);

      return (
        <div className="oo-share-tab-panel">
          <div className="oo-social-action-text oo-text-capitalize">{titleString}</div>
          {shareButtons}
        </div>
      );
    }

    else if (this.state.activeTab === this.tabs.EMBED) {
      try {
        var iframeURL = this.props.skinConfig.shareScreen.embed.source
          .replace("<ASSET_ID>", this.props.assetId)
          .replace("<PLAYER_ID>", this.props.playerParam.playerBrandingId)
          .replace("<PUBLISHER_ID>", this.props.playerParam.pcode);
      } catch(err) {
        iframeURL = "";
      }

      return (
        <div className="oo-share-tab-panel">
          <textarea className="oo-form-control oo-embed-form"
                    rows="3"
                    value={iframeURL}
                    readOnly />
        </div>
      );
    }
  },

  handleEmailClick: function(event) {
    event.preventDefault();
    var emailBody = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMAIL_BODY, this.props.localizableStrings);
    var mailToUrl = "mailto:";
    mailToUrl += "?subject=" + encodeURIComponent(this.props.contentTree.title);
    mailToUrl += "&body=" + encodeURIComponent(emailBody + location.href);
    //location.href = mailToUrl; //same window
    if (OO.isIos && OO.isSafari) {
      
        document.location = mailToUrl;
    } else {
        var emailWindow = window.open(mailToUrl, "email", "height=315,width=780"); //new window
        setTimeout(function () {
          try {
            // If we can't access href, a web client has taken over and this will throw
            // an exception, preventing the window from being closed.
            var test = emailWindow.location.href;
            emailWindow.close()
          } catch (e) {
            console.log('email send error - ', e);
          }
          // Generous 2 second timeout to give the window time to redirect if it's going to a web client
        }, 2000);
    }
  },

  handleFacebookClick: function() {
    var facebookUrl = "http://www.facebook.com/sharer.php";
    facebookUrl += "?u=" + encodeURIComponent(location.href);
    window.open(facebookUrl, "facebook window", "height=315,width=780");
  },

  handleGPlusClick: function() {
    var gPlusUrl = "https://plus.google.com/share";
    gPlusUrl += "?url=" + encodeURIComponent(location.href);
    window.open(gPlusUrl, "google+ window", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
  },

  handleTwitterClick: function() {
    var twitterUrl = "https://twitter.com/intent/tweet";
    twitterUrl += "?text=" + encodeURIComponent(this.props.contentTree.title+": ");
    twitterUrl += "&url=" + encodeURIComponent(location.href);
    window.open(twitterUrl, "twitter window", "height=300,width=750");
  },

  showPanel: function(panelToShow) {
    this.setState({activeTab: panelToShow});
  },

  render: function() {
    var shareContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.shareContent');
    var socialContent = Utils.getPropertyValue(this.props.skinConfig, 'shareScreen.socialContent', []);
    if (!shareContent) return null;

    var showEmbedTab = false;
    var showShareTab = false;

    for (var i = 0; i < shareContent.length; i++){
      if (shareContent[i] == this.tabs.EMBED) showEmbedTab = true;
      if (shareContent[i] == this.tabs.SHARE && socialContent.length) showShareTab = true;
    }

    var shareTab = ClassNames({
      'oo-share-tab': true,
      'oo-active': this.state.activeTab == this.tabs.SHARE,
      'oo-hidden': !showShareTab
    });
    var embedTab = ClassNames({
      'oo-embed-tab': true,
      'oo-active': this.state.activeTab == this.tabs.EMBED,
      'oo-hidden': !showEmbedTab
    });

    var shareString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SHARE, this.props.localizableStrings),
        embedString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMBED, this.props.localizableStrings);
    
    return (
      <div className="oo-content-panel oo-share-panel">
        <div className="oo-tab-row">
          <a className={shareTab} onClick={this.showPanel.bind(this, this.tabs.SHARE)}>{shareString}</a>
          <a className={embedTab} onClick={this.showPanel.bind(this, this.tabs.EMBED)}>{embedString}</a>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
});

SharePanel.defaultProps = {
  contentTree: {
    title: ''
  }
};

module.exports = SharePanel;
