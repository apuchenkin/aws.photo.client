'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.landing', ['$rootScope', '$timeout', 'categories', 'CONFIG',
    function ($rootScope, $timeout, categories, config) {
      var me = this,
        sha = new Hashes.SHA1(),
        b64 = new Hashes.Base64(),
        w = '320',
        h = '240',
        sign;

      var mapCategory = function(category) {
        if (!category.image) {
          return category
        } else {
          var b64image = b64.encode(category.image);
          sign = sha.hex_hmac(config.secret, b64image + '-' + w + 'x' + h);
          return angular.merge(category, {
            thumb: [config.apiEndpoint, 'hs/image', b64image, w, h, sign].join('/')
          });
        }
      };

      me.categories = _.groupBy(_.map(categories, mapCategory), 'parent');

      $timeout(function () {
        new Masonry('.content .galleries ul', {
          isFitWidth: true,
          columnWidth: 200,
          itemSelector: 'li.item'
        });
      });
    }]);
