'use strict';

angular.module('aws.photo.client')
  .directive('awsPhotoTitle', [function () {

    return {
      template:
        '<figcaption ng-cloak>' +
          '<span class="caption" ng-bind="data.caption"></span>' +
          '{{"PHOTO.BY" | translate}}' + '<span class="author" ng-bind="::data.author.name"></span>' +
        '</figcaption>',
      restrict: 'C'
    };
  }]);
