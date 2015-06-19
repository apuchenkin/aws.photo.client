'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['$rootScope', '$state', '$cookieStore', 'categories', '$translate',
    function ($rootScope, $state, $cookieStore, categories, $translate) {
      var me = this;
      me.categories = $rootScope.categories = categories;
      me.groupCategories = _.groupBy(categories, 'parent');
      me.language = $translate.use();

      $rootScope.name = 'PHOTO.AWESOMESTUFF.IN';
      $rootScope.description = $translate.instant('DESCRIPTION');
      $rootScope.title = $rootScope.name + ' - ' + $rootScope.description;

      me.setLanguage = function(lang) {
        $cookieStore.put('language', lang);
        $state.reload();
      }
    }]);
