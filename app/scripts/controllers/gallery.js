'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.gallery
 * @description
 * # aws.controller.gallery
 * Controller of the aws-photo-client
 */
angular.module('aws.photo.client')
  .controller('aws.controller.gallery', ['$timeout', 'photos', 'CONFIG',
    function ($timeout, photos, config) {
      var me = this,
          sha = new Hashes.SHA1(),
          views = _.pluck(photos, 'views'),
          std = math.std(views),
          max = math.max(views),
          gutter = me.gutter = config.gutter,
          s = me.size = config.galleryColumnWidth,
          s2 = (s * 2) + gutter,
          s3 = (s * 3) + (gutter * 2),
          s4 = (s * 4) + (me.gutter * 3)
      ;

      me.bricks = [];

      var getBrick = function (photo) {
        var div = Math.floor(photo.views / (std + 1)) + 1,
            agg = Math.floor(max / ((photo.views * std) + 1)) + 1,
            probs, mode, isHorisontal, ratio, dims, dsmap, sign, msize;

        probs = _.flatten([
          _.fill(new Array((agg * agg * 8) + (div * div * 1)), 1),
          _.fill(new Array((agg * agg * 4) + (div * div * 2)), 2),
          _.fill(new Array((agg * agg * 2) + (div * div * 3)), 3),
          _.fill(new Array((agg * agg * 1) + (div * div * 4)), 4)
        ]);

        mode = _.sample(probs);
        isHorisontal = (photo.width > photo.height);
        ratio = Math.floor(photo.width / photo.height);

        dsmap = {
          1: [ratio >= 2 ? s2 : s, s],
          2: isHorisontal ? [ratio >= 3 ? s3 : s2, s] : [s, s2],
          3: ratio >= 4 ? [s4, s] : [ratio >= 2 ? s3 : s2, s2],
          4: isHorisontal ? [ratio >= 2 ? s4 : s3, s2] : [s2, s3]
        };

        dims = dsmap[mode];
        msize = _.max([dims[0], dims[1]]);
        sign = sha.hex_hmac(config.secret, photo.id + "-" + msize + 'x' + msize);

        return {
          id: photo.id,
          width: dims[0],
          height: dims[1],
          src: [config.apiEndpoint, 'hs/photo', photo.id, msize, msize, sign].join('/')
        };
      };

      angular.extend(me.bricks, photos.map(getBrick));

      $timeout(function () {
        new Masonry(angular.element('#masonry')[0], {
          columnWidth: me.size,
          itemSelector: '.masonry-brick',
          gutter: me.gutter
        });
      });
    }
  ]);
