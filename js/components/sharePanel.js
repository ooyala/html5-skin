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
    var tabStyle  = {display: "inline-block", width: "100px", "height": "50px",
      "lineHeight": "50px", borderRight: "1px solid #afafaf", textAlign: "center",
      backgroundColor: "#444444", color: "#afafaf", fontWeight: "bold"};

    var activeTab = {color: "#4389ff", backgroundColor: "#3a3a3a"};

    var lastTabStyle = Utils.extend(tabStyle, {borderRight: "0px none"});

    var socialIconStyle = {display: "inline-block", height: "30px", width: "30px",
      marginBottom: "15px", marginRight: "15px", backgroundColor: "aqua", textAlign: "center",
      fontSize: "22px", fontWeight: "bold", lineHeight: "30px", borderRadius: "6px"};
    var twitterIconStyle = Utils.clone(socialIconStyle);
    twitterIconStyle.backgroundColor = "#64ccea";
    var facebookIconStyle = Utils.clone(socialIconStyle);
    facebookIconStyle.backgroundColor = "#517db8";
    var plusIconStyle = Utils.clone(socialIconStyle);
    plusIconStyle.backgroundColor = "#ff6267";

    var panelStyle = {backgroundColor: "#3a3a3a", bottom: 0, flex: 1, color: "white", padding: "20px", display: "none"};

    var containerStyle = {position: "absolute", "top": 0, bottom: "32px", backgroundColor: "#444444",
      left: 0, right: 0, display: "flex", flexDirection: "column"};

    var tabRowStyle = {borderBottom: "1px solid #afafaf"};
    var titleStyle = {fontSize: "18px", fontWeight: "bold", marginBottom: "15px"};
    var embedUrlStyle = {color:"black", marginBottom: "15px", borderRadius: "6px", borderStyle: "none", width: "300px", height: "36px", paddingLeft: "15px"};

    return (
      <div style={containerStyle}>
        <div style={tabRowStyle}>
          <span onClick={this.showPanel.bind(this, this.tabs.SHARE)} style={(this.state.activeTab == this.tabs.SHARE) ? Utils.extend(tabStyle, activeTab) : tabStyle}>Share</span>
          <span onClick={this.showPanel.bind(this, this.tabs.EMBED)} style={(this.state.activeTab == this.tabs.EMBED) ? Utils.extend(tabStyle, activeTab) : tabStyle}>Embed</span>
          <span onClick={this.showPanel.bind(this, this.tabs.EMAIL)} style={(this.state.activeTab == this.tabs.EMAIL) ? Utils.extend(lastTabStyle, activeTab) : lastTabStyle}>Email</span>
        </div>
        <div style={(this.state.activeTab == this.tabs.SHARE) ? Utils.extend(panelStyle, {display: ""}) : panelStyle}>
          <div style={titleStyle}>{(this.props.contentTree && this.props.contentTree.title) || ""}</div>
          <div onClick={this.handleTwitterClick} style={twitterIconStyle}>t</div>
          <div onClick={this.handleFacebookClick} style={facebookIconStyle}>f</div>
          <div onClick={this.handleGPlusClick} style={plusIconStyle}>g+</div><br/>
          <input style={embedUrlStyle} type='text' defaultValue={location.href}/><br/>
          <input style={{marginBottom: "15px"}}type='checkbox'/> Start at <input style={{color:"black", borderRadius: "6px", borderStyle: "none", width: "60px", height: "26px", paddingLeft: "10px"}} type='text' defaultValue={Utils.formatSeconds(this.props.currentPlayhead)}/><br/>
        </div>
        <div style={(this.state.activeTab == this.tabs.EMBED) ? Utils.extend(panelStyle, {display: ""}) : panelStyle}>
          <textarea style={{height: "60%", width: "70%", color: "black", borderRadius: "6px"}}>
            &lt;script src="//player.ooyala.com/v4/"&gt;&lt;/script&gt;
          </textarea>
        </div>
        <div style={(this.state.activeTab == this.tabs.EMAIL) ? Utils.extend(panelStyle, {display: ""}) : panelStyle}>
          <table style={{color: "white"}}>
            <tr>
              <td style={{paddingLeft: "5px"}}>To</td>
              <td style={{width: "10px"}}></td>
              <td><input ref="sharePanelTo" onFocus={this.handleFieldFocus} style={{color:"gray", marginBottom: "15px", borderRadius: "6px", borderStyle: "none", width: "300px", height: "32px", paddingLeft: "15px"}} type='text' defaultValue='recipient'/></td>
            </tr>
            <tr>
              <td>Subject</td>
              <td style={{width: "10px"}}></td>
              <td><input ref="sharePanelSubject" onFocus={this.handleFieldFocus} style={{color:"gray", marginBottom: "15px", borderRadius: "6px", borderStyle: "none", width: "300px", height: "32px", paddingLeft: "15px"}} type='text' defaultValue='subject'/><br/></td>
            </tr>
            <tr>
              <td>Message</td>
              <td style={{width: "10px"}}></td>
              <td><textarea ref="sharePanelMessage" onFocus={this.handleFieldFocus} style={{color: "gray", height: "80px", width: "300px", borderRadius: "6px"}}>
                Optional Message
              </textarea></td>
            </tr>
            <tr>
              <td></td>
              <td style={{width: "10px"}}></td>
              <td style={{textAlign: "right"}}><button onClick={this.handleEmailClick} style={{backgroundColor:"#4389ff", border: "0px none transparent", borderRadius: "6px", height: "40px", width: "70px", marginTop: "8px"}}>Send</button></td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
});