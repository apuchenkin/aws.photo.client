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
    'ngCookies',
    'ui.router',
    'pascalprecht.translate',
    'restmod',
    'http-auth-interceptor'
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

  .config(['$stateProvider', 'CONFIG', function ($stateProvider, config) {

    // Public routes
    $stateProvider
      .state('error', {
        abstract: true,
        template: '<ui-view></ui-view>'
      })
      .state('error.404', {
        url: '/404',
        templateUrl: 'views/error/404.html'
      });

    // Public routes
    $stateProvider
      .state('home.static', {
        abstract: true,
        views: {
          title: {
            template: '<h1 class="title"><a>About</a></h1>'
          },
          content: { },
          footer: {
            templateUrl: 'views/footer.html'
          }
        }
      });

    _.each(config.static, function(url, key) {
      $stateProvider.state(key, {
        url: url,
        views: {
          'content@home': {
            templateUrl: 'views/static/' + url + '.html'
          }
        }
      });
    });

    //main routes
    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'aws.controller.login',
        controllerAs: 'login',
        templateUrl: 'views/login.html'
      })
      .state('logout', {
        url: '/logout',
        controller: ['aws.service.auth', function(auth) {
          auth.logout();
        }]
      });

    $stateProvider
      .state('admin', {
        url: '/admin?{category:string}',
        controller: 'aws.controller.admin.gallery',
        controllerAs: 'admin',
        templateUrl: 'views/admin/gallery.html',
        data: {
          admin: true
        }
      });

    //main routes
    $stateProvider
      .state('home', {
        abstract: true,
        url: '/',
        controller: 'aws.controller.main',
        controllerAs: 'main',
        templateUrl: 'views/main.html',
        resolve: {
          categories: ['aws.model.category', function(Category) {
            var categories =  Category.$collection();
            return categories.$refresh().$asPromise();
          }]
        }
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
          title: {
            templateUrl: 'views/title.html'
          },
          navigation: {
            templateUrl: 'views/navigation.html',
            controller: 'aws.controller.navigation',
            controllerAs: 'navigation'
          },
          content: { },
          footer: {
            templateUrl: 'views/footer.html'
          }
        }
      })

      .state('home.category.about', {
        url: '/about',
        views: {
          'content@home': {
            templateUrl: 'views/about.html',
            controller: 'aws.controller.about',
            controllerAs: 'about'
          }
        }
      })

      .state('home.category.gallery', {
        url: '/:subcategory',
        params: {
          subcategory: {value: null, squash: true}
        },
        title: 'Home',
        views: {
          'content@home': {
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
                  var photo = _.sample(_.flatten(_.map(groups[i], function(p){return _.fill(Array(p.views + 1), p)})));
                  photo.views = _.sum(groups[i], 'views');
                  acc.push(photo);
                }
                return acc;
              }, groups.null);

              return _.sortBy(photos, 'order');
            };

            photos.$refresh().$then(function(items) {
              var groups = doGroups(items);
              deferred.resolve(groups);
              return groups;
            });

            return deferred.promise;
          }]
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

  .factory('restmodConfig', ['restmod', 'CONFIG', function (restmod, config) {

    return restmod.mixin('DefaultPacker', { // include default packer extension
      $config: {
        primaryKey: 'id',
        jsonRoot: '.',
        jsonMeta: 'meta',
        jsonLinks: 'links',
        urlPrefix: config.apiEndpoint
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

  .config(['$locationProvider', '$httpProvider', 'CONFIG', function ($locationProvider, $httpProvider, config) {
    $httpProvider.defaults.useXDomain = config.useXDomain;
    $httpProvider.interceptors.push('requestInterceptor');
    $locationProvider.html5Mode(config.html5);
  }])

  .run(['$rootScope', '$cookieStore', 'aws.service.auth', '$state', 'CONFIG', function ($rootScope, $cookieStore, auth, $state, config) {
    $rootScope.config = config;

    if ($cookieStore.get('access_token')) {
      auth.checkCredentials($cookieStore.get('access_token'));
    }

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
