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
    this.isMobile = this.props.controller.state.isMobile;
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
        <div className="shareTabPanel" style={shareScreenStyle.panelStyle}>
          <div style={shareScreenStyle.titleStyle}>{(this.props.contentTree && this.props.contentTree.title) || ""}</div>
          <div className="twitter" onClick={this.handleTwitterClick} onTouchEnd={this.handleTwitterClick} style={twitterIconStyle}>t</div>
          <div className="facebook" onClick={this.handleFacebookClick} onTouchEnd={this.handleFacebookClick} style={facebookIconStyle}>f</div>
          <div className="googlePlus" onClick={this.handleGPlusClick} onTouchEnd={this.handleGPlusClick} style={plusIconStyle}>g+</div><br/>
          <input className="embedUrl" style={shareScreenStyle.embedUrlStyle} type='text' defaultValue={location.href}/><br/>
          <input className="startPointCheckBox" style={{marginBottom: "15px"}}type='checkbox'/>
            Start at <input className="startPointTextField" style={shareScreenStyle.startAtInput} type='text'
            defaultValue={Utils.formatSeconds(this.props.currentPlayhead)}/><br/>
        </div>
      );
    }
    else if (this.state.activeTab === this.tabs.EMBED) {
      return (
        <div className="shareTabPanel" style={shareScreenStyle.panelStyle}>
          <textarea className="embedTextArea" style={shareScreenStyle.embedTextArea}>
            &lt;script src="//player.ooyala.com/v4/"&gt;&lt;/script&gt;
          </textarea>
        </div>
      );
    }
    else if (this.state.activeTab === this.tabs.EMAIL) {
      return (
        <div className="shareTabPanel" style={shareScreenStyle.panelStyle}>
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
              <td><textarea className="sharePanelMessage" ref="sharePanelMessage" onFocus={this.handleFieldFocus} style={shareScreenStyle.emailTextArea}>
                Optional Message
              </textarea></td>
            </tr>
            <tr>
              <td></td>
              <td style={{width: "10px"}}></td>
              <td style={{textAlign: "right"}}>
                <button className="emailSendButton" onClick={this.handleEmailClick} onTouchEnd={this.handleEmailClick} style={shareScreenStyle.emailSendButton}>Send</button></td>
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
    var activeTabStyle = Utils.extend(shareScreenStyle.tabStyle, shareScreenStyle.activeTab);
    var activeLastTabStyle = Utils.extend(shareScreenStyle.lastTabStyle, shareScreenStyle.activeTab);

    return (
      <div style={shareScreenStyle.containerStyle}>
        <div className="tabRow" style={shareScreenStyle.tabRowStyle}>
          <span className="shareTab" onClick={this.showPanel.bind(this, this.tabs.SHARE)}
            onTouchEnd={this.showPanel.bind(this, this.tabs.SHARE)}
            style={(this.state.activeTab == this.tabs.SHARE) ? activeTabStyle : shareScreenStyle.tabStyle}>Share</span>
          <span className="embedTab" onClick={this.showPanel.bind(this, this.tabs.EMBED)}
            onTouchEnd={this.showPanel.bind(this, this.tabs.EMBED)}
            style={(this.state.activeTab == this.tabs.EMBED) ? activeTabStyle : shareScreenStyle.tabStyle}>Embed</span>
          <span className="emailTab" onClick={this.showPanel.bind(this, this.tabs.EMAIL)}
            onTouchEnd={this.showPanel.bind(this, this.tabs.EMAIL)}
            style={(this.state.activeTab == this.tabs.EMAIL) ? activeLastTabStyle : shareScreenStyle.lastTabStyle}>Email</span>
        </div>
        {this.getActivePanel()}
      </div>
    );
  }
});