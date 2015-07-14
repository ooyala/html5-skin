/********************************************************************
  MORE OPTIONS PANEL
*********************************************************************/
/**
* @class MoreOptionsPanel
* @constructor
*/

var MoreOptionsPanel = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  closeMoreOptionsScreen: function() {
    this.props.controller.closeMoreOptionsScreen();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleDiscoveryClick: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  buildMoreOptionsButtonList: function() {
    var optionItemTemplates = {
      "discovery": <div className="discovery" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick}>
        <span className="icon icon-topmenu-discovery"></span></div>,
      "bitrateSelector": <div className="bitrateSelector" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-quality"></span></div>,
      "closedCaption": <div className="closedCaption" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-cc"></span></div>,
      "share": <div className="share" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-share"
        onClick={this.handleShareClick}></span></div>
    };


    var moreOptionsItems = [];
    var moreOptions = this.props.skinConfig.moreOptions;
    for (i=0; i < moreOptions.length; i++) {
      moreOptionsItems.push(optionItemTemplates[moreOptions[i]]);
    }
    return moreOptionsItems;
  },

  render: function() {
    var moreOptionsItems = this.buildMoreOptionsButtonList();
    return (
      <div style={MoreOptionsScreenStyle.panelStyle}>
        <div onClick={this.closeMoreOptionsScreen} style={MoreOptionsScreenStyle.closeButtonStyle}><span className="icon icon-close"></span></div>
        <div style={MoreOptionsScreenStyle.buttonListStyle}>
          {moreOptionsItems}
        </div>
      </div>
    );
  }
});