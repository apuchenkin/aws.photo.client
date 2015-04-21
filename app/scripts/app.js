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
    'aws.config',
    'ngAnimate',
    'ui.router',
    'pascalprecht.translate',
    'restmod'
  ])

  .factory('customLoader', ['aws.model.translation', '$q', function (Translation, $q) {
    // return loaderFn
    return function (options) {
      var deferred = $q.defer(),
          translation =  Translation.$collection({language: options.key});

      translation.$refresh().$then(function(items) {
        deferred.resolve(items.reduce(function(acc, item){
          var type = acc[item.type]   = acc[item.type]    || {},
              ref  = type[item.refId] = type[item.refId]  || {};
          ref[item.field] = item.value;
          return acc;
        }, {}));
      });
      return deferred.promise;
    };
  }])

  .config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useLoader('customLoader', { key: 'en'});
  }])

  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/404');
  }])

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
        url: '/:category',
        controller: 'aws.controller.main',
        controllerAs: 'main',
        resolve: {
          categories: ['aws.model.category', function(Category) {
            var categories =  Category.$collection();
            return categories.$refresh().$asPromise();
          }],
          category: ['$stateParams', '$state', 'categories', function ($stateParams, $state, categories) {
            var category = categories.$findByName($stateParams.category);
            if (!category) {
              $state.go('error.404');
            }
            category.childs = categories.$getChilds(category);
            return category
          }]
        },
        templateUrl: function ($stateParams) {
          var registered = ['chile'];
          if (_.indexOf(registered, $stateParams.category) >= 0) {
            return 'views/gallery/' + $stateParams.category + '.html';
          } else {
            return 'views/gallery/default.html';
          }
        }
      })

      .state('home.gallery', {
        url: '/:subcategory',
        params: {
          subcategory: {value: null, squash: true}
        },
        title: 'Home',
        views: {
          navigation: {
            templateUrl: 'views/navigation.html',
            controller: 'aws.controller.navigation',
            controllerAs: 'navigation'
          },
          gallery: {
            templateUrl: 'views/gallery.html',
            controller: 'aws.controller.gallery',
            controllerAs: 'gallery'
          }
        },
        resolve: {
          subcategory: ['$stateParams', '$state', 'categories', function ($stateParams, $state, categories) {
            return categories.$findByName($stateParams.subcategory);
          }],
          photos: ['aws.model.photo', 'category', 'subcategory', function (Photo, category, subcategory) {
            var photos = Photo.$collection({category: (subcategory || category).name});
            return photos.$refresh().$asPromise();
          }]
        }
      })

      .state('home.gallery.image', {
        url: '/photo/{id:int}',
        controller: 'aws.controller.image',
        controllerAs: 'imageCtrl',
        resolve: {
          photo: ['$stateParams', 'aws.model.photo', function ($stateParams, Photo) {
            return Photo.$find($stateParams.id).$asPromise();
          }]
        }
      })
    ;
  }])

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
  }])

  .factory('restmodConfig', ['restmod', 'CONFIG', function (restmod, config) {

    return restmod.mixin('DefaultPacker', { // include default packer extension
      $config: {
        primaryKey: 'id',
        jsonRoot: '.',
        jsonMeta: 'meta',
        jsonLinks: 'links',
        urlPrefix: config.api_endpoint
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
  }]);
