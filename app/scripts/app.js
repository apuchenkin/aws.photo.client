'use strict';

/**
 * @ngdoc overview
 * @name aws-photo-client
 * @description
 * # aws-photo-client
 *
 * Main module of the application.
 */
angular
  .module('aws.photo.client', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    //'wu.masonry',
    'restmod'
  ])

  .config(function ($urlRouterProvider) {
    // when there is an empty route, redirect to /
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/404');
  })

  .config(['$stateProvider', function ($stateProvider) {

    // Public routes
    $stateProvider
      .state('error', {
        abstract: true,
        template: '<ui-view></ui-view>'
      })
      .state('error.404', {
        url: '/404',
        templateUrl: '/views/error/404.html'
      });

    //main routes
    $stateProvider
      .state('home', {
        abstract: true,
        url: '/',
        controller: 'aws.controller.main',
        resolve: {
          categories: ['aws.model.category', function(Category) {
            var categories =  Category.$collection();
            return categories.$refresh().$asPromise();
          }]
        },
        controllerAs: 'mainCtrl',
        template: '<ui-view></ui-view>'
      })
      .state('home.gallery', {
        url: ':category/:subcategory',
        params: {
          subcategory: {value: null, squash: true}
        },
        title: 'Home',
        templateUrl: 'views/gallery.html',
        controller: 'aws.controller.images',
        controllerAs: 'imagesCtrl',
        resolve: {
          category: ['$stateParams', '$state', 'categories', function($stateParams, $state, categories) {
            var category = categories.$findByName($stateParams.category);
            if (!category) {
              $state.go('error.404');
            }
            category.childs = categories.$getChilds(category);
            return category
          }],
          subcategory: ['$stateParams', '$state', 'categories', function($stateParams, $state, categories) {
            return categories.$findByName($stateParams.subcategory);
          }]
        }
      })
      .state('home.gallery.image', {
        url: ':id',
        controller: 'aws.controller.image',
        controllerAs: 'imageCtrl'
      })
    ;
  }])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
  }])

  .factory('restmodConfig', ['restmod', function (restmod) {
    return restmod.mixin('DefaultPacker', { // include default packer extension
      $config: {
        primaryKey: 'id',
        jsonRoot: '.',
        jsonMeta: 'meta',
        jsonLinks: 'links',
        urlPrefix: 'http://localhost:3000'
      },

      $extend: {
        // special snakecase to camelcase renaming
        Model: {
          unpack: function (_resource, _raw) {
            var name = null;
            var data = this.$super.apply(this, arguments);

            if (_resource.$isCollection) {
              name = this.getProperty('jsonRootMany') || this.getProperty('jsonRoot') || this.getProperty('plural');
            } else {
              name = this.getProperty('jsonRootSingle') || this.getProperty('jsonRoot') || this.getProperty('name');
            }

            return name === '.' ? _raw : data;
          }
        }
      }
    });
  }])

  .config(['restmodProvider', function (restmodProvider) {
    restmodProvider.rebase('restmodConfig');
  }])

  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(false);
  }])

  .directive('colorbox', function() {
  return {
    restrict: 'AC',
    link: function (scope, element, attrs) {
      $(element).colorbox(attrs.colorbox);
    }
  };
});
