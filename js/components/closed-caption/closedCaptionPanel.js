/** ******************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
 * Closed caption settings screen.
 *
 * @class ClosedCaptionPanel
 * @constructor
 */
let React = require('react');

let Utils = require('../utils');

let CONSTANTS = require('../../constants/constants');

let LanguageTab = require('./languageTab');

let ColorSelectionTab = require('./colorSelectionTab');

let CaptionOpacityTab = require('./captionOpacityTab');

let FontTypeTab = require('./fontTypeTab');

let FontSizeTab = require('./fontSizeTab');

let TextEnhancementsTab = require('./textEnhancementsTab');

let CCPreviewPanel = require('./ccPreviewPanel');

let Tabs = require('../tabs');

let Tab = Tabs.Panel;
let createReactClass = require('create-react-class');

// The scroll buttons are not needed until the player's width is below a specific amount. This varies by language.
let tabMenuOverflowMap = {
  en: 730,
  es: 995,
  zh: 610,
};

let ClosedCaptionPanel = createReactClass({
  render: function() {
    let languageTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.LANGUAGE_TAB_TITLE,
      this.props.localizableStrings
    );
    let colorSelectionTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.COLOR_SELECTION_TAB_TITLE,
      this.props.localizableStrings
    );
    let captionOpacityTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.CAPTION_OPACITY_TAB_TITLE,
      this.props.localizableStrings
    );
    let fontTypeTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.FONT_TYPE_TAB_TITLE,
      this.props.localizableStrings
    );
    let fontSizeTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.FONT_SIZE_TAB_TITLE,
      this.props.localizableStrings
    );
    let textEnhancementsTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.TEXT_ENHANCEMENTS_TAB_TITLE,
      this.props.localizableStrings
    );

    return (
      <div className="oo-content-panel oo-closed-captions-panel">
        <Tabs
          className="captions-navbar"
          showScrollButtons={this.props.componentWidth < tabMenuOverflowMap[this.props.language]}
          {...this.props}
        >
          <Tab title={languageTabTitle}>
            <LanguageTab {...this.props} />
          </Tab>
          <Tab title={colorSelectionTabTitle}>
            <ColorSelectionTab {...this.props} />
          </Tab>
          <Tab title={captionOpacityTabTitle}>
            <CaptionOpacityTab {...this.props} />
          </Tab>
          <Tab title={fontTypeTabTitle}>
            <FontTypeTab {...this.props} />
          </Tab>
          <Tab title={fontSizeTabTitle}>
            <FontSizeTab {...this.props} />
          </Tab>
          <Tab title={textEnhancementsTabTitle}>
            <TextEnhancementsTab {...this.props} />
          </Tab>
        </Tabs>

        <CCPreviewPanel {...this.props} />
      </div>
    );
  },
});

module.exports = ClosedCaptionPanel;
