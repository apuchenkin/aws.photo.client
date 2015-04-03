'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('photoawesomestuffinApp')
  .controller('MainCtrl', function ($scope) {
    $('.photoset-grid').photosetGrid();
  });
