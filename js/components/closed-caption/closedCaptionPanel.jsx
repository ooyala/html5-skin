import React from 'react';
import Utils from '../utils';
import CONSTANTS from '../../constants/constants';
import LanguageTab from './languageTab';
import ColorSelectionTab from './colorSelectionTab';
import CaptionOpacityTab from './captionOpacityTab';
import FontTypeTab from './fontTypeTab';
import FontSizeTab from './fontSizeTab';
import TextEnhancementsTab from './textEnhancementsTab';
import CCPreviewPanel from './ccPreviewPanel';
import Tabs from '../tabs';

const Tab = Tabs.Panel;

/**
 * Closed caption settings screen
 * @param {Object} props – Props object
 * @returns {Object} React VDOM element
 */
const ClosedCaptionPanel = (props) => {
  // The scroll buttons are not needed until the player's width is below a specific amount. This varies by language.
  const tabMenuOverflowMap = {
    en: 730,
    es: 995,
    zh: 610,
  };
  const { language, localizableStrings, componentWidth } = props;

  const languageTabTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.LANGUAGE_TAB_TITLE,
    localizableStrings
  );
  const colorSelectionTabTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.COLOR_SELECTION_TAB_TITLE,
    localizableStrings
  );
  const captionOpacityTabTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.CAPTION_OPACITY_TAB_TITLE,
    localizableStrings
  );
  const fontTypeTabTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.FONT_TYPE_TAB_TITLE,
    localizableStrings
  );
  const fontSizeTabTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.FONT_SIZE_TAB_TITLE,
    localizableStrings
  );
  const textEnhancementsTabTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.TEXT_ENHANCEMENTS_TAB_TITLE,
    localizableStrings
  );

  return (
    <div className="oo-content-panel oo-closed-captions-panel">
      <Tabs
        className="captions-navbar"
        showScrollButtons={componentWidth < tabMenuOverflowMap[language]}
        {...props}
      >
        <Tab title={languageTabTitle}>
          <LanguageTab {...props} />
        </Tab>
        <Tab title={colorSelectionTabTitle}>
          <ColorSelectionTab {...props} />
        </Tab>
        <Tab title={captionOpacityTabTitle}>
          <CaptionOpacityTab {...props} />
        </Tab>
        <Tab title={fontTypeTabTitle}>
          <FontTypeTab {...props} />
        </Tab>
        <Tab title={fontSizeTabTitle}>
          <FontSizeTab {...props} />
        </Tab>
        <Tab title={textEnhancementsTabTitle}>
          <TextEnhancementsTab {...props} />
        </Tab>
      </Tabs>

      <CCPreviewPanel {...props} />
    </div>
  );
};

module.exports = ClosedCaptionPanel;
