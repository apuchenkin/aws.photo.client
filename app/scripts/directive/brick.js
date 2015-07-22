'use strict';

angular.module('aws.photo.client')
  .directive('awsBrick', [function () {

    return {
      template: '' +
        '<a ng-cloak ui-sref="home.category.gallery.image({id: ngModel.id})">' +
          '<div ng-cloak class="masonry-brick photo-{{ngModel.id}}" ng-style="{{::style}}"></div>' +
        '</a>',

      restrict: 'E',
      scope: {
        ngModel: '='
      },
      controller: ['$scope', function($scope) {
        var brick = $scope.ngModel;

        $scope.style = {
          width: brick.width,
          height: brick.height,
          'background-image': 'url(' + brick.src + ')'
        };
      }]
    };
  }]);


