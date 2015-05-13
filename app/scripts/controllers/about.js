'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.about', ['$scope', 'category', '$translate',
    function ($scope, category, $translate) {
      $scope.category = category;
      //$translate(['category', category.$pk, 'about'].join('.')).then(function (translation) {
      //  debugger;
      //  $scope.html = translation;
      //});
    }
  ]);
