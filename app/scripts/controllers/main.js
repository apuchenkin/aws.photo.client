'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['categories', function (categories) {
    var me = this;
    me.categories = categories;
  }]);
