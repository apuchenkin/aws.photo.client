'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.images', ['aws.model.photo', '$timeout', function (Photo, $timeout) {
    var me = this;

    me.bricks = [];
    me.gutter = 5;
    var s = me.size = 75;
    var s2 = (s * 2) + me.gutter;
    var s3 = (s * 3) + (me.gutter * 2);

    var getBrick = function (photo) {
      var k = Math.floor((Math.random() * 4) + 1),
          isHorisontal = (photo.width > photo.height),
          dims
      ;

      switch (k) {
        case 4:   dims = isHorisontal ? [s3, s2] : [s2, s3]; break;
        case 3:   dims = [s2, s2]; break;
        case 2:   dims = isHorisontal ? [s2, s] : [s, s2]; break;
        default:  dims = [s, s]; break;
      }

      return {
        width: dims[0],
        height: dims[1],
        src: 'http://localhost:3000/' + photo.thumb,
        style: {
          width:  dims[0],
          height: dims[1],
          "background-image": "url(http://localhost:3000/" + photo.thumb + ")",
          "margin-bottom": me.gutter
        }
      }
    };

    me.photos = Photo.$collection();
    me.photos.$refresh();
    me.photos.$then(function (photos) {
      var bricks = photos.map(getBrick);
      angular.extend(me.bricks, bricks);

      $timeout(function() {
        var container = angular.element('#masonry');
        new Masonry( container[0], {
          columnWidth: me.size,
          itemSelector: '.masonry-brick',
          gutter: me.gutter
        });
      });
    });
  }
]);
