'use strict';

angular.module('aws.photo.client')
  .directive('awsPhoto', [function () {

    return {
      template:
      '<figure>'+
        '<div class="mfp-zoom" ng-click="me.toggleZoom()" ng-mousemove="me.move($event)" ng-style="me.style" ng-show="me.visible"></div>'+
        '<div class="mfp-figure" ng-show="!me.visible">'+
          '<div class="mfp-img"></div>'+
        '</div>'+
        '<div class="mfp-tools">' +
          '<button title="Zoom" class="mfp-btn" ng-click="me.toggleZoom();"><i class="fa fa-arrows-alt"></i></button>' +
          '<button title="Close (Esc)" class="mfp-btn" ng-click="me.close();"><i class="mfp-close-icn fa fa-times"></i></button>' +
        '</div>'+
        '<div class="mfp-bottom-bar">'+
          '<div class="mfp-title"></div>'+
        '<div class="mfp-counter"></div>'+
        '</div>'+
      '</figure>', // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button
      restrict: 'C',
      controllerAs: 'me',
      controller: ['$scope', function($scope) {
        var me = this;
        me.visible = false;

        me.close = function () {
          $scope.magnific.close();
        };

        me.move = function (e) {
          console.log(e);
          angular.extend(me.style, {
            'background-position': e.clientX / e.target.clientWidth * 100 + '% ' + e.clientY / e.target.clientHeight * 100 + '%'
          });
        };

        me.toggleZoom = function () {
          var m = $scope.magnific;

          me.style = {
            'background-image': 'url("' + m.items[m.index].src + '")',
            'background-position': 'center center',
            'background-repeat': 'no-repeat'
          };

          me.visible = !me.visible;

          if (me.visible) {
            m.arrowLeft.hide();
            m.arrowRight.hide();
          } else {
            m.arrowLeft.show();
            m.arrowRight.show();
          }
        };
      }]
    };
  }]);
