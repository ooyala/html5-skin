/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/


var ClosedCaptionPanel = React.createClass({
  responsiveStyleSet: function(clientWidth){
    var scale = clientWidth/1280;
    console.log("xenia clientWidth", clientWidth);
    console.log("xenia scale", scale);
    closedCaptionScreenStyles.captionStyle.fontSize = 32*scale;

    
    console.log("xenia fontSize", closedCaptionScreenStyles.captionStyle.fontSize);


  },

  render: function(){
    this.responsiveStyleSet(this.props.clientWidth);

    return (
      <div style = {closedCaptionScreenStyles.screenStyle}>
        <div style = {closedCaptionScreenStyles.captionStyle}>CC Options <span className="icon icon-topmenu-cc"></span></div>
        <OnOffSwitch {...this.props} />
        <LanguageTabContent {...this.props}/>
        <CCPreviewPanel {...this.props} />
      </div>
    );
  }
});

var OnOffSwitch = React.createClass({

  componentWillMount: function(){
    this.toggleCCStyles();
  },

  handleOnOffSwitch: function(){
    this.props.controller.toggleClosedCaptionEnabled();
    this.toggleCCStyles();
  },

  toggleCCStyles: function(){
    closedCaptionScreenStyles.switch.background = this.props.ccOptions.enabled ? closedCaptionScreenStyles.switch.onBackground : "grey";
    closedCaptionScreenStyles.switchThumb.left = this.props.ccOptions.enabled ? "" : "0";
    closedCaptionScreenStyles.switchThumb.right = this.props.ccOptions.enabled ? "0" : "";
    closedCaptionScreenStyles.CCPreviewPanelStyle.height = this.props.ccOptions.enabled ? "100" : "0";
    closedCaptionScreenStyles.itemStyle.color = this.props.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.onStyle.color = this.props.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.offStyle.color = this.props.ccOptions.enabled ? "grey" : "white";

  },

  render: function(){
    return (
        <div style={closedCaptionScreenStyles.switchStyle}>
          <span style={closedCaptionScreenStyles.offStyle}>Off</span>
          <div style={closedCaptionScreenStyles.switchContainer} onClick = {this.handleOnOffSwitch}>
            <span style={closedCaptionScreenStyles.switch}></span>
            <span style={closedCaptionScreenStyles.switchThumb}></span>
          </div>
          <span style={closedCaptionScreenStyles.onStyle}>On</span>
        </div>
    );
  }
});


var CCPreviewPanel = React.createClass({
  render: function(){
    return (
      <div style = {closedCaptionScreenStyles.CCPreviewPanelStyle}>
        <div style = {closedCaptionScreenStyles.CCPreviewCaptionStyle}>CLOSED CAPTION PREVIEW</div>
        <div style = {closedCaptionScreenStyles.CCPreviewTextStyle}>Sample Text</div>
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

  changeLanguage: function(language){
    this.props.controller.onClosedCaptionLanguageChange(language);
  },


  render: function(){
    var availableLanguages = this.props.ccOptions.availableLanguages; //getting list of languages

    var languageCodes = availableLanguages.languages; // getting an array of all the codes

    //number of columns and rows in a table to display
    var rows = 4;
    var columns = Math.floor(languageCodes.length/rows) + 1;

    var table = new Array(rows); //creating an array for easier rendering (have to do this to fill the table by columns)
    for (var i = 0; i < table.length; i++){
      table[i] = new Array(columns);
    }

    for (var j = 0; j < languageCodes.length; j++){//putting elements into that array
      var rownum = j%rows;
      var colnum = Math.floor(j/rows);
      table[rownum][colnum] = languageCodes[j];
    }

    return(
      <div>
        <table style = {closedCaptionScreenStyles.tableStyle}>
          {
            table.map(function(row,i){
              return (
                <tr key = {i}>
                  {row.map(function(item, j){
                    return (
                      <td key = {j}>
                        <div style = {(this.props.ccOptions.language == item && this.props.ccOptions.enabled) ? closedCaptionScreenStyles.itemSelectedStyle : closedCaptionScreenStyles.itemStyle} 
                        onClick = {this.props.ccOptions.enabled ? this.changeLanguage.bind(this, item) : null}>{availableLanguages.locale[item]}</div>
                      </td>
                    );
                  },this)}
                </tr>
              );
            },this)
          }
        </table>
      </div>
    );
  }
});