'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('photoawesomestuffinApp')
  .controller('ImageCtrl', function ($scope, $http, $stateParams) {
    $scope.image = {};
    debugger;
    $http.get('http://localhost:3000/photo/' + $stateParams.id).then(function(response){
      angular.extend($scope.image, response.data);
    });
  });
