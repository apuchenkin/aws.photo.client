'use strict';

angular.module('aws.photo.client')
  .directive('awsLanguageSelector', ['CONFIG', function (config) {

    return {
      template:
        '<span class="lang">' +
          '<a ng-class="{active: $root.language === lang}" ' +
          'ng-repeat="lang in ::$root.config.languages" ' +
          'ng-href="{{$root.link[lang]}}" ' +
          'hreflang="{{lang}}"' +
          'ng-bind="(lang.toUpperCase() | translate)"></a>' +
        '</span>',
      restrict: 'E',
      scope: {
        ngModel: '='
      }
    };
  }]);


