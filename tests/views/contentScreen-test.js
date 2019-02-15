jest.dontMock('../../js/views/contentScreen');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/constants/constants');
jest.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var ContentScreen = require('../../js/views/contentScreen');
var AccessibleButton = require('../../js/components/accessibleButton');
var CONSTANTS = require('../../js/constants/constants');

describe('ContentScreen', function() {
  let props;

  beforeEach(function() {
    props = {
      controller: {
        toggleScreen: function() {},
        toggleDiscoveryScreen: function() {},
        state: {
          accessibilityControlsEnabled: true
        }
      },
      skinConfig: {
        discoveryScreen: {
          panelTitle: {
            titleFont: {
              color: 'red',
              fontFamily: 'Arial',
            },
          },
        },
      },
    };
  });

  it('test content screen', function() {

    // Render content screen into DOM
    var wrapper = Enzyme.mount(<ContentScreen {...props} />);

    // test close btn
    var closeBtn = wrapper.find('.oo-close-button').hostNodes();
    closeBtn.simulate('click');
  });

  it('test content screen for Discovery Screen', function() {

    // Render content screen into DOM
    var wrapper = Enzyme.mount(<ContentScreen {...props} screen={CONSTANTS.SCREEN.DISCOVERY_SCREEN} />);

    // test close btn
    var closeBtn = wrapper.find('.oo-close-button').hostNodes();
    closeBtn.simulate('click');
  });

  it('should toggle screen when ESC key is pressed', function() {
    var toggleScreenCalled = false;
    props.controller.toggleScreen = function() {
      toggleScreenCalled = true;
    };
    var wrapper = Enzyme.mount(<ContentScreen {...props} />);
    wrapper.simulate('keyDown', { key: CONSTANTS.KEY_VALUES.ESCAPE });
    expect(toggleScreenCalled).toBe(true);
  });

  it('should auto focus on first accessible element when specified', function() {
    var wrapper = Enzyme.mount(
      <ContentScreen autoFocus={true} {...props}>
        <AccessibleButton ariaLabel="fancy"></AccessibleButton>
        <AccessibleButton ariaLabel="pants"></AccessibleButton>
      </ContentScreen>
    );
    var focusableElements = wrapper.find(AccessibleButton);
    expect(document.activeElement).toBe(focusableElements.at(0).getDOMNode());
  });

});
