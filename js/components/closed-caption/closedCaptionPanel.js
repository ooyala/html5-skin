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
    ColorSelectionTab = require('./colorSelectionTab'),
    CaptionOpacityTab = require('./captionOpacityTab'),
    FontTypeTab = require('./fontTypeTab'),
    FontSizeTab = require('./fontSizeTab'),
    TextEnhancementsTab = require('./textEnhancementsTab'),
    CCPreviewPanel = require('./ccPreviewPanel'),
    Tabs = require('../tabs'),
    Tab = Tabs.Panel;

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
              <CaptionOpacityTab />
            </Tab>
            <Tab title="Font Type">
              <FontTypeTab />
            </Tab>
            <Tab title="Font Size">
              <FontSizeTab />
            </Tab>
            <Tab title="Text Enhancements">
              <TextEnhancementsTab />
            </Tab>
          </Tabs>

          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});

module.exports = ClosedCaptionPanel;