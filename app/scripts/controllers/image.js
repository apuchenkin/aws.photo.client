'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.image', ['$stateParams', '$state', 'aws.model.photo', '$compile', '$scope', '$timeout',
    function ($stateParams, $state, Photo, $compile, $scope, $timeout) {
      var me = this;

      me.image = Photo.$find($stateParams.id);
      $scope.zoomStyle = {
        //transition: 'background-position 0.2s linear'
      };
      me.image.$then(function () {
        var magnificPopup = $.magnificPopup.open({
          type: 'image',

          image: {
            cursor: null,
            titleSrc: function (item) {
              return item.el.attr('title') + ' &middot; <a class="image-source-link" href="' + item.el.attr('data-source') + '" target="_blank">image source</a>';
            }
          },
          //gallery:{
          //  enabled:true
          //},
          //zoom: {
          //  enabled: true, // By default it's false, so don't forget to enable it
          //  duration: 300, // duration of the effect, in milliseconds
          //  easing: 'ease-in-out', // CSS transition easing function
          //
          //  //// The "opener" function should return the element from which popup will be zoomed in
          //  //// and to which popup will be scaled down
          //  //// By defailt it looks for an image tag:
          //  opener: function (openerElement) {
          //    debugger;
          //    // openerElement is the element on which popup was initialized, in this case its <a> tag
          //    // you don't need to add "opener" option if this code matches your needs, it's defailt one.
          //    return openerElement.img;
          //  }
          //},
          callbacks: {
            close: function () {
              $state.go('home.gallery');
            },
            imageLoadComplete: function () {
              var magnific = this;
              if (magnific.content) {
                var imgContainer = magnific.content.find('img');

                var items = magnific.items;
                // Get an instance API
                imgContainer.on('click', function () {
                  var zoom = angular.element('<div class="mfp-zoom" ng-style="zoomStyle" ng-click="toggle()"></div>');

                  zoom.mousemove(function(e){
                    angular.extend($scope.zoomStyle, {
                      "background-position":  e.clientX / zoom.width() * 100 + '% ' + e.clientY / zoom.height() * 100 + '%'
                    });
                    $scope.$digest();
                  });
                  angular.extend($scope.zoomStyle, {
                    "background-image":  'url("' + items[0].src + '")',
                    "background-position": 'center center'
                  });
                  var zoomEl = $compile(zoom)($scope);

                  $scope.toggle = function () {
                    magnific.items = items;
                    magnific.updateItemHTML();
                  };

                  $timeout(function () {
                    magnific.items = [{
                      src: zoomEl,
                      type: 'inline'
                    }];
                    magnific.updateItemHTML();
                  });
                });
              }
            }
          },
          items: {
            src: 'http://localhost:3000/' + me.image.src,
            title: me.image.name
          }
        });
      });
    }]);
