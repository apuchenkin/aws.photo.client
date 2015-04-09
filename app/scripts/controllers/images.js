'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.images', ['aws.model.photo', '$timeout', 'category', 'subcategory', 'photos', '$stateParams', '$state',
    function (Photo, $timeout, category, subcategory, photos, $stateParams, $state) {
    //if (!subcategory) {
    //  debugger;
    //  $state.go('home.gallery.image', {subcategory: null, id: +$stateParams.subcategory});
    //}

    var me = this;
    me.category = category;

    me.bricks = [];
    me.gutter = 5;
    var s = me.size = 100;
    var s2 = (s * 2) + me.gutter;
    var s3 = (s * 3) + (me.gutter * 2);

    var getBrick = function (photo) {
      var k = Math.floor((Math.random() * 4) + 1),
          isHorisontal = (photo.width > photo.height),
          dims
      ;

      switch (k) {
        case 4:   dims = isHorisontal ? [s3, s2] : [s2, s3]; break;
        case 3:   dims = [s2, s2]; break;
        case 2:   dims = isHorisontal ? [s2, s] : [s, s2]; break;
        default:  dims = [s, s]; break;
      }

      return {
        id: photo.id,
        width: dims[0],
        height: dims[1],
        src: 'http://localhost:3000/' + photo.thumb,

        //todo: move to the directive
        style: {
          width:  dims[0],
          height: dims[1],
          "background-image": "url(http://localhost:3000/" + photo.thumb + ")",
          "background-position": "center",
          "background-size": 'cover',
          "margin-bottom": me.gutter
        }
      }
    };

    angular.extend(me.bricks, photos.map(getBrick));
    $timeout(function() {
      var masonry = new Masonry( angular.element('#masonry')[0], {
        columnWidth: me.size,
        itemSelector: '.masonry-brick',
        gutter: me.gutter
      });
    });
  }
]);
