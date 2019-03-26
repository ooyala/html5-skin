jest.dontMock('../../../js/components/utils/autofocus');

const Autofocus = require('../../../js/components/utils/autofocus');
import React from 'react';

class Button extends React.Component {}

describe('Autofocus', () => {

  let autofocus, controllerMock, popoverObj;
  beforeEach(() => {
    popoverObj = { 'test': true, wasTriggeredWithKeyboard: jest.fn().mockReturnValue(true) };
    controllerMock = {
      toggleButtons: {
        popover: popoverObj,
        test: false,
      },
      state: {
        showPopoverOptions: {
          showPopover: true,
          autoFocus: true,
        },
        popover: {
          showPopover: false,
          autoFocus: false,
        }
      }
    };
    autofocus = new Autofocus(controllerMock.state, controllerMock.toggleButtons);
  });

  it('tests function getToggleButtons: should return correct value or empty object ', () => {
    const popover = autofocus.getToggleButtons('popover');
    const notPopover = autofocus.getToggleButtons('notPopover');
    expect(popover).toEqual(popoverObj);
    expect(notPopover).toEqual({});
  });

  it('tests function setToggleButtons: should set a value to menu', () => {
    autofocus.setToggleButtons('test', Button);
    expect(controllerMock.toggleButtons.test).toEqual(Button);
  });

  it('tests function configureMenuAutofocus: should set autoFocus to false if the event was not triggered with keyboard', () => {
    autofocus.configureMenuAutofocus('showPopoverOptions');
    expect(controllerMock.state.showPopoverOptions.autoFocus).toBe(false);
    autofocus.configureMenuAutofocus('popover');
    expect(controllerMock.state.popover.autoFocus).toBe(true);
  });

});