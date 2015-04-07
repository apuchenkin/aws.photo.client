'use strict';

/**
 * @ngdoc function
 * @name photoawesomestuffinApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the photoawesomestuffinApp
 */
angular.module('aws.photo.client')
  .controller('aws.controller.image', ['$stateParams', '$state', 'aws.model.photo', function ($stateParams, $state, Photo) {
    var me = this;

    me.image = Photo.$find($stateParams.id);
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
        callbacks: {
          close: function () {
            $state.go('home.gallery');
          }
          //imageLoadComplete: function () {
          //  var me = this;
          //  var imgContainer = me.content.find('img');
          //
          //  // Get an instance API
          //  imgContainer.on('click', function () {
          //    me.items = [{
          //      //src: $('<div class="white-popup">Dynamically created popup</div>'),
          //      src: $('<div class="mfp-zoom"></div>').zoom({url: me.items[0].src}),
          //      type: 'inline'
          //    }];
          //    me.updateItemHTML();
          //  });
          //}
        },
        items: {
          src: 'http://localhost:3000/' + me.image.src,
          title: me.image.name
        }
      });
    });
  }]);
