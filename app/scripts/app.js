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
    'pascalprecht.translate'
  ])

  .config(['$stateProvider', 'CONFIG', function ($stateProvider, config) {

    // Public routes
    $stateProvider
      .state('home.static', {
        abstract: true,
        views: {
          'title@': {
            templateUrl: 'views/static/title.html'
          },
          content: { },
          footer: { }
        }
      });

    _.each(config.static, function (url, key) {
      $stateProvider.state(key, {
        url: url,
        data: {},
        onEnter: ['$rootScope', '$translate', function($rootScope, $translate) {
          this.data.title = $rootScope.pageTitle = $translate.instant(url.toUpperCase());
        }],
        views: {
          'content@': {
            template: '<div class="static" ng-bind-html="content"></div>',
            controller: ['$scope', '$state', '$translate', '$rootScope', '$http', '$sce',
              function ($scope, $state, $translate, $rootScope, $http, $sce) {

                $http.get(['views/static', $translate.use(), url + '.html'].join('/'))
                  .success(function (content) {
                    $scope.content = $sce.trustAsHtml(content);
                  })
                  .error(function () {
                    $state.go('error.404');
                  });
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
            templateUrl: 'views/landing/title.html'
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
        data: {},
        onEnter: ['$rootScope', function($rootScope) {
          $rootScope.hasNavigation = false;
        }]
      })

      .state('home.category', {
        abstract: true,
        url: ':category',
        resolve: {
          category: ['$rootScope', '$stateParams', '$state', 'categories', function ($rootScope, $stateParams, $state, categories) {
            var category = $rootScope.category = categories.$findByName($stateParams.category);
            if (!category) {
              $state.go('error.404');
            }
            if (category.parent) {
              $state.go('home.category.gallery', {category: categories.$findById(category.parent).name, subcategory: category.name});
            }
            category.childs = categories.$getChilds(category);
            return category;
          }]
        },
        views: {
          'title@': {
            templateUrl: 'views/gallery/title.html'
          },
          'navigation@': {
            templateUrl: 'views/navigation.html',
            controller: 'aws.controller.navigation',
            controllerAs: 'navigation'
          },
          content: { },
          footer: { }
        }
      })

      .state('home.category.gallery', {
        url: '/:subcategory',
        params: {
          subcategory: {value: null, squash: true}
        },
        views: {
          'content@': {
              templateUrl: 'views/gallery.html',
              controller: 'aws.controller.gallery',
              controllerAs: 'gallery'
          }
        },
        resolve: {
          subcategory: ['$stateParams', '$state', 'categories', function ($stateParams, $state, categories) {
            return categories.$findByName($stateParams.subcategory);
          }],
          photos: ['aws.model.photo', 'category', 'subcategory', '$q', function (Photo, category, subcategory, $q) {
            var photos = Photo.$collection({category: (subcategory || category).name});
            var deferred = $q.defer();

            var doGroups = function(photos) {
              var groups = _.groupBy(photos, 'group');
              photos = _.reduce(_.keys(groups), function(acc, i) {
                if (+i > 0) {
                  var photo = _.sample(_.flatten(_.map(groups[i], function(p){return _.fill(new Array(p.views + 1), p);})));
                  photo.views = _.sum(groups[i], 'views');
                  acc.push(photo);
                }
                return acc;
              }, groups.null);

              return _.sortBy(photos, 'datetime');
            };

            photos.$refresh().$then(function(items) {
              var groups = doGroups(items);
              deferred.resolve(groups);
              return groups;
            });

            return deferred.promise;
          }]
        },
        onEnter: ['$rootScope', '$translate', function($rootScope, $translate) {
          this.data.title = $rootScope.category.title;
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
          photo: ['$stateParams', 'aws.model.photo', function ($stateParams, Photo) {
            return Photo.$find($stateParams.id).$asPromise();
          }],
          resolutions: ['$http', function($http) {
            return $http.get('/resolution.json');
          }]
        }
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

  .run(['$rootScope', '$cookieStore', '$state', 'CONFIG', '$translate', function ($rootScope, $cookieStore, $state, config, $translate) {
    if ($cookieStore.get('language')) {
      $translate.use($cookieStore.get('language'));
    }

    $rootScope.config = config;
    $rootScope.language = $translate.use();
    $rootScope.name = 'PHOTO.AWESOMESTUFF.IN';
    $rootScope.description = $translate.instant('DESCRIPTION');
    $rootScope.layout = 'default';

    $rootScope.$on('$stateChangeStart',
      function () {
        $rootScope.loading = true;
      });

    $rootScope.$on('$stateChangeSuccess',
      function (a, state) {
        $rootScope.loading = false;
        $rootScope.layout  = state.data && state.data.layout || 'default';
        $rootScope.title = state.data && state.data.title
          ? $rootScope.name + ' - ' + state.data.title
          : $rootScope.name + ' - ' + $rootScope.description
        ;
      });
  }]);
