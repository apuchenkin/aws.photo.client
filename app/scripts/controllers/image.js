'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.image', ['$state', '$compile', '$scope', 'photos', 'photo', 'CONFIG',
    function ($state, $compile, $scope, photos, photo, config) {
      var index = _.findIndex(photos, {id: photo.$pk});

      var updatePage = function(magnific) {
        var current = magnific.items[magnific.index];
        $state.go('home.gallery.image', {id: current.data.id}, {notify: false}).then(magnific.updateItemHTML);
      };

      photos = _.union(_.slice(photos, index), _.take(photos, index));

      $.magnificPopup.open({
        type: 'image',
        // Delay in milliseconds before popup is removed
        removalDelay: 300,

        mainClass: 'mfp-fade',
        image: {
          markup: $compile('<div class="aws-photo"></div>')($scope),
          verticalFit: true,
          cursor: null
        },
        gallery: {
          enabled: true
        },
        zoom: {
          enabled: true, // By default it's false, so don't forget to enable it
          duration: 300, // duration of the effect, in milliseconds
          easing: 'ease-in-out', // CSS transition easing function
          opener: function (item) {
            return angular.element('#masonry .photo-' + item.data.id);
          }
        },
        callbacks: {
          close: function () {
            $state.go('home.gallery');
          }
        },

        items: photos.map(function (item) {
          var scope = $scope.$new();
          scope.data = item;

          return {
            src: config.staticEndpoint + item.src,
            title: $compile('<div class="aws-photo-title"></div>')(scope),
            id: item.id
          };
        })
      });

      $scope.magnific = $.magnificPopup.instance;

      $scope.magnific.next = function() {
        $.magnificPopup.proto.next.call(this);
        updatePage(this);
      };

      $scope.magnific.prev = function() {
        $.magnificPopup.proto.prev.call(this);
        updatePage(this);
      };
    }
  ]);
