/** ******************************************************************
  CLOSED CAPTION PANEL
******************************************************************** */
/**
 * Closed caption settings screen.
 *
 * @class ClosedCaptionPanel
 * @constructor
 */
const React = require('react');

const Utils = require('../utils');

const CONSTANTS = require('../../constants/constants');

const LanguageTab = require('./languageTab');

const ColorSelectionTab = require('./colorSelectionTab');

const CaptionOpacityTab = require('./captionOpacityTab');

const FontTypeTab = require('./fontTypeTab');

const FontSizeTab = require('./fontSizeTab');

const TextEnhancementsTab = require('./textEnhancementsTab');

const CCPreviewPanel = require('./ccPreviewPanel');

const Tabs = require('../tabs');

const Tab = Tabs.Panel;
const createReactClass = require('create-react-class');

// The scroll buttons are not needed until the player's width is below a specific amount. This varies by language.
const tabMenuOverflowMap = {
  en: 730,
  es: 995,
  zh: 610,
};

const ClosedCaptionPanel = createReactClass({
  render() {
    const languageTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.LANGUAGE_TAB_TITLE,
      this.props.localizableStrings
    );
    const colorSelectionTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.COLOR_SELECTION_TAB_TITLE,
      this.props.localizableStrings
    );
    const captionOpacityTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.CAPTION_OPACITY_TAB_TITLE,
      this.props.localizableStrings
    );
    const fontTypeTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.FONT_TYPE_TAB_TITLE,
      this.props.localizableStrings
    );
    const fontSizeTabTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.FONT_SIZE_TAB_TITLE,
      this.props.localizableStrings
    );
    const textEnhancementsTabTitle = Utils.getLocalizedString(
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
