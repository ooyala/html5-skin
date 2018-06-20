jest.dontMock('../../js/views/contentScreen')
    .dontMock('../../js/components/closed-caption/closedCaptionPanel')
    .dontMock('../../js/components/closed-caption/ccPreviewPanel')
    .dontMock('../../js/components/closed-caption/languageTab')
    .dontMock('../../js/components/closed-caption/onOffSwitch')
    .dontMock('../../js/components/accessibleButton')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/components/tabs')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/dataSelector')
    .dontMock('../../js/components/higher-order/accessibleMenu')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var ContentScreen = require('../../js/views/contentScreen');
var ClosedCaptionPanel = require('../../js/components/closed-caption/closedCaptionPanel');
var OnOffSwitch = require('../../js/components/closed-caption/onOffSwitch');
var CONSTANTS = require('../../js/constants/constants');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');
var Enzyme = require('enzyme');

describe('ClosedCaptionPanel', function() {
  var availableLanguages = {'languages':['en','fr','de','ru','it'],
                            'locale':{'en': 'English', 'fr': 'français', 'de': 'Deutsch', 'ru': 'русский', 'it': 'italiano'}};
  var mockSkinConfig = Utils.clone(skinConfig);
  mockSkinConfig.icons = {'cc': [], 'left': [], 'right': []};
  mockSkinConfig.defaultEnabled = true;
  mockSkinConfig.defaultLanguage = 'en';

  var closedCaptionOptions = {'enabled': true,
                              'availableLanguages': availableLanguages};
  var mockController = {
    toggleClosedCaptionEnabled: function() {},
    onClosedCaptionChange: function() {}
  };

  beforeEach(function() {
    mockController = {
      toggleClosedCaptionEnabled: function() {},
      onClosedCaptionChange: function() {}
    };
    closedCaptionOptions = {'enabled': true,
                            'availableLanguages': availableLanguages};
  });

  it('tests languages displayed in closed caption panel', function() {
    // Render closed caption panel into DOM
    var wrapper = Enzyme.mount(<ClosedCaptionPanel skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions}/>);
    var items0 = wrapper.find('.oo-item').hostNodes();
    var leftButton = wrapper.find('.oo-left-button').hostNodes();
    var rightButton = wrapper.find('.oo-right-button').hostNodes();

    function testItemsOnPage(items, page) {
      var j = items0.length*(page);
      for (var i=0; i<items.length; i++) {
        var domNode = ReactDOM.findDOMNode(items.at(i).instance());
        var itemText = domNode.textContent;
        expect(itemText).toEqual(availableLanguages.locale[availableLanguages.languages[i+j]]);
      }
    }
    // checking that languages on page 0 are as expected
    testItemsOnPage(items0, 0);

    // checking that languages displayed on page 1 are as expected after clicking right chevron
    rightButton.simulate('click');
    var items1 = wrapper.find('.oo-data').hostNodes();
    testItemsOnPage(items1, 1);

    // checking that languages displayed on page 0 are as expected after clicking left chevron
    leftButton.simulate('click');
    testItemsOnPage(items0, 0);
  });

  it('checks closed caption switch works', function() {
    mockController.toggleClosedCaptionEnabled = function() {
      closedCaptionsEnabled = !closedCaptionsEnabled;
    };

    var wrapper = Enzyme.mount(
      <ContentScreen
        screen={CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN}
        screenClassName="oo-content-screen oo-content-screen-closed-captions"
        titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
        element={<OnOffSwitch controller={mockController} skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} ariaLabel="ariaLabel"/>}
        icon="cc"
        skinConfig={mockSkinConfig}>
        <ClosedCaptionPanel skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>
      </ContentScreen>
        );

    var closedCaptionsEnabled = closedCaptionOptions.enabled;
    var toggle = wrapper.find('.oo-switch-container-selectable').hostNodes();

    toggle.simulate('click');
    expect(closedCaptionsEnabled).toBe(!closedCaptionOptions.enabled);
    toggle.simulate('click');
    expect(closedCaptionsEnabled).toBe(closedCaptionOptions.enabled);
  });

  it('checks closed caption on switch with accent color', function() {
    mockSkinConfig.general.accentColor = 'blue';

    var wrapper = Enzyme.mount(
      <ContentScreen
        screen={CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN}
        screenClassName="oo-content-screen oo-content-screen-closed-captions"
        titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
        element={<OnOffSwitch controller={mockController} skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} ariaLabel="ariaLabel"/>}
        icon="cc"
        skinConfig={mockSkinConfig}>
        <ClosedCaptionPanel skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>
      </ContentScreen>
    );

    var onOffSwitch = wrapper.find('.oo-switch-body').instance();
    expect(onOffSwitch.style.backgroundColor).toBe('blue');
  });

  //TODO: Check with SPB team on this test. The previous test may not have functioned the way we expected
  //it('checks closed caption off switch with accent color', function() {
  //  mockSkinConfig.general.accentColor = 'blue';
  //
  //  var wrapper = Enzyme.mount(
  //    <ContentScreen
  //      screen={CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN}
  //      screenClassName="oo-content-screen oo-content-screen-closed-captions"
  //      titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
  //      element={<OnOffSwitch controller={mockController} skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} ariaLabel="ariaLabel"/>}
  //      icon="cc"
  //      skinConfig={mockSkinConfig}>
  //      <ClosedCaptionPanel skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>
  //    </ContentScreen>
  //  );
  //
  //  var onOffSwitch = wrapper.find('.oo-switch-body').instance();
  //  expect(onOffSwitch.style.backgroundColor).toBe('blue');
  //});

  it('checks changing the closed caption language', function() {
    var selectedLanguage = skinConfig.closedCaptionOptions.defaultLanguage;
    mockController.onClosedCaptionChange = function(name, value) {
      selectedLanguage = value;
    };

    var wrapper = Enzyme.mount(<ClosedCaptionPanel skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>);

    var newLanguage = wrapper.find('.oo-item').hostNodes().at(1);
    newLanguage.simulate('click');
    expect(selectedLanguage).toBe(availableLanguages.languages[1]);
  });

  it('checks changing the closed caption language with accent color', function() {
    var selectedLanguage = skinConfig.closedCaptionOptions.defaultLanguage;
    mockController.onClosedCaptionChange = function(name, value) {
      selectedLanguage = value;
    };

    mockSkinConfig.general.accentColor = 'blue';

    var wrapper = Enzyme.mount(<ClosedCaptionPanel skinConfig={mockSkinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>);
    var newLanguage = wrapper.find('.oo-item').hostNodes().at(1);
    newLanguage.simulate('click');
    expect(newLanguage.instance().style.backgroundColor).toBe('blue');
    expect(selectedLanguage).toBe(availableLanguages.languages[1]);
  });
});
