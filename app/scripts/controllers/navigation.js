'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.navigation', ['$rootScope', 'category',
    function ($rootScope, category) {
      this.category = category;
      $rootScope.hasNavigation = category.childs && category.childs.length;
    }
  ]);
