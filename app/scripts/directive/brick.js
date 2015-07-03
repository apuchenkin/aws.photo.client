'use strict';

angular.module('aws.photo.client')
  .directive('awsBrick', ['CONFIG', function (config) {

    return {
      template: '<div ng-cloak class="masonry-brick photo-{{ngModel.id}}" ng-style="{{style}}"></div>',
      restrict: 'E',
      scope: {
        ngModel: '='
      },
      controller: ['$scope', function($scope) {
        var brick = $scope.ngModel;

        $scope.style = {
          width: brick.width,
          height: brick.height,
          'background-image': 'url(' + brick.src + ')',
          'background-position': 'center',
          'background-size': 'cover'
        };
      }]
    };
  }]);


