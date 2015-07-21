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
    'aws.photo.core',
    'ngAnimate',
    'ngCookies',
    'ui.router',
    'pascalprecht.translate',
    'ngSanitize'
  ])

  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/404');
  }])

  .config(['$translateProvider', 'TRANSLATION',
    function ($translateProvider, TRANSLATION) {
      $translateProvider
        .translations('en', TRANSLATION.EN)
        .translations('ru', TRANSLATION.RU)
        .registerAvailableLanguageKeys(['en', 'ru'], {
          'en_US': 'en',
          'en_UK': 'en',
          'ru_RU': 'ru'
        })
        .fallbackLanguage('en')
        .useSanitizeValueStrategy('sanitize')
        .determinePreferredLanguage();
    }])

  .config(['$stateProvider', 'CONFIG', function ($stateProvider, config) {

    // Public routes
    $stateProvider
      .state('error', {
        abstract: true,
        views: {
          'title@': {
            templateUrl: 'views/landing/title.html',
            controller: ['$scope', 'CONFIG', '$translate', function($scope, config, $translate) {
              $scope.name = config.meta.name;
              $scope.description = $translate.instant('DESCRIPTION');
            }]
          }
        }
      })
      .state('error.404', {
        url: '/404',
        resolve: {
          previousState: [
            '$state',
            function ($state) {
              return {
                name: $state.current.name,
                params: $state.params,
                URL: $state.href($state.current.name, $state.params)
              };
            }
          ]
        },
        onEnter: ['aws.service.meta', '$translate',
          function (metaService, $translate) {
            metaService.setTitle($translate.instant('ERROR.404'));
          }],
        views: {
          'content@': {
            templateUrl: 'views/error/404.html',
            controller: [
              'previousState', '$scope',
              function (previousState, $scope) {
                if (previousState.name !== 'error.404' && previousState.name !== 'home') {
                  $scope.backUrl = previousState.URL;
                }
              }
            ]
          }
        }
      });

    // Public routes
    $stateProvider
      .state('home.static', {
        abstract: true
      });

    _.each(config.static, function (url, key) {
      $stateProvider.state(key, {
        url: url,
        resolve: {
          page: ['$translate', '$http', 'aws.service.meta',
            function ($translate, $http, metaService) {
              metaService.setTitle($translate.instant('STATIC.' + url.toUpperCase()));
              return $http.get(['views/static', $translate.use(), url + '.html'].join('/'));
            }]
        },
        views: {
          'title@': {
            templateUrl: 'views/static/title.html',
            controller: ['$scope', 'CONFIG', '$translate', function($scope, config, $translate) {
              $scope.name = config.meta.name;
              $scope.title = $translate.instant('STATIC.' + url.toUpperCase());
            }]
          },
          'content@': {
            template: '<div class="static" ng-bind-html="content"></div>',
            controller: ['$scope', 'page', '$sce',
              function ($scope, page, $sce) {
                $scope.content = $sce.trustAsHtml(page.data);
              }]
          }
        }
      });
    });

    $stateProvider
      .state('home', {
        url: '/',
        views: {
          title: {
            templateUrl: 'views/landing/title.html',
            controller: ['$scope', 'CONFIG', '$translate', function($scope, config, $translate) {
              $scope.name = config.meta.name;
              $scope.description = $translate.instant('DESCRIPTION');
            }]
          },
          content: {
            templateUrl: 'views/landing/content.html',
            controller: 'aws.controller.landing',
            controllerAs: 'landing'
          },
          footer: {
            templateUrl: 'views/footer.html'
          }
        },
        resolve: {
          categories: ['aws.model.category', function(Category) {
            var categories =  Category.$collection();
            return categories.$refresh().$asPromise();
          }]
        },
        data: {}
      })

      .state('home.category', {
        abstract: true,
        url: ':category',
        resolve: {
          category: ['$stateParams', '$state', 'categories', function ($stateParams, $state, categories) {
            var category = categories.$findByName($stateParams.category);
            if (!category) {
              $state.go('error.404', {}, {reload: true});
            } else if (category.parent) {
              $state.go('home.category.gallery', {category: categories.$findById(category.parent).name, subcategory: category.name});
            } else {
              category.childs = categories.$getChilds(category);
              return category;
            }
            return false;
          }]
        }
      })

      .state('home.category.gallery', {
        url: '/:subcategory',
        params: {
          subcategory: {value: null, squash: true}
        },
        views: {
          'navigation@': {
            templateUrl: 'views/navigation.html',
            controller: ['$rootScope', '$scope', 'category', function ($rootScope, $scope, category) {
              $scope.category = category;
            }
            ]
          },
          'title@': {
            templateUrl: 'views/gallery/title.html',
            controller: ['$scope', 'category', function($scope, category) {
              $scope.name = config.meta.name;
              $scope.category = category;
            }]
          },
          'content@': {
              templateUrl: 'views/gallery.html',
              controller: 'aws.controller.gallery',
              controllerAs: 'gallery'
          }
        },
        resolve: {
          subcategory: ['$stateParams', '$state', 'categories', 'category', function ($stateParams, $state, categories, category) {
            if ($stateParams.subcategory) {
              var sub = categories.$findByName($stateParams.subcategory);
              if (!sub) {
                $state.go('home.category.gallery', {category: category.name, subcategory: null}, {reload: true});
                return false;
              }

              return sub;
            }
            return false;
          }],
          photos: ['category', 'subcategory', '$q', 'aws.service.photo', function (category, subcategory, $q, photoService) {
            var deferred = $q.defer(),
              photos = (subcategory || category).photo.$fetch(),
              groups;

            photos.$refresh().$then(function(items) {
              groups = photoService.refinePhotos(items);
              deferred.resolve(groups);
              return groups;
            });

            return deferred.promise;
          }]
        },
        onEnter: ['category', 'subcategory', 'aws.service.meta', function(category, subcategory, metaService) {
          metaService.setTitle((subcategory || category).title);
        }],
        onExit: function() {
          Ps.destroy(angular.element('.content')[0]);
        },
        data: {
          layout: 'flexed'
        }
      })

      .state('home.category.gallery.image', {
        url: '/photo/{id:int}',
        controller: 'aws.controller.image',
        controllerAs: 'imageCtrl',
        resolve: {
          photo: ['$stateParams', 'aws.model.photo', 'photos', '$state', 'category', 'subcategory', 'aws.service.meta',
            function ($stateParams, Photo, photos, $state, category, subcategory, metaService) {
            var photo = Photo.$find($stateParams.id).$asPromise();
              photo.then(function (p) {
                if (_.findIndex(photos.raw, 'id', p.id) < 0) {
                  $state.go('home.category.gallery', {category: category.name, subcategory: subcategory ? subcategory.name : null}, {reload: true});
                }
                if (_.findIndex(photos, 'id', p.id) < 0) {
                  photos.push(p);
                }
            })
            .catch(function () {
              $state.go('home.category.gallery', {
                category: category.name,
                subcategory: subcategory ? subcategory.name : null
              }, {reload: true});
            });

            return photo;
          }],
          resolutions: ['$http', function($http) {
            return $http.get('/resolution.json');
          }]
        },
        onEnter: ['$rootScope', 'category', 'photo', 'aws.service.meta', function($rootScope, category, photo, metaService) {
          metaService.setTitle(photo.caption);
          metaService.setDescription(photo.caption);
          metaService.setKeywords(_.pluck(photo.categories, 'title'));
        }]
      })
    ;
  }])

  .factory('requestInterceptor', ['$q', '$translate', function ($q, $translate) {
    return {
      // setup authorisation header pre-request
      'request': function (config) {
        config.headers = config.headers || {};
        config.headers['Accept-Language'] = $translate.use();

        return config;
      }
    };
  }])

  .config(['$locationProvider', '$httpProvider', 'CONFIG', function ($locationProvider, $httpProvider, config) {
    $httpProvider.defaults.useXDomain = config.useXDomain;
    $httpProvider.interceptors.push('requestInterceptor');
    $locationProvider.html5Mode(config.html5);
  }])

  .run(['$rootScope', '$cookieStore', '$state', 'CONFIG', '$translate', 'aws.service.meta', function ($rootScope, $cookieStore, $state, config, $translate, metaService) {
    if ($cookieStore.get('language')) {
      $translate.use($cookieStore.get('language'));
    }

    $rootScope.config = config;
    $rootScope.language = $translate.use();
    $rootScope.layout = 'default';
    $rootScope.meta = {};

    $rootScope.$on('$stateChangeStart', function () {
      $rootScope.loading = true;
      $.magnificPopup.close();
      metaService.clean();
    });

    $rootScope.$on('$stateChangeSuccess',
      function (a, state) {
        $rootScope.loading = false;
        $rootScope.meta.keywords = metaService.getKeywords();
        $rootScope.meta.description = metaService.getDescription();
        $rootScope.meta.title = metaService.getTitle();
        $rootScope.layout  = state.data && state.data.layout || 'default';
        ga('send', 'pageview');
      });
  }]);
