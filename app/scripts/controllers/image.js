'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.image', ['$stateParams', function ($stateParams) {
    var me = this;
    me.image = {};

    $http.get('http://localhost:3000/photo/' + $stateParams.id).then(function(response){
      angular.extend(me.image, response.data);
    });
  }]);
