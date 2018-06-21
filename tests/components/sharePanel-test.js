jest.dontMock('../../js/components/sharePanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('../../config/languageFiles/en.json')
    .dontMock('../../config/languageFiles/es.json')
    .dontMock('../../config/languageFiles/zh.json')
    .dontMock('classnames');

_ = require('underscore');
var React = require('react');
var Enzyme = require('enzyme');
var CONSTANTS = require('../../js/constants/constants');
var SharePanel = require('../../js/components/sharePanel');
var en = require('../../config/languageFiles/en.json'),
    es = require('../../config/languageFiles/es.json'),
    zh = require('../../config/languageFiles/zh.json');

// manual mock of OO.ready player skin params
var playerParam = null;
var localizableStrings = null;
var skinConfig = null;
beforeEach(function() {
  playerParam = {
    'skin': {
      'languages': {'en': en, 'es': es, 'zh': zh},
      'inline': {
        'shareScreen' : {
          'embed' : { 'source' : 'iframe_<ASSET_ID>_<PLAYER_ID>_<PUBLISHER_ID>' },
          'shareContent': ['social', 'embed'],
          'socialContent': ['twitter', 'facebook', 'google+', 'email']
        }
      }
    },
    'playerBrandingId': 'bb',
    'pcode': 'cc'
  };
  localizableStrings = playerParam.skin.languages;
  skinConfig = playerParam.skin.inline;
});

// start unit test
describe('SharePanel', function() {
  it('tests social panel in social screen', function() {

    // loop through languages
    for (var key in localizableStrings) {
      if (localizableStrings.hasOwnProperty(key)) {

        // Render share panel into DOM
        var wrapper = Enzyme.mount(
          <SharePanel language={key} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"} playerParam={playerParam} />
        );

        // parent elements
        var shareTabPanel = wrapper.find('.oo-share-tab-panel');
        var tabs = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');

        // test share tab
        var shareTab = tabs[0];
        expect(shareTab.textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.SHARE]);
        TestUtils.Simulate.click(shareTab);

        // test social links
        var twitter = wrapper.find('.oo-twitter');
        var facebook = wrapper.find('.oo-facebook');
        var googlePlus = wrapper.find('.oo-google-plus');
        var emailShare = wrapper.find('.oo-email-share');
        TestUtils.Simulate.click(twitter);
        TestUtils.Simulate.click(facebook);
        TestUtils.Simulate.click(googlePlus);
        OO = {};
        OO.isIos = false;
        OO.isSafari = false;
        TestUtils.Simulate.click(emailShare);
        OO = null;
      }
    }
  });

  it('tests share email option when device is ios and browser is safari', function() {
  // loop through languages
    for (var key in localizableStrings) {
      if (localizableStrings.hasOwnProperty(key)) {

      // Render share panel into DOM
        var wrapper = Enzyme.mount(
        <SharePanel language={key} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"}
                    playerParam={playerParam}/>
      );

      // parent elements
        var shareTabPanel = wrapper.find('.oo-share-tab-panel');
        var tabs = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');

      // test share tab
        var shareTab = tabs[0];
        expect(shareTab.textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.SHARE]);
        TestUtils.Simulate.click(shareTab);

        var emailShare = wrapper.find('.oo-email-share');
        OO = {};
        OO.isIos = true;
        OO.isSafari = true;
        document.location = 'ooyala.com';// make sure some different site there before testing
        TestUtils.Simulate.click(emailShare);
        var index = document.location.indexOf('mailto:?subject=&body=');
        OO = null;
        expect(index).toBe(0);
      }
    }
  });
  it('tests share email option when device is ios and browser is chrome', function() {
  // loop through languages
    for (var key in localizableStrings) {
      if (localizableStrings.hasOwnProperty(key)) {

      // Render share panel into DOM
        var wrapper = Enzyme.mount(
        <SharePanel language={key} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"}
                    playerParam={playerParam}/>
      );

      // parent elements
        var shareTabPanel = wrapper.find('.oo-share-tab-panel');
        var tabs = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');

      // test share tab
        var shareTab = tabs[0];
        expect(shareTab.textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.SHARE]);
        TestUtils.Simulate.click(shareTab);

        var emailShare = wrapper.find('.oo-email-share');

        OO = {};
        OO.isIos = true;
        OO.isSafari = false;
        document.location = 'ooyala.com';// need to reset location because previous test case will have that location.
        TestUtils.Simulate.click(emailShare);
        var index = document.location.indexOf('mailto:?subject=&body=');
        OO = null;
        expect(index).toBe(-1);
      }
    }
  });
  it('tests conditional rendering of social share buttons', function() {
    skinConfig.shareScreen.socialContent = ['twitter', 'facebook'];

    var wrapper = Enzyme.mount(
    <SharePanel language={"en"} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"} playerParam={playerParam} />
  );

    var twitter = wrapper.find('.oo-twitter');
    var facebook = wrapper.find('.oo-facebook');
    TestUtils.Simulate.click(twitter);
    TestUtils.Simulate.click(facebook);

    var shareTabPanel = wrapper.find('.oo-share-tab-panel');
    var buttons = shareTabPanel.childNodes;

    var childClasses = _.map(buttons, function(child) {
      return child.className;
    });
    expect(childClasses).toEqual(['oo-twitter', 'oo-facebook']);
  });

  it('tests that share tab is hidden when social buttons are empty', function() {
    skinConfig.shareScreen.socialContent = [];

    var wrapper = Enzyme.mount(
    <SharePanel language={"en"} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"} playerParam={playerParam} />
  );

    var shareTab = wrapper.find('.oo-share-tab');
    expect(shareTab.className).toMatch('hidden');
  });

  it('tests embed tab in social screen is shown, social tab is not shown', function() {

    // loop through languages
    for (var key in localizableStrings) {
      if (localizableStrings.hasOwnProperty(key)) {

        playerParam.skin.inline.shareScreen.shareContent = ['embed'];

        // Render share panel into DOM
        var wrapper = Enzyme.mount(
          <SharePanel language={key} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"} playerParam={playerParam} />
        );

        // parent elements
        var shareTabPanel = wrapper.find('.oo-share-tab-panel');
        var tabs = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');

        // test embed tab shown, share not shown
        var shareTab = tabs[0];
        var embedTab = tabs[1];
        expect(embedTab.textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.EMBED]);
        TestUtils.Simulate.click(embedTab);
        var textArea = TestUtils.findRenderedDOMComponentWithTag(DOM, 'textarea');
        expect(textArea.value).toContain('iframe_aa_bb_cc');

        expect(embedTab.className).not.toMatch('hidden');
        expect(shareTab.className).toMatch('hidden');
      }
    }
  });

  it('tests embed tab in social screen is not shown, social tab is shown', function() {

    // loop through languages
    for (var key in localizableStrings) {
      if (localizableStrings.hasOwnProperty(key)) {

        playerParam.skin.inline.shareScreen.shareContent = ['social'];

        // Render share panel into DOM
        var wrapper = Enzyme.mount(
          <SharePanel language={key} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"} playerParam={playerParam} />
        );

        // parent elements
        var shareTabPanel = wrapper.find('.oo-share-tab-panel');
        var tabs = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');

        // test share tabs shown, embed not shown
        var shareTab = tabs[0];
        var embedTab = tabs[1];
        expect(embedTab.textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.EMBED]);
        TestUtils.Simulate.click(embedTab);
        var textArea = TestUtils.findRenderedDOMComponentWithTag(DOM, 'textarea');
        expect(textArea.value).toContain('iframe_aa_bb_cc');

        expect(shareTab.className).not.toMatch('hidden');
        expect(embedTab.className).toMatch('hidden');

      }
    }
  });
});
