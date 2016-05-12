jest.dontMock('../../js/components/thumbnail');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var Thumbnail = require('../../js/components/thumbnail');

describe('Thumbnail', function () {
  var thumbnails = {
    "data":{
      "available_time_slices":[
         0,
         10,
         20,
         30,
         40,
         50,
         60,
         70,
         80,
         90,
         100
      ],
      "available_widths":[
         120,
         240
        ],
      "thumbnails":{
        "0":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_1.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_1.jpg",
               "width":240,
               "height":80
            }
         },
         "10":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_2.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_2.jpg",
               "width":240,
               "height":80
            }
         },
         "20":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_3.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_3.jpg",
               "width":240,
               "height":80
            }
         },
         "30":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_4.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_4.jpg",
               "width":240,
               "height":80
            }
         },
         "40":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_5.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_5.jpg",
               "width":240,
               "height":80
            }
         },
         "50":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_6.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_6.jpg",
               "width":240,
               "height":80
            }
         },
         "60":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_7.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_7.jpg",
               "width":240,
               "height":80
            }
         },
         "70":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_8.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_8.jpg",
               "width":240,
               "height":80
            }
         },
         "80":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_9.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_9.jpg",
               "width":240,
               "height":80
            }
         },
         "90":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_10.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_10.jpg",
               "width":240,
               "height":80
            }
         },
         "100":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_11.jpg",
               "width":120,
               "height":80
            },
            "240":{
               "url":"http://media.video-cdn.espn.com/motion/2016/0504/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles/chaptertn/Hu_160504_Deportes_Pura_Quimica_MiltonCenter_Miercoles_11.jpg",
               "width":240,
               "height":80
            }
         }
      },
      "errors":[
        {
         "status":404,
         "code":"Not Found",
         "title":"unable to find thumbnail images",
         "detail":"embed code not found"
        }
      ]
    }
  };
  it('creates a Thumbnail at 5 sec', function () {
    var DOM = TestUtils.renderIntoDocument(
      <Thumbnail
        hoverPosition={5}
        duration={100}
        hoverTime={5}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );
    var thumbnail = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-thumbnail');
    var thumbnailTime = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-thumbnail-time');
    expect(ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image']).toBe("url("+thumbnails["data"]["thumbnails"]["0"]["120"]["url"]+")");
    expect(thumbnail.length).toBe(1);
    expect(thumbnailTime.length).toBe(1);
  });

  it('creates a Thumbnail at 15 sec', function () {
    var DOM = TestUtils.renderIntoDocument(
      <Thumbnail
        hoverPosition={15}
        duration={100}
        hoverTime={15}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );
    expect(ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image']).toBe("url("+thumbnails["data"]["thumbnails"]["10"]["120"]["url"]+")");
  });

  it('creates a Thumbnail at 25 sec', function () {
    var DOM = TestUtils.renderIntoDocument(
      <Thumbnail
        hoverPosition={250}
        duration={100}
        hoverTime={25}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );
    expect(ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image']).toBe("url("+thumbnails["data"]["thumbnails"]["20"]["120"]["url"]+")");
  });

  it('creates a Thumbnail at 0 sec', function () {
    var DOM = TestUtils.renderIntoDocument(
      <Thumbnail
        hoverPosition={0}
        duration={100}
        hoverTime={0}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );
    expect(ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image']).toBe("url("+thumbnails["data"]["thumbnails"]["0"]["120"]["url"]+")");
  });

  it('creates a Thumbnail at 100 sec', function () {
    var DOM = TestUtils.renderIntoDocument(
      <Thumbnail
        hoverPosition={100}
        duration={100}
        hoverTime={100}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );
    expect(ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image']).toBe("url("+thumbnails["data"]["thumbnails"]["90"]["120"]["url"]+")");
  });

  it('creates a Thumbnail at 500 sec', function () {
    var DOM = TestUtils.renderIntoDocument(
      <Thumbnail
        hoverPosition={500}
        duration={100}
        hoverTime={50}
        scrubberBarWidth={1000}
        thumbnails={thumbnails}/>
    );
    expect(ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image']).toBe("url("+thumbnails["data"]["thumbnails"]["40"]["120"]["url"]+")");
  });
});