jest
  .dontMock('../../../js/components/markers/markerIcon')
  .dontMock('classnames');

import React from 'react';
import Enzyme from 'enzyme';
import MarkerIcon from '../../../js/components/markers/markerIcon';

describe('MarkerIcon component', function () {
  let baseProps;

  function renderComponent() {
    return Enzyme.mount(<MarkerIcon {...baseProps}/>);
  };

  beforeEach(() => {
    baseProps = {
      duration: 10,
      scrubberBarWidth: 0,
      data: {},
      config: {},
      accentColor: '',
      controller: {
        seek: () => {},
        state: {
          isMobile: false
        }
      },
      level: 0
    };
  });

  it('Shouldn\'t render a markerIcon', function () {
    const markerIcon = renderComponent();
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a markerIcon of type: text if there is no text property available', function () {
    baseProps.data.type = 'text';
    const markerIcon = renderComponent();
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a markerIcon if the type is missing', function () {
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    baseProps.data.start = 60;
    const markerIcon = renderComponent();
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a markerIcon of type: icon if there is no icon_url property available', function () {
    baseProps.data.type = 'icon';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Should render a markerIcon', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
  });

  it('Should render a markerIcon wtih a custom background color', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.background_color = '#ffff';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('backgroundColor', '#ffff');
  });

  it('Should render a markerIcon wtih a default background color (accentColor)', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.accentColor = '#0000';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('backgroundColor', '#0000');
  });

  it('Should render a markerIcon wtih a global background color (skin.json)', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.config = {
      background_color: '#d60000'
    };
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('backgroundColor', '#d60000');
  });

  it('Should render a markerIcon with a position fixed by type', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start= 60;
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 125);

    markerIcon.setProps({
      data: {
        type: 'icon',
        start: 60,
        icon_url: 'www.mysite.com/images/icon.png'
      }
    });

    markerIcon.unmount().mount();

    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 144);
  });

  it('Should render a markerIcon with a truncated text', function () {
    const truncatedText = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat vitae repudi ...';
    baseProps.data.type = 'text';
    baseProps.data.text = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat vitae repudiandae provident deleniti.';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text p').text()).toBe(truncatedText);
  });

  it('Should render a markerIcon wtih an icon image', function () {
    baseProps.data.type = 'icon';
    baseProps.data.icon_url = 'test.jpg';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-icon img').length).toBe(1);    
  });

  it('Should render a markerIcon wtih an icon image and a cover image', function () {
    baseProps.data.type = 'icon';
    baseProps.data.icon_url = 'test.jpg';
    baseProps.data.image_url = 'cover.jpg';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-icon img').length).toBe(2);
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-icon img').at(1).hasClass('oo-hidden')).toBe(true);
  });

  it('Should render a markerIcon (text), hover it will show more information and restore it on mouse leave', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);    
    
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseleave');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(false);
  });

  it('Should render a markerIcon (text), hover it will show more information and custom background color', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.hover_color = '#ff0000';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').prop('style')).toHaveProperty('backgroundColor', '#ff0000');
  });

  it('Should render a markerIcon (text), hover it and click to seek to the marker start', function () {
    let seeked = false;
    let seekTime = 0;
    baseProps.controller.seek = (time) => {
      seeked = true;
      seekTime = time;
    };
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);    
    
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(seeked).toBe(true);
    expect(seekTime).toBe(markerIcon.props().data.start);    
  });

  it('Should render a markerIcon (text), on mobile browsers it will not react to hover event', function () {
    baseProps.controller.state.isMobile = true;
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(false);       
  });

  it('Should render a markerIcon (text), on mobile browsers it will react to click event and expand it', function () {
    baseProps.controller.state.isMobile = true;
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);       
  });


  it('Should render a markerIcon (text), on mobile browsers it will react to second click and perform the seek action', function () {
    baseProps.controller.state.isMobile = true;
    let seeked = false;
    let seekTime = 0;
    baseProps.controller.seek = (time) => {
      seeked = true;
      seekTime = time;
    };
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);

    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(seeked).toBe(true);
    expect(seekTime).toBe(markerIcon.props().data.start);
  });

  it('Should render a markerIcon and update the position on resize', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start= 60;
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 125);

    markerIcon.setProps({duration: 350});
    let newLeft = markerIcon.find('div.oo-marker-bubble').prop('style').left;
    expect(newLeft).toBeCloseTo(102.14);

    markerIcon.setProps({scrubberBarWidth: 900});
    newLeft = markerIcon.find('div.oo-marker-bubble').prop('style').left;
    expect(newLeft).toBeCloseTo(119.285);
  });

  it('Should render a markerIcon with a position fixed by type (hover)', function () {
    baseProps.data.type = 'text';
    baseProps.data.text = 'test';
    baseProps.data.start= 60;
    baseProps.duration = 300;
    baseProps.scrubberBarWidth = 800;
    const markerIcon = renderComponent();
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 90);

    markerIcon.setProps({
      data: {
        type: 'icon',
        start: 60,
        icon_url: 'www.mysite.com/images/icon.png',
        image_url: 'www.mysite.com/images/cover.png'
      }
    });

    markerIcon.unmount().mount();
    markerIcon.find('div.oo-marker-bubble.oo-marker-icon').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 90);
  });


});

