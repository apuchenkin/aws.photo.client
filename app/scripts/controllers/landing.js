'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.landing', ['$rootScope', '$timeout', 'categories', 'CONFIG', 'aws.service.photo',
    function ($rootScope, $timeout, categories, config, photoService) {
      var me = this;

      var mapCategory = function(category) {
        if (!category.image) {
          return category;
        } else {
          return angular.merge(category, {
            thumb: photoService.remapImage(category.image, config.gallery.width,config.gallery.height)
          });
        }
      };

      me.categories = _.groupBy(_.map(categories, mapCategory), 'parent');

      $timeout(function () {
        new Packery('.content .galleries ul', {
          isFitWidth: true,
          columnWidth: 200,
          itemSelector: 'li.item'
        });
      });
    }]);
