'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.category', ['restmod', function (restmod) {
    return restmod.model('/category').mix({
      $extend: {
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
