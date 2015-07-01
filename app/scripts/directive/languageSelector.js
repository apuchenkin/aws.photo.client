'use strict';

angular.module('aws.photo.client')
  .directive('awsLanguageSelector', ['CONFIG', function (config) {

    return {
      template:
        '<span class="lang">' +
          '<a ng-class="{active: $root.language === lang}" ng-repeat="lang in me.languages" ng-click="me.setLanguage(lang)">{{lang.toUpperCase() | translate}}</a>' +
        '</span>',
      restrict: 'E',
      scope: {
        ngModel: '='
      },
      controller: ['$cookieStore', '$window', function($cookieStore, $window) {
        var me = this;

        me.languages = config.languages;
        me.setLanguage = function(lang) {
          $cookieStore.put('language', lang);
          $window.location.reload();
        };
      }],
      controllerAs: 'me'
    };
  }]);


