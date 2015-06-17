'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['$state', '$cookieStore', 'categories', '$translate',
    function ($state, $cookieStore, categories, $translate) {
      var me = this;
      me.categories = categories;
      me.language = $translate.use();

      me.setLanguage = function(lang) {
        $cookieStore.put('language', lang);
        $state.reload();
      }
    }]);
