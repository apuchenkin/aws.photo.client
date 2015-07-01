'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.photo', ['restmod', '$http', function (restmod, $http) {
    return restmod.model('/photo').mix({
      $extend: {
        Collection: {
          /**
           * Performs photo grouping
           *
           * @param [Int]
           * @returns {HttpPromise}
           */
          $group: function (ids) {
            return $http.post(this.$url() + '/group', ids);
          },

          $groupAdd: function (groupId, ids) {
            return $http({
              method: 'link',
              url: this.$url() + '/group/' + groupId,
              data: ids
            });
          },

          $groupRemove: function (groupId, ids) {
            return $http({
              method: 'unlink',
              url: this.$url() + '/group/' + groupId,
              data: ids
            });
          }
        }
      }
    });
  }]);
