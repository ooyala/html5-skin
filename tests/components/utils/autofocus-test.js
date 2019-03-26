jest.dontMock('../../../js/components/utils/autofocus');

const Autofocus = require('../../../js/components/utils/autofocus');

describe('Autofocus', () => {

  let autofocus, controllerMock, popoverObj;
  beforeEach(() => {
    popoverObj = { 'test': true, wasTriggeredWithKeyboard: jest.fn() };
    controllerMock = {
      toggleButtons: {
        popover: popoverObj,
        test: false,
      },
      state: {
        showPopoverOptions: {
          showPopover: true,
          autoFocus: true,
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
    autofocus.setToggleButtons('test', true);
    expect(controllerMock.toggleButtons.test).toBe(true);
  });

  it('tests function configureMenuAutofocus: should call wasTriggeredWithKeyboard or set autoFocus to false', () => {
    autofocus.configureMenuAutofocus('showPopoverOptions');
    expect(controllerMock.state.showPopoverOptions.autoFocus).toBe(false);
    autofocus.configureMenuAutofocus('popover');
    expect(popoverObj.wasTriggeredWithKeyboard).toHaveBeenCalled();
  });

});