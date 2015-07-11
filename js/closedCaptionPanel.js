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
  render: function(){
    return (
      <div style = {closedCaptionScreenStyles.screenStyle}>
        <div style = {closedCaptionScreenStyles.captionStyle}>CC Options</div>
        <OnOffSwitch {...this.props} />
        <LanguageTabContent {...this.props}/>
        <CCPreviewPanel {...this.props} />
      </div>
    );
  }
});

var OnOffSwitch = React.createClass({

  componentWillMount: function(){
    this.setCCOptionsStyle();
  },

  handleOnOffSwitch: function(){
    this.props.controller.state.ccOptions.enabled = !this.props.controller.state.ccOptions.enabled;
    this.setCCOptionsStyle();
    this.props.controller.onClosedCaptionChange();
  },

  setCCOptionsStyle: function(){
    closedCaptionScreenStyles.onOffSwitchInner.background = this.props.controller.state.ccOptions.enabled ? closedCaptionScreenStyles.onOffSwitchInner.onBackground : "grey";
    closedCaptionScreenStyles.onOffSwitchSwitch.left = this.props.controller.state.ccOptions.enabled ? "" : "0";
    closedCaptionScreenStyles.onOffSwitchSwitch.right = this.props.controller.state.ccOptions.enabled ? "0" : "";
    closedCaptionScreenStyles.CCPreviewPanelStyle.height = this.props.controller.state.ccOptions.enabled ? "100" : "0";
    closedCaptionScreenStyles.itemStyle.color = this.props.controller.state.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.onStyle.color = this.props.controller.state.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.offStyle.color = this.props.controller.state.ccOptions.enabled ? "grey" : "white";

  },

  render: function(){
    return (
        <div style={closedCaptionScreenStyles.onOffSwitchStyle}>
          <span style={closedCaptionScreenStyles.offStyle}>Off</span>
          <div style={closedCaptionScreenStyles.onOffSwitchContainer} onClick = {this.handleOnOffSwitch}>
            <span style={closedCaptionScreenStyles.onOffSwitchInner}></span>
            <span style={closedCaptionScreenStyles.onOffSwitchSwitch}></span>
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
      selectedLanguage: this.props.controller.state.ccOptions.language
    };
  },

  changeLanguage: function(language){
    this.props.controller.state.ccOptions.language = language;
    this.props.controller.onClosedCaptionChange();
  },


  render: function(){
    var availableLanguages = this.props.controller.state.ccOptions.availableLanguages; //getting list of languages

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
                        <div style = {(this.props.controller.state.ccOptions.language == item && this.props.controller.state.ccOptions.enabled) ? closedCaptionScreenStyles.itemSelectedStyle : closedCaptionScreenStyles.itemStyle} 
                        onClick = {this.props.controller.state.ccOptions.enabled ? this.changeLanguage.bind(this, item) : null}>{availableLanguages.locale[item]}</div>
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