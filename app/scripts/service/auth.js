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

      loginFailed = function () {
        $rootScope.isAdmin = false;
        $cookieStore.remove('access_token');
        $state.go('admin');
      };

      $rootScope.$on('event:auth-loginConfirmed', function (scope, data) {
        $rootScope.isAdmin = true;
        $cookieStore.put('access_token', data.token);
        $state.go('home');
      });

      $rootScope.$on('event:auth-loginCancelled', loginFailed);
      $rootScope.$on('event:auth-loginRequired', loginFailed);

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
          var b64 = new Hashes.Base64(),
            token = 'Basic ' + b64.encode([credentials.email, credentials.password].join(':'));

          return $http({
            method: 'GET',
            url: config.apiEndpoint + '/auth/check',
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json; charset=utf-8'
            },
            ignoreAuthModule: true
          })
            .success(function (response) {
              response.logged_in
                ? authService.loginConfirmed({token: token})
                : authService.loginCancelled();
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
