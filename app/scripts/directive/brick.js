angular.module('aws.photo.client')
  .directive('awsBrick', [function () {

    return {
      template: '<div class="masonry-brick photo-{{brick.id}}" ng-style="{{style}}"></div>',
      restrict: 'E',
      scope: {
        ngModel: '='
      },
      controller: ['$scope', function($scope) {
        var brick = $scope.ngModel;

        $scope.style = {
          width: brick.width,
          height: brick.height,
          "background-image": "url(" + brick.src + ")",
          "background-position": "center",
          "background-size": 'cover',
          "margin-bottom": 5 //todo: app settings
        }
      }]
    };
  }]);


