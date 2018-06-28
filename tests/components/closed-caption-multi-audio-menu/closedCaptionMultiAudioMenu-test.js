jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/tab');
jest.dontMock('../../../js/components/closed-caption-multi-audio-menu/helpers');
jest.dontMock('../../../js/components/utils');
jest.dontMock('../../../js/components/accessibleButton');
jest.dontMock('../../../js/components/higher-order/accessibleMenu');
jest.dontMock('../../../js/constants/languages');
jest.dontMock('underscore');

var React = require('react');
var Enzyme = require('enzyme');

var ClosedCaptionMultiAudioMenu = require('../../../js/components/closed-caption-multi-audio-menu/closedCaptionMultiAudioMenu');
var MultiAudioTab = require('../../../js/components/closed-caption-multi-audio-menu/multiAudioTab');
var Tab = require('../../../js/components/closed-caption-multi-audio-menu/tab');
var AccessibleButton = require('../../../js/components/accessibleButton');

describe('ClosedCaptionMultiAudioMenu component', function() {
  var selectedAudio = null;
  var selectedCaptionsId = null;
  var props = {};
  var wrapper;

  beforeEach(function() {
    props = {
      menuClassName: undefined,
      skinConfig: {},
      controller: {
        setCurrentAudio: function(track) {
          if (selectedAudio) {
            selectedAudio.enabled = false;
          }
          selectedAudio = track;
          selectedAudio.enabled = true;
        },
        onClosedCaptionChange: function(id) {
          selectedCaptionsId = id;
        },
        state: {
          closedCaptionOptions: {
            availableLanguages: {
              languages: ['en', 'de', 'fr']
            }
          },
          multiAudio: {
            tracks: [
              {
                enabled: true,
                label: '',
                lang: 'eng',
                id: '1'
              },
              {
                enabled: false,
                label: '',
                lang: 'deu',
                id: '2'
              }
            ]
          }
        }
      },
      language: 'sp',
      localizableStrings: {
        en: {
          Audio: 'MockTitleEn'
        },
        sp: {
          Audio: 'MockTitleSp'
        },
        ja: {
          Audio: 'MockTitleJa'
        }
      }
    };

    wrapper = Enzyme.mount(<ClosedCaptionMultiAudioMenu {...props} />);
  });

  afterEach(function() {
    selectedAudio = null;
    selectedCaptionsId = null;
    props = {};
    wrapper = null;
  });

  it('should be rendered', function() {
    var component = wrapper.find(ClosedCaptionMultiAudioMenu);
    expect(component).toBeTruthy();
  });

  it('should render MultiAudioTab component', function() {
    var component = wrapper.find(MultiAudioTab);

    expect(component).toBeTruthy();

    var tabComponent = wrapper.find(Tab);
    var accessibleButtonComponent = tabComponent.at(0).find(AccessibleButton).at(1);
    accessibleButtonComponent.simulate('click');

    expect(selectedAudio).toEqual({
      enabled: true,
      label: '',
      lang: 'deu',
      id: '2'
    });
  });

  it('should render MultiAudioTab component with translated title', function() {
    var component = wrapper.find(MultiAudioTab);

    expect(component).toBeTruthy();

    var tabComponent = wrapper.find(Tab);

    var header = tabComponent.at(0).find('.oo-cc-ma-menu__header').getDOMNode();
    expect(header.textContent).toEqual('MockTitleSp');
  });

  it('should also render Tab component when options are provided', function() {
    var tabComponent = wrapper.find(Tab);

    var items = tabComponent.at(1).find('.oo-cc-ma-menu__element');

    var amount = 3;
    expect(items.length).toBe(amount);
  });

  it('should not render neither tab not multiaudio when there\'s no data', function() {
    var emptyProps = {
      menuClassName: undefined,
      skinConfig: {},
      controller: {
        setCurrentAudio: function(audioTrack) {
          selectedAudio = audioTrack;
        },
        onClosedCaptionChange: function(id) {
          selectedCaptionsId = id;
        },
        state: {}
      }
    };

    var wrapper = Enzyme.mount(<ClosedCaptionMultiAudioMenu {...emptyProps} />);
    var components = wrapper.find(Tab);

    expect(components.length).toBe(0);
  });

  it('should not call any callbacks when handlers are not defined', function() {
    var emptyHandlers = {
      menuClassName: undefined,
      skinConfig: {},
      controller: {
        state: {
          closedCaptionOptions: {
            availableLanguages: {
              languages: ['en', 'fr']
            }
          }
        }
      }
    };

    var wrapper = Enzyme.mount(<ClosedCaptionMultiAudioMenu {...emptyHandlers} />);
    var component = wrapper.find(Tab);

    var items = component.find('.oo-cc-ma-menu__element');

    items.at(0).simulate('click');

    expect(selectedAudio).toEqual(null);
  });
});
