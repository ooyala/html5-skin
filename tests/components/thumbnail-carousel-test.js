jest.dontMock('../../js/components/thumbnailCarousel')
  .dontMock('../../js/components/thumbnail')
  .dontMock('../../js/components/utils');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var Thumbnail = require('../../js/components/thumbnail');
var ThumbnailCarousel = require('../../js/components/thumbnailCarousel');
var Utils = require('../../js/components/utils');

var testThumbnails = function(DOM, thumbnails, hoverTime) {
  var hoverPosition = -1;
  for (var i = 0; i < thumbnails.data.available_time_slices.length; i++) {
    if (thumbnails.data.available_time_slices[i] == hoverTime) {
      hoverPosition = i;
      break;
    } else if (thumbnails.data.available_time_slices[i] > hoverTime) {
      hoverPosition = i - 1;
      break;
    }
  }

  var imagesDiv = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'oo-thumbnail-carousel-center-image');
  var images = imagesDiv[0]._parentNode._childNodes;
  for (var i = 0; i < hoverPosition; i++) {
    var style = images[i]._style;
    if (typeof style == "string") {
      var offset = style.indexOf("url(") + 4;
      expect(style.slice(offset, -2)).toBe(thumbnails.data.thumbnails[thumbnails.data.available_time_slices[hoverPosition - i]]["120"]["url"]);
    }    
  }
  for (var i = hoverPosition + 1; i < images.length; i++) {
    var style = images[i]._style;
    if (typeof style == "string") {
      var offset = style.indexOf("url(") + 4;
      expect(style.slice(offset, -2)).toBe(thumbnails.data.thumbnails[thumbnails.data.available_time_slices[i - 2]]["120"]["url"]);
    }    
  }
}

describe('ThumbnailCarousel', function () {
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

  it('creates a ThumbnailCarousel at 50 sec', function () {
    var hoverTime = 50;
    var DOM = TestUtils.renderIntoDocument(
      <ThumbnailCarousel
        duration={100}
        hoverTime={hoverTime}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );
    var centerImage = ReactDOM.findDOMNode(DOM.refs.thumbnailCarousel).style._values['background-image'];
    centerImage = centerImage.slice(centerImage.indexOf("url(") + 4, -1);
    expect(centerImage).toBe(thumbnails.data.thumbnails["50"]["120"]["url"]);

    testThumbnails(DOM, thumbnails, hoverTime);
  });

  it('creates a ThumbnailCarousel at 45 sec', function () {
    var hoverTime = 45;
    var DOM = TestUtils.renderIntoDocument(
      <ThumbnailCarousel
        duration={100}
        hoverTime={hoverTime}
        scrubberBarWidth={100}
        thumbnails={thumbnails}/>
    );

    var centerImage = ReactDOM.findDOMNode(DOM.refs.thumbnailCarousel).style._values['background-image'];
    centerImage = centerImage.slice(centerImage.indexOf("url(") + 4, -1);
    expect(centerImage).toBe(thumbnails.data.thumbnails["40"]["120"]["url"]);

    testThumbnails(DOM, thumbnails, hoverTime);
  });
});