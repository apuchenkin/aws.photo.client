'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.photo', ['restmod', '$http', function (restmod, $http) {
    return restmod.model('/photo').mix({
      $extend: {
        Collection: {
          /**
           * Performs photo grouping
           *
           * @param [Photo]
           * @returns {HttpPromise}
           */
          $group: function (items) {
            var data = _.map(items, 'id');
            return $http.post(this.$url() + '/group', data);
          }
        }
      }
    });
  }]);
