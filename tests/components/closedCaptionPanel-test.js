jest.dontMock('../../js/components/closedCaptionPanel')
    .dontMock('../../config/skin.json');


React = require('react/addons');
TestUtils = React.addons.TestUtils;
ClosedCaptionPanel = require('../../js/components/closedCaptionPanel');
var skin = require('../../config/skin.json');


describe('ClosedCaptionPanel', function () {
    var availableLanguages = {"languages":["en","fr","de","ru","it"], "locale":{"de": "Deutsch", "en": "English", "fr": "français", "ru": "русский", "it": "italiano"}};
    var skinConfig = {"icons": {
                        "cc": [{"fontFamilyName": "alice", "fontString": "\u006B", "fontStyleClass": "icon icon-topmenu-cc"}],
                        "left": [{"fontFamilyName": "alice", "fontString": "\u0072", "fontStyleClass": "icon icon-left"}],
                        "right": [{"fontFamilyName": "alice", "fontString": "\u0073", "fontStyleClass": "icon icon-right"}]
                       },
                       "closedCaptionOptions": {
                            "defaultEnabled": true,
                            "defaultLanguage": "en",
                            "availableLanguages": availableLanguages
                        }
                     };
    var closedCaptionOptions = {"enabled":true, 
                                "availableLanguages": availableLanguages};

    it('tests languages displayed in closed caption panel', function () {
        //Render closed caption panel into DOM
        DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions}/>);
        var items0 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'language');

        function testItemsOnPage(items, page){
            var j = items0.length*(page);
            for (i=0; i<items.length; i++){
                var itemText = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'language')[i].getDOMNode().textContent;
                expect(itemText).toEqual(availableLanguages.locale[availableLanguages.languages[j+i]]);
            }
        }
        //checking that languages on page 0 are as expected
        testItemsOnPage(items0, 0);

        //switching to the second page
        var languageContainer = TestUtils.findRenderedDOMComponentWithClass(DOM, 'language-container');
        var links = TestUtils.scryRenderedDOMComponentsWithTag(languageContainer, 'a');
        var rightButton = links[links.length-1];
        var leftButton = links[links.length-2];
        expect(rightButton._reactInternalInstance._currentElement.ref).toEqual('rightChevron');
        expect(leftButton._reactInternalInstance._currentElement.ref).toEqual('leftChevron');
        TestUtils.Simulate.click(rightButton);

        //checking that languages displayed on page 1 are as expected
        var items1 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'language');
        testItemsOnPage(items1, 1);

        TestUtils.Simulate.click(leftButton);

        //checking that languages displayed on page 0 are as expected
        testItemsOnPage(items0, 0);
    });

    it('checks closed caption switch works', function () {
        var mockController = {
            toggleClosedCaptionEnabled: function() {
                closedCaptionsEnabled = !closedCaptionsEnabled;
            }
        };

        DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>);

        var closedCaptionsEnabled = skinConfig.closedCaptionOptions.defaultEnabled;
        var toggle = TestUtils.findRenderedDOMComponentWithClass(DOM, 'switch-container-selectable');

        TestUtils.Simulate.click(toggle);
        expect(closedCaptionsEnabled).toBe(!skinConfig.closedCaptionOptions.defaultEnabled);
        TestUtils.Simulate.click(toggle);
        expect(closedCaptionsEnabled).toBe(skinConfig.closedCaptionOptions.defaultEnabled);
    });

    it('checks changing the closed caption language', function () {
        var selectedLanguage = skinConfig.closedCaptionOptions.defaultLanguage;
        var mockController = {
            onClosedCaptionLanguageChange: function(language) {
                selectedLanguage = language;
            }
        };

        DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>);

        var newLanguage = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'language')[1];
        TestUtils.Simulate.click(newLanguage);
        expect(selectedLanguage).toBe(availableLanguages.languages[1]);
    });

    it('checks not able to change the closed caption language when disabled', function () {
        var selectedLanguage = skinConfig.closedCaptionOptions.defaultLanguage;
        skinConfig.closedCaptionOptions.defaultEnabled = false;
        closedCaptionOptions.enabled = false;
        var mockController = {
            onClosedCaptionLanguageChange: function(language) {
                selectedLanguage = language;
            }
        };

        DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions} controller={mockController}/>);

        var newLanguage = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'language')[1];
        TestUtils.Simulate.click(newLanguage);
        expect(selectedLanguage).toBe(skinConfig.closedCaptionOptions.defaultLanguage);

        skinConfig.closedCaptionOptions.defaultEnabled = true;
        closedCaptionOptions.enabled = true;
    });

    it('checks not showing languages if only one available', function () {
         var availableLanguages = {"languages":["en"], "locale":{"en": "English"}};
         skinConfig.closedCaptionOptions.availableLanguages = availableLanguages;
         closedCaptionOptions.availableLanguages = availableLanguages;
         DOM = TestUtils.renderIntoDocument(<ClosedCaptionPanel skinConfig={skinConfig} closedCaptionOptions={closedCaptionOptions}/>);
         var items0 = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'language');
         expect(items0.length).toBe(0);
    });
});