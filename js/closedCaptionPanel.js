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

  setResponsiveStyle: function(clientWidth, clientHeight){
    var scale = Math.max(clientWidth/1280, 0.3);
    //scale = Math.min(clientWidth/1280, 1); // if do not scale above
    var controlBarHeight = 60;
    closedCaptionScreenStyles.CCPreviewPanelStyle.bottom = controlBarHeight;

    closedCaptionScreenStyles.innerPanelStyle.padding = 35 * scale;
    closedCaptionScreenStyles.captionStyle.fontSize = 32 * scale;
    closedCaptionScreenStyles.switchStyle.marginTop = closedCaptionScreenStyles.innerPanelStyle.padding;
    closedCaptionScreenStyles.switchStyle.height = 28 * scale;
    closedCaptionScreenStyles.switchStyle.width = 140 * scale;
    closedCaptionScreenStyles.switchStyle.fontSize = 20 * scale;
    closedCaptionScreenStyles.itemStyle.fontSize = 22 * scale;
    closedCaptionScreenStyles.itemStyle.padding = 3;
    closedCaptionScreenStyles.itemStyle.marginRight = 140 * scale - 2*closedCaptionScreenStyles.itemStyle.padding;
    closedCaptionScreenStyles.itemStyle.marginTop = 40 * scale - 2*closedCaptionScreenStyles.itemStyle.padding;
    closedCaptionScreenStyles.itemSelectedStyle.fontSize = closedCaptionScreenStyles.itemStyle.fontSize;
    closedCaptionScreenStyles.itemSelectedStyle.padding = closedCaptionScreenStyles.itemStyle.padding;
    closedCaptionScreenStyles.itemSelectedStyle.marginRight = closedCaptionScreenStyles.itemStyle.marginRight;
    closedCaptionScreenStyles.itemSelectedStyle.marginTop = closedCaptionScreenStyles.itemStyle.marginTop;
    closedCaptionScreenStyles.CCPreviewPanelStyle.visibility = this.props.ccOptions.enabled ? "visible" : "hidden";
    closedCaptionScreenStyles.CCPreviewPanelStyle.height = 70 * scale;
    closedCaptionScreenStyles.CCPreviewTextStyle.fontSize = 24 * scale;
    closedCaptionScreenStyles.CCPreviewTextStyle.marginLeft = closedCaptionScreenStyles.innerPanelStyle.padding;
    closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize = 12 * scale;
    closedCaptionScreenStyles.CCPreviewCaptionStyle.marginLeft = closedCaptionScreenStyles.innerPanelStyle.padding;
    closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop = 1/3*(closedCaptionScreenStyles.CCPreviewPanelStyle.height - 4/3*closedCaptionScreenStyles.CCPreviewTextStyle.fontSize-4/3*closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize);
    closedCaptionScreenStyles.CCPreviewCaptionStyle.marginBottom = closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop;

    //var panelHeight = Math.min(clientHeight, 720) - controlBarHeight; // if do not scale above 720 height
    var panelHeight = clientHeight - controlBarHeight; //calculating the height of the panel where table with languages goes
    panelHeight -= 4/3*closedCaptionScreenStyles.captionStyle.fontSize;
    panelHeight -= 2*closedCaptionScreenStyles.innerPanelStyle.padding;
    panelHeight -= closedCaptionScreenStyles.switchStyle.height;
    panelHeight -= closedCaptionScreenStyles.switchStyle.marginTop;
    panelHeight -= closedCaptionScreenStyles.itemStyle.marginTop + 2*closedCaptionScreenStyles.itemSelectedStyle.padding;
    panelHeight -= closedCaptionScreenStyles.CCPreviewPanelStyle.height;

    //closedCaptionScreenStyles.innerPanelStyle.padding += (clientHeight - Math.min(clientHeight, 720))/2; // if do not scale above 720 height

    //number of table rows that can fit into the panel
    var numRows = Math.floor(panelHeight/(4/3*closedCaptionScreenStyles.itemSelectedStyle.fontSize+closedCaptionScreenStyles.itemStyle.marginTop + 2*closedCaptionScreenStyles.itemSelectedStyle.padding));
    return numRows;

  },

  render: function(){
    var numRows = this.setResponsiveStyle(this.props.clientWidth, this.props.clientHeight);

    return (
      <div style = {closedCaptionScreenStyles.screenStyle}>
        <div style = {closedCaptionScreenStyles.innerPanelStyle}>
          <div style = {closedCaptionScreenStyles.captionStyle}>CC Options <span className="icon icon-topmenu-cc"></span></div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props} numRows = {numRows} />
          <CCPreviewPanel {...this.props} />
        </div>
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
    closedCaptionScreenStyles.itemStyle.color = this.props.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.onStyle.color = this.props.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.offStyle.color = this.props.ccOptions.enabled ? "grey" : "white";

  },

  render: function(){
    return (
        <div style={closedCaptionScreenStyles.switchStyle} onClick = {this.handleOnOffSwitch}>
          <span style={closedCaptionScreenStyles.offStyle}>Off</span>
          <div style={closedCaptionScreenStyles.switchContainer}>
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
    var rows = (this.props.numRows > 0) ? this.props.numRows : 1;
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
      <div style = {{overflowX:"scroll"}}>
        <table>
          {
            table.map(function(row,i){
              return (
                <tr key = {i}>
                  {row.map(function(item, j){
                    return (
                      <td key = {j} onClick = {this.props.ccOptions.enabled ? this.changeLanguage.bind(this, item) : null}>
                        <div style = {(this.props.ccOptions.language == item && this.props.ccOptions.enabled) ? closedCaptionScreenStyles.itemSelectedStyle : closedCaptionScreenStyles.itemStyle} 
                        >{availableLanguages.locale[item]}</div>
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