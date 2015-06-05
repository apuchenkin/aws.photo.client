'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.gallery
 * @description
 * # aws.controller.gallery
 * Controller of the aws-photo-client
 */
angular.module('aws.photo.client')
  .controller('aws.controller.admin.gallery', ['$rootScope', '$state', '$stateParams', '$scope', 'aws.model.photo', 'aws.model.category', 'CONFIG',
    function ($rootScope, $state, $stateParams, $scope, Photo, Category, config) {
      var me = this;

      me.category = $stateParams.category;
      me.categories = Category.$collection();
      me.photos = Photo.$collection({category: me.category});
      me.groupStyle = {};
      me.selected = [];

      me.categories.$refresh();

      me.toggleVisibility = function (item) {
        item.hidden = !item.hidden;
        item.$save(['hidden']);
      };

      me.unGroup = function (item) {
        item.group = null;
        item.$save(['group']);
      };

      me.group = function () {
        Photo.$collection().$group(me.selected);
        $state.reload();
      };

      me.setCategory = function (category) {
        $state.go($state.current, {category: category.name});
      };

      var getRandomColor = function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      me.select = function(item) {
        item.selected = !item.selected;
        item.selected
          ? me.selected.push(item)
          : _.remove(me.selected, item);
      };

      $rootScope.config = config;

      me.photos.$refresh().$then(function(items){
        _.map(_.keys(_.groupBy(items, 'group')), function(groupId) {
          me.groupStyle[groupId] = {background: getRandomColor()}
        })
      });
    }
  ]);
