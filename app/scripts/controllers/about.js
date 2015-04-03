'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('photoawesomestuffinApp')
  .controller('AboutCtrl', function ($scope, $http) {
    $scope.bricks = [];
    $http.get('http://localhost:3000/photo').then(function(response){
      angular.extend($scope.bricks, response.data);
    });
  });
