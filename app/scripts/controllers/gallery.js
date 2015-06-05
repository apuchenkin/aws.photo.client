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
      var me = this;
      me.bricks = [];
      me.gutter = config.gutter;

      var views = _.pluck(photos, 'views');
      var std = math.std(views);
      var max = math.max(views);

      var s = me.size = config.galleryColumnWidth;
      var s2 = (s * 2) + me.gutter;
      var s3 = (s * 3) + (me.gutter * 2);
      var s4 = (s * 4) + (me.gutter * 3);

      var getBrick = function (photo) {
        var div = Math.floor(photo.views / (std + 1)) + 1;
        var agg = Math.floor(max / ((photo.views * std) + 1)) + 1;

        var probs = _.flatten([
          _.fill(new Array((agg * agg * 8) + (div * div * 1)), 1),
          _.fill(new Array((agg * agg * 4) + (div * div * 2)), 2),
          _.fill(new Array((agg * agg * 2) + (div * div * 3)), 3),
          _.fill(new Array((agg * agg * 1) + (div * div * 4)), 4)
        ]);

        var mode = _.sample(probs),
          isHorisontal = (photo.width > photo.height),
          pk = Math.floor(photo.width / photo.height),
          dims, dsmap;

        dsmap = {
          1: [pk >= 2 ? s2 : s, s],
          2: isHorisontal ? [pk >= 3 ? s3 : s2, s] : [s, s2],
          3: pk >= 4 ? [s4, s] : [pk >= 2 ? s3 : s2, s2],
          4: isHorisontal ? [pk >= 2 ? s4 : s3, s2] : [s2, s3]
        };

        dims = dsmap[mode];

        return {
          id: photo.id,
          width: dims[0],
          height: dims[1],
          src: config.staticEndpoint + photo.thumb
        };
      };

      var doGroups = function(photos) {
        var groups = _.groupBy(photos, 'group');
        photos = _.reduce(_.keys(groups), function(acc, i) {
          if (+i > 0) {
            var photo = _.sample(_.flatten(_.map(groups[i], function(p){return _.fill(Array(p.views + 1), p)})));
            photo.views = _.sum(groups[i], 'views');
            acc.push(photo);
          }
          return acc;
        }, groups.null);

        return _.sortBy(photos, 'order');
      };

      angular.extend(me.bricks, doGroups(photos).map(getBrick));

      $timeout(function () {
        new Masonry(angular.element('#masonry')[0], {
          columnWidth: me.size,
          itemSelector: '.masonry-brick',
          gutter: me.gutter
        });
      });
    }
  ]);
