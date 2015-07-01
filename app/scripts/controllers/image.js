'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.image', ['$state', '$compile', '$scope', 'photos', 'photo', 'CONFIG', '$timeout', 'resolutions', '$translate', '$window',
    function ($state, $compile, $scope, photos, photo, config, $timeout, resolutions, $translate, $window) {
      var index = _.findIndex(photos, {id: photo.$pk}),
          sha = new Hashes.SHA1();

      var getSize = function() {
        var minv = resolutions.data.map(function(item){
          return Math.pow(item[0] - $window.innerWidth, 2) + Math.pow(item[1] - $window.innerHeight, 2);
        });
        return resolutions.data[minv.indexOf(_.min(minv))];
      };

      var afterStateUpdate = function() {
        var photo = $state.$current.locals.globals.photo;
        $scope.magnific.currItem.data.title = $compile('<div class="aws-photo-title"></div>')(angular.extend($scope.$new(), {data: photo}));
        $scope.magnific.updateItemHTML();
      };

      var updatePage = function(magnific) {
        var current = magnific.items[magnific.index];
        $state.go('home.category.gallery.image', {id: current.data.id}, {notify: false}).then(afterStateUpdate);
      };

      photos = _.union(_.slice(photos, index), _.take(photos, index));

      $.magnificPopup.open({
        type: 'image',
        // Delay in milliseconds before popup is removed
        removalDelay: 300,
        preload: [0, 1],
        mainClass: 'mfp-zoom-in',
        image: {
          markup: $compile('<div class="aws-photo"></div>')($scope),
          verticalFit: true,
          cursor: null
        },
        gallery: {
          enabled: true,
          tPrev: $translate.instant('PHOTO.PREV'), // Alt text on left arrow
          tNext: $translate.instant('PHOTO.NEXT'), // Alt text on right arrow
          tCounter: $translate.instant('PHOTO.PAGES') // Markup for "1 of 7" counter
        },
        //zoom: {
        //  enabled: true, // By default it's false, so don't forget to enable it
        //  duration: 300, // duration of the effect, in milliseconds
        //  easing: 'ease-in-out', // CSS transition easing function
        //  opener: function (item) {
        //    return angular.element('#masonry .photo-' + item.data.id);
        //  }
        //},

        callbacks: {
          resize: function() {
            this.items.map(function (item) {
              var
                id = item.data ? item.data.id : item.id,
                size = getSize(),
                sign = sha.hex_hmac(config.secret, id + '-' + size[0] + 'x' + size[1]);

              item.src = [config.apiEndpoint, 'hs/photo', id, size[0], size[1], sign].join('/');
             });
            this.updateItemHTML();
          },
          imageLoadComplete: function() {
            var self = this;
            $timeout(function() {
              self.wrap.addClass('mfp-image-loaded');
            }, 16);
          },
          close: function () {
            this.wrap.removeClass('mfp-image-loaded');
            $state.go('home.category.gallery');
          }
        },

        items: photos.map(function (item) {
          var scope = $scope.$new(),
              size = getSize(),
              sign = sha.hex_hmac(config.secret, item.id + "-" + size[0] + 'x' + size[1]);

          scope.data = item;
          return {
            src: [config.apiEndpoint, 'hs/photo', item.id, size[0], size[1], sign].join('/'),
            //src: config.staticEndpoint + item.src,
            dataSrc: config.staticEndpoint + item.src,
            id: item.id
          };
        })
      });

      $scope.magnific = $.magnificPopup.instance;
      afterStateUpdate();

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
