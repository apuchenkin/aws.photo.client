'use strict';

angular.module('aws.photo.client')
  .directive('awsPhotoTitle', [function () {

    return {
      template: '<figcaption ng-cloak><span class="caption">{{"photo." + data.$pk + ".caption" | translate}}</span> by <span class="author">{{data.author}}</span></figcaption>',
      restrict: 'C'
    };
  }]);
