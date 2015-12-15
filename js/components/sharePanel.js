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
  getDefaultProps: function () {
    return {
      contentTree: {
        title: ''
      }
    };
  },

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
      var startAtString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.START_AT, this.props.localizableStrings);

      return (
        <div className="shareTabPanel">
          <div className="social-action-text text-capitalize">{titleString}</div>
          <a className="twitter" onClick={this.handleTwitterClick}>t</a>
          <a className="facebook" onClick={this.handleFacebookClick}>f</a>
          <a className="googlePlus" onClick={this.handleGPlusClick}>g+</a>
          <a className="emailShare" onClick={this.handleEmailClick}>
            <span className="icon icon-topmenu-share"></span>
          </a>
          <br/>

          <form className="form-inline">
            <div className="form-group">
              <label className="sr-only" htmlFor="oo-url">url</label>
              <input className="form-control" type='url' defaultValue={location.href} id="oo-url"/>
            </div>

            <label className="checkbox-inline">
              <input type="checkbox" />{startAtString}
            </label>

            <div className="form-group">
              <label className="sr-only" htmlFor="oo-start-at">{startAtString}</label>
              <input className="form-control start-at" type='text' id="oo-start-at" defaultValue={Utils.formatSeconds(this.props.currentPlayhead)} />
            </div>
          </form>
        </div>
      );
    }

    else if (this.state.activeTab === this.tabs.EMBED) {
      return (
        <div className="shareTabPanel">
          <textarea className="form-control"
                    rows="3"
                    value="&lt;script src=&quot;//player.ooyala.com/v4/&quot;&gt;&lt;/script&gt;"
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
      'tab': true,
      'active': this.state.activeTab == this.tabs.SHARE
    });
    var embedTab = ClassNames({
      'tab': true,
      'active': this.state.activeTab == this.tabs.EMBED
    });

    var shareString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SHARE, this.props.localizableStrings),
        embedString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMBED, this.props.localizableStrings);

    return (
      <div className="share-container">
        <div className="tabRow">
          <a className={shareTab} onClick={this.showPanel.bind(this, this.tabs.SHARE)}>{shareString}</a>
          <a className={embedTab} onClick={this.showPanel.bind(this, this.tabs.EMBED)}>{embedString}</a>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
});
module.exports = SharePanel;