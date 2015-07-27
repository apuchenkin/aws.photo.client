'use strict';

angular
  .module('aws.photo.client')
  .directive('ngRightClick', ['$parse', function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          ga('send', 'event', 'rightclick');
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    };
  }]);
