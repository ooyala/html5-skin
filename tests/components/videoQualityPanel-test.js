jest.dontMock('../../js/components/videoQualityPanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/components/icon')
    .dontMock('../../js/components/higher-order/accessibleMenu')
    .dontMock('../../js/components//accessibleButton')
    .dontMock('../../js/constants/constants')
    .dontMock('../../js/constants/macros')
    .dontMock('classnames');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var MACROS = require('../../js/constants/macros');
var CONSTANTS = require('../../js/constants/constants');
var VideoQualityPanel = require('../../js/components/videoQualityPanel');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');

// start unit test
describe('VideoQualityPanel', function () {
  var selectedBitrate, mockController, mockSkinConfig, mockProps;
  var availableBitrates = [{"id":"auto", "bitrate":0}, {"id":"1", "bitrate":1000}, {"id":"2", "bitrate":2000}, {"id":"3", "bitrate":3000}, {"id":"4", "bitrate":4000}, {"id":"5", "bitrate":5000}];
  var bitrateLabels = ['1 kbps', '2 kbps','3 kbps','4 kbps','5 kbps'];

  beforeEach(function() {
    mockController = {
      state: {
        isMobile: false,
        "videoQualityOptions": {
          "showPopover":true
        },
        volumeState: {
          volume: 1
        },
        closedCaptionOptions: {availableLanguages: true}
      },
      sendVideoQualityChangeEvent: function(selectedData){
        selectedBitrate = selectedData;
      }
    };
    mockSkinConfig = JSON.parse(JSON.stringify(skinConfig));
    mockProps = {
      controller: mockController,
      videoQualityOptions: {
        availableBitrates: availableBitrates,
        selectedBitrate: null
      },
      skinConfig: mockSkinConfig
    };
  });

  it('creates video quality panel', function () {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn');
    expect(bitrateItems.length).toBe(availableBitrates.length-1);

    for (i=0; i<bitrateItems.length; i++){
      var itemText = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn')[i].textContent;
      expect(itemText).toEqual(bitrateLabels[i]);
    }
  });

  it('selects item from video quality panel', function () {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].querySelector("[class*=label]").textContent).toBe('Auto');

    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn');
    expect(bitrateItems.length).toBe(availableBitrates.length-1);

    for (i=0; i<bitrateItems.length; i++){
      var newBitrate = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn')[i];
      TestUtils.Simulate.click(newBitrate);
      expect(selectedBitrate.id).toBe(availableBitrates[i+1].id);
    }
  });

  it('selects item from video quality panel with accent color', function () {
    mockSkinConfig.general.accentColor = "blue";
    mockSkinConfig.controlBar.iconStyle.active.color = "";

    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].querySelector("[class*=label]").textContent).toBe('Auto');
    var autoBitrate = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality-auto-label');

    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn');
    expect(bitrateItems.length).toBe(availableBitrates.length-1);
    expect(autoBitrate.style.color).toBe("blue");
    expect(bitrateItems[0].style.color).not.toBe("blue");

    for (i=0; i<bitrateItems.length; i++){
      var newBitrate = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn')[i];
      TestUtils.Simulate.click(newBitrate);
      expect(selectedBitrate.id).toBe(availableBitrates[i+1].id);
      expect(autoBitrate.style.color).not.toBe("blue");
      expect(newBitrate.style.color).toBe("blue");
    }
  });

  it('selects item from video quality panel with controlbar iconStyle color', function () {
    mockSkinConfig.general.accentColor = "red";

    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].querySelector("[class*=label]").textContent).toBe('Auto');
    var autoBitrate = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality-auto-label');

    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn');
    expect(bitrateItems.length).toBe(availableBitrates.length-1);
    expect(autoBitrate.style.color).toBe("red");
    expect(bitrateItems[0].style.color).not.toBe("red");

    for (i=0; i<bitrateItems.length; i++){
      var newBitrate = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn')[i];
      TestUtils.Simulate.click(newBitrate);
      expect(selectedBitrate.id).toBe(availableBitrates[i+1].id);
      expect(autoBitrate.style.color).not.toBe("red");
      expect(newBitrate.style.color).toBe("red");
    }
  });

  it('checks selected item is still there', function () {
    var mockProps = {
      controller: mockController,
      videoQualityOptions: {
        availableBitrates: availableBitrates,
        selectedBitrate: availableBitrates[1]
      },
      skinConfig: skinConfig
    };
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].textContent).toBe(bitrateLabels[0]);
  });

  it('should render ARIA attributes on Auto quality button', function() {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var autoButton = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality-auto-btn');
    expect(autoButton.getAttribute('aria-label')).toBe(CONSTANTS.ARIA_LABELS.AUTO_QUALITY);
    expect(autoButton.getAttribute('role')).toBe('menuitemradio');
    expect(autoButton.getAttribute('aria-checked')).toBeTruthy();
  });

  it('should render ARIA attributes on quality buttons', function() {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var qualityButtons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn');
    var qualityButton, ariaLabel;

    for (var i = 0; i < qualityButtons.length; i++) {
      qualityButton = qualityButtons[i];
      ariaLabel = CONSTANTS.ARIA_LABELS.QUALITY_LEVEL.replace(MACROS.LEVEL, i + 1).replace(MACROS.QUALITY, qualityButton.innerHTML);
      expect(qualityButton.getAttribute('aria-label')).toBe(ariaLabel);
      expect(qualityButton.getAttribute('role')).toBe('menuitemradio');
      expect(qualityButton.getAttribute('aria-checked')).toBeTruthy();
      expect(qualityButton.getAttribute(CONSTANTS.KEYBD_FOCUS_ID_ATTR)).toBe('quality' + (i + 1));
    }
  });

  it('should update aria-checked attribute when bitrate is selected', function() {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var qualityButton = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-quality-btn')[2];
    expect(qualityButton.getAttribute('aria-checked')).toBe('false');
    TestUtils.Simulate.click(qualityButton);
    expect(qualityButton.getAttribute('aria-checked')).toBe('true');
  });

  describe('keyboard navigation', function() {
    var qualityPanel, qualityButtons;

    var getMockKeydownEvent = function(target, key) {
      return {
        _type: 'keydown',
        target: target,
        key: key,
        preventDefault: function() {}
      };
    };

    beforeEach(function() {
      var DOM = TestUtils.renderIntoDocument(
        <VideoQualityPanel {...mockProps} />
      );
      qualityPanel = TestUtils.findRenderedDOMComponentWithClass(DOM, 'oo-quality-panel');
      qualityButtons = qualityPanel.querySelectorAll('[' + CONSTANTS.KEYBD_FOCUS_ID_ATTR + ']');
    });

    afterEach(function() {
      document.activeElement = null;
    });

    it('should focus on previous menu item when pressing UP or LEFT arrow keys', function() {
      var activeIndex = qualityButtons.length - 1;
      document.activeElement = qualityButtons[activeIndex];
      qualityPanel.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEY_VALUES.ARROW_UP));
      expect(document.activeElement).toBe(qualityButtons[activeIndex - 1]);
      qualityPanel.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEY_VALUES.ARROW_LEFT));
      expect(document.activeElement).toBe(qualityButtons[activeIndex - 2]);
    });

    it('should focus on next menu item when pressing DOWN or RIGHT arrow keys', function() {
      var activeIndex = 0;
      document.activeElement = qualityButtons[activeIndex];
      qualityPanel.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEY_VALUES.ARROW_DOWN));
      expect(document.activeElement).toBe(qualityButtons[activeIndex + 1]);
      qualityPanel.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEY_VALUES.ARROW_RIGHT));
      expect(document.activeElement).toBe(qualityButtons[activeIndex + 2]);
    });

    it('should loop focus when navigating with arrow keys', function() {
      document.activeElement = qualityButtons[0];
      qualityPanel.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEY_VALUES.ARROW_UP));
      expect(document.activeElement).toBe(qualityButtons[qualityButtons.length - 1]);
      qualityPanel.dispatchEvent(getMockKeydownEvent(document.activeElement, CONSTANTS.KEY_VALUES.ARROW_RIGHT));
      expect(document.activeElement).toBe(qualityButtons[0]);
    });

  });

});
