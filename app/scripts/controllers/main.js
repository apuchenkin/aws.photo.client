'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['categories', '$translate', function (categories, $translate) {
    var me = this;
    me.language = 'en';
    me.categories = categories;

    $translate.use(me.language);
  }]);
