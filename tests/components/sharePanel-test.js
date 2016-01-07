jest.dontMock('../../js/components/sharePanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('../../config/en.json')
    .dontMock('../../config/es.json')
    .dontMock('../../config/zh.json');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var CONSTANTS = require('../../js/constants/constants');
var SharePanel = require('../../js/components/sharePanel');
var en = require('../../config/en.json'),
    es = require('../../config/es.json'),
    zh = require('../../config/zh.json');

//manual mock of OO.ready player skin params
var playerParam = {
  "skin": {
    "languages": {"en": en, "es": es, "zh": zh},
    "inline": {"shareScreen" : {"embed" : { "source" : "iframe_<ASSET_ID>_<PLAYER_ID>_<PUBLISHER_ID>"}}}
  },
  "playerBrandingId": "bb",
  "pcode": "cc"
};
var localizableStrings = playerParam.skin.languages;
var skinConfig = playerParam.skin.inline;

//start unit test
describe('SharePanel', function () {
  it('tests social panel in social screen', function () {

    //loop through languages
    for (var key in localizableStrings) {
      if (localizableStrings.hasOwnProperty(key)) {

        //Render share panel into DOM
        var DOM = TestUtils.renderIntoDocument(
          <SharePanel language={key} localizableStrings={localizableStrings} skinConfig={skinConfig} assetId={"aa"} playerParam={playerParam} />
        );

        //parent elements
        var shareTabPanel = TestUtils.findRenderedDOMComponentWithClass(DOM, 'shareTabPanel');
        var tabs = TestUtils.scryRenderedDOMComponentsWithTag(DOM, 'a');

        //test share tab
        var shareTab = tabs[0];
        expect(React.findDOMNode(shareTab).textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.SHARE]);
        TestUtils.Simulate.click(shareTab);
        expect(React.findDOMNode(shareTabPanel).textContent).toContain(localizableStrings[key][CONSTANTS.SKIN_TEXT.SHARE_CALL_TO_ACTION]);

        //test social links
        var twitter = TestUtils.findRenderedDOMComponentWithClass(shareTabPanel, 'twitter');
        var facebook = TestUtils.findRenderedDOMComponentWithClass(shareTabPanel, 'facebook');
        var googlePlus = TestUtils.findRenderedDOMComponentWithClass(shareTabPanel, 'googlePlus');
        var emailShare = TestUtils.findRenderedDOMComponentWithClass(shareTabPanel, 'emailShare');
        TestUtils.Simulate.click(twitter);
        TestUtils.Simulate.click(facebook);
        TestUtils.Simulate.click(googlePlus);
        TestUtils.Simulate.click(emailShare);

        //test embed tab
        var embedTab = tabs[1];
        expect(React.findDOMNode(embedTab).textContent).toEqual(localizableStrings[key][CONSTANTS.SKIN_TEXT.EMBED]);
        TestUtils.Simulate.click(embedTab);
        var textArea = TestUtils.findRenderedDOMComponentWithTag(shareTabPanel, 'textarea');
        expect(React.findDOMNode(textArea).value).toContain('iframe_aa_bb_cc');
      }
    }
  });
});