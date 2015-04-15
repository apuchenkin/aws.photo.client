'use strict';

angular.module('aws.photo.client')
  .factory('aws.model.translation', ['restmod', function (restmod) {
    return restmod.model('/translation');
  }]);
