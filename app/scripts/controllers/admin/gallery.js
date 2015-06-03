'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.gallery
 * @description
 * # aws.controller.gallery
 * Controller of the aws-photo-client
 */
angular.module('aws.photo.client')
  .controller('aws.controller.admin.gallery', ['$rootScope', '$scope', 'aws.model.photo', 'aws.model.category', 'CONFIG',
    function ($rootScope, $scope, Photo, Category, config) {
      var me = this;

      me.categories = Category.$collection();
      me.categories.$refresh();

      me.photos = [];
      me.selected = [];

      me.toggleVisibility = function (item) {
        item.hidden = !item.hidden;
        item.$save(['hidden']);
      };

      me.select = function(item) {
        item.selected = !item.selected;
        item.selected
          ? me.selected.push(item)
          : _.remove(me.selected, item);
      };

      $rootScope.config = config;
      $scope.$watch('category', function(category) {
        me.photos = Photo.$collection({category: category});
        me.photos.$refresh();
      });
    }
  ]);
