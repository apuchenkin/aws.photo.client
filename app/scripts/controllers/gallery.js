'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.gallery
 * @description
 * # aws.controller.gallery
 * Controller of the aws-photo-client
 */
angular.module('aws.photo.client')
  .controller('aws.controller.gallery', ['$rootScope', '$timeout', 'photos', 'CONFIG', 'aws.service.photo',
    function ($rootScope, $timeout, photos, config, photoService) {
      var me = this,
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
        var
          div = Math.floor(photo.views / (std + 1)) + 1,
          agg = Math.floor(max / ((photo.views * std) + 1)) + 1,
          mdiv  = _.map([1,2,3,4], function(x){ return x * Math.pow(div,2);}),
          magg  = _.map([8,4,2,1], function(x){ return x * Math.pow(agg,2);}),
          probs = _.map(_.zip(mdiv, magg),_.sum),
          mode  = photoService.weightedRandom(probs),
          isHorisontal = (photo.width > photo.height),
          ratio = photo.width / photo.height,
          inc = (ratio >= 1) ? ratio : 1 / ratio,
          dsmap = [
            [ratio >= 2 ? s2 : s, s],
            isHorisontal ? [ratio >= 3 ? s3 : s2, s] : [s, s2],
            ratio >= 4 ? [s4, s] : [ratio >= 2 ? s3 : s2, s2],
            isHorisontal ? [ratio >= 2 ? s4 : s3, s2] : [s2, s3]
          ],
          dims = dsmap[mode],
          msize =  _.max([Math.ceil(_.min([dims[0], dims[1]]) * inc), _.max([dims[0], dims[1]])])
        ;

        return {
          id: photo.id,
          width: dims[0],
          height: dims[1],
          src: photoService.remapPhoto(photo.id, msize, msize)
        };
      };

      angular.extend(me.bricks, photos.map(getBrick));

      var container = angular.element('.content')[0];
      container.scrollTop = 0;
      Ps.initialize(container);

      $timeout(function () {
        new Masonry('#masonry', {
          columnWidth: me.size,
          itemSelector: '.masonry-brick',
          gutter: me.gutter
        });
      });
    }
  ]);
