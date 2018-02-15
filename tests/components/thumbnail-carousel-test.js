jest.dontMock('../../js/components/thumbnailCarousel')
  .dontMock('../../js/components/thumbnail')
  .dontMock('../../js/components/utils');

var React = require('react');
var TestUtils = require('react-addons-test-utils');
var ReactDOM = require('react-dom');
var ThumbnailCarousel = require('../../js/components/thumbnailCarousel');

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
         120
        ],
      "thumbnails":{
        "0":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_000.jpg",
               "width":120,
               "height":80
            }
         },
         "10":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_010.jpg",
               "width":120,
               "height":80
            }
         },
         "20":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_020.jpg",
               "width":120,
               "height":80
            }
         },
         "30":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_030.jpg",
               "width":120,
               "height":80
            }
         },
         "40":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_040.jpg",
               "width":120,
               "height":80
            }
         },
         "50":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_050.jpg",
               "width":120,
               "height":80
            }
         },
         "60":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_060.jpg",
               "width":120,
               "height":80
            }
         },
         "70":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_070.jpg",
               "width":120,
               "height":80
            }
         },
         "80":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_080.jpg",
               "width":120,
               "height":80
            }
         },
         "90":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_090.jpg",
               "width":120,
               "height":80
            }
         },
         "100":{
            "120":{
               "url":"http://media.video-cdn.espn.com/motion/Miercoles_100.jpg",
               "width":120,
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
  var centralThumbnail = {
    imageHeight: 120,
    imageWidth: 80,
    pos: 1,
    url: "http://media.video-cdn.espn.com/motion/Miercoles_100.jpg"
  };

  it('creates a ThumbnailCarousel at 50 sec', function () {
    var hoverTime = 50; // should find thumbnails that correspond to time slice of 50 as there is a time slice for the value of 50
    var width = thumbnails.data.available_widths[0];
    var onRef = function() {};
    var thumbnailStyle = {
      left: 23,
      backgroundImage: "url('http://media.video-cdn.espn.com/motion/Miercoles_050.jpg')",
      backgroundSize: "120px 80px",
      backgroundPosition: "0px 0px"
    };
    var DOM = TestUtils.renderIntoDocument(
      <ThumbnailCarousel
        onRef={onRef}
        duration={100}
        hoverTime={hoverTime}
        scrubberBarWidth={200}
        carouselWidth="154"
        carouselHeight="102"
        thumbnailWidth="93"
        thumbnailHeight="63"
        centralThumbnail={centralThumbnail}
        thumbnailStyle={thumbnailStyle}
        thumbnails={thumbnails}/>
    );
    var centerImage = ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image'];
    centerImage = centerImage.slice(centerImage.indexOf("url(") + 4, -1);
    expect(centerImage).toBe(thumbnails.data.thumbnails[hoverTime][width]["url"]); //50 is present in the data, so hoverTime of 50 should find exact match
  });

  it('creates a ThumbnailCarousel at 45 sec', function () {
    var hoverTime = 45; // should find thumbnails that correspond to time slice of 40 as there is no exact time slice match for the value of 45
    var width = thumbnails.data.available_widths[0];
    var onRef = function() {};
    var thumbnailStyle = {
      left: 23,
      backgroundImage: "url('http://media.video-cdn.espn.com/motion/Miercoles_040.jpg')",
      backgroundSize: "120px 80px",
      backgroundPosition: "0px 0px"
    };
    var DOM = TestUtils.renderIntoDocument(
      <ThumbnailCarousel
        onRef={onRef}
        duration={100}
        hoverTime={hoverTime}
        scrubberBarWidth={200}
        carouselWidth="154"
        carouselHeight="102"
        thumbnailWidth="93"
        thumbnailHeight="63"
        centralThumbnail={centralThumbnail}
        thumbnailStyle={thumbnailStyle}
        thumbnails={thumbnails}/>
    );
    var centerImage = ReactDOM.findDOMNode(DOM.refs.thumbnail).style._values['background-image'];
    centerImage = centerImage.slice(centerImage.indexOf("url(") + 4, -1);
    expect(centerImage).toBe(thumbnails.data.thumbnails[hoverTime - 5][width]["url"]);//45 is not present in the data, so hoverTime of 45 should find previous value
  });
});