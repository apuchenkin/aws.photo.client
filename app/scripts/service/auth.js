'use strict';

angular.module('aws.photo.client')
  .service('aws.service.auth',
  ['$rootScope', '$http', '$cookieStore', '$state', 'CONFIG', 'authService',
    function ($rootScope, $http, $cookieStore, $state, config, authService) {
      /**
       * @private
       * @type {*}
       */
      var user = null;

      $rootScope.$on('event:auth-loginRequired', function () {
          $cookieStore.remove('access_token');
          $state.go('admin');
      });

      $rootScope.$on('event:auth-loginConfirmed', function (scope, data) {
        $cookieStore.put('access_token', data.token);
        $state.go('home');
      });

      $rootScope.$on('event:auth-loginCancelled', function () {
        $cookieStore.remove('access_token');
        $state.go('admin');
      });

      // public API exposed here
      return {

        /**
         * Returns current user details
         * @returns {*}
         */
        getUser: function () {
          return user ? user : initUser();
        },

        /**
         * Performs authentication over credentials:
         * @param credentials Object {email: [string], password: [string]}
         */
        login: function (credentials) {
           return $http.post(config.apiEndpoint + '/authenticate', credentials, {ignoreAuthModule: true})
            .success(function(response) {
               //credentials
               authService.loginConfirmed({token: 'sup'});
             });
        },

        /**
         * Performs logout
         */
        logout: function () {
          authService.loginCancelled();
        }
      };
    }]
);
