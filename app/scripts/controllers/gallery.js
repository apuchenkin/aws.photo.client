'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.gallery
 * @description
 * # aws.controller.gallery
 * Controller of the aws-photo-client
 */
angular.module('aws.photo.client')
  .controller('aws.controller.gallery', ['$timeout', 'photos',
    function ($timeout, photos) {
      var me = this;
      me.bricks = [];
      me.gutter = 5;

      var views = _.pluck(photos, "views");
      var std = math.std(views);
      var max = math.max(views);

      var s = me.size = 100;
      var s2 = (s * 2) + me.gutter;
      var s3 = (s * 3) + (me.gutter * 2);

      var getBrick = function (photo) {
        var div = Math.floor(photo.views / (std + 1)) + 1;
        var agg = Math.floor(max / ((photo.views * std) + 1)) + 1;

        var probs = _.flatten([
          _.fill(Array((agg * agg * 8) + (div * div * 1)), 1),
          _.fill(Array((agg * agg * 4) + (div * div * 2)), 2),
          _.fill(Array((agg * agg * 2) + (div * div * 3)), 3),
          _.fill(Array((agg * agg * 1) + (div * div * 4)), 4)
        ]);

        var mode = probs[math.randomInt(0, probs.length + 1)],
          isHorisontal = (photo.width > photo.height),
          dims
          ;

        switch (mode) {
          case 4:
            dims = isHorisontal ? [s3, s2] : [s2, s3];
            break;
          case 3:
            dims = [s2, s2];
            break;
          case 2:
            dims = isHorisontal ? [s2, s] : [s, s2];
            break;
          default:
            dims = [s, s];
            break;
        }

        return {
          id: photo.id,
          width: dims[0],
          height: dims[1],
          src: 'http://localhost:3000/' + photo.thumb
        }
      };

      angular.extend(me.bricks, photos.map(getBrick));

      $timeout(function () {
        var masonry = new Masonry(angular.element('#masonry')[0], {
          columnWidth: me.size,
          itemSelector: '.masonry-brick',
          gutter: me.gutter
        });
      });
    }
  ]);
