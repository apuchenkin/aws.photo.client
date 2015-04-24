'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['$rootScope', '$translate', 'categories', 'category', 'CONFIG',
    function ($rootScope, $translate, categories, category, config) {
      var me = this;
      me.language = config.language;
      me.categories = categories;
      $rootScope.category = me.category = category;

      $translate.use(me.language);
    }]);
