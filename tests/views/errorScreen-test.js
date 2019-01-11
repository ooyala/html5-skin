jest.dontMock('../../js/views/errorScreen');
jest.dontMock('../../js/components/utils');
jest.dontMock('../../js/constants/constants');

var React = require('react');
var Enzyme = require('enzyme');
var ErrorScreen = require('../../js/views/errorScreen');

describe('ErrorScreen', function() {
  it('test error screen with valid error code', function() {
    const props = { controller: { state: { accessibilityControlsEnabled: true } }, errorCode: { code: 'network' } };
    // Just check it mounts with no exceptions
    Enzyme.mount(<ErrorScreen {...props} />);
  });

  it('test error screen with invalid error code', function() {
    const props = { controller: { state: { accessibilityControlsEnabled: true } }, errorCode: { code: '404' } };
    // Just check it mounts with no exceptions
    Enzyme.mount(<ErrorScreen {...props} />);
  });

  describe('when passing error codes into the component', function() {
    describe('and error code is drm_server_error', function() {
      var props = {
        controller: { state: {
          accessibilityControlsEnabled: true,
        } },
        errorCode: { code: 'drm_server_error' },
        language: 'en',
        localizableStrings: {
          en: {
            'DRM SERVER ERROR': 'DRM SERVER ERROR',
            'DRM server error': 'DRM server error'
          }
        }
      };

      var wrapper = Enzyme.mount(<ErrorScreen {...props}/>);
      var titleElement = wrapper.find('.oo-error-title').hostNodes().getDOMNode();
      var descriptionElement = wrapper.find('.oo-error-description').hostNodes().getDOMNode();
      var actionElement = wrapper.find('.oo-error-action').hostNodes().getDOMNode();

      it('should render correct title, description and action', function() {
        expect(titleElement.textContent).toEqual('DRM SERVER ERROR');
        expect(descriptionElement.textContent).toEqual('DRM server error');
      });
    });

    describe('and error code is non_registered_device', function() {
      var props = {
        controller: { state: { accessibilityControlsEnabled: true } },
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

      var wrapper = Enzyme.mount(<ErrorScreen {...props}/>);
      var titleElement = wrapper.find('.oo-error-title').hostNodes().getDOMNode();
      var descriptionElement = wrapper.find('.oo-error-description').hostNodes().getDOMNode();
      var actionElement = wrapper.find('.oo-error-action').hostNodes().getDOMNode();

      it('should render correct title, description and action', function() {
        expect(titleElement.textContent).toEqual('AUTHORIZATION ERROR');
        // eslint-disable-next-line
        expect(descriptionElement.textContent).toEqual('Unable to register this device to this account, as the maximum number of authorized devices has already been reached. Error Code 22');
        // eslint-disable-next-line
        expect(actionElement.textContent).toEqual('Please remove one of your authorized devices to enable this device.');
      });
    });

    describe('and error code is device_limit_reached', function() {
      var props = {
        controller: { state: { accessibilityControlsEnabled: true } },
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

      var wrapper = Enzyme.mount(<ErrorScreen {...props}/>);
      var titleElement = wrapper.find('.oo-error-title').hostNodes().getDOMNode();
      var descriptionElement = wrapper.find('.oo-error-description').hostNodes().getDOMNode();
      var actionElement = wrapper.find('.oo-error-action').hostNodes().getDOMNode();

      it('should render correct title, description and action', function() {
        expect(titleElement.textContent).toEqual('AUTHORIZATION ERROR');
        // eslint-disable-next-line
        expect(descriptionElement.textContent).toEqual('Unable to access this content, as the maximum number of devices has already been authorized. Error Code 29');
        // eslint-disable-next-line
        expect(actionElement.textContent).toEqual('Please remove one of your authorized devices to enable this device.');
      });
    });
  });
});
