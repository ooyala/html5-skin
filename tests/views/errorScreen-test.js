jest.dontMock('../../js/views/errorScreen');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/constants/constants');
jest.dontMock('../../js/mixins/accessibilityMixin');
jest.dontMock('../../js/constants/constants');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ErrorScreen = require('../../js/views/errorScreen');

describe('ErrorScreen', function() {
  /**
   * render ErrorScreen and return elements
   * @description renders ErrorScreen in DOM and returns title and description elements
   * @param {*} props - props to render the component with
   * @returns {{titleElement: Element, descriptionElement: Element}} - elements
   */
  function renderComponentAndFind(props) {
    var component = TestUtils.renderIntoDocument(<ErrorScreen {...props} />);
    var titleElement = TestUtils.findRenderedDOMComponentWithClass(component, 'oo-error-title');
    var descriptionElement = TestUtils.findRenderedDOMComponentWithClass(component, 'oo-error-description');
    var actionElement = TestUtils.findRenderedDOMComponentWithClass(component, 'oo-error-action');

    return {
      titleElement: titleElement,
      descriptionElement: descriptionElement,
      actionElement: actionElement
    };
  }

  it('test error screen with valid error code', function() {
    var errorCode = {
      code: 'network'
    };
    // Render error screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ErrorScreen errorCode={errorCode} />);
  });

  it('test error screen with invalid error code', function() {
    var errorCode = {
      code: '404'
    };
    // Render error screen into DOM
    var DOM = TestUtils.renderIntoDocument(<ErrorScreen errorCode={errorCode} />);
  });

  describe('when passing error codes into the component', function() {
    describe('and error code is drm_server_error', function() {
      var props = {
        errorCode: { code: 'drm_server_error' },
        language: 'en',
        localizableStrings: {
          en: {
            'DRM SERVER ERROR': 'DRM SERVER ERROR',
            'DRM server error': 'DRM server error'
          }
        }
      };

      var elements = renderComponentAndFind(props);

      it('should render correct title, description and action', function() {
        expect(elements.titleElement.textContent).toEqual('DRM SERVER ERROR');
        expect(elements.descriptionElement.textContent).toEqual('DRM server error');
      });
    });

    describe('and error code is non_registered_device', function() {
      var props = {
        errorCode: { code: 'non_registered_device' },
        language: 'en',
        localizableStrings: {
          en: {
            'AUTHORIZATION ERROR': 'AUTHORIZATION ERROR',
            // eslint-disable-next-line max-len
            'Unable to register this device to this account, as the maximum number of authorized devices has already been reached. Error Code 22':
              'Unable to register this device to this account, as the maximum' +
              ' number of authorized devices has already been reached. Error Code 22',
            'Please remove one of your authorized devices to enable this device.':
                'Please remove one of your authorized devices to enable this device.'
          }
        }
      };

      var elements = renderComponentAndFind(props);

      it('should render correct title, description and action', function() {
        expect(elements.titleElement.textContent).toEqual('AUTHORIZATION ERROR');
        // eslint-disable-next-line
        expect(elements.descriptionElement.textContent).toEqual('Unable to register this device to this account, as the maximum number of authorized devices has already been reached. Error Code 22');
        // eslint-disable-next-line
        expect(elements.actionElement.textContent).toEqual('Please remove one of your authorized devices to enable this device.');
      });
    });

    describe('and error code is device_limit_reached', function() {
      var props = {
        errorCode: { code: 'device_limit_reached' },
        language: 'en',
        localizableStrings: {
          en: {
            'AUTHORIZATION ERROR': 'AUTHORIZATION ERROR',
            // eslint-disable-next-line max-len
            'Unable to access this content, as the maximum number of devices has already been authorized. Error Code 29':
              'Unable to access this content, as the maximum number of devices' +
              ' has already been authorized. Error Code 29',
            'Please remove one of your authorized devices to enable this device.':
              'Please remove one of your authorized devices to enable this device.'
          }
        }
      };

      var elements = renderComponentAndFind(props);

      it('should render correct title, description and action', function() {
        expect(elements.titleElement.textContent).toEqual('AUTHORIZATION ERROR');
        // eslint-disable-next-line
        expect(elements.descriptionElement.textContent).toEqual('Unable to access this content, as the maximum number of devices has already been authorized. Error Code 29');
        // eslint-disable-next-line
        expect(elements.actionElement.textContent).toEqual('Please remove one of your authorized devices to enable this device.');
      });
    });
  });
});
