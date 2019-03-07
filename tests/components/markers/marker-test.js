jest
  .dontMock('../../../js/components/markers/marker')
  .dontMock('classnames');

import React from 'react';
import Enzyme from 'enzyme';
import Marker from '../../../js/components/markers/marker';

describe('Marker component', function () {

  let baseProps;

  function renderComponent() {
    return Enzyme.mount(<Marker {...baseProps}/>);
  };

  beforeEach(() => {
    baseProps = {
      duration: 0,
      scrubberBarWidth: 0,
      data: {},
      config: {},
      accentColor: ''
    };
  });

  it('Shouldn\'t render a marker when the type is not defined', function () {
    const marker = renderComponent();
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a marker when the type is \'text\' and the text property is empty', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = '';
    const marker = renderComponent();
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a marker when the type is \'text\' and the text property is not defined', function () {
    baseProps.data.type = 'text';
    const marker = renderComponent();
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a marker when the type is \'icon\' and the start property is not defined', function () {
    baseProps.data.type = 'icon';
    const marker = renderComponent();
    expect(marker.isEmptyRender()).toBeTruthy();
  });

  it('Should render a marker with the oo-marker class', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start = 60;
    const marker = renderComponent();
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
  });

  it('Should render a marker and update his position', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start = 60;
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const marker = renderComponent();
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.getDOMNode().style).toHaveProperty('left', '160px');

    marker.setProps({scrubberBarWidth:900});
    expect(marker.getDOMNode().style).toHaveProperty('left', '180px');
  });

  it('Shouldn\'t render again the marker when the props are the same', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start = 60;
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const marker = renderComponent();
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.getDOMNode().style).toHaveProperty('left', '160px');

    marker.setProps({scrubberBarWidth:800});
    expect(marker.getDOMNode().style).toHaveProperty('left', '160px');
  });

  it('Should render a marker with the accentcolor as background color', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start = 60;
    baseProps.accentColor = "#ffff";
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const marker = renderComponent();
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.find('div').prop('style')).toHaveProperty('backgroundColor', '#ffff');
  });

  it('Should render a marker with the custom background color ', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start = 60;
    baseProps.data.marker_color = '#0000';
    baseProps.accentColor = "#ffff";
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const marker = renderComponent();
    expect(marker.find('div').hasClass('oo-marker')).toBeTruthy();
    expect(marker.find('div').prop('style')).toHaveProperty('backgroundColor', '#0000');
  });

});