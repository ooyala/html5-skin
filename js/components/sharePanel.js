/********************************************************************
  SHARING SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var React = require('react'),
    Utils = require('./utils'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle');

var SharePanel = React.createClass({
  tabs: {SHARE: "share", EMBED: "embed", EMAIL: "email"},

  componentDidMount: function(){
    if (Utils.isSafari()){
      InlineStyle.shareScreenStyle.containerStyle.display = "-webkit-flex";
      InlineStyle.shareScreenStyle.tabRowStyle.display = "-webkit-flex";
    }
    else {
      InlineStyle.shareScreenStyle.containerStyle.display = "flex";
      InlineStyle.shareScreenStyle.tabRowStyle.display = "flex";
    }
  },


  getDefaultProps: function() {
    return {
      controller: {
        state: {
          isMobile: false
        }
      }
    };
  },


  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      activeTab: this.tabs.SHARE,
    };
  },

  getActivePanel: function() {
    var shareStyle = InlineStyle.shareScreenStyle;
    if (this.state.activeTab === this.tabs.SHARE) {
      var twitterIconStyle = Utils.extend(shareStyle.socialIconStyle, shareStyle.twitterIconStyle);
      var facebookIconStyle = Utils.extend(shareStyle.socialIconStyle, shareStyle.facebookIconStyle);
      var plusIconStyle = Utils.extend(shareStyle.socialIconStyle, shareStyle.plusIconStyle);
      var titleString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.INVEST_IN_SOCIAL_CHANGE, this.props.localizableStrings);
      var startAtString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.START_AT, this.props.localizableStrings);

      return (
        <div className="shareTabPanel" style={shareStyle.panelStyle}>
          <div style={shareStyle.titleStyle}>{titleString}</div>
          <div className="twitter" onClick={this.handleTwitterClick} onTouchEnd={this.handleTwitterClick} style={twitterIconStyle}>t</div>
          <div className="facebook" onClick={this.handleFacebookClick} onTouchEnd={this.handleFacebookClick} style={facebookIconStyle}>f</div>
          <div className="googlePlus" onClick={this.handleGPlusClick} onTouchEnd={this.handleGPlusClick} style={plusIconStyle}>g+</div><br/>
          <input className="embedUrl" style={shareStyle.embedUrlStyle} type='text' defaultValue={location.href}/>
          <input className="startPointCheckBox" style={{marginBottom: "15px"}}type='checkbox'/>
          {startAtString} <input className="startPointTextField" style={shareStyle.startAtInput} type='text'
            defaultValue={Utils.formatSeconds(this.props.currentPlayhead)}/><br/>
        </div>
      );
    }
    else if (this.state.activeTab === this.tabs.EMBED) {
      return (
        <div className="shareTabPanel" style={shareStyle.panelStyle}>
          <textarea
            className="embedTextArea"
            value="&lt;script src=&quot;//player.ooyala.com/v4/&quot;&gt;&lt;/script&gt;"
            style={shareStyle.embedTextArea}
            readOnly
            />
        </div>
      );
    }
    else if (this.state.activeTab === this.tabs.EMAIL) {
      var toString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.TO, this.props.localizableStrings),
          subjectString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SUBJECT, this.props.localizableStrings),
          messageString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.MESSAGE, this.props.localizableStrings),
          recipientString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.RECIPIENT, this.props.localizableStrings),
          optionalMessageString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OPTIONAL_MESSAGE, this.props.localizableStrings),
          sendString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SEND, this.props.localizableStrings);

      return (
        <div className="shareTabPanel" style={shareStyle.panelStyle}>
          <table style={{color: "white"}}>
            <tr>
              <td style={{paddingLeft: "5px"}}>{toString}</td>
              <td style={{width: "10px"}}></td>
              <td>
                <input ref="sharePanelTo"
                       onFocus={this.handleFieldFocus}
                       style={shareStyle.emailInputField}
                       type='text'
                       placeholder={recipientString}
                  />
              </td>
            </tr>
            <tr>
              <td>{subjectString}</td>
              <td style={{width: "10px"}}></td>
              <td>
                <input ref="sharePanelSubject"
                       onFocus={this.handleFieldFocus}
                       style={shareStyle.emailInputField}
                       type='text'
                       placeholder={subjectString}
                  />
                <br/>
              </td>
            </tr>
            <tr>
              <td>{messageString}</td>
              <td style={{width: "10px"}}></td>
              <td>
                <textarea
                  ref="sharePanelMessage"
                  onFocus={this.handleFieldFocus}
                  style={shareStyle.emailTextArea}
                  placeholder={optionalMessageString}
                  />
              </td>
            </tr>
            <tr>
              <td></td>
              <td style={{width: "10px"}}></td>
              <td style={{textAlign: "right"}}>
                <button className="emailSendButton"
                        onClick={this.handleEmailClick}
                        onTouchEnd={this.handleEmailClick}
                        style={shareStyle.emailSendButton}>
                  {sendString}
                </button>
              </td>
            </tr>
          </table>
        </div>
      );
    }
  },

  handleEmailClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      var mailToUrl = "mailto:";
      mailToUrl += this.refs.sharePanelTo.getDOMNode().value;
      mailToUrl += "?subject=" + encodeURIComponent(this.refs.sharePanelSubject.getDOMNode().value);
      mailToUrl += "&body=" + encodeURIComponent(this.refs.sharePanelMessage.getDOMNode().value);
      location.href = mailToUrl;
    }
  },

  handleFacebookClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      var facebookUrl = "http://www.facebook.com/sharer.php";
      facebookUrl += "?u=" + encodeURIComponent(location.href);
      window.open(facebookUrl, "facebook window", "height=315,width=780");
    }
  },

  handleFieldFocus: function(evt) {
    evt.target.style.color = "black";
    evt.target.value = "";
  },

  handleGPlusClick: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      var gPlusUrl = "https://plus.google.com/share";
      gPlusUrl += "?url=" + encodeURIComponent(location.href);
      window.open(gPlusUrl, "google+ window", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
    }
  },

  handleTwitterClick: function(evt) {
     if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      var twitterUrl = "https://twitter.com/intent/tweet";
      twitterUrl += "?text=" + encodeURIComponent(this.props.contentTree.title+": ");
      twitterUrl += "&url=" + encodeURIComponent(location.href);
      window.open(twitterUrl, "twitter window", "height=300,width=750");
    }
  },

  showPanel: function(panelToShow, evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.setState({activeTab: panelToShow});
    }
  },

  render: function() {
    var shareStyle = InlineStyle.shareScreenStyle;
    var activeTabStyle = Utils.extend(shareStyle.tabStyle, shareStyle.activeTab);
    var activeLastTabStyle = Utils.extend(shareStyle.lastTabStyle, shareStyle.activeTab);
    var shareString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SHARE, this.props.localizableStrings),
        embedString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMBED, this.props.localizableStrings),
        emailString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMAIL, this.props.localizableStrings);

    return (
      <div style={shareStyle.containerStyle}>
        <div className="tabRow" style={shareStyle.tabRowStyle}>
          <span className="shareTab" onClick={this.showPanel.bind(this, this.tabs.SHARE)}
            onTouchEnd={this.showPanel.bind(this, this.tabs.SHARE)}
            style={(this.state.activeTab == this.tabs.SHARE) ? activeTabStyle : shareStyle.tabStyle}>{shareString}</span>
          <span className="embedTab" onClick={this.showPanel.bind(this, this.tabs.EMBED)}
            onTouchEnd={this.showPanel.bind(this, this.tabs.EMBED)}
            style={(this.state.activeTab == this.tabs.EMBED) ? activeTabStyle : shareStyle.tabStyle}>{embedString}</span>
          <span className="emailTab" onClick={this.showPanel.bind(this, this.tabs.EMAIL)}
            onTouchEnd={this.showPanel.bind(this, this.tabs.EMAIL)}
            style={(this.state.activeTab == this.tabs.EMAIL) ? activeLastTabStyle : shareStyle.lastTabStyle}>{emailString}</span>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
});
module.exports = SharePanel;