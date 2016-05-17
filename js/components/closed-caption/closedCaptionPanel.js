/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* Closed caption settings screen.
*
* @class ClosedCaptionPanel
* @constructor
*/
var React = require('react'),
    OnOffSwitch = require('./onOffSwitch'),
    LanguageTab = require('./languageTab'),
    CCPreviewPanel = require('./ccPreviewPanel');

var ClosedCaptionPanel = React.createClass({
  render: function(){
    return (
        <div className="oo-content-panel oo-closed-captions-panel">
          <OnOffSwitch {...this.props} />
          <LanguageTab {...this.props} />
          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});

module.exports = ClosedCaptionPanel;