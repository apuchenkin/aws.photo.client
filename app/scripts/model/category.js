'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.category', ['restmod', '$http', function (restmod, $http) {
    return restmod.model('/category').mix({
      $extend: {
        Record: {
          $appendPhotos: function (ids) {
            return $http({
              method: 'link',
              url: this.$url() + '/photo',
              data: ids
            });
          },
          $dropPhotos: function (ids) {
            return $http({
              method: 'unlink',
              url: this.$url() + '/photo',
              data: ids
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
