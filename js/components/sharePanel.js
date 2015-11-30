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

  tabs: {SHARE: "share", EMBED: "embed", EMAIL: "email"},

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
          <a className="googlePlus" onClick={this.handleGPlusClick}>g+</a><br/>

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

    else if (this.state.activeTab === this.tabs.EMAIL) {
      var emailInput = ClassNames({
        'form-group': true,
        'clearfix': true,
        'has-error': this.state.hasError
      });

      var toString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.TO, this.props.localizableStrings),
          subjectString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SUBJECT, this.props.localizableStrings),
          messageString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.MESSAGE, this.props.localizableStrings),
          recipientString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.RECIPIENT, this.props.localizableStrings),
          optionalMessageString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OPTIONAL_MESSAGE, this.props.localizableStrings),
          sendString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SEND, this.props.localizableStrings);

      return (
        <div className="shareTabPanel">
          <form className="form-horizontal">
            <div className={emailInput}>
              <label htmlFor="oo-email" className="col-sm-2 form-control-label">{toString}</label>
              <div className="col-sm-10">
                <input ref="sharePanelTo"
                       id="oo-email"
                       type="email"
                       className="form-control"
                       placeholder={recipientString} />
              </div>
            </div>

            <div className="form-group clearfix">
              <label htmlFor="oo-subject" className="col-sm-2 form-control-label">{subjectString}</label>
              <div className="col-sm-10">
                <input ref="sharePanelSubject"
                       id="oo-subject"
                       type="text"
                       className="form-control"
                       placeholder={subjectString} />
              </div>
            </div>

            <div className="form-group clearfix">
              <label htmlFor="oo-message" className="col-sm-2 form-control-label">{messageString}</label>
              <div className="col-sm-10">
                <textarea ref="sharePanelMessage"
                          id="oo-message"
                          className="form-control"
                          rows="2"
                          placeholder={optionalMessageString} />
              </div>
            </div>

            <div className="form-group clearfix">
              <div className="col-sm-offset-2 col-sm-10">
                <button type="button"
                        className="btn btn-primary pull-left"
                        onClick={this.handleEmailClick}>{sendString}</button>
              </div>
            </div>

          </form>
        </div>
      );
    }
  },

  handleEmailClick: function() {
    var mailto = this.refs.sharePanelTo.getDOMNode().value;
    var subject = encodeURIComponent(this.refs.sharePanelSubject.getDOMNode().value);
    var body = encodeURIComponent(this.refs.sharePanelMessage.getDOMNode().value);

    if (Utils.validateEmail(mailto)) {
      this.setState({hasError: false});
      var mailToUrl = "mailto:" + mailto.trim();
      mailToUrl += "?subject=" + subject;
      mailToUrl += "&body=" + body;
      location.href = mailToUrl;
    } else {
      this.setState({hasError: true});
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
    var shareTab = ClassNames({
      'tab': true,
      'active': this.state.activeTab == this.tabs.SHARE
    });
    var embedTab = ClassNames({
      'tab': true,
      'active': this.state.activeTab == this.tabs.EMBED
    });
    var emailTab = ClassNames({
      'tab': true,
      'active': this.state.activeTab == this.tabs.EMAIL
    });

    var shareString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SHARE, this.props.localizableStrings),
        embedString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMBED, this.props.localizableStrings),
        emailString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMAIL, this.props.localizableStrings);

    return (
      <div className="share-container">
        <div className="tabRow">
          <a className={shareTab} onClick={this.showPanel.bind(this, this.tabs.SHARE)}>{shareString}</a>
          <a className={embedTab} onClick={this.showPanel.bind(this, this.tabs.EMBED)}>{embedString}</a>
          <a className={emailTab} onClick={this.showPanel.bind(this, this.tabs.EMAIL)}>{emailString}</a>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
});
module.exports = SharePanel;