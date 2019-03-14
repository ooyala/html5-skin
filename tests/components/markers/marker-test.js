jest
  .dontMock('../../../js/components/markers/marker')
  .dontMock('classnames');

import React from 'react';
import Enzyme from 'enzyme';
import Marker from '../../../js/components/markers/marker';
import _ from 'underscore';
import sinon from 'sinon';

describe('Marker component', function () {

  const baseProps = {
    duration: 0,
    scrubberBarWidth: 0,
    data: {},
    config: {},
    accentColor: ''
  };

  function renderComponent(props) {
    return Enzyme.mount(<Marker {...props}/>);
  };

  it('Shouldn\'t render a marker when the type is not defined', function () {
    const marker = renderComponent(baseProps);
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a marker when the type is \'text\' and the text property is empty', function () {
    const data = {
      type: 'text',
      text: ''
    };
    const props = _.extend({}, baseProps, {data: data});
    const marker = renderComponent(props);
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a marker when the type is \'text\' and the text property is not defined', function () {
    const data = {
      type: 'text'
    };
    const props = _.extend({}, baseProps, {data: data});
    const marker = renderComponent(props);
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a marker when the type is \'icon\' and the start property is not defined', function () {
    const data = {
      type: 'icon'
    };
    const props = _.extend({}, baseProps, {data: data});
    const marker = renderComponent(props);
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Should render a marker with the oo-marker class', function () {
    const data = {
      type: 'text',
      text: 'test',
      start: 60
    };
    const props = _.extend({}, baseProps, {data: data});
    const marker = renderComponent(props);
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
  });

  it('Should render a marker and update his position', function () {
    const data = {
      type: 'text',
      text: 'test',
      start: 60
    };
    const props = _.extend({}, baseProps, {data: data, scrubberBarWidth: 800, duration: 300});
    const marker = renderComponent(props);
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.getDOMNode().style).toHaveProperty('left', '160px');

    marker.setProps({scrubberBarWidth:900});
    expect(marker.getDOMNode().style).toHaveProperty('left', '180px');
  });

  it('Should render a marker with the accentcolor as background color', function () {
    const data = {
      type: 'text',
      text: 'test',
      start: 60
    };
    const props = _.extend({}, baseProps,
      {
        data: data,
        scrubberBarWidth: 800,
        duration: 300,
        accentColor: '#ffff'
      });
    const marker = renderComponent(props);
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.find('div').prop('style')).toHaveProperty('backgroundColor', '#ffff');
  });

  it('Should render a marker with the custom background color ', function () {
    const data = {
      type: 'text',
      text: 'test',
      start: 60,
      markerColor: '#0000'
    };
    const props = _.extend({}, baseProps,
      {
        data: data,
        scrubberBarWidth: 800,
        duration: 300
      });
    const marker = renderComponent(props);
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.find('div').prop('style')).toHaveProperty('backgroundColor', '#0000');
  });

});