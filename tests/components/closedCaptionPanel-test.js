jest.dontMock('../../js/views/contentScreen')
    .dontMock('../../js/components/closed-caption/closedCaptionPanel')
    .dontMock('../../js/components/closed-caption/ccPreviewPanel')
    .dontMock('../../js/components/closed-caption/languageTab')
    .dontMock('../../js/components/closed-caption/onOffSwitch')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/components/tabs')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/dataSelector')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ContentScreen = require('../../js/views/contentScreen');
var ClosedCaptionPanel = require('../../js/components/closed-caption/closedCaptionPanel');
var OnOffSwitch = require('../../js/components/closed-caption/onOffSwitch');
var CONSTANTS = require('../../js/constants/constants');

describe('ClosedCaptionPanel', function () {
  var availableLanguages = {"languages":["en","fr","de","ru","it"],
                            "locale":{"en": "English", "fr": "français", "de": "Deutsch", "ru": "русский", "it": "italiano"}};
  var skinConfig = {
    "icons": {"cc": [], "left": [], "right": []},
    "closedCaptionOptions": {
      "defaultEnabled": true,
      "defaultLanguage": "en"
    }
  };
  var closedCaptionOptions = {"enabled": true,
                              "availableLanguages": availableLanguages};

  it('tests languages displayed in closed caption panel', function () {
    //Render closed caption panel into DOM
    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions}/>);

    var items0 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-item');
    var leftButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-left-button');
    var rightButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-right-button');

    function testItemsOnPage(items, page){
      var j = items0.length*(page);
      for (var i=0; i<items.length; i++){
        var itemText = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-item')[i].textContent;
          expect(itemText).toEqual(availableLanguages.locale[availableLanguages.languages[i+j]]);
      }
    }
    //checking that languages on page 0 are as expected
    testItemsOnPage(items0, 0);

    //checking that languages displayed on page 1 are as expected after clicking right chevron
    TestUtils.Simulate.click(rightButton);
    var items1 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-item');
    testItemsOnPage(items1, 1);

    //checking that languages displayed on page 0 are as expected after clicking left chevron
    TestUtils.Simulate.click(leftButton);
    testItemsOnPage(items0, 0);
  });

  it('checks closed caption switch works', function () {
    var mockController = {
      toggleClosedCaptionEnabled: function() {
        closedCaptionsEnabled = !closedCaptionsEnabled;
      }
    };

    var DOM = TestUtils.renderIntoDocument(
      <ContentScreen
        screen={CONSTANTS.SCREEN.CLOSEDCAPTION_SCREEN}
        screenClassName="oo-content-screen oo-content-screen-closed-captions"
        titleText={CONSTANTS.SKIN_TEXT.CC_OPTIONS}
        element={<OnOffSwitch controller={mockController} closedCaptionOptions={closedCaptionOptions}/>}
        icon="cc"
        skinConfig={skinConfig}>
        <ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>
      </ContentScreen>
        );

    var closedCaptionsEnabled = closedCaptionOptions.enabled;
    var toggle = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-switch-container-selectable');

    TestUtils.Simulate.click(toggle);
    expect(closedCaptionsEnabled).toBe(!closedCaptionOptions.enabled);
    TestUtils.Simulate.click(toggle);
    expect(closedCaptionsEnabled).toBe(closedCaptionOptions.enabled);
  });

  it('checks changing the closed caption language', function () {
    var selectedLanguage = skinConfig.closedCaptionOptions.defaultLanguage;
    var mockController = {
      onClosedCaptionChange: function(name, value) {
        selectedLanguage = value;
      }
    };

    var DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>);

    var newLanguage = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-item')[1];
    TestUtils.Simulate.click(newLanguage);
    expect(selectedLanguage).toBe(availableLanguages.languages[1]);
  });
});