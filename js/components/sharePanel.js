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
  tabs: {SHARE: "share", EMBED: "embed"},

  getInitialState: function() {
    return {
      activeTab: this.tabs.SHARE,
      hasError: false
    };
  },

  getActivePanel: function() {
    if (this.state.activeTab === this.tabs.SHARE) {
      var titleString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SHARE_CALL_TO_ACTION, this.props.localizableStrings);

      return (
        <div className="oo-share-tab-panel">
          <div className="oo-social-action-text oo-text-capitalize">{titleString}</div>
          <a className="oo-twitter" onClick={this.handleTwitterClick}> </a>
          <a className="oo-facebook" onClick={this.handleFacebookClick}> </a>
          <a className="oo-google-plus" onClick={this.handleGPlusClick}> </a>
          <a className="oo-email-share" onClick={this.handleEmailClick}> </a>
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
          <textarea className="oo-form-control"
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
    window.open(mailToUrl, "_blank", "height=315,width=780"); //new window
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
    var shareTab = ClassNames({
      'oo-share-tab': true,
      'oo-active': this.state.activeTab == this.tabs.SHARE
    });
    var embedTab = ClassNames({
      'oo-embed-tab': true,
      'oo-active': this.state.activeTab == this.tabs.EMBED
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