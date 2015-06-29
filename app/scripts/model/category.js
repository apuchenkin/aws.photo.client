'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.category', ['restmod', '$http', function (restmod, $http) {
    return restmod.model('/category').mix({
      $extend: {
        Record: {
          $appendPhotos: function (items) {
            return $http({
              method: 'link',
              url: this.$url() + '/photo',
              data: items
            });
          },
          $dropPhotos: function (items) {
            return $http({
              method: 'unlink',
              url: this.$url() + '/photo',
              data: items
            });
          }
        },
        Collection: {
          $getChilds: function (category) {
            return _.filter(this, {parent: category.id});
          },
          $findById: function (id) {
            return _.find(this, {id: id});
          },
          $findByName: function (name) {
            return _.find(this, {name: name});
          }
        }
      }
    });
  }]);
