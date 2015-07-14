'use strict';

angular.module('aws.photo.admin')
  .controller('aws.controller.gallery',
  ['$rootScope', '$scope', '$state', '$stateParams', 'aws.model.photo', 'aws.model.category', 'CONFIG', '$q',
    function ($rootScope, $scope, $state, $stateParams, Photo, Category, config, $q) {
      var me = this,
          sha = new Hashes.SHA1(),
          size = '240',
          photos = Photo.$collection()
      ;

      me.category = $stateParams.category;
      me.categories = Category.$collection();
      me.photos = [];
      me.selected = [];
      me.parentPhotos = [];
      me.isShowHidden = false;

      me.categories.$refresh().$then(function (categories) {
        var category = categories.$findByName(me.category);
        if (category && category.parent) {
          var parent = categories.$findById(category.parent);
          me.parentPhotos = Photo.$collection({category: parent.name});
          me.parentPhotos.$refresh();
          $q.all([me.parentPhotos.$promise, photos.$promise]).then(function () {
            var ids = _.intersection(_.map(photos, 'id'), _.map(me.parentPhotos,'id'));
            ids.map(function(i){
              _.find(photos, {id: i}).hasParent = true;
            });
          });
        }
      });

      me.toggleHidden = function () {
        me.isShowHidden = !me.hidden;
        updatePhotoData();
      };

      me.toggleVisibility = function (item) {
        item.hidden = !item.hidden;
        item.$save(['hidden']);
      };

      me.unGroup = function (photo) {
        //item.group = null;
        //item.$save(['group']);
        Photo.$collection().$groupRemove(photo.group, [photo.id]);
        updatePhotoData();
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

      me.groupPhoto = function(item, photo) {
        var pack = me.selected.length ? _.pluck(me.selected, 'id') : [item];

        if (photo.group) { // append to photo group
          Photo.$collection().$groupAdd(photo.group, pack);
        } else { //make grouping
          pack.push(photo.id);
          Photo.$collection().$group(pack);
        }
        updatePhotoData();
      };

      me.isSelected = function(item) {
        return me.selected.indexOf(item) >= 0;
      };

      me.drop = function() {
        var category = _.find(me.categories, {name: me.category});
        category.$dropPhotos(_.pluck(me.selected, 'id'));
        updatePhotoData();
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

      var updatePhotoData = function() {
        me.groupStyle = {};
        me.photos = [];
        photos.$refresh({category: $stateParams.category, hidden: me.isShowHidden}).$then(function(items){
          angular.extend(me.photos, items.map(mapPhoto));
          _.map(_.keys(_.groupBy(items, 'group')), function(groupId) {
            me.groupStyle[groupId] = {background: getRandomColor()};
          });
        });
      };
      updatePhotoData();
    }
  ]);
