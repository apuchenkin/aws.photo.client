'use strict';

/**
 * @ngdoc overview
 * @name aws-photo-admin
 * @description
 * # aws-photo-admin
 *
 * Administrative pages
 */
angular
  .module('aws.photo.admin', [
    'aws.config',
    'aws.photo.core',
    'ui.router',
    'ngCookies',
    'http-auth-interceptor',
    'ang-drag-drop'
  ])

  .factory('requestInterceptor', ['$q', '$cookieStore', function ($q, $cookieStore) {
    return {
      // setup authorisation header pre-request
      'request': function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('access_token')) {
          config.headers.Authorization = $cookieStore.get('access_token');
        }

        return config;
      }
    };
  }])

  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }])

  .config(['$locationProvider', '$httpProvider', 'CONFIG', function ($locationProvider, $httpProvider, config) {
    $httpProvider.defaults.useXDomain = config.useXDomain;
    $httpProvider.interceptors.push('requestInterceptor');
    $locationProvider.html5Mode(config.html5);
  }])

  .config(['$stateProvider', function ($stateProvider) {

    //main routes
    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'aws.controller.login',
        controllerAs: 'login',
        templateUrl: '/module/admin/views/login.html'
      })
      .state('logout', {
        url: '/logout',
        controller: ['aws.service.auth', function(auth) {
          auth.logout();
        }]
      });

    $stateProvider
      .state('home', {
        url: '/?{category:string}',
        controller: 'aws.controller.gallery',
        controllerAs: 'admin',
        templateUrl: '/module/admin/views/gallery.html',
        resolve: {
          categories: ['aws.model.category', function(Category) {
            var categories =  Category.$collection();
            return categories.$refresh().$asPromise();
          }],
          photos: ['categories', '$stateParams', '$state', 'aws.service.photo', 'CONFIG', function (categories, $stateParams, $state, photoService, config) {
            if ($stateParams.category) {
              var category = categories.$findByName($stateParams.category);
              if (!category) {
                $state.go('home', {category: null});
              }
              category.photo.$on('after-feed', function() {
                this.thumb = photoService.remapPhoto(this.id, config.admin.size, config.admin.size);
              });

              return category.photo.$fetch().$asPromise();
            }

            return false;
          }]
        },
        data: {
          admin: true
        }
      });
  }])

  .run(['$rootScope', '$cookieStore', 'aws.service.auth', '$state', 'CONFIG', function ($rootScope, $cookieStore, auth, $state, config) {
    $rootScope.config = config;

    if ($cookieStore.get('access_token')) {
      auth.checkCredentials($cookieStore.get('access_token'));
    }

    $rootScope.layout = 'default';
    $rootScope.$on('$stateChangeStart',
      function (event, toState) {
        if (toState.data !== undefined) {
          if (toState.data.admin !== undefined && toState.data.admin) {
            if (!$cookieStore.get('access_token')) {
              event.preventDefault();
              $state.go('login');
            }
          }
        }

        $rootScope.loading = true;
      });

    $rootScope.$on('$stateChangeSuccess',
      function () {
        $rootScope.loading = false;
      });
  }]);

