angular.module('aws.photo.client')
  .directive('awsPhoto', [function () {

    return {
      template:
      '<div class="mfp-zoom" ng-click="me.toggleZoom()" ng-mousemove="me.move($event)" ng-style="me.style" ng-show="me.visible"></div>'+
      '<div class="mfp-figure" ng-show="!me.visible">'+
        '<div class="mfp-img"></div>'+
      '</div>'+
      '<div class="mfp-tools"><div class="zoom" ng-click="me.toggleZoom();">zoom</div><div class="mfp-close"></div></div>'+
      '<div class="mfp-bottom-bar">'+
        '<div class="mfp-title"></div>'+
      '<div class="mfp-counter"></div>'+
      '</div>'
      , // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button
      transclude: false,
      restrict: 'AC',
      templateNamespace: 'html',
      scope: false,
      controllerAs: 'me',
      controller: ['$scope', function($scope) {
        var me = this;
        me.visible = false;

        me.move = function (e) {
            angular.extend(me.style, {
              "background-position": e.clientX / e.screenX * 100 + '% ' + e.clientY / e.screenY * 100 + '%'
            });
        };

        me.toggleZoom = function () {
          var m = $scope.magnific;

          me.style = {
            "background-image": 'url("' + m.items[m.index].src + '")',
            "background-position": 'center center'
          };

          me.visible = !me.visible;

          if (me.visible) {
            m.arrowLeft.hide();
            m.arrowRight.hide();
          } else {
            m.arrowLeft.show();
            m.arrowRight.show();
          }
        }
      }]
    };
  }]);
