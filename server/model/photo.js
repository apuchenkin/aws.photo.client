'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var path = require('path');
var fs = require('fs');
var gm = require('gm');

module.exports = (function () {
  var Photo = Backbone.Model.extend({
    urlRoot: '/photos',
    defaults: {
      "views":  0
    },
    parse: function (data) {
      var me = this;
      var gutter = 5;
      var s = 75;
      var vs = (s * 2) + gutter;
      var hs = (s * 3) + (gutter * 2);
      var k = Math.floor((Math.random() * 4) + 1); //todo: count

      if (data.name) {
        me.set('src', '/images/gallery/' + data.name);
        var thumb = gm('../app/images/min/' + data.name);
        thumb.size(function(err, value) {
          thumb.gravity('center');
          var width, height;

          switch(k) {
            case 4:
              var crop = (value.width > value.height)
                  ? [hs, vs, 0,0]
                  : [vs, hs, 0,0]
                ;
              width = crop[1];
              height = crop[2];
              thumb.resize(hs, hs);
              thumb.crop.apply(thumb, crop);
              break;
            case 3:
              thumb.resize(vs, vs, '^');
              thumb.crop(vs, vs, 0, 0);
              width = vs;
              height = vs;
              break;
            case 2:
              var crop = (value.width > value.height)
                  ? [vs, s, 0,0]
                  : [s, vs, 0,0]
                ;
              width = crop[1];
              height = crop[2];
              thumb.resize(vs, vs);
              thumb.crop.apply(thumb, crop);
              //code block
              break;
            default:
              thumb.resize(s, s, '^');
              thumb.crop(s, s, 0, 0);
              width = s;
              height = s;
          }

          me.set('width', width);
          me.set('height', height);

          var name = '../app/images/thumb/' + data.name;
          thumb.interlace('Line');
          thumb.write(name, function (err, buffer) {
            //var data_uri_prefix = "data:image/png;base64,";
            //var image = buffer.toString('base64');
            //me.set('thumb', data_uri_prefix + image);
            me.set('thumb', '/images/thumb/' + data.name);
          });
        });
      }

      return data;
    }
  });

  Photo.prototype.sync = require('backbone-orm').sync(Photo);
  return Photo;
}());
