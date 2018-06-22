jest.dontMock('../../js/components/upNextPanel');
jest.dontMock('../../js/components/accessibleButton');
jest.dontMock('../../js/components/closeButton');
jest.dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var UpNextPanel = require('../../js/components/upNextPanel');
var skinConfig = require('../../config/skin.json');

describe('UpNextPanel', function() {
  var defaultSkinConfig = JSON.parse(JSON.stringify(skinConfig));
  it('tests up next panel', function() {
    var data = {'upNextData':{'provider_id':69468, 'name':'owl', 'description':'owl video', 'status':'live', 'size':742937, 'updated_at':'2015-11-03 18:13:34 +0000', 'created_at':'2015-05-19 20:56:21 +0000', 'processing_progress':1, 'preview':'1', 'content_type':'Video', 'language':'en', 'duration':6066, 'preview_image_url':'http://cf.c.ooyala.com/o2Ymc2dTpIcimIbgA4eI6oSWbrpyFPhA/promo256337880', 'preview_images':'<previewImage>\n<url>http://cf.c.ooyala.com/o2Ymc2dTpIcimIbgA4eI6oSWbrpyFPhA/promo256337880</url>\n<width>1</width>\n<height>1</height>\n</previewImage>' }};

    var mockController = {
      upNextDismissButtonClicked: function() {},
      sendDiscoveryClickEvent: function(a, b) {},
      state: {
        upNextInfo: {}
      }
    };

    // Render up next panel into DOM
    var wrapper = Enzyme.mount(<UpNextPanel upNextInfo={data} controller={mockController} skinConfig={defaultSkinConfig}/>);

    // test up next content link
    var upNextContent = wrapper.find('.oo-up-next-content').hostNodes();
    upNextContent.simulate('click');

    // test close btn
    var closeBtn = wrapper.find('.oo-up-next-close-btn').hostNodes();
    closeBtn.simulate('click');
  });
});
