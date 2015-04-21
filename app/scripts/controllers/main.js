'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['$translate', 'categories', 'category', 'CONFIG',
    function ($translate, categories, category, config) {
      var me = this;
      me.language = config.language;
      me.categories = categories;
      me.category = category;

      $translate.use(me.language);
    }]);
