/********************************************************************
  SHARING SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var SharePanel = React.createClass({
  tabs: {SHARE: "share", EMBED: "embed", EMAIL: "email"},

  getInitialState: function() {
    return {
      activeTab: this.tabs.SHARE
    };
  },

  handleEmailClick: function() {
    var mailToUrl = "mailto:";
    mailToUrl += this.refs.sharePanelTo.getDOMNode().value;
    mailToUrl += "?subject=" + encodeURIComponent(this.refs.sharePanelSubject.getDOMNode().value);
    mailToUrl += "&body=" + encodeURIComponent(this.refs.sharePanelMessage.getDOMNode().value);
    location.href = mailToUrl;
  },

  handleFacebookClick: function() {
    var facebookUrl = "http://www.facebook.com/sharer.php";
    facebookUrl += "?u=" + encodeURIComponent(location.href);
    window.open(facebookUrl, "facebook window", "height=315,width=780");
  },

  handleFieldFocus: function(evt) {
    evt.target.style.color = "black";
    evt.target.value = "";
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
    var twitterIconStyle = Utils.clone(sharePanelStyle.socialIconStyle);
    twitterIconStyle.backgroundColor = "#64ccea";
    var facebookIconStyle = Utils.clone(sharePanelStyle.socialIconStyle);
    facebookIconStyle.backgroundColor = "#517db8";
    var plusIconStyle = Utils.clone(sharePanelStyle.socialIconStyle);
    plusIconStyle.backgroundColor = "#ff6267";

    return (
      <div style={sharePanelStyle.containerStyle}>
        <div style={sharePanelStyle.tabRowStyle}>
          <span onClick={this.showPanel.bind(this, this.tabs.SHARE)} style={(this.state.activeTab == this.tabs.SHARE) ? Utils.extend(sharePanelStyle.tabStyle, sharePanelStyle.activeTab) : sharePanelStyle.tabStyle}>Share</span>
          <span onClick={this.showPanel.bind(this, this.tabs.EMBED)} style={(this.state.activeTab == this.tabs.EMBED) ? Utils.extend(sharePanelStyle.tabStyle, sharePanelStyle.activeTab) : sharePanelStyle.tabStyle}>Embed</span>
          <span onClick={this.showPanel.bind(this, this.tabs.EMAIL)} style={(this.state.activeTab == this.tabs.EMAIL) ? Utils.extend(sharePanelStyle.lastTabStyle, sharePanelStyle.activeTab) : sharePanelStyle.lastTabStyle}>Email</span>
        </div>
        <div style={(this.state.activeTab == this.tabs.SHARE) ? Utils.extend(sharePanelStyle.panelStyle, {display: ""}) : sharePanelStyle.panelStyle}>
          <div style={sharePanelStyle.titleStyle}>{(this.props.contentTree && this.props.contentTree.title) || ""}</div>
          <div onClick={this.handleTwitterClick} style={twitterIconStyle}>t</div>
          <div onClick={this.handleFacebookClick} style={facebookIconStyle}>f</div>
          <div onClick={this.handleGPlusClick} style={plusIconStyle}>g+</div><br/>
          <input style={sharePanelStyle.embedUrlStyle} type='text' defaultValue={location.href}/><br/>
          <input style={{marginBottom: "15px"}}type='checkbox'/> Start at <input style={sharePanelStyle.startAtInput} type='text' defaultValue={Utils.formatSeconds(this.props.currentPlayhead)}/><br/>
        </div>
        <div style={(this.state.activeTab == this.tabs.EMBED) ? Utils.extend(sharePanelStyle.panelStyle, {display: ""}) : sharePanelStyle.panelStyle}>
          <textarea style={sharePanelStyle.embedTextArea}>
            &lt;script src="//player.ooyala.com/v4/"&gt;&lt;/script&gt;
          </textarea>
        </div>
        <div style={(this.state.activeTab == this.tabs.EMAIL) ? Utils.extend(sharePanelStyle.panelStyle, {display: ""}) : sharePanelStyle.panelStyle}>
          <table style={{color: "white"}}>
            <tr>
              <td style={{paddingLeft: "5px"}}>To</td>
              <td style={{width: "10px"}}></td>
              <td><input ref="sharePanelTo" onFocus={this.handleFieldFocus} style={sharePanelStyle.emailInputField} type='text' defaultValue='recipient'/></td>
            </tr>
            <tr>
              <td>Subject</td>
              <td style={{width: "10px"}}></td>
              <td><input ref="sharePanelSubject" onFocus={this.handleFieldFocus} style={sharePanelStyle.emailInputField} type='text' defaultValue='subject'/><br/></td>
            </tr>
            <tr>
              <td>Message</td>
              <td style={{width: "10px"}}></td>
              <td><textarea ref="sharePanelMessage" onFocus={this.handleFieldFocus} style={sharePanelStyle.emailTextArea}>
                Optional Message
              </textarea></td>
            </tr>
            <tr>
              <td></td>
              <td style={{width: "10px"}}></td>
              <td style={{textAlign: "right"}}><button onClick={this.handleEmailClick} style={sharePanelStyle.emailSendButton}>Send</button></td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
});