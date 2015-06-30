/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/

var tabList = [
  {'id': 'language', 'caption': 'Langugage'},
  {'id': 'font', 'caption': 'Font'},
  {'id': 'size', 'caption': 'Size'},
  {'id': 'color', 'caption': 'Color'},
  {'id': 'backgroundColor', 'caption': 'Background Color'},
  {'id': 'borderColor', 'caption': 'Caption Window'},
  {'id': 'shadow', 'caption': 'Shadow'},
  {'id': 'transition', 'caption': 'Transition'}
];

var ClosedCaptionPanel = React.createClass({
  getInitialState: function () {
        return {
            tabList: tabList,
            activeTab: 'language'
        };
    },

  changeTab: function(tab) {
        this.setState({ activeTab: tab.id });
    },
  
  render: function() {
    
    return (
      <div style={{backgroundColor: "#444444", height:"100%"}}>
        <Tabs
          activeTab = {this.state.activeTab}
          changeTab={this.changeTab} 
          data={tabList}/>
        <TabContent {...this.props}
          activeTab={this.state.activeTab} />
        <CCPreviewPanel {...this.props} data = {this.state}/> 

      </div>
    );
  }
});

var Tabs = React.createClass({
  getInitialState: function () {
    return {activeTab: this.props.activeTab};
  },

  tabClick: function(tab){
        this.props.changeTab(tab);
        this.setState({activeTab: tab.id});
  },

  render: function() {
    return (
      <div>
        <div style = {closedCaptionScreenStyles.captionStyle}>CC Options</div>
        {
          this.props.data.map(function(tab, i) {
            var tStyle = null;
            if (i == this.props.data.length-1){//style for last tab, without the border on the right
              tStyle = (this.props.activeTab == tab.id) ? closedCaptionScreenStyles.lastTabSelectedStyle : closedCaptionScreenStyles.lastTabStyle;
            }
            else{//style for the rest of the tabs
              tStyle = (this.props.activeTab == tab.id) ? closedCaptionScreenStyles.tabSelectedStyle : closedCaptionScreenStyles.tabStyle;
            }
            return(
              <div key = {i} 
                style={tStyle} 
                onClick = {this.tabClick.bind(this,tab)}>
                {tab.caption}
              </div>
            );
          }.bind(this))
        }
      </div>
    );
  }
});

var TabContent = React.createClass({
  render: function(){
      return(
          <div>
              {this.props.activeTab === 'language' ?
                  <LanguageTabContent {...this.props}/>
              :null}

              {this.props.activeTab === 'font' ?
              <div>
                  <FontTabContent {...this.props}/>
              </div>
              :null}

              {this.props.activeTab === 'size' ?
              <div>
                  <SizeTabContent {...this.props}/>
              </div>
              :null}

              {this.props.activeTab === 'color' ?
              <div>
                  <ColorTabContent {...this.props}/>
              </div>
              :null}

              {this.props.activeTab === 'backgroundColor' ?
              <div>
                  <BackgroundColorTabContent {...this.props}/>
              </div>
              :null}

              {this.props.activeTab === 'borderColor' ?
              <div>
                  <BorderColorTabContent {...this.props}/>
              </div>
              :null}

              {this.props.activeTab === 'shadow' ?
              <div>
                  <ShadowTabContent {...this.props}/>
              </div>
              :null}

              {this.props.activeTab === 'transition' ?
              <div>
                  <TransitionTabContent {...this.props}/>
              </div>
              :null}
          </div>
      );
  }
});
var CCPreviewPanel = React.createClass({
  render: function(){
    var backColor = this.props.ccOptions.window.backgroundColor;
    var backColorOpacity = backColor.substring(0, backColor.length - 2) + this.props.ccOptions.window.backgroundOpacity +")";

    var borderColor = this.props.ccOptions.window.borderColor;
    var borderColorOpacity = borderColor.substring(0, borderColor.length - 2) + this.props.ccOptions.window.borderOpacity +")";


    var SampleText = {"en":"English Sample Text", "fr":"French Sample Text", "es":"Spanish Sample Text", "ru":"Russian Sample Text", "de":"German Sample Text", "pt":"Portuguese Sample Text", "el":"Greek Sample Text"};
    return (
      <div style = {closedCaptionScreenStyles.CCPreviewPanelStyle}>
      <div style={closedCaptionScreenStyles.CCPreviewCaptionStyle}>CLOSED CAPTION PREVIEW</div>
        <div style = {closedCaptionScreenStyles.CCPreviewContainerStyle}><div style={{backgroundColor:backColorOpacity, borderStyle:"solid", borderWidth:"1px", borderColor:borderColorOpacity, padding: "10", fontFamily:this.props.ccOptions.text.font, fontSize: this.props.ccOptions.text.size, color: this.props.ccOptions.text.color, opacity:this.props.ccOptions.text.opacity, textShadow:this.props.ccOptions.text.shadow}}>{SampleText[this.props.ccOptions.language]}</div></div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  getInitialState: function() {
    return {
      selectedLanguage: this.props.ccOptions.language
    };
  },

  handleClick: function(i) {
    console.log("xenia ",this.props.ccOptions);
    this.props.ccOptions.language = this.props.contentTree.closed_captions[0].languages[i];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = this.props.contentTree.closed_captions[0].languages;
    var longLanguage = {"en":"English", "fr":"French", "es":"Spanish", "ru":"Russian", "de":"German", "pt":"Portuguese", "el":"Greek"};
    // var rows = 4;
    // var columns = Math.floor(items.length/rows) + 1;
    // console.log (columns);
    return(
        <div>
        {items.map(function(item, i) {
          return (
            <div style={(this.props.ccOptions.language == items[i]) ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleClick.bind(this, i)} key={i}>{longLanguage[item]}</div>
          );
        }, this)}
      </div>
    );
  }
});


var FontTabContent = React.createClass({
  componentWillMount: function() {
    this.fonts = {"Arial":"Arial", "Verdana":"Verdana", "Lucida":"Lucida Grande", "Times":"Times", "Courier":"Courier", "Impact":"Impact", "Trebuchet":"Trebuchet MS", "Georgia":"Georgia"};
  },

  handleClick: function(item) {
    this.props.ccOptions.text.font = this.fonts[item];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = Object.keys(this.fonts);
    return(
      <div>
        <table height = "150" >
          <tr height = "50%">
          {
            items.map(function(item, i) {
              if (i < items.length/2)
              return(
                <td key = {i} onClick={this.handleClick.bind(this,item)}><div style = {(this.props.ccOptions.text.font == this.fonts[item])?closedCaptionScreenStyles.fontSelectedStyle:closedCaptionScreenStyles.fontStyle}><div style={{fontFamily:this.fonts[item]}}>{item}</div></div></td>
              );
            },this)
          }
          </tr>
          <tr height = "50%">
          {
            items.map(function(item, i) {
              if (i >= items.length/2)
              return(
                <td key = {i} onClick={this.handleClick.bind(this,item)}><div style = {(this.props.ccOptions.text.font == this.fonts[item])?closedCaptionScreenStyles.fontSelectedStyle:closedCaptionScreenStyles.fontStyle}><div style={{fontFamily:this.fonts[item]}}>{item}</div></div></td>
              );
            },this)
          }
          </tr>
        </table>
      </div>
    );
  }
});

var SizeTabContent = React.createClass({
  componentWillMount: function() {
    this.fontSize = ["10", "15", "20", "25"];
  },

  handleClick: function(i) {
    this.props.ccOptions.text.size = this.fontSize[i];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = this.fontSize;
    return(
      <div>
        {items.map(function(item, i) {
          return (
            <div style={(this.props.ccOptions.text.size == items[i]) ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleClick.bind(this, i)} key={i}><div style={{fontSize:items[i]}}>Aa</div></div>
          );
        }, this)}
      </div>
    );
  }
});

var ColorTabContent = React.createClass({
  componentWillMount: function() {
    this.colors = ["rgba(255,255,255,1)","rgba(0,0,255,1)","rgba(255,0,0,1)","rgba(0,255,0,1)","rgba(255,0,255,1)","rgba(255,255,0,1)","rgba(0,255,255,1)","rgba(0,0,0,1)"];
  },

  handleColorClick: function(i) {
    this.props.ccOptions.text.color = this.colors[i];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  handleOpaqueClick: function(i) {
    this.props.ccOptions.text.opacity = i;
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = this.colors;
    return(
      <div>
        <div style={{display:"inline-block"}}>
          <table height = "100" >
            <tr height = "50%">
            {
              items.map(function(item, i) {
                if (i < items.length/2)
                return(
                  <td key = {i} onClick={this.handleColorClick.bind(this,i)}><div style = {(this.props.ccOptions.text.color == items[i])?closedCaptionScreenStyles.languageSelectedStyle:closedCaptionScreenStyles.languageStyle}><div style={{backgroundColor:items[i], height: "30", width: "30"}}> </div></div></td>
                );
              },this)
            }
            </tr>
            <tr height = "50%">
            {
              items.map(function(item, i) {
                if (i >= items.length/2)
                return(
                  <td key = {i} onClick={this.handleColorClick.bind(this,i)}><div style = {(this.props.ccOptions.text.color == items[i])?closedCaptionScreenStyles.languageSelectedStyle:closedCaptionScreenStyles.languageStyle}><div style={{backgroundColor:items[i], height: "30", width: "30"}}> </div></div></td>
                );
              },this)
            }
            </tr>
          </table>
        </div>
        <div style={{display:"inline-block"}}>
        <table height = "100">
          <tr height = "50%"><td><div style={this.props.ccOptions.text.opacity == "1" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"1")}>Opaque</div></td></tr>
          <tr height = "50%"><td><div style={this.props.ccOptions.text.opacity == "0.5" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"0.5")}>Semi-Transparent</div></td></tr>
        </table>
        </div>
      </div>
    );
  }
});

var BackgroundColorTabContent = React.createClass({
  componentWillMount: function() {
    this.colors = ["rgba(255,255,255,1)","rgba(0,0,255,1)","rgba(255,0,0,1)","rgba(0,255,0,1)","rgba(255,0,255,1)","rgba(255,255,0,1)","rgba(0,255,255,1)","rgba(0,0,0,1)"];
  },

  handleColorClick: function(i) {
    this.props.ccOptions.window.backgroundColor = this.colors[i];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  handleOpaqueClick: function(i) {
    this.props.ccOptions.window.backgroundOpacity = i;
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = this.colors;
    return(
      <div>
        <div style={{display:"inline-block"}}>
          <table height = "100" >
            <tr height = "50%">
            {
              items.map(function(item, i) {
                if (i < items.length/2)
                return(
                  <td key = {i} onClick={this.handleColorClick.bind(this,i)}><div style = {(this.props.ccOptions.window.backgroundColor == items[i])?closedCaptionScreenStyles.languageSelectedStyle:closedCaptionScreenStyles.languageStyle}><div style={{backgroundColor:items[i], height: "30", width: "30"}}> </div></div></td>
                );
              },this)
            }
            </tr>
            <tr height = "50%">
            {
              items.map(function(item, i) {
                if (i >= items.length/2)
                return(
                  <td key = {i} onClick={this.handleColorClick.bind(this,i)}><div style = {(this.props.ccOptions.window.backgroundColor == items[i])?closedCaptionScreenStyles.languageSelectedStyle:closedCaptionScreenStyles.languageStyle}><div style={{backgroundColor:items[i], height: "30", width: "30"}}> </div></div></td>
                );
              },this)
            }
            </tr>
          </table>
        </div>
        <div style={{display:"inline-block"}}>
        <table height = "100">
          <tr height = "33.33%"><td><div style={this.props.ccOptions.window.backgroundOpacity == "1" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"1")}>Opaque</div></td></tr>
          <tr height = "33.33%"><td><div style={this.props.ccOptions.window.backgroundOpacity == "0.5" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"0.5")}>Semi-Transparent</div></td></tr>
          <tr height = "33.33%"><td><div style={this.props.ccOptions.window.backgroundOpacity == "0" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"0")}>Transparent</div></td></tr>
        </table>
        </div>
      </div>
    );
  }
});

var BorderColorTabContent = React.createClass({
  componentWillMount: function() {
    this.colors = ["rgba(255,255,255,1)","rgba(0,0,255,1)","rgba(255,0,0,1)","rgba(0,255,0,1)","rgba(255,0,255,1)","rgba(255,255,0,1)","rgba(0,255,255,1)","rgba(0,0,0,1)"];
  },

  handleColorClick: function(i) {
    this.props.ccOptions.window.borderColor = this.colors[i];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  handleOpaqueClick: function(i) {
    this.props.ccOptions.window.borderOpacity = i;
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = this.colors;
    return(
      <div>
        <div style={{display:"inline-block"}}>
          <table height = "100" >
            <tr height = "50%">
            {
              items.map(function(item, i) {
                if (i < items.length/2)
                return(
                  <td key = {i} onClick={this.handleColorClick.bind(this,i)}><div style = {(this.props.ccOptions.window.borderColor == items[i])?closedCaptionScreenStyles.languageSelectedStyle:closedCaptionScreenStyles.languageStyle}><div style={{backgroundColor:items[i], height: "30", width: "30"}}> </div></div></td>
                );
              },this)
            }
            </tr>
            <tr height = "50%">
            {
              items.map(function(item, i) {
                if (i >= items.length/2)
                return(
                  <td key = {i} onClick={this.handleColorClick.bind(this,i)}><div style = {(this.props.ccOptions.window.borderColor == items[i])?closedCaptionScreenStyles.languageSelectedStyle:closedCaptionScreenStyles.languageStyle}><div style={{backgroundColor:items[i], height: "30", width: "30"}}> </div></div></td>
                );
              },this)
            }
            </tr>
          </table>
        </div>
        <div style={{display:"inline-block"}}>
        <table height = "100">
          <tr height = "33.33%"><td><div style={this.props.ccOptions.window.borderOpacity == "1" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"1")}>Opaque</div></td></tr>
          <tr height = "33.33%"><td><div style={this.props.ccOptions.window.borderOpacity == "0.5" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"0.5")}>Semi-Transparent</div></td></tr>
          <tr height = "33.33%"><td><div style={this.props.ccOptions.window.borderOpacity == "0" ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleOpaqueClick.bind(this,"0")}>Transparent</div></td></tr>
        </table>
        </div>
      </div>
    );
  }
});

var ShadowTabContent = React.createClass({
  componentWillMount: function() {
    this.shadows = ["","2px 2px 8px","-2px -2px 8px", "1px 1px 4px","-1px -1px 4px"];
  },

  handleClick: function(i) {
    this.props.ccOptions.text.shadow = this.shadows[i];
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = this.shadows;
    return(
      <div style={{margin:"50"}}>
        {items.map(function(item, i) {
          return (
            <div style={(this.props.ccOptions.text.shadow == items[i]) ? closedCaptionScreenStyles.languageSelectedStyle : closedCaptionScreenStyles.languageStyle} onClick={this.handleClick.bind(this, i)} key={i}><div style={{textShadow:items[i]}}>A</div></div>
          );
        }, this)}
      </div>
    );
  }
});

var TransitionTabContent = React.createClass({
  componentWillMount: function() {
    this.transitions = {"tr1":"Transition 1","tr2":"Transition 2","tr3":"Transition 3","tr4":"Transition 4"};
  },

  handleClick: function(item) {
    this.props.ccOptions.transition = item;
    this.props.controller.onClosedCaptionChange({"ccOptions":this.props.ccOptions});
  },

  render: function(){
    var items = Object.keys(this.transitions);
    return(
      <div>
        <table height = "150" >
          <tr height = "50%">
          {
            items.map(function(item, i) {
              if (i < items.length/2)
              return(
                <td key = {i} onClick={this.handleClick.bind(this,item)}><div style = {(this.props.ccOptions.transition == item)?closedCaptionScreenStyles.fontSelectedStyle:closedCaptionScreenStyles.fontStyle}>{this.transitions[item]}</div></td>
              );
            },this)
          }
          </tr>
          <tr height = "50%">
          {
            items.map(function(item, i) {
              if (i >= items.length/2)
              return(
                <td key = {i} onClick={this.handleClick.bind(this,item)}><div style = {(this.props.ccOptions.transition == item)?closedCaptionScreenStyles.fontSelectedStyle:closedCaptionScreenStyles.fontStyle}>{this.transitions[item]}</div></td>
              );
            },this)
          }
          </tr>
        </table>
      </div>
    );
  }
});


var closedCaptionScreenStyles ={

  captionStyle: {
    display: "inline-block", 
    height: "30",
    textAlign: "center", 
    fontSize: "20",
    color: "white", 
    margin: "15"},

  tabStyle: {
    display: "inline-block", 
    height: "15",
    borderRight: "1px solid #afafaf", 
    textAlign: "center", 
    fontSize: "12", 
    paddingRight: "3", 
    paddingLeft: "3",
    //this one is changed for tabSelectedStyle
    color: "#DDDDDD"},

  tabSelectedStyle: {
    display: "inline-block", 
    height: "15",
    borderRight: "1px solid #afafaf", 
    textAlign: "center",
    fontSize: "12", 
    paddingRight: "3", 
    paddingLeft: "3",
    //properties different from tabStyle
    color: "#0FDDAF", 
    borderTop: "1px solid #13BF99"},

  lastTabStyle: {
    display: "inline-block", 
    height: "15",
    //removed the border on the right
    textAlign: "center", 
    fontSize: "12", 
    paddingRight: "3", 
    paddingLeft: "3",
    color: "#DDDDDD"},

  lastTabSelectedStyle: {
    display: "inline-block", 
    height: "15",
    //removed the border on the right 
    textAlign: "center",
    fontSize: "12", 
    paddingRight: "3", 
    paddingLeft: "3",
    //properties different from tabStyle
    color: "#0FDDAF", 
    borderTop: "1px solid #13BF99"},

  languageStyle: {
    display: "inline-block",
    textAlign: "center", 
    minWidth :"50", 
    color: "#DDDDDD", 
    marginLeft: "25", 

    padding: "5", 
    paddingLeft: "10",
    paddingRight: "10"},
  
  languageSelectedStyle: {
    display: "inline-block",
    textAlign: "center", 
    minWidth :"50", 
    color: "#DDDDDD", 
    marginLeft: "25", 
 
    padding: "5", 
    paddingLeft: "10",
    paddingRight: "10",
    //properties different from languageStyle
    backgroundColor: "#13BF99", 
    borderRadius: "4"},

  fontStyle: {
    textAlign: "center", 
    minWidth :"100", 
    color: "#DDDDDD", 
    marginLeft: "25", 
    marginTop: "15", 
    padding: "15"
    },
  
  fontSelectedStyle: {
    textAlign: "center", 
    minWidth :"100", 
    color: "#DDDDDD", 
    marginLeft: "25", 
    marginTop: "15", 
    padding: "15",
    //properties diff from fontStyle
    backgroundColor: "#13BF99", 
    borderRadius: "4"},

  CCPreviewPanelStyle:{
    height: "120", 
    width:"100%", 
    backgroundColor: "black", 
    position:"absolute", 
    bottom:"0"
  },

  CCPreviewCaptionStyle: {
    color:"white",
    marginLeft: "20", 
    fontSize:"10", 
    paddingTop:"5", 
    paddingBottom:"5"
  },

  CCPreviewContainerStyle:{
    marginRight: "20", 
    marginLeft: "20", 
    backgroundColor: "grey", 
    borderRadius: "4"
  }
};


