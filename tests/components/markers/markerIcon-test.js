jest
  .dontMock('../../../js/components/markers/markerIcon')
  .dontMock('classnames');

import React from 'react';
import Enzyme from 'enzyme';
import MarkerIcon from '../../../js/components/markers/markerIcon';
import _ from 'underscore';

describe('MarkerIcon component', function () {
  const baseProps = {
    duration: 0,
    scrubberBarWidth: 0,
    data: {},
    config: {},
    accentColor: '',
    controller: {
      seek: () => { },
      state: {
        isMobile: false
      }
    },
    level: 0
  };

  function renderComponent(props) {
    return Enzyme.mount(<MarkerIcon {...props}/>);
  };

  it('Shouldn\'t render a markerIcon when there is no information about type, start, scrubberBarWidth or duration', function () {
    const markerIcon = renderComponent(baseProps);
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a markerIcon of type: text if there is no text property available', function () {
    const data = {
      type: 'text'
    }
    const props = _.extend({}, baseProps, {data: data});
    const markerIcon = renderComponent(props);
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a markerIcon if the type is missing', function () {
    const data = {
      start: 60
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Shouldn\'t render a markerIcon of type: icon if there is no iconUrl property available', function () {
    const data = {
      type: 'icon'
    }
    const props = _.extend({}, baseProps, {data: data, duration: 300, scrubberBarWidth: 800});
    const markerIcon = renderComponent(props);
    expect(markerIcon.isEmptyRender()).toBeTruthy();
  });

  it('Should render a markerIcon', function () {
    const data = {
      type: 'text',
      text: 'test'
    }
    const props = _.extend({}, baseProps, {data: data, duration: 300, scrubberBarWidth: 800});
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
  });

  it('Should render a markerIcon wtih a custom background color', function () {
    const data = {
      type: 'text',
      text: 'test',
      backgroundColor: "#ffff"
    }
    const props = _.extend({}, baseProps, {data: data, duration: 300, scrubberBarWidth: 800});
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('backgroundColor', '#ffff');
  });

  it('Should render a markerIcon with a default background color (accentColor)', function () {
    const data = {
      type: 'text',
      text: 'test'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800,
        accentColor: '#0000'
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('backgroundColor', '#0000');
  });

  it('Should render a markerIcon wtih a global background color (skin.json)', function () {
    const data = {
      type: 'text',
      text: 'test'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800,
        config: {
          backgroundColor: '#d60000'
        }
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('backgroundColor', '#d60000');
  });

  it('Should render a markerIcon with a position fixed by type', function () {
    const data = {
      type: 'text',
      text: 'test',
      start: 60
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 125);

    markerIcon.setProps({
      data: {
        type: 'icon',
        start: 60,
        iconUrl: 'www.mysite.com/images/icon.png'
      }
    });

    markerIcon.unmount().mount();

    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 144);
  });

  it('Should render a markerIcon with a truncated text', function () {
    const truncatedText = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat vitae repudi ...';
    const data = {
      type: 'text',
      text: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat vitae repudiandae provident deleniti.'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text p').text()).toBe(truncatedText);
  });

  it('Should render a markerIcon wtih an icon image', function () {
    const data = {
      type: 'icon',
      iconUrl: 'test.jpg'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-icon img').length).toBe(1);    
  });

  it('Should render a markerIcon wtih an icon image and a cover image', function () {
    const data = {
      type: 'icon',
      iconUrl: 'test.jpg',
      imageUrl: 'cover.jpg'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-icon img').length).toBe(2);
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-icon img').at(1).hasClass('oo-hidden')).toBe(true);
  });

  it('Should render a markerIcon (text), hover it will show more information and restore it on mouse leave', function () {
    const data = {
      type: 'text',
      text: 'test'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);    
    
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseleave');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(false);
  });

  it('Should render a markerIcon (text), hover it will show more information and custom background color', function () {
    const data = {
      type: 'text',
      text: 'test',
      hoverColor: '#ff0000'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').prop('style')).toHaveProperty('backgroundColor', '#ff0000');
  });

  it('Should render a markerIcon (text), hover it and click to seek to the marker start', function () {
    let seeked = false;
    let seekTime = 0;
    let playheadUpdated = false;
    const controller = {
      seek : (time) => {
        seeked = true;
        seekTime = time;
      },
      updateSeekingPlayhead: () => {
        playheadUpdated = true;
      },
      state: {
        isMobile: false
      }
    }

    const data = {
      type: 'text',
      text: 'test'
    }

    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800,
        controller: controller
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);    
    
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(seeked).toBe(true);
    expect(seekTime).toBe(markerIcon.props().data.start);
    expect(playheadUpdated).toBe(true);  
  });

  it('Should render a markerIcon (text), on mobile browsers it will not react to hover event', function () {
    const controller = {
      state: {
        isMobile: true
      }
    }

    const data = {
      type: 'text',
      text: 'test'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800,
        controller: controller
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(false);       
  });

  it('Should render a markerIcon (text), on mobile browsers it will react to click event and expand it', function () {
    const controller = {
      state: {
        isMobile: true
      }
    }

    const data = {
      type: 'text',
      text: 'test'
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800,
        controller: controller
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);       
  });


  it('Should render a markerIcon (text), on mobile browsers it will react to second click and perform the seek action', function () {
    let seeked = false;
    let seekTime = 0;
    let playheadUpdated = false;
    const controller = {
      seek : (time) => {
        seeked = true;
        seekTime = time;
      },
      updateSeekingPlayhead: () => {
        playheadUpdated = true;
      },
      state: {
        isMobile: true
      }
    }

    const data = {
      type: 'text',
      text: 'test'
    }

    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800,
        controller: controller
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(markerIcon.find('div.oo-marker-bubble.oo-marker-text').hasClass('oo-marker-expanded')).toBe(true);

    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('click');
    expect(seeked).toBe(true);
    expect(seekTime).toBe(markerIcon.props().data.start);
    expect(playheadUpdated).toBe(true);
  });

  it('Should render a markerIcon and update the position on resize', function () {
    const data = {
      type: 'text',
      text: 'test',
      start: 60
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
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
    const data = {
      type: 'text',
      text: 'test',
      start: 60
    }
    const props = _.extend({}, baseProps,
      {
        data: data,
        duration: 300,
        scrubberBarWidth: 800
      });
    const markerIcon = renderComponent(props);
    expect(markerIcon.exists('div.oo-marker-bubble')).toBeTruthy();
    markerIcon.find('div.oo-marker-bubble.oo-marker-text').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 90);

    markerIcon.setProps({
      data: {
        type: 'icon',
        start: 60,
        iconUrl: 'www.mysite.com/images/icon.png',
        imageUrl: 'www.mysite.com/images/cover.png'
      }
    });

    markerIcon.unmount().mount();
    markerIcon.find('div.oo-marker-bubble.oo-marker-icon').simulate('mouseenter');
    expect(markerIcon.find('div.oo-marker-bubble').prop('style')).toHaveProperty('left', 110);
  });


});

