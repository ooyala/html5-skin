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

  componentDidMount: function(){
    if (Utils.isSafari()){
      shareScreenStyle.containerStyle.display = "-webkit-flex";
      shareScreenStyle.tabRowStyle.display = "-webkit-flex";
    }
    else {
      shareScreenStyle.containerStyle.display = "flex";
      shareScreenStyle.tabRowStyle.display = "flex";
    }
  },

  getInitialState: function() {
    return {
      activeTab: this.tabs.SHARE
    };
  },

  getActivePanel: function() {
    if (this.state.activeTab === this.tabs.SHARE) {
      var twitterIconStyle = Utils.clone(shareScreenStyle.socialIconStyle);
      twitterIconStyle.backgroundColor = "#64ccea";
      var facebookIconStyle = Utils.clone(shareScreenStyle.socialIconStyle);
      facebookIconStyle.backgroundColor = "#517db8";
      var plusIconStyle = Utils.clone(shareScreenStyle.socialIconStyle);
      plusIconStyle.backgroundColor = "#ff6267";

      return (
        <div style={shareScreenStyle.panelStyle}>
          <div style={shareScreenStyle.titleStyle}>{(this.props.contentTree && this.props.contentTree.title) || ""}</div>
          <div onClick={this.handleTwitterClick} style={twitterIconStyle}>t</div>
          <div onClick={this.handleFacebookClick} style={facebookIconStyle}>f</div>
          <div onClick={this.handleGPlusClick} style={plusIconStyle}>g+</div><br/>
          <input style={shareScreenStyle.embedUrlStyle} type='text' defaultValue={location.href}/><br/>
          <input style={{marginBottom: "15px"}}type='checkbox'/>
            Start at <input style={shareScreenStyle.startAtInput} type='text'
            defaultValue={Utils.formatSeconds(this.props.currentPlayhead)}/><br/>
        </div>
      );
    }
    else if (this.state.activeTab === this.tabs.EMBED) {
      return (
        <div style={shareScreenStyle.panelStyle}>
          <textarea style={shareScreenStyle.embedTextArea}>
            &lt;script src="//player.ooyala.com/v4/"&gt;&lt;/script&gt;
          </textarea>
        </div>
      );
    }
    else if (this.state.activeTab === this.tabs.EMAIL) {
      return (
        <div style={shareScreenStyle.panelStyle}>
          <table style={{color: "white"}}>
            <tr>
              <td style={{paddingLeft: "5px"}}>To</td>
              <td style={{width: "10px"}}></td>
              <td><input ref="sharePanelTo" onFocus={this.handleFieldFocus}
                style={shareScreenStyle.emailInputField} type='text' defaultValue='recipient'/></td>
            </tr>
            <tr>
              <td>Subject</td>
              <td style={{width: "10px"}}></td>
              <td><input ref="sharePanelSubject" onFocus={this.handleFieldFocus}
                style={shareScreenStyle.emailInputField} type='text' defaultValue='subject'/><br/></td>
            </tr>
            <tr>
              <td>Message</td>
              <td style={{width: "10px"}}></td>
              <td><textarea ref="sharePanelMessage" onFocus={this.handleFieldFocus} style={shareScreenStyle.emailTextArea}>
                Optional Message
              </textarea></td>
            </tr>
            <tr>
              <td></td>
              <td style={{width: "10px"}}></td>
              <td style={{textAlign: "right"}}>
                <button onClick={this.handleEmailClick} style={shareScreenStyle.emailSendButton}>Send</button></td>
            </tr>
          </table>
        </div>
      );
    }
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
    var activeTabStyle = Utils.extend(shareScreenStyle.tabStyle, shareScreenStyle.activeTab);
    var activeLastTabStyle = Utils.extend(shareScreenStyle.lastTabStyle, shareScreenStyle.activeTab);

    return (
      <div style={shareScreenStyle.containerStyle}>
        <div style={shareScreenStyle.tabRowStyle}>
          <span onClick={this.showPanel.bind(this, this.tabs.SHARE)}
            style={(this.state.activeTab == this.tabs.SHARE) ? activeTabStyle : shareScreenStyle.tabStyle}>Share</span>
          <span onClick={this.showPanel.bind(this, this.tabs.EMBED)}
            style={(this.state.activeTab == this.tabs.EMBED) ? activeTabStyle : shareScreenStyle.tabStyle}>Embed</span>
          <span onClick={this.showPanel.bind(this, this.tabs.EMAIL)}
            style={(this.state.activeTab == this.tabs.EMAIL) ? activeLastTabStyle : shareScreenStyle.lastTabStyle}>Email</span>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
});