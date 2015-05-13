'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['$translate', 'categories', 'CONFIG',
    function ($translate, categories, config) {
      var me = this;
      me.language = config.language;
      me.categories = categories;

      $translate.use(me.language);
    }]);
