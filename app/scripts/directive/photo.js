'use strict';

angular.module('aws.photo.client')
  .directive('awsPhoto', [function () {

    return {
      template:
      '<figure>' +
        '<div class="mfp-zoom" ng-click="me.toggleZoom()" ng-right-click="me.toggleZoom()" ng-mousemove="me.move($event)" ng-style="me.zoomStyle" ng-show="me.visible"></div>' +
        '<div class="mfp-figure" ng-show="!me.visible">' +
        '<div class="mfp-img"></div>' +
        '</div>' +
        '<div class="mfp-tools">' +
          '<button class="mfp-btn" ng-click="me.toggleZoom();">{{"TOOLS.FULLSCREEN" | translate}}<i class="icon-expand"></i></button>' +
          '<button class="mfp-btn" ng-click="me.close();">{{"TOOLS.CLOSE" | translate}}<i class="mfp-close-icn icon-close"></i></button>' +
        '</div>' +
        '<div class="mfp-bottom-bar">' +
          '<div class="mfp-title"></div>' +
          '<div class="mfp-counter"></div>' +
        '</div>' +
      '</figure>',
       // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button
      restrict: 'C',
      controllerAs: 'me',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
        var me = this;
        me.zoomStyle = {};
        me.visible = false;

        me.close = function () {
          $scope.magnific.close();
        };

        me.move = function (e) {
          angular.extend(me.zoomStyle, {
            'background-position': e.clientX / e.target.clientWidth * 100 + '% ' + e.clientY / e.target.clientHeight * 100 + '%'
          });
        };

        me.toggleZoom = function () {
          ga('send', 'event', 'fullscreen');

          me.zoomStyle = {};
          var m = $scope.magnific;
          m.updateStatus('loading');
          $rootScope.loading = true;

          var img = new Image();
          img.onload = function () {
            $rootScope.loading = false;
            m.updateStatus('ready');
            me.zoomStyle = {
              'background-image': 'url("' + img.src + '")',
              'background-position': 'center center',
              'background-repeat': 'no-repeat'
            };
          };

          img.src = m.items[m.index].data.dataSrc;
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
