'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.photo', ['restmod', function (restmod) {
    return restmod.model('/photo');
  }]);
