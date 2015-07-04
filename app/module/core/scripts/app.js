angular
  .module('aws.photo.core', [
    'aws.config',
    'restmod',
    'ui.router',
    'pascalprecht.translate'
  ])

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

  .config(['$urlRouterProvider', function ($urlRouterProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/404');
  }])

  .factory('restmodConfig', ['restmod', 'CONFIG', function (restmod, config) {

    return restmod.mixin('DefaultPacker', { // include default packer extension
      $config: {
        style: 'AMSApi', // By setting the style variable the warning is disabled.
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

  .config(['$stateProvider', 'CONFIG', function ($stateProvider, config) {
    // Public routes
    $stateProvider
      .state('error', {
        abstract: true,
        template: '<ui-view></ui-view>'
      })
      .state('error.404', {
        url: '/404',
        templateUrl: 'module/core/views/error/404.html'
      });
  }])
;
