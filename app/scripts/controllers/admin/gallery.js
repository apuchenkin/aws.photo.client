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
      var me = this,
          sha = new Hashes.SHA1(),
          size = '240';

      me.category = $stateParams.category;
      me.categories = Category.$collection();
      var photos = Photo.$collection({category: me.category});
      me.groupStyle = {};
      me.photos = [];
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

      me.select = function(item, e) {
        if (e.ctrlKey) {
          me.isSelected(item)
            ? _.remove(me.selected, item)
            : me.selected.push(item);
        } else {
          me.selected = [item];
        }
      };

      me.isSelected = function(item) {
        return me.selected.indexOf(item) >= 0;
      };

      me.drop = function() {
        var category = _.find(me.categories, {name: me.category});
        category.$dropPhotos(_.pluck(me.selected, 'id'));
        $state.reload();
      };

      me.onDrop = function(item, category) {
        var pack = me.selected.length ? _.pluck(me.selected, 'id') : [item];
        category.$appendPhotos(pack);
      };

      $rootScope.config = config;

      var mapPhoto = function (p) {
        var sign = sha.hex_hmac(config.secret, p.id + '-' + size + 'x' + size);

        return angular.extend(p, {
          thumb: [config.apiEndpoint, 'hs/photo', p.id, size, size, sign].join('/')
        });
      };

      photos.$refresh().$then(function(items){
        angular.extend(me.photos, items.map(mapPhoto));
        _.map(_.keys(_.groupBy(items, 'group')), function(groupId) {
          me.groupStyle[groupId] = {background: getRandomColor()}
        })
      });
    }
  ]);
