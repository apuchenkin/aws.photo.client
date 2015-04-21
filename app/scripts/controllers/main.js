'use strict';

/**
 * @ngdoc function
 * @name aws-photo-client.controller:aws.controller.main
 * @description
 * # MainCtrl
 */
angular.module('aws.photo.client')
  .controller('aws.controller.main', ['$translate', 'categories', 'category', function ($translate, categories, category) {
    var me = this;
    me.language = 'en';
    me.categories = categories;
    me.category = category;

    $translate.use(me.language);
  }]);
