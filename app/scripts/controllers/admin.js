'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.admin', ['$scope', 'aws.service.auth',
    function ($scope, authService) {
      var me = this;
      me.credentials = {};

      me.login = function () {
        authService
          .login(me.credentials)
          .error(function () {
              debugger;
          });
      };
    }
  ]);
