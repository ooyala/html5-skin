/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('./utils'),
    ClassNames = require('classnames'),
    ccStyle = InlineStyle.closedCaptionScreenStyles;

var ClosedCaptionPanel = React.createClass({
  // calculateNumberOfRows: function(clientWidth, clientHeight){
  //   var switchHeight = parseInt(ccStyle.switchStyle.height) + parseInt(ccStyle.switchStyle.marginTop);
  //   var CCPreviewPanelHeight = parseInt(ccStyle.CCPreviewPanelStyle.height);
  //   var captionHeight = 4/3*parseInt(ccStyle.captionStyle.fontSize);
  //   var innerPanelPaddingHeight = 2*parseInt(ccStyle.innerPanelStyle.padding);

  //   //height of the panel that should fit the table
  //   var panelHeight = clientHeight - CCPreviewPanelHeight - captionHeight - innerPanelPaddingHeight - switchHeight;
  //   //height of a table row
  //   var tableRowHeight = 2*parseInt(ccStyle.itemSelectedStyle.fontSize) + parseInt(ccStyle.itemStyle.marginTop) + 2*parseInt(ccStyle.itemSelectedStyle.padding);

  //   var numRows = Math.floor(panelHeight/tableRowHeight);

  //   return numRows;
  // },

/*   Responsive design code for later

   setResponsiveStyle: function(clientWidth){
     var scale = Math.min(1, Math.max(clientWidth/1280, 0.3));

     ccStyle.CCPreviewPanelStyle.bottom = 15 * scale;

     ccStyle.innerPanelStyle.padding = 35 * scale;

     ccStyle.closeButtonStyle.right = ccStyle.innerPanelStyle.padding;
     ccStyle.closeButtonStyle.top = ccStyle.innerPanelStyle.padding;

     ccStyle.captionStyle.fontSize = 32 * scale + "pt";
     ccStyle.captionIconStyle.fontSize = 25 * scale + "px";

     ccStyle.switchStyle.marginTop = 35 * scale;
     ccStyle.switchStyle.height = 28 * scale;
     ccStyle.switchStyle.width = 140 * scale;
     ccStyle.switchStyle.fontSize = 20 * scale + "pt";

     ccStyle.CCPreviewPanelStyle.height = 70 * scale;

     ccStyle.CCPreviewTextStyle.fontSize = 24 * scale + "pt";
     ccStyle.CCPreviewTextStyle.marginLeft = ccStyle.innerPanelStyle.padding;

     ccStyle.CCPreviewCaptionStyle.fontSize = 12 * scale + "pt";
     ccStyle.CCPreviewCaptionStyle.marginLeft = ccStyle.innerPanelStyle.padding;
     ccStyle.CCPreviewCaptionStyle.marginTop = 1/4*(parseInt(ccStyle.CCPreviewPanelStyle.height) - 4/3*parseInt(ccStyle.CCPreviewTextStyle.fontSize)-4/3*parseInt(ccStyle.CCPreviewCaptionStyle.fontSize));
     ccStyle.CCPreviewCaptionStyle.marginBottom = ccStyle.CCPreviewCaptionStyle.marginTop;

     this.setResponsiveStyleCCLanguages(clientWidth);
   },

   setResponsiveStyleCCLanguages: function(clientWidth){
     var scale = Math.max(clientWidth/1280, 0.3);

     ccStyle.itemStyle.fontSize = 22 * scale + "pt";
     ccStyle.itemStyle.padding = 3;
     ccStyle.itemStyle.width = 140 * scale;
     ccStyle.itemStyle.marginRight = 140 * scale - 2*parseInt(ccStyle.itemStyle.padding);
     ccStyle.itemStyle.marginTop = 40 * scale - 2*parseInt(ccStyle.itemStyle.padding);

     ccStyle.lastColumnItemStyle.fontSize = ccStyle.itemStyle.fontSize;
     ccStyle.lastColumnItemStyle.padding = ccStyle.itemStyle.padding;
     ccStyle.lastColumnItemStyle.width = ccStyle.itemStyle.width;
     ccStyle.lastColumnItemStyle.marginRight = 0;
     ccStyle.lastColumnItemStyle.marginTop = ccStyle.itemStyle.marginTop;

     ccStyle.itemSelectedStyle.fontSize = ccStyle.itemStyle.fontSize;
     ccStyle.itemSelectedStyle.padding = ccStyle.itemStyle.padding;
     ccStyle.itemSelectedStyle.width = ccStyle.itemStyle.width;
     ccStyle.itemSelectedStyle.marginRight = ccStyle.itemStyle.marginRight;
     ccStyle.itemSelectedStyle.marginTop = ccStyle.itemStyle.marginTop;

     ccStyle.lastColumnItemSelectedStyle.fontSize = ccStyle.lastColumnItemStyle.fontSize;
     ccStyle.lastColumnItemSelectedStyle.padding = ccStyle.lastColumnItemStyle.padding;
     ccStyle.lastColumnItemSelectedStyle.width = ccStyle.itemSelectedStyle.width;
     ccStyle.lastColumnItemSelectedStyle.marginRight = ccStyle.lastColumnItemStyle.marginRight;
     ccStyle.lastColumnItemSelectedStyle.marginTop = ccStyle.lastColumnItemStyle.marginTop;

     ccStyle.closedCaptionChevronLeftButtonContainer.width = 50 * scale;
     ccStyle.closedCaptionChevronRightButtonContainer.width = ccStyle.tableLanguageContainerStyle.marginLeft = ccStyle.tableLanguageContainerStyle.marginRight = ccStyle.closedCaptionChevronLeftButtonContainer.width;
     ccStyle.closedCaptionChevronLeftButton.styles.fontSize = 32 * scale + "pt";
     ccStyle.closedCaptionChevronRightButton.styles.fontSize = ccStyle.closedCaptionChevronLeftButton.styles.fontSize;
    },*/

  render: function(){
    // this.setResponsiveStyle(this.props.clientWidth); //Leave this for later when we use the resizing
    var numRows = 3;//this.calculateNumberOfRows(this.props.clientWidth, this.props.clientHeight);
    var closedCaptionOptionsString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    return (
        <div className = "closed-captions-panel">
          <div className = "closed-captions-panel-title">
            {closedCaptionOptionsString} 
            <span className={this.props.skinConfig.icons.cc.fontStyleClass}></span>
          </div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props} numRows = {numRows} />
          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});
module.exports = ClosedCaptionPanel;


var OnOffSwitch = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
  },

  handleOnOffSwitch: function(evt){
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render: function(){
    var switchThumbClassName = ClassNames({
      'switch-thumb': true,
      'switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'switch-thumb-off': !this.props.closedCaptionOptions.enabled
    });
    var switchBodyClassName = ClassNames({
      'switch-body': true,
      'switch-body-off': !this.props.closedCaptionOptions.enabled
    });
    var onCaptionClassName = ClassNames({
      'switch-captions switch-captions-on': true,
      'switch-captions-active': this.props.closedCaptionOptions.enabled
    });
    var offCaptionClassName = ClassNames({
      'switch-captions switch-captions-off': true,
      'switch-captions-active': !this.props.closedCaptionOptions.enabled
    });

    var offString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OFF, this.props.localizableStrings);
    var onString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ON, this.props.localizableStrings);
    return (
        <div className="switch-container">
          <span className = {offCaptionClassName}>{offString}</span>
          <div className = "switch-element">
            <span className = {switchBodyClassName}></span>
            <span className = {switchThumbClassName}></span>
          </div>
          <span className = {onCaptionClassName}>{onString}</span>
          <a className="switch-container-selectable" onClick={this.handleOnOffSwitch}></a>
        </div>
    );
  }
});


var CCPreviewPanel = React.createClass({
  render: function(){
    var closedCaptionPreviewTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW, this.props.localizableStrings);
    var closedCaptionSampleText =Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);
    return (
      <div className = "preview-panel">
        <div className = "preview-caption">{closedCaptionPreviewTitle}</div>
        <div className = "preview-text">{closedCaptionSampleText}</div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      selectedLanguage: this.props.closedCaptionOptions.language,
      scrollLeftDistance: 0
    };
  },

  componentDidUpdate: function(){
    // var oldChevronRightVisibility = ccStyle.closedCaptionChevronRightButtonContainer.visibility;
    // var oldChevronLeftVisibility = ccStyle.closedCaptionChevronLeftButtonContainer.visibility;

    // //right chevron button is visible if (scrollLeftDistance + table container) are less than table width
    // ccStyle.closedCaptionChevronRightButtonContainer.visibility = (Math.ceil(this.refs.tableLanguageContainer.getDOMNode().clientWidth + this.state.scrollLeftDistance) < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    // //left chevron button is visible if scrollLeftDistance is > 0 and table does not fit into the container
    // ccStyle.closedCaptionChevronLeftButtonContainer.visibility = (this.state.scrollLeftDistance > 0 && this.refs.tableLanguageContainer.getDOMNode().clientWidth < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft = this.state.scrollLeftDistance;

    // if (oldChevronRightVisibility != ccStyle.closedCaptionChevronRightButtonContainer.visibility ||
    //   oldChevronLeftVisibility != ccStyle.closedCaptionChevronLeftButtonContainer.visibility){
    //   this.forceUpdate();//to update the screen if chevron buttons changed visibility
    // }
  },

  calculateScrollDistance: function(){
    var colWidth = parseInt(ccStyle.itemStyle.width) + parseInt(ccStyle.itemStyle.marginRight) + 2*parseInt(ccStyle.itemStyle.padding);
    var numCols =  Math.floor((this.refs.tableLanguageContainer.getDOMNode().clientWidth + parseInt(ccStyle.itemStyle.marginRight)) / (colWidth));
    var scrollDistance = numCols * colWidth;

    return scrollDistance;
  },

  changeLanguage: function(language, evt){
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      if (this.props.closedCaptionOptions.enabled){
        this.props.controller.onClosedCaptionLanguageChange(language);
      }
    }
  },

  handleLeftChevronClick: function(evt){
    if (this.props.closedCaptionOptions.enabled){
      this.refs.tableLanguageContainer.getDOMNode().scrollLeft += -1*this.calculateScrollDistance();
      this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
    }
  },

  handleRightChevronClick: function(evt){
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      if (this.props.closedCaptionOptions.enabled){
        this.refs.tableLanguageContainer.getDOMNode().scrollLeft += this.calculateScrollDistance();
        this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
      }
    }
  },

  setClassname: function(item, j, colnum){
    var classname;
    if (this.props.closedCaptionOptions.language == item && this.props.closedCaptionOptions.enabled){
      if (j == colnum){
        classname = "item item-selected item-last-column";
      }
      else {
        classname = "item item-selected";
      }
    }
    else {
      if (j == colnum){
        classname = "item item-last-column";
      }
      else {
        classname = "item";
      }
    }

    return classname;
  },


  render: function(){
    var table = [];
    var availableLanguages = this.props.closedCaptionOptions.availableLanguages; //getting list of languages

    if (availableLanguages.languages.length > 1){//if there is only one element, do not show it at all
      var languageCodes = availableLanguages.languages; // getting an array of all the codes
      var maxNumberOfRows = 5; // per specs

      //number of columns and rows in a table to display
      var rows = Math.min(maxNumberOfRows,(this.props.numRows > 0) ? this.props.numRows : 1);
      var columns = Math.floor(languageCodes.length/rows) + 1;

      table = new Array(rows); //creating an array for easier rendering (have to do this to fill the table by columns)
      for (var i = 0; i < table.length; i++){
        table[i] = new Array(columns);
      }

      for (var j = 0; j < languageCodes.length; j++){//putting elements into that array
        var rownum = j%rows;
        var colnum = Math.floor(j/rows);
        table[rownum][colnum] = languageCodes[j];
      }
    }

    return(
      <div className="language-panel">
        <div className="chevron-button-container left-chevron-container">
          <span className={this.props.skinConfig.icons.left.fontStyleClass} aria-hidden="true"></span>
          <a className="chevron-container-selectable" onClick={this.handleLeftChevronClick}></a>
        </div>
        <div className="chevron-button-container right-chevron-container">
          <span className={this.props.skinConfig.icons.right.fontStyleClass} aria-hidden="true"></span>
          <a className="chevron-container-selectable" onClick={this.handleRightChevronClick}></a>
        </div>
        <div style = {ccStyle.tableLanguageContainerStyle} ref="tableLanguageContainer">
          <table ref = "tableLanguage" style = {ccStyle.tableLanguageStyle}>
            {
              table.map(function(row,i){
                return (
                  <tr key = {i}>
                    {row.map(function(item, j){
                      return (
                        <td className={availableLanguages.locale[item]} key = {j} onClick={this.changeLanguage.bind(this, item)} onTouchEnd={this.changeLanguage.bind(this, item)} style = {ccStyle.tdLanguageStyle}>
                          <div className = {this.setClassname(item, j, colnum)}>{availableLanguages.locale[item]}</div>
                        </td>
                      );
                    },this)}
                  </tr>
                );
              },this)
            }
          </table>
        </div>
      </div>
    );
  }
});