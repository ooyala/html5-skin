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

          <Tabs className="captions-navbar">
            <Tab title="Language">
              <LanguageTab {...this.props} />
            </Tab>
            <Tab title="Color Selection">
              <ColorSelectionTab {...this.props} />
            </Tab>
            <Tab title="Caption Opacity">
              <CaptionOpacityTab {...this.props} />
            </Tab>
            <Tab title="Font Type">
              <FontTypeTab {...this.props} />
            </Tab>
            <Tab title="Font Size">
              <FontSizeTab {...this.props} />
            </Tab>
            <Tab title="Text Enhancements">
              <TextEnhancementsTab {...this.props} />
            </Tab>
          </Tabs>

          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});

module.exports = ClosedCaptionPanel;