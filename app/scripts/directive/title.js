angular.module('aws.photo.client')
  .directive('awsPhotoTitle', [function () {

    return {
      template: '<figcaption><span class="caption">{{"photo." + data.$pk + ".caption" | translate}}</span> by <span class="author">{{data.author}}</span></figcaption>',
      transclude: false,
      restrict: 'AC',
      templateNamespace: 'html',
      scope: false
    };
  }]);
