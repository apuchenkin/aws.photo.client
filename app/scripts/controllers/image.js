'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.image', ['$stateParams', '$state', 'aws.model.photo', '$compile', '$scope', '$timeout', 'photos', 'photo',
    function ($stateParams, $state, Photo, $compile, $scope, $timeout, photos, photo) {
      var me = this;

      me.photo = photo;
      var index = _.findIndex(photos, {id: me.photo.$pk});
      photos = _.union(_.slice(photos, index), _.take(photos, index));

      $.magnificPopup.instance.next = function() {
        $.magnificPopup.proto.next.call(this /*, optional arguments */);
        $state.go('home.gallery.image', {id: this.items[this.index].data.id}, {notify: false});
      };
      $.magnificPopup.instance.prev = function() {
        $.magnificPopup.proto.prev.call(this /*, optional arguments */);
        $state.go('home.gallery.image', {id: this.items[this.index].data.id}, {notify: false});
      };

      $.magnificPopup.open({
        type: 'image',
        image: { cursor: null },
        gallery: {
          enabled: true,
          // currently bound by imagezoom
          navigateByImgClick: false
        },
        zoom: {
          enabled: true, // By default it's false, so don't forget to enable it
          duration: 300, // duration of the effect, in milliseconds
          easing: 'ease-in-out', // CSS transition easing function
          opener: function (item) {
            return angular.element('#masonry > .photo-' + item.data.id);
          }
        },
        callbacks: {
          close: function () {
            $state.go('home.gallery');
          },
          imageLoadComplete: function () {
            var magnific = this;
            if (magnific.content) {
              var imgContainer = magnific.content.find('img');

              // Get an instance API
              imgContainer.on('click', function () {
                var currentItem = magnific.items[magnific.index].data;
                var zoom = angular.element('<div class="mfp-zoom" ng-style="zoomStyle" ng-click="toggle()"></div>');
                zoom.mousemove(function (e) {
                  angular.extend($scope.zoomStyle, {
                    "background-position": e.clientX / zoom.width() * 100 + '% ' + e.clientY / zoom.height() * 100 + '%'
                  });
                  $scope.$digest();
                });

                magnific.items[magnific.index] = {
                  item: currentItem,
                  src: $compile(zoom)($scope),
                  title: currentItem.title,
                  id: currentItem.id,
                  type: 'inline'
                };

                magnific.arrowLeft.hide();
                magnific.arrowRight.hide();

                $scope.toggle = function () {
                  magnific.arrowLeft.show();
                  magnific.arrowRight.show();
                  magnific.items[magnific.index] = magnific.items[magnific.index].data.item;
                  magnific.updateItemHTML();
                };

                $timeout(function () {
                  magnific.updateItemHTML();
                  $scope.zoomStyle = {
                    "background-image": 'url("' + magnific.items[magnific.index].data.item.src + '")',
                    "background-position": 'center center'
                  };
                });
              });
            }
          }
        },
        items: photos.map(function(item) {return {
          src: 'http://localhost:3000/' + item.src,
          title: item.name + '<button>zoom</button>',
          id: item.id
        }})
      });
    }]);
