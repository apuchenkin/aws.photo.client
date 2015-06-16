'use strict';

angular.module('aws.photo.client')
  .directive('awsPhotoTitle', [function () {

    return {
      template: '<figcaption ng-cloak><span class="caption">{{data.caption}}</span> by <span class="author">{{data.author.name}}</span></figcaption>',
      restrict: 'C'
    };
  }]);
